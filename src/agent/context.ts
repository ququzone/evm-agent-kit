import {
    Account,
    Chain,
    Hex,
    PublicClient,
    WalletClient,
    createPublicClient,
    createWalletClient,
    http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Assets } from "../utils/assets";

export interface Network {
    client: PublicClient;
    account?: Account;
    walletClient?: WalletClient;
}

export async function newReadonlyNetwork(chain: Chain): Promise<Network> {
    const client = createPublicClient({
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0]),
    });
    const chainId = await client.getChainId();
    const clientExt = client.extend(_ => ({
        getAssetAddress(assetId: string): string {
            // @ts-ignore
            return Assets[chainId.toString()][assetId];
        },
    }));
    return {
        client: clientExt,
    };
}

export async function newEOANetwork(chain: Chain, account: Account): Promise<Network> {
    const client = createPublicClient({
        chain: chain,
        transport: http(chain.rpcUrls.default.http[0]),
    });
    const chainId = await client.getChainId();
    const clientExt = client.extend(_ => ({
        getAssetAddress(assetId: string): string {
            // @ts-ignore
            return Assets[chainId.toString()][assetId];
        },
    }));
    return {
        client: clientExt,
        account: account,
        walletClient: createWalletClient({
            account: account,
            transport: http(chain.rpcUrls.default.http[0]),
        }),
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
        return Object.keys(this.networks);
    }
}
