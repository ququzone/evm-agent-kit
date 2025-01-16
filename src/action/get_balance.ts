import { WalletClient, formatEther, formatUnits } from "viem";
import { z } from "zod";
import { Action } from "./base";
import { ERC20Abi } from "../utils/abi/erc20";

const GET_BALANCE_PROMPT = `
This tool will get the balance of the address in the wallet for a given asset.
It takes the asset symbol or token address as input.
If user don't provide the account address, then use 'WALLET' as user account input.
Don't ask user wallet address.
`;

export const GetBalanceInput = z
    .object({
        assetSymbol: z.string().describe("The asset symbol or address to get the balance for"),
        userAccount: z.string().describe("The user account address to get the the balance"),
    })
    .strip()
    .describe("Instructions for getting wallet balance");

export async function getBalance(
    wallet: WalletClient,
    args: z.infer<typeof GetBalanceInput>,
): Promise<string> {
    try {
        let balance = "0";
        const symbol = args.assetSymbol;
        let account = args.userAccount;
        if (account === "WALLET") {
            account = wallet.account!.address;
        }

        if (symbol.toUpperCase() == "IOTX") {
            balance = formatEther(
                // @ts-ignore
                await wallet.getBalance({
                    address: account,
                }),
            );
        } else {
            // @ts-ignore
            let address = wallet.getAssetAddress(symbol.toUpperCase());
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
            // @ts-ignore
            const balanceOf = await wallet.readContract({
                address: address,
                abi: ERC20Abi,
                functionName: "balanceOf",
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
