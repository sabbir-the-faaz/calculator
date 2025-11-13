
import { ACTIONS } from './constants';

export interface State {
  currentOperand?: string | null;
  previousOperand?: string | null;
  operation?: string | null;
  overwrite?: boolean;
}

export type Action = 
  | { type: typeof ACTIONS.ADD_DIGIT; payload: { digit: string } }
  | { type: typeof ACTIONS.CHOOSE_OPERATION; payload: { operation: string } }
  | { type: typeof ACTIONS.CLEAR }
  | { type: typeof ACTIONS.DELETE_DIGIT }
  | { type: typeof ACTIONS.EVALUATE };
