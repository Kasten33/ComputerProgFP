import React, { useState } from "react";
import { useNavigate } from "react-router";
import { addBook } from "../../api/controllers/books";

export default function compose() {
  const [form, setForm] = useState({
    title: "",
    body: "",
  });
  const navigate = useNavigate();

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const newBook = { ...form };

    try {
      await addBook(newBook);
      // navigate or reset form here if needed
    } catch (error) {
      window.alert(error);
    }
  }
  setForm({
    title: "",
    author: "",
    date_published: "",
    ongoing: "",
  });
  navigate("/write");
  // Rest of your component...
}

/*
return (
  <div>
    <h3>Create New Book</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Chapter Text</label>
        <input
          type="text-area"
          className="form-control"
          id="body"
          value={form.body}
          onChange={(e) => updateForm({ body: e.target.value })}
        />
      </div>

      <div className="form-group" style={{ marginTop: "10px" }}>
        <input type="submit" value="Create Book" className="btn btn-primary" />
      </div>
    </form>
  </div>
);
*/
