import { formatEther, formatUnits } from "viem";
import { z } from "zod";
import { Action } from "./base";
import { ERC20Abi } from "../utils/abi/erc20";
import { Context } from "../agent/context";

const GET_BALANCE_PROMPT = `
This tool will get the balance of the address in the wallet for a given asset.
It takes the asset symbol or token address as input.
If user don't provide the account address, then use 'WALLET' as user account input.
Don't ask user wallet address.
`;

export const GetBalanceInput = z
    .object({
        network: z.string().describe("The network using for"),
        assetSymbol: z.string().describe("The asset symbol or address to get the balance for"),
        userAccount: z.string().describe("The user account address to get the the balance"),
    })
    .strip()
    .describe("Instructions for getting wallet balance");

export async function getBalance(
    context: Context,
    args: z.infer<typeof GetBalanceInput>,
): Promise<string> {
    const network = context.networks.get(args.network);
    if (!network) {
        return `The ${args.network} doesn't support.`;
    }
    try {
        let balance = "0";
        const symbol = args.assetSymbol;
        let account = args.userAccount;
        if (account === "WALLET") {
            if (!context.account) {
                throw new Error("No account in context");
            }
            account = context.account!.address;
        }

        if (symbol.toUpperCase() === network.client.chain?.nativeCurrency.symbol) {
            balance = formatEther(
                await network.client.getBalance({
                    // @ts-ignore
                    address: account,
                }),
            );
        } else {
            // @ts-ignore custome method for network
            let address = network.client.getAssetAddress(symbol.toUpperCase());
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
            const balanceOf = await network.client.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "balanceOf",
                // @ts-ignore
                args: [account],
            });
            balance = formatUnits(balanceOf, decimals);
        }
        return `The ${symbol} for account ${account} is ${balance}`;
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
