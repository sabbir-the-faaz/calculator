
import React from 'react';

interface CalculatorButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, label, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`text-3xl text-white font-light p-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-colors duration-200 ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
