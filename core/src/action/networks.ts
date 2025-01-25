import { z } from "zod";
import { Action } from "./base";
import { Context } from "../agent/context";

export const NetworkInput = z.object({});

export async function networks(context: Context): Promise<string> {
    return `All networks supported by agent: ${context.networkNames()}`;
}

export class NetworksAction implements Action<typeof NetworkInput> {
    public name = "networks";
    public description = "This tool will response all supported networks by agent.";
    public argsSchema = NetworkInput;
    public func = networks;
}
