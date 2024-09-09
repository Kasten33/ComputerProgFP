import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

axios.defaults.baseURL="http://localhost:3001";

const ComposeB = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const router = useRouter();

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
      await axios.post("http://localhost:3001/books/create", form);
       // Reset form fields
      setForm({
        title: "",
        description: "",
        completed: false,
      });
    
    } catch (error) {
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
