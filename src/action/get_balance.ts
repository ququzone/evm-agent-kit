import { WalletClient, formatEther, formatUnits } from "viem";
import { z } from "zod";
import { Action } from "./base";
import { ERC20Abi } from "../utils/abi/erc20";

const GET_BALANCE_PROMPT = `
This tool will get the balance of the address in the wallet for a given asset.
It takes the asset symbol as input.
Don't ask user wallet address, the tool will use agent wallet address.
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
        let balance = "0";
        const symbol = args.assetSymbol.toUpperCase();
        const account = wallet.account?.address;
        if (symbol == "IOTX") {
            balance = formatEther(
                // @ts-ignore
                await wallet.getBalance({
                    address: account,
                }),
            );
        } else {
            // @ts-ignore
            const address = wallet.getAssetAddress(symbol);
            if (!address) {
                return `The ${symbol} doesn't support.`;
            }
            // @ts-ignore
            const decimals = await wallet.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "decimals",
            });
            // @ts-ignore
            const balanceOf = await wallet.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "balanceOf",
                args: [account],
            });
            balance = formatUnits(balanceOf, decimals);
        }
        return `The ${symbol} for account ${wallet.account?.address} is ${balance}`;
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
