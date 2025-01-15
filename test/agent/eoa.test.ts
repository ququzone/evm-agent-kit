import { generatePrivateKey } from "viem/accounts";
import { EOAAgent } from "../../src/agent/eoa"

describe("EOAAgent", () => {
    describe("initialization", () => {
        it("basic", async () => {
            const agent = await EOAAgent.buildWithPrivateKey(
                "https://babel-api.mainnet.iotex.io",
                generatePrivateKey(),
            );

            const balance = await agent.getBalance("0x0000000000000000000000000000000000000000");
            expect(balance).toBeGreaterThan(0);
        })
    })
})
