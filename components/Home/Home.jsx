import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './Home.module.scss'; 



export default function HomeP() {
  const [books, setBooks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBooksAndUsers = async () => {
        try {
          // Fetch books from your backend
          const booksResponse = await axios.get('http://localhost:3001/books');
          const booksData = booksResponse.data;
  
          // Fetch user names for each book
          const booksWithUserNames = await Promise.all(
            booksData.map(async (book) => {
              if (!book.userId) {
                // If userId is null or undefined, set userName to 'Unknown User'
                return { ...book, userName: 'Unknown User' };
              }
              try {
                const userResponse = await axios.get(`http://localhost:3001/user/${book.userId}`);
                const userName = userResponse.data.userName;
                return { ...book, userName };
              } catch (error) {
                console.error(`Error fetching user for book ${book.id}:`, error);
                return { ...book, userName: 'Unknown User' };
              }
            })
          );
  
          setBooks(booksWithUserNames);
        } catch (error) {
          console.error('Error fetching books or user names:', error);
        }
      };
  
      fetchBooksAndUsers();
    }, []);
  
    const handleBookClick = async (bookId) => {
        try {
          // Redirect to the book details page with the book id as a query parameter
          router.push({
            pathname: '/book',
            query: { id: bookId },
          });
        } catch (error) {
          console.error(`Error navigating to book details for book ${bookId}:`, error);
        }
      };
    

    return (
        <div className={styles.books_container}>
          {books.map((book) => (
            <div key={book._id} className={styles.book_box} onClick={() => handleBookClick(book._id )}>
              <h3>{book.title}</h3>
              <p>{book.userName}</p>
            </div>
          ))}
        </div>
    );
}