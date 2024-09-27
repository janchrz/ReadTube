import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Book } from 'lucide-react';

const BookReader = ({ book, onRead }) => {
  const bookInfo = book.volumeInfo;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="p-6">
        <div className="h-64 bg-gray-200 flex items-center justify-center relative mb-4">
          <img
            src={bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
            alt={`Cover of ${bookInfo.title}`}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
          />
          {book.saleInfo?.isEbook && (
            <div className="absolute top-0 right-0 m-2 px-2 py-1 text-xs font-bold rounded bg-green-500 text-white">
              eBook
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{bookInfo.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{bookInfo.authors?.join(', ') || 'Unknown Author'}</p>
        <p className="text-xs text-gray-500 mb-2">{bookInfo.categories?.[0] || 'Uncategorized'}</p>
        <p className="text-xs text-gray-500 mb-4">Published: {bookInfo.publishedDate || 'Unknown'}</p>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(bookInfo.averageRating || 0)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {bookInfo.averageRating 
              ? `(${bookInfo.averageRating.toFixed(1)}) - ${bookInfo.ratingsCount} ratings`
              : 'No ratings'
            }
          </span>
        </div>
        <Button
          onClick={() => onRead(book)}
          className="w-full flex items-center justify-center"
        >
          <Book className="w-4 h-4 mr-2" />
          Read Book
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookReader;