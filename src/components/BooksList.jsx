import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, BookmarkPlus, BookmarkMinus, Book, Maximize2, Minimize2 } from 'lucide-react';

// Button component
function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'font-medium rounded-md transition-colors';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100'
  };
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Card component
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

const BookList = ({ books, onRead }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    const savedBooksFromStorage = JSON.parse(localStorage.getItem('savedBooks') || '[]');
    setSavedBooks(savedBooksFromStorage);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const openModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPreviewModal = (book) => {
    setSelectedBook(book);
    setIsPreviewModalOpen(true);
    onRead(book);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    if (isFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const toggleSaveBook = (book) => {
    const updatedSavedBooks = savedBooks.some((savedBook) => savedBook.id === book.id)
      ? savedBooks.filter((savedBook) => savedBook.id !== book.id)
      : [...savedBooks, book];

    setSavedBooks(updatedSavedBooks);
    localStorage.setItem('savedBooks', JSON.stringify(updatedSavedBooks));
  };

  const isBookSaved = (bookId) => savedBooks.some((savedBook) => savedBook.id === bookId);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-2">
        {books.map((book) => (
          <div key={book.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mb-4">
            <Card className="h-full">
              <CardContent className="h-full flex flex-col justify-between p-4">
                <div>
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative mb-4">
                    <img
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                    <div className={`absolute top-0 right-0 m-2 px-2 py-1 text-xs font-bold rounded ${book.isFree ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {book.isFree ? 'Free' : 'Paid'}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <p className="text-xs text-gray-500 mb-2">{book.genre}</p>
                  <p className="text-xs text-gray-500 mb-4">Published: {book.publishedDate}</p>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(book.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {book.rating ? `(${book.rating.toFixed(1)})` : 'No rating'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => openModal(book)}
                    variant="default"
                    size="sm"
                  >
                    Details
                  </Button>
                  
                  {book.infoLink ? (
                    <Button
                      onClick={() => openPreviewModal(book)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center"
                    >
                      <Book className="w-4 h-4 mr-1" />
                      Read
                    </Button>
                  ) : (
                    <span className="text-gray-500 text-sm">Not Available</span>
                  )}

                  <button
                    onClick={() => toggleSaveBook(book)}
                    className={`transition-colors ${
                      isBookSaved(book.id) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                    }`}
                    aria-label={
                      isBookSaved(book.id)
                        ? 'Remove from saved books'
                        : 'Save book for later'
                    }
                  >
                    {isBookSaved(book.id) ? (
                      <BookmarkMinus className="h-6 w-6" />
                    ) : (
                      <BookmarkPlus className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl relative max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={closeModal}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 pr-16 text-gray-900">
                  {selectedBook.title}
                </h2>
                <img
                  src={selectedBook.cover}
                  alt={`Cover of ${selectedBook.title}`}
                  className="w-32 h-48 object-cover rounded-md shadow-md mb-4"
                />
                <p className="text-lg text-gray-700 mb-2">{selectedBook.author}</p>
                <p className="text-md text-gray-500 mb-2">{selectedBook.genre}</p>
                <p className="text-sm text-gray-500 mb-4">Published: {selectedBook.publishedDate}</p>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(selectedBook.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedBook.rating 
                      ? `(${selectedBook.rating.toFixed(1)}) - ${selectedBook.ratingsCount} ratings`
                      : 'No ratings'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{selectedBook.description}</p>
                <p className={`text-sm font-semibold ${selectedBook.isFree ? 'text-green-600' : 'text-gray-600'} mb-4`}>
                  {selectedBook.isFree ? 'This book is free!' : 'This book is not free.'}
                </p>
                <a
                  href={selectedBook.infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  More Info on Google Books
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreviewModalOpen && selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4"
            onClick={closePreviewModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg w-full h-full sm:w-11/12 sm:h-5/6 md:w-4/5 md:h-4/5 lg:w-3/4 lg:h-3/4 xl:w-2/3 xl:h-2/3 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 right-2 flex space-x-2 z-10">
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-6 w-6" />
                  ) : (
                    <Maximize2 className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={closePreviewModal}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="Close preview"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <h2 className="text-xl font-bold mb-2 pr-16 text-gray-900">
                {selectedBook.title}
              </h2>
              <div className="w-full h-[calc(100%-2rem)]">
                <iframe
                  src={`https://books.google.com/books?id=${selectedBook.id}&lpg=PP1&pg=PP1&output=embed`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={`Preview of ${selectedBook.title}`}
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookList;