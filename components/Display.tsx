
import React from 'react';

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand?: string | null) {
  if (operand == null || operand === "") return null;
  const [integer, decimal] = operand.split(".");
  if (isNaN(parseInt(integer))) return operand; // Return original if not a number (e.g., "Error")
  if (decimal == null) return INTEGER_FORMATTER.format(parseInt(integer));
  return `${INTEGER_FORMATTER.format(parseInt(integer))}.${decimal}`;
}


interface DisplayProps {
  previousOperand?: string | null;
  operation?: string | null;
  currentOperand?: string | null;
}

const Display: React.FC<DisplayProps> = ({ previousOperand, operation, currentOperand }) => {
  return (
    <div className="bg-gray-800 text-white p-6 text-right break-words rounded-t-2xl">
      <div className="text-gray-400 text-2xl h-8 truncate" data-testid="previous-operand">
        {formatOperand(previousOperand)} {operation}
      </div>
      <div className="text-6xl font-light tracking-tight h-20 flex items-end justify-end" data-testid="current-operand">
        <span className="truncate">{formatOperand(currentOperand) || "0"}</span>
      </div>
    </div>
  );
};

export default Display;
