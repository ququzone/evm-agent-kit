import { Account, WalletClient, Hex, createWalletClient, http, Address, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";
import { Action, ActionSchemaAny } from "../action";
import { Assets } from "../utils/assets";

export class EOAAgentKit {
    private account?: Account;
    private wallet?: WalletClient;

    public static async buildWithPrivateKey(rpc: string, privateKey: string): Promise<EOAAgentKit> {
        const agent = new EOAAgentKit();
        agent.account = privateKeyToAccount(privateKey as Hex);
        agent.wallet = createWalletClient({
            account: agent.account,
            transport: http(rpc),
        });

        const chainId = await agent.wallet.getChainId();
        agent.wallet = agent.wallet.extend(publicActions).extend(client => ({
            getAssetAddress(assetId: string): string {
                // @ts-ignore
                return Assets[chainId.toString()][assetId];
            },
        }));

        return agent;
    }

    async address(): Promise<string> {
        return this.account!.address;
    }

    async getBalance(address: string): Promise<bigint> {
        const recipient = address as Address;
        // @ts-ignore
        return await this.wallet?.getBalance({
            address: recipient,
        });
    }

    async run<ActionSchema extends ActionSchemaAny>(
        action: Action<ActionSchema>,
        args: ActionSchema,
    ): Promise<string> {
        if (action.func.length > 1) {
            if (!this.wallet) {
                return `Require wallet to run Action: ${action.name}.`;
            }

            return await action.func(this.wallet!, args);
        }

        return await (action.func as (args: z.infer<ActionSchema>) => Promise<string>)(args);
    }
}
