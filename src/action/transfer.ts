import { WalletClient, parseEther } from "viem";
import { z } from "zod";
import { Action } from "./base";

const TRANSFER_PROMPT = `
This tool will transfer an asset from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- assetId: The asset ID to transfer
- destination: Where to send the funds

Important notes:
- Always use asset ID 'usdc' when transferring USDC
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'iotx'), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
`;

export const TransferInput = z
    .object({
        amount: z.number().describe("The amount of the asset to transfer"),
        assetSymbol: z.string().describe("The asset symbol to transfer"),
        destination: z.string().describe("The destination to transfer the funds"),
    })
    .strip()
    .describe("Instructions for transferring assets");

export async function transfer(
    wallet: WalletClient,
    args: z.infer<typeof TransferInput>,
): Promise<string> {
    try {
        const symbol = args.assetSymbol.toUpperCase();
        if (symbol === "IOTX") {
            const amount = parseEther(args.amount.toString());
            const hash = await wallet.sendTransaction({
                account: wallet.account!,
                // @ts-ignore
                to: args.destination,
                value: amount,
            });

            return `Transferred ${args.amount} of ${symbol} to ${args.destination}.\nTransaction hash for the transfer: ${hash}\nTransaction link for the transfer: https://iotexscan.io/tx/${hash}`;
        } else {
            return `Unsupport transfer ${symbol} currently.`;
        }
    } catch (error) {
        return `Error transferring the asset: ${error}`;
    }
}

export class TransferAction implements Action<typeof TransferInput> {
    public name = "transfer";
    public description = TRANSFER_PROMPT;
    public argsSchema = TransferInput;
    public func = transfer;
}
