import { WalletClient } from "viem";
import { z } from "zod";
import { Action } from "./base";

export const AddressInput = z.object({});

export async function address(
    wallet: WalletClient,
    args: z.infer<typeof AddressInput>,
): Promise<string> {
    return `The agent wallet address is ${wallet.account?.address}`;
}

export class AddressAction implements Action<typeof AddressInput> {
    public name = "address";
    public description = "This tool will get wallet address about agent.";
    public argsSchema = AddressInput;
    public func = address;
}
