import {
    Account,
    Chain,
    Hex,
    PublicClient,
    Transport,
    WalletClient,
    createPublicClient,
    createWalletClient,
    http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Assets } from "../utils/assets";

export interface Network {
    client: PublicClient;
    transport: Transport;
}

export async function newNetwork(chain: Chain): Promise<Network> {
    const transport = http(chain.rpcUrls.default.http[0]);
    const client = createPublicClient({
        chain: chain,
        transport: transport,
    });
    const chainId = await client.getChainId();
    const clientExt = client.extend(() => ({
        getAssetAddress(assetId: string): string {
            return Assets[chainId.toString()][assetId];
        },
    }));
    return {
        client: clientExt,
        transport: transport,
    };
}

export class Context {
    account?: Account;
    networks: Map<string, Network>;

    constructor(privateKey?: string) {
        if (privateKey) {
            this.account = privateKeyToAccount(privateKey as Hex);
        }
        this.networks = new Map<string, Network>();
    }

    addNetwork(name: string, network: Network) {
        this.networks.set(name, network);
    }

    networkNames(): string[] {
        return [...this.networks.keys()];
    }

    getWalletClient(networkName: string): WalletClient {
        if (!this.account) {
            throw new Error("No account in context");
        }
        const network = this.networks.get(networkName);
        if (!network) {
            throw new Error(`The ${networkName} doesn't support`);
        }

        return createWalletClient({
            account: this.account,
            transport: network.transport,
        });
    }
}
