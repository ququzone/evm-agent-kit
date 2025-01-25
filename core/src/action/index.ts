import { AddressAction } from "./address";
import { Action, ActionSchemaAny } from "./base";
import { GetBalanceAction } from "./get_balance";
import { NetworksAction } from "./networks";
import { TransferAction } from "./transfer";

export function getAllActions(): Action<ActionSchemaAny>[] {
    return [
        new NetworksAction(),
        new AddressAction(),
        new GetBalanceAction(),
        new TransferAction(),
    ];
}

export const ACTIONS = getAllActions();

export { Action, ActionSchemaAny };
