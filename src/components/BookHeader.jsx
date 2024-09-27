import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';

const BookHeader = ({ darkMode, setDarkMode, setIsMobileMenuOpen }) => {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed top-0 left-0 right-0 z-20`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="text-red-600">Read</span>
          <span className={darkMode ? 'text-white' : 'text-black'}>Tube</span>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <button className="hover:text-gray-300">Home</button>
          <div className="relative group">
            <button className="hover:text-gray-300">Categories</button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {["Classic", "Fiction", "Science Fiction", "Romance", "Adventure"].map((genre) => (
                  <button
                    key={genre}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="hover:text-gray-300">About</button>
          <button className="hover:text-gray-300">Contact</button>
          <button
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default BookHeader;