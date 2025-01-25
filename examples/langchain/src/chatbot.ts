import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as readline from "readline";
import { defineChain } from "viem";
import { mainnet } from "viem/chains";
import { AgentKit, Context, newNetwork } from "evm-agent-kit";

import { WalletToolkit } from "./toolkit";

async function initializeAgent() {
    let baseURL = "https://api.deepseek.com";
    let mode = "deepseek-chat";
    if (process.env.LLM_API_URL) {
        baseURL = process.env.LLM_API_URL;
    }
    if (process.env.LLM_MODEL) {
        mode = process.env.LLM_MODEL;
    }
    try {
        const llm = new ChatOpenAI({
            //model: "gpt-4o-mini",
            model: mode,
            configuration: {
                baseURL: baseURL,
            },
        });

        // Initialize AgentKit
        const context = new Context(`0x${process.env.PRIVATE_KEY!}`);

        const mainnetNetwork = await newNetwork(mainnet);
        context.addNetwork(mainnet.name, mainnetNetwork);

        const iotxChain = defineChain({
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
                    name: "default",
                    url: "https://iotexscan.io",
                },
            },
            testnet: false,
        });
        const iotxNetwork = await newNetwork(iotxChain);
        context.addNetwork(iotxChain.name, iotxNetwork);

        const agentKit = await AgentKit.buildWithContext(context);

        // Initialize Agent Toolkit and get tools
        const toolkit = new WalletToolkit(agentKit);
        const tools = toolkit.getTools();

        // Store buffered conversation history in memory
        const memory = new MemorySaver();
        const agentConfig = { configurable: { thread_id: "AgentKit Chatbot Example!" } };

        // Create React Agent using the LLM and AgentKit tools
        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier: `
          You are a helpful agent that can interact onchain using the EVM AgentKit. You are 
          empowered to interact onchain using your tools. If not, you can provide your wallet details and request 
          funds from the user. Before executing your first action, get the wallet details to see what network 
          you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
          asks you to do something you can't do with your currently available tools, please answer the question 
          by using your own knowledge about the topic and don't use context. 
          Be concise and helpful with your responses. Refrain from 
          restating your tools' descriptions unless it is explicitly requested.
          Don't use markdown format response.
          Always use upper case symbol for the native asset.
          The default network should be Ethereum. If user don't provide network name, please 'Ethereum' as network name.
          `,
        });

        return { agent, config: agentConfig };
    } catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error;
    }
}

async function runChatMode(agent: any, config: any) {
    console.log("Starting chat mode... Type 'exit' to end.");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
        new Promise(resolve => rl.question(prompt, resolve));

    try {
        while (true) {
            const userInput = await question("\nPrompt: ");

            if (userInput.toLowerCase() === "exit") {
                break;
            }

            const stream = await agent.stream({ messages: [new HumanMessage(userInput)] }, config);

            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    console.log(chunk.agent.messages[0].content);
                } else if ("tools" in chunk) {
                    console.log(chunk.tools.messages[0].content);
                }
                console.log("-------------------");
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}

async function main() {
    try {
        const { agent, config } = await initializeAgent();

        await runChatMode(agent, config);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    console.log("Starting Agent...");
    main().catch(error => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
