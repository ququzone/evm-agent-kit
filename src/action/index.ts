import { Action, ActionSchemaAny } from "./base";
import { GetBalanceAction } from "./get_balance";

export function getAllActions(): Action<ActionSchemaAny>[] {
    return [new GetBalanceAction()];
}

export const ACTIONS = getAllActions();

export { Action, ActionSchemaAny };
