import { parseEther, parseUnits } from "viem";
import { z } from "zod";
import { Action } from "./base";
import { ERC20Abi } from "../utils/abi/ERC20";
import { Context } from "../agent/context";

const TRANSFER_PROMPT = `
This tool will transfer an asset from the wallet to another onchain address.

It takes the following inputs:
- amount: The amount to transfer
- assetSymbol: The asset symbol to transfer
- destination: Where to send the funds

Important notes:
- Ensure sufficient balance of the input asset before transferring
- When sending native assets (e.g. 'ETH'), ensure there is sufficient balance for the transfer itself AND the gas cost of this transfer
`;

export const TransferInput = z
    .object({
        network: z.string().describe("The network using for"),
        amount: z.number().describe("The amount of the asset to transfer"),
        assetSymbol: z.string().describe("The asset symbol or address to transfer"),
        destination: z.string().describe("The destination to transfer the funds"),
    })
    .strip()
    .describe("Instructions for transferring assets");

export async function transfer(
    context: Context,
    args: z.infer<typeof TransferInput>,
): Promise<string> {
    if (!context.account) {
        throw "No account in context";
    }
    const network = context.networks.get(args.network);
    if (!network) {
        return `The ${args.network} doesn't support.`;
    }
    try {
        const walletClient = context.getWalletClient(args.network);
        const symbol = args.assetSymbol.toUpperCase();
        let hash = "";
        if (symbol === network.client.chain?.nativeCurrency.symbol) {
            const amount = parseEther(args.amount.toString());
            hash = await walletClient.sendTransaction({
                account: context.account,
                // @ts-expect-error ignore address check
                to: args.destination,
                value: amount,
            });
        } else {
            // @ts-expect-error custome method for network
            let address = network.client.getAssetAddress(symbol);
            if (!address) {
                if (args.assetSymbol.startsWith("0x")) {
                    address = args.assetSymbol;
                } else {
                    return `The ${symbol} doesn't support.`;
                }
            }
            const decimals = await network.client.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "decimals",
            });
            const amount = parseUnits(args.amount.toString(), decimals);
            hash = await walletClient.writeContract({
                address: address,
                abi: ERC20Abi,
                functionName: "transfer",
                // @ts-expect-error ignore address check
                args: [args.destination, amount],
            });
        }
        let result = `Transferred ${args.amount} of ${symbol} to ${args.destination}.\nTransaction hash for the transfer: ${hash}`;
        if (
            network.client.chain?.blockExplorers &&
            network.client.chain?.blockExplorers["default"]
        ) {
            result += `\nTransaction link for the transfer: ${network.client.chain?.blockExplorers["default"].url}/tx/${hash}`;
        }
        return result;
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
