import React from 'react';
import { X, BookOpen } from 'lucide-react';

const BookDetails = ({ book, isFullScreen, setIsFullScreen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-auto ${isFullScreen ? '' : 'p-4'}`}>
      <div className={`max-w-4xl mx-auto ${isFullScreen ? 'h-full' : 'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <div className="space-x-2">
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            </button>
            <button
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className={`overflow-y-auto ${isFullScreen ? 'h-[calc(100vh-80px)]' : 'max-h-[70vh]'}`}>
          <p className="text-lg leading-relaxed">{book.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;