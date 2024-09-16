import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Account = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [books, setBooks] = useState([]); // State to store book details
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.userID;
        if (!userId) {
          throw new Error("User ID not found in token.");
        }
        setUserId(userId);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`http://localhost:3001/user/${userId}`, config);
        console.log("User data:", response.data);
        setUser(response.data);

        // Fetch book details
        const book = await Promise.all(
          response.data.books.map(bookId => axios.get(`http://localhost:3001/books/${bookId}`, config))
        );
        setBooks(book.map(res => res.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleCreateNewBook = () => {
    router.push("/newBook");
  };

  const handleCreateNewChapter = (bookId) => {
    console.log("bookId:", bookId)
    router.push({
      pathname: '/newChapter',
      query: { bookId: bookId }
    });;
  };

  const handleEdit = (bookId) => {
    router.push({pathname: '/editChapters', query: {bookId: bookId}});
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`http://localhost:3001/books/delete/${bookId}`, config);
      // Refresh user data after deletion
      const response = await axios.get(
        `http://localhost:3001/user/${userId}`,
        config
      );
      setUser(response.data);
      // Refresh book details
      const bookDetails = await Promise.all(
        response.data.books.map(bookId => axios.get(`http://localhost:3001/books/${bookId}`, config))
      );
      setBooks(bookDetails.map(res => res.data));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };


  const handleUpdateBook = (bookId) => {
    router.push({pathname: '/updateBook', query: {bookId: bookId}});
  };

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Account Details</h1>
      <p>
        <strong>Name:</strong> {user.userName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={handleCreateNewBook}>Create New Book</button>
      <h2>Books</h2>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              {book.title}
              <button onClick={() => handleCreateNewChapter(book._id)}>Create New Chapter</button>
              <button onClick={() => handleEdit(book._id)}>Edit Chapter</button>
              <button onClick={() => handleDeleteBook(book._id)}>Delete Book</button>
              <button onClick={() => handleUpdateBook(book._id)}>Update Book</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};


export default Account;
