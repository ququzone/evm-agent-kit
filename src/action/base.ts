import { z } from "zod";
import { Context } from "../agent/context";

export type ActionSchemaAny = z.ZodObject<any, any, any, any>;

export interface Action<ActionSchema extends ActionSchemaAny> {
    name: string;

    description: string;

    argsSchema: ActionSchema;

    func:
        | ((context: Context, args: z.infer<ActionSchema>) => Promise<string>)
        | ((args: z.infer<ActionSchema>) => Promise<string>);
}
