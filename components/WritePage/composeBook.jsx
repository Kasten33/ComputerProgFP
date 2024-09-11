import React, { useState } from "react";
import axios from "axios";

axios.defaults.baseURL="http://localhost:3001";

const ComposeB = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false,
  });

  function updateForm(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      await axios.post("http://localhost:3001/books/create", form, { // Ensure the URL is correct
        headers: {
          'Authorization': `Bearer ${token}` // Ensure the Authorization header is set correctly
        }
      });

      // Reset form fields
      setForm({
        title: "",
        description: "",
        completed: false,
      });
    
    } catch (error)  {
      console.error('Error creating book:', error); // Log the error for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request data:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      alert("Error creating book");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={updateForm}
          placeholder="Title"
          required
        />
        <textarea
          type="text"
          name="description"
          value={form.description}
          onChange={updateForm}
          placeholder="Description"
          required
        />
        <div>
          <label>Completed</label>
        <select name="completed" value={form.completed} onChange={updateForm}>
          <option value={true}>Completed</option>
          <option value={false}>Not Completed</option>
        </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ComposeB;
