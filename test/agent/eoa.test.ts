import { generatePrivateKey } from "viem/accounts";
import { EOAAgentKit } from "../../src/agent/eoa";

describe("EOAAgentKit", () => {
    describe("initialization", () => {
        it("basic", async () => {
            const agent = await EOAAgentKit.buildWithPrivateKey(
                "https://babel-api.mainnet.iotex.io",
                generatePrivateKey(),
            );

            const balance = await agent.getBalance("0x0000000000000000000000000000000000000000");
            expect(balance).toBeGreaterThan(0);

            console.log(`Agent address is ${await agent.address()}`);
        });
    });
});
