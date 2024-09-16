import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./UBook.module.scss";

const UBook = () => {
    const [form, setForm] = useState({
      title: "",
      description: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { bookId } = router.query;
  
    useEffect(() => {
      if (bookId) {
        axios
          .get(`http://localhost:3001/books/${bookId}`)
          .then((response) => {
            setForm({
              title: response.data.title,
              description: response.data.description,
            });
            setLoading(false);
          })
          .catch((error) => {
            setError("Error fetching book data");
            setLoading(false);
          });
      }
    }, [bookId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.patch(`http://localhost:3001/books/update/${bookId}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Book updated successfully");
        router.push("/account"); // Redirect to books list or another page
      } catch (error) {
        setError("Error updating book");
      }
    };
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div className={styles.container}>
        <h1>Edit Book</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Book</button>
        </form>
      </div>
    );
  };
  
  export default UBook;