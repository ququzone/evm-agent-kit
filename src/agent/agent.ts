import { Address } from "viem";
import { z } from "zod";
import { Action, ActionSchemaAny } from "../action";
import { Context } from "./context";

export class AgentKit {
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public static async buildWithContext(context: Context): Promise<AgentKit> {
        return new AgentKit(context);
        // agent.account = privateKeyToAccount(privateKey as Hex);
        // agent.wallet = createWalletClient({
        //     account: agent.account,
        //     transport: http(rpc),
        // });
    }

    async address(): Promise<string> {
        if (this.context.account) {
            return this.context.account.address;
        }
        throw new Error("No account in context");
    }

    async getBalance(network: string, address: string): Promise<bigint> {
        if (!this.context.networks.has(network)) {
            throw new Error(`The ${network} doesn't support`);
        }
        const recipient = address as Address;
        return await this.context.networks.get(network)!.client.getBalance({
            address: recipient,
        });
    }

    async run<ActionSchema extends ActionSchemaAny>(
        action: Action<ActionSchema>,
        args: ActionSchema,
    ): Promise<string> {
        if (action.func.length > 1) {
            if (!this.context) {
                return `Require context to run Action: ${action.name}.`;
            }

            return await action.func(this.context, args);
        }

        return await (action.func as (args: z.infer<ActionSchema>) => Promise<string>)(args);
    }
}
