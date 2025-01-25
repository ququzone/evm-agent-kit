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
        return await action.func(this.context, args);
    }
}
