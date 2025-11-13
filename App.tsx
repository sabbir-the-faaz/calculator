
import React, { useReducer } from 'react';
import { ACTIONS } from './constants';
import type { State, Action } from './types';
import CalculatorButton from './components/CalculatorButton';
import Display from './components/Display';

function evaluate({ currentOperand, previousOperand, operation }: State): string {
  const prev = parseFloat(previousOperand || "0");
  const current = parseFloat(currentOperand || "0");
  if (isNaN(prev) || isNaN(current)) return "";
  
  let computation: number;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "−":
      computation = prev - current;
      break;
    case "×":
      computation = prev * current;
      break;
    case "÷":
      if (current === 0) return "Error";
      computation = prev / current;
      break;
    default:
      return current.toString();
  }
  return computation.toString();
}

// Fix: Changed reducer signature to accept the full action object.
// This allows TypeScript to correctly narrow the type of `action` within the switch statement,
// resolving the error where `payload` might not exist on every action type.
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") return state;
      if (action.payload.digit === "." && state.currentOperand?.includes(".")) return state;
       if (state.currentOperand === "0" && action.payload.digit !== ".") {
        return { ...state, currentOperand: action.payload.digit };
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
       if (state.currentOperand === "Error") return { ...state };
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return { currentOperand: "0" };

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "0",
        };
      }
      if (state.currentOperand == null || state.currentOperand === "0" || state.currentOperand === "Error") return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: "0" };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    
    default:
        return state;
  }
}

const App: React.FC = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, { currentOperand: "0"});

  const baseBtn = "bg-gray-700 hover:bg-gray-600 active:bg-gray-500";
  const operatorBtn = "bg-amber-500 hover:bg-amber-400 active:bg-amber-300";
  const specialBtn = "bg-gray-500 hover:bg-gray-400 active:bg-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-black rounded-2xl shadow-2xl overflow-hidden">
          <Display 
            previousOperand={previousOperand} 
            operation={operation} 
            currentOperand={currentOperand} 
          />
          <div className="grid grid-cols-4 gap-px bg-gray-900">
            <CalculatorButton label="AC" onClick={() => dispatch({ type: ACTIONS.CLEAR })} className={`${specialBtn} col-span-2`} />
            <CalculatorButton label="DEL" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })} className={specialBtn} />
            <CalculatorButton label="÷" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "÷" } })} className={operatorBtn} />
            
            <CalculatorButton label="7" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "7" } })} className={baseBtn} />
            <CalculatorButton label="8" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "8" } })} className={baseBtn} />
            <CalculatorButton label="9" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "9" } })} className={baseBtn} />
            <CalculatorButton label="×" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "×" } })} className={operatorBtn} />

            <CalculatorButton label="4" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "4" } })} className={baseBtn} />
            <CalculatorButton label="5" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "5" } })} className={baseBtn} />
            <CalculatorButton label="6" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "6" } })} className={baseBtn} />
            <CalculatorButton label="−" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "−" } })} className={operatorBtn} />

            <CalculatorButton label="1" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "1" } })} className={baseBtn} />
            <CalculatorButton label="2" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "2" } })} className={baseBtn} />
            <CalculatorButton label="3" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "3" } })} className={baseBtn} />
            <CalculatorButton label="+" onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: "+" } })} className={operatorBtn} />

            <CalculatorButton label="0" onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "0" } })} className={`${baseBtn} col-span-2`} />
            <CalculatorButton label="." onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "." } })} className={baseBtn} />
            <CalculatorButton label="=" onClick={() => dispatch({ type: ACTIONS.EVALUATE })} className={operatorBtn} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
