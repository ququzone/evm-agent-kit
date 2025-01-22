import { StructuredToolInterface, BaseToolkit as Toolkit } from "@langchain/core/tools";
import { ACTIONS, AgentKit } from "evm-agent-kit";
import { WalletTool } from "./tools/wallet";

export class WalletToolkit extends Toolkit {
    tools: StructuredToolInterface[];

    constructor(agentKit: AgentKit) {
        super();
        const actions = ACTIONS;
        const tools = actions.map(action => new WalletTool(action, agentKit));
        this.tools = tools;
    }
}
