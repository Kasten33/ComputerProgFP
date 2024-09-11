import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./Chapter.module.scss"; // Import the SCSS module


const Chap = () => {
  const router = useRouter();
  const { bookId, id } = router.query;
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    if (id) { // Ensure id is defined before making the request
      const fetchChapter = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/chapter/books/${bookId}/${id}`);
          setChapter(response.data);
        } catch (error) {
          console.error("Error fetching chapter:", error);
        }
      };

      fetchChapter();
    }
  }, [bookId, id]);

  if (!chapter) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chapterbody}>
      <h1>{chapter.chapTitle}</h1>
      <p>{chapter.content}</p>
    </div>
  );
};

export default Chap;
