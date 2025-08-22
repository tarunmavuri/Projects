
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="max-w-2xl mx-auto bg-rose-900/40 backdrop-blur-md border-l-4 border-rose-500 text-rose-200 p-4 rounded-md shadow-lg" role="alert">
      <div className="flex">
        <div className="py-1"><i className="fa-solid fa-circle-exclamation mr-3 text-xl text-rose-400"></i></div>
        <div>
          <p className="font-bold">Oops! Something went wrong.</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};