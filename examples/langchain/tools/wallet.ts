import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Action, ActionSchemaAny, EOAAgentKit } from "../../../src";

export class WalletTool<ActionSchema extends ActionSchemaAny> extends StructuredTool {
    public schema: ActionSchema;

    public name: string;

    public description: string;

    private agentKit: EOAAgentKit;

    private action: Action<ActionSchema>;

    constructor(action: Action<ActionSchema>, agentKit: EOAAgentKit) {
        super();
        this.action = action;
        this.agentKit = agentKit;
        this.name = action.name;
        this.description = action.description;
        this.schema = action.argsSchema;
    }

    protected async _call(
        input: z.infer<typeof this.schema> & Record<string, unknown>,
    ): Promise<string> {
        try {
            let args: any;

            if (this.schema) {
                try {
                    const validatedInput = this.schema.parse(input);
                    args = validatedInput;
                } catch (validationError) {
                    args = input;
                }
            } else {
                args = input;
            }

            return await this.agentKit.run(this.action, args);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return `Error executing ${this.name}: ${error.message}`;
            }
            return `Error executing ${this.name}: Unknown error occurred`;
        }
    }
}
