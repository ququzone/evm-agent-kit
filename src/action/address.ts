import { z } from "zod";
import { Action } from "./base";
import { Context } from "../agent/context";

export const AddressInput = z.object({});

export async function address(context: Context, _: z.infer<typeof AddressInput>): Promise<string> {
    if (context.account) {
        return `The agent wallet address is ${context.account.address}`;
    }
    throw new Error("No account in context");
}

export class AddressAction implements Action<typeof AddressInput> {
    public name = "address";
    public description = "This tool will get wallet address about agent.";
    public argsSchema = AddressInput;
    public func = address;
}
