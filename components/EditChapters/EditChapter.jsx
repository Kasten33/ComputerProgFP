import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './EChap.module.scss';

const EditChapter = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { bookId } = router.query;

  useEffect(() => {
    if (bookId) {
      axios
        .get(`http://localhost:3001/books/${bookId}`)
        .then((response) => {
          setBook(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Error fetching book data');
          setLoading(false);
        });
    }
  }, [bookId]);

  const handleUpdate = (chapterId) => {
    // Implement the update logic here
    console.log(`Update chapter with ID: ${chapterId}`);
  };

  const handleDelete = async (chapterId) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      try {
        await axios.delete(`http://localhost:3001/chapter/books/${bookId}/delete/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // Update the local state to reflect the changes
        setBook((prevBook) => ({
          ...prevBook,
          chapters: prevBook.chapters.filter((chapter) => chapter.id !== chapterId),
        }));
        alert('Chapter deleted successfully');
      } catch (error) {
        console.error('Error deleting chapter:', error);
        alert('Error deleting chapter');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Chapters for Book: {book.title}</h1>
      <ul>
        {book.chapters.map((chapter) => (
          <li key={chapter.id} className={styles.chapterItem}>
            <h2>{chapter.title}</h2>
            <p>{chapter.content}</p>
            <button onClick={() => handleUpdate(chapter._id)}>Update</button>
            <button onClick={() => handleDelete(chapter._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditChapter;