import React, { useState, useEffect } from 'react';
import BookHeader from './components/BookHeader';
import BookDetails from './components/BookDetails';
import BooksList from './components/BooksList';
import SearchBar from './components/SearchBar';
import Bookshelf from './header/Bookshelf';
import Home from './header/Home';
import Welcome from './header/Welcome';
import { X, Sun, Moon } from 'lucide-react';
import './App.css';

const books = [
  // Your book data here
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const filteredBooks = books.filter(book =>
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedGenre === "" || book.genre === selectedGenre)
  );

  const booksInProgress = books.filter(book => book.progress > 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <BookHeader darkMode={darkMode} setDarkMode={setDarkMode} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile menu content */}
      </div>

      <main className="container mx-auto px-4 py-8 mt-20">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          onSearch={setSearchResults}
        />
        <BooksList books={searchResults.length > 0 ? searchResults : filteredBooks} onRead={setSelectedBook} />
        
        
        <Home books={books} />
        {booksInProgress.length > 0 && (
          <Bookshelf books={booksInProgress} onRead={setSelectedBook} />
        )}
      </main>

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          onClose={() => { setSelectedBook(null); setIsFullScreen(false); }}
        />
      )}

      <footer className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} py-8`}>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default App;