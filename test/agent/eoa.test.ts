import { generatePrivateKey } from "viem/accounts";
import { AgentKit } from "../../src/agent/agent";
import { Context, newEOANetwork } from "../../src/agent/context";
import { defineChain } from "viem";

describe("AgentKit", () => {
    describe("initialization", () => {
        it("basic", async () => {
            const chain = defineChain({
                id: 4689,
                name: "IoTeX Mainnet",
                nativeCurrency: { name: "IoTeX", symbol: "IOTX", decimals: 18 },
                rpcUrls: {
                    default: {
                        http: ["https://babel-api.mainnet.iotex.io"],
                    },
                },
                blockExplorers: {
                    default: {
                        name: "IoTeXScan",
                        url: "https://iotexscan.io",
                    },
                },
                testnet: false,
            });
            const context = new Context(generatePrivateKey());
            const network = await newEOANetwork(chain, context.account!);
            context.addNetwork("IoTeX", network);
            const agent = await AgentKit.buildWithContext(context);

            const balance = await agent.getBalance(
                "IoTeX",
                "0x0000000000000000000000000000000000000000",
            );
            expect(balance).toBeGreaterThan(0);

            console.log(`Agent address is ${await agent.address()}`);
        });
    });
});
