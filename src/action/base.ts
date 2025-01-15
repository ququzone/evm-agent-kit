import { WalletClient } from "viem";
import { z } from "zod";

export type ActionSchemaAny = z.ZodObject<any, any, any, any>;

export interface Action<ActionSchema extends ActionSchemaAny> {
    name: string;

    description: string;

    argsSchema: ActionSchema;

    func:
        | ((wallet: WalletClient, args: z.infer<ActionSchema>) => Promise<string>)
        | ((args: z.infer<ActionSchema>) => Promise<string>);
}
