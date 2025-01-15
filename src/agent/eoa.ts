import {
    Account,
    WalletClient,
    Hex,
    createWalletClient,
    http,
    Address,
    publicActions,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export class EOAAgent {
    private wallet?: Account;
    private client?: WalletClient;

    public static async buildWithPrivateKey(
        rpc: string,
        privateKey: string,
    ): Promise<EOAAgent> {
        const agent = new EOAAgent();
        agent.wallet = privateKeyToAccount(privateKey as Hex);
        agent.client = createWalletClient({
            account: agent.wallet,
            transport: http(rpc),
        }).extend(publicActions);

        return agent;
    }

    async getBalance(address: string): Promise<bigint> {
        const recipient = address as Address;
        // @ts-ignore
        return await this.client?.getBalance({
            address: recipient,
        });
    }
}
