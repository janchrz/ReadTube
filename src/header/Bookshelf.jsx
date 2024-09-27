import React from 'react';
import { BookOpen } from 'lucide-react';

const Bookshelf = ({ books, onRead }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">Continue Reading</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
              <div className="mt-2">
                <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{book.progress}% completed</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700">
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                onClick={() => onRead(book)}
              >
                <BookOpen className="inline-block mr-2 h-4 w-4" /> Continue Reading
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Bookshelf;