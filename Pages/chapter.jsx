import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/Navbar/navbar.jsx";
import Chap from "../components/Chapter/chapter.jsx";

export default function Chapter() {
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
    <div>
      <div>
        <NavBar />
      </div>
      <h1>{book.title}</h1>
      <p>
        <Chap />
      </p>
      <br />
      <div>
        <button>Previous</button>
        <button>Index</button>
        <button>Next</button>
      </div>
    </div>
  );
}
