import React, { useState } from "react";
import axios from "axios";

axios.defaults.baseURL="http://localhost:3001";

const ComposeC = ({ bookId }) => {
    const [chapter, setChapter] = useState({
        chapTitle: "",
        content: "",
      });
      const handleChange = (e) => {
        const { name, value } = e.target;
        setChapter((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await axios.post(`http://localhost:3001/books/${bookId}/add`, chapter);
          alert("Chapter added successfully");
        } catch (error) {
          alert("Error adding chapter: " + error.message);
        }
      };




      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={chapter.chapTitle}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              name="content"
              value={chapter.content}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Chapter</button>
        </form>
      );
    };

export default ComposeC;