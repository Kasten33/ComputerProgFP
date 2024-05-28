import React, { useState, useEffect } from "react";
import styles from "./Chapter.module.scss";
import axios from "axios";

const Chap = () => {
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get("/api/book"); // replace with your API endpoint
        setBook(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
  }, []);

  if (!book) {
    return "Loading...";
  }

  return (
    <div classname={styles.body}>
      <h1>{book.body}</h1>
    </div>
  );
};

export default Chap;
