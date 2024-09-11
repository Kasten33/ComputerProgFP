import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./Book.module.scss"; // Import the SCSS module

export default function Book() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (id) { // Ensure id is defined before making the request
      const fetchBook = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/books/${id}`);
          setBook(response.data);
        } catch (error) {
          console.error("Error fetching book:", error);
        }
      };

      fetchBook();
    }
  }, [id]);

  const handleChapterClick = (chapterId) => {
    router.push({
      pathname: '/chapter',
      query: { bookId: id, id: chapterId},
    });
  };


  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.book}>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <div className={styles.chapters}>
        {book.chapters && book.chapters.length > 0 ? (
          book.chapters.map((chapter) => (
            <div key={chapter.id} className={styles.chapter} onClick={() => handleChapterClick(chapter.id)}>
              <h3>{chapter.chapTitle}</h3>
            </div>
          ))
        ) : (
          <p>No chapters available.</p>
        )}
      </div>
    </div>
  );
};