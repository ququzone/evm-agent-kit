import { WalletClient, parseEther, parseUnits } from "viem";
import { z } from "zod";
import { Action } from "./base";
import { ERC20Abi } from "../utils/abi/erc20";

const TRANSFER_PROMPT = `
This tool will transfer an asset from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- assetSymbol: The asset symbol to transfer
- destination: Where to send the funds

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'ETH', 'IOTX'), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
`;

export const TransferInput = z
    .object({
        amount: z.number().describe("The amount of the asset to transfer"),
        assetSymbol: z.string().describe("The asset symbol or address to transfer"),
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
        let hash = "";
        if (symbol === "IOTX") {
            const amount = parseEther(args.amount.toString());
            hash = await wallet.sendTransaction({
                account: wallet.account!,
                // @ts-ignore
                to: args.destination,
                value: amount,
            });
        } else {
            // @ts-ignore
            let address = wallet.getAssetAddress(symbol);
            if (!address) {
                if (args.assetSymbol.startsWith("0x")) {
                    address = args.assetSymbol;
                } else {
                    return `The ${symbol} doesn't support.`;
                }
            }
            // @ts-ignore
            const decimals = await wallet.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "decimals",
            });
            const amount = parseUnits(args.amount.toString(), decimals);
            hash = await wallet.writeContract({
                address: address,
                abi: ERC20Abi,
                functionName: "transfer",
                // @ts-ignore
                args: [args.destination, amount],
            });
        }
        return `Transferred ${args.amount} of ${symbol} to ${args.destination}.\nTransaction hash for the transfer: ${hash}\nTransaction link for the transfer: https://iotexscan.io/tx/${hash}`;
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
