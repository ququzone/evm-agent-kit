import { WalletClient } from "viem";
import { z } from "zod";
import { Action } from "./base";

const GET_BALANCE_PROMPT = `
This tool will get the balance of the address in the wallet for a given asset.
Don't ask user address, just use wallet address.
It takes the asset symbol as input. Always use 'iotx' for the native asset IOTX.
`;

export const GetBalanceInput = z
    .object({
        assetSymbol: z.string().describe("The asset symbol to get the balance for"),
    })
    .strip()
    .describe("Instructions for getting wallet balance");

export async function getBalance(
    wallet: WalletClient,
    args: z.infer<typeof GetBalanceInput>,
): Promise<string> {
    try {
        console.log(`${args.assetSymbol}`);
        return `The ${args.assetSymbol} for account ${wallet.account?.address} is ${0}`;
    } catch (error) {
        return `Error getting balance in the wallet: ${error}`;
    }
}

export class GetBalanceAction implements Action<typeof GetBalanceInput> {
    public name = "get_balance";
    public description = GET_BALANCE_PROMPT;
    public argsSchema = GetBalanceInput;
    public func = getBalance;
}
