import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import BooksList from './BooksList';
import SearchHistory from './SearchHistory';
import { debounce } from 'lodash';

const API_KEY = 'AIzaSyANPKz3NE19gufQvvSvN-AtlMzJ2RZCMEQ';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [books, setBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const genres = ['All', 'Classic', 'Fiction', 'Science Fiction', 'Romance', 'Adventure', 'Mystery', 'Fantasy', 'Biography', 'History', 'Poetry'];

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const fetchBooks = useCallback(async (query, isSearch = false) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const genreQuery = selectedGenre !== 'All' ? `+subject:${selectedGenre}` : '';
      const fullQuery = `${query}${genreQuery}`;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${fullQuery}&orderBy=relevance&maxResults=${isSearch ? 20 : 5}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.items) {
        const formattedBooks = data.items.map((item) => {
          const bookInfo = item.volumeInfo;
          const saleInfo = item.saleInfo;
          return {
            id: item.id,
            title: bookInfo.title,
            author: bookInfo.authors ? bookInfo.authors[0] : 'Unknown Author',
            genre: bookInfo.categories ? bookInfo.categories[0] : 'Uncategorized',
            cover: bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
            infoLink: bookInfo.infoLink,
            description: bookInfo.description || 'No description available.',
            isFree: saleInfo?.saleability === 'FREE' || saleInfo?.isEbook === true,
            rating: bookInfo.averageRating || 0,
            ratingsCount: bookInfo.ratingsCount || 0,
            publishedDate: bookInfo.publishedDate || 'Unknown',
          };
        });
        if (isSearch) {
          setBooks(formattedBooks);
          updateRecentSearches(query);
        } else {
          setSuggestions(formattedBooks);
        }
      } else {
        if (isSearch) {
          setBooks([]);
        } else {
          setSuggestions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('An error occurred while fetching books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGenre]);

  const debouncedFetchSuggestions = useCallback(debounce((query) => fetchBooks(query, false), 300), [fetchBooks]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedFetchSuggestions(newSearchTerm);
  };

  const handleSearch = (query = searchTerm) => {
    fetchBooks(query, true);
    setSuggestions([]);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setIsGenreDropdownOpen(false);
    if (searchTerm) {
      handleSearch();
    }
  };

  const handleReadBook = (book) => {
    console.log('Reading:', book);
    // Implement your read book functionality here
  };

  const updateRecentSearches = (term) => {
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="container mx-auto px-4">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .genre-dropdown {
          animation: slideDown 0.3s ease-out;
        }
        .search-input:focus, .genre-button:focus {
          outline: none;
        }
        .genre-button {
          transition: background-color 0.3s ease-in-out, transform 0.1s ease-in-out;
        }
        .genre-button:hover {
          background-color: #f0f0f0;
        }
        .genre-button:active {
          transform: scale(0.98);
        }
        .chevron {
          transition: transform 0.3s ease-in-out;
        }
        .chevron-open {
          transform: rotate(180deg);
        }
      `}</style>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input w-full p-2 pl-10 pr-10 border rounded-md transition-all duration-300 ease-in-out"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    setSearchTerm(book.title);
                    setSuggestions([]);
                    handleSearch(book.title);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover mr-3" />
                  <div>
                    <div className="font-semibold truncate">{book.title}</div>
                    <div className="text-sm text-gray-500 truncate">{book.author}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Search
        </button>
        <div className="relative">
          <button
            onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
            className="genre-button w-full sm:w-auto px-4 py-2 bg-white border rounded-md flex items-center justify-between"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="truncate">{selectedGenre}</span>
            <ChevronDown className={`h-4 w-4 ml-2 chevron ${isGenreDropdownOpen ? 'chevron-open' : ''}`} />
          </button>
          {isGenreDropdownOpen && (
            <div className="genre-dropdown absolute z-10 w-48 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 truncate transition-colors duration-200"
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <SearchHistory
        recentSearches={recentSearches}
        onSearchSelect={(term) => {
          setSearchTerm(term);
          handleSearch(term);
        }}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="w-full h-[400px] bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 mb-4"></div>
              <div className="px-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="flex justify-between items-center mt-4">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4 animate-fadeIn">
          {error}
        </div>
      ) : (
        <div className="animate-fadeIn">
          <BooksList books={books} onRead={handleReadBook} />
        </div>
      )}
    </div>
  );
}