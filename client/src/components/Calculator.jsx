import React, { useState, useEffect } from 'react';

const buttons = [
  ['C', '←', '/', '*'],
  ['7', '8', '9', '-'],
  ['4', '5', '6', '+'],
  ['1', '2', '3', '='],
  ['0', '.', '', ''],
];

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleInput = (value) => {
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === '←') {
      setExpression(expression.slice(0, -1));
    } else if (value === '=') {
      try {
        // WARNING: eval can be dangerous, replace with safe eval lib in prod
        const evalResult = eval(expression);
        setResult(evalResult);
      } catch {
        setResult('Error');
      }
    } else {
      if (result) setResult('');
      setExpression((prev) => prev + value);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const validKeys = '0123456789+-*/.=cC';
      if (validKeys.includes(e.key)) {
        handleInput(e.key === 'c' || e.key === 'C' ? 'C' : e.key);
      } else if (e.key === 'Enter') {
        handleInput('=');
      } else if (e.key === 'Backspace') {
        handleInput('←');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-3xl shadow-2xl p-4 w-72">
      <div className="bg-white rounded-3xl shadow-inner p-3 w-full">
        {/* Display */}
        <div className="bg-gray-100 rounded-xl px-3 py-2 mb-3 text-right shadow-inner h-16 flex flex-col justify-center">
          <div className="text-gray-500 text-sm truncate">{expression || '0'}</div>
          <div className="text-lg font-bold text-indigo-700 truncate">{result}</div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((btn, i) =>
            btn ? (
              <button
                key={i}
                onClick={() => handleInput(btn)}
                className={`py-2 rounded-xl shadow-sm text-base font-semibold transition transform hover:scale-105 active:scale-95 focus:outline-none
                  ${btn === '='
                    ? 'bg-indigo-500 text-white'
                    : btn === 'C'
                    ? 'bg-red-100 text-red-600'
                    : btn === '←'
                    ? 'bg-yellow-100 text-yellow-700'
                    : ['+', '-', '*', '/'].includes(btn)
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-50 text-gray-800'
                  }`}
              >
                {btn}
              </button>
            ) : (
              <div key={i}></div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
