import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../../api/controllers/books";
import e from "cors";

export default function Compose() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    date_published: "",
    ongoing: "",
  });
  const navigate = useNavigate();

  function updateForm(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      await addBook(form);
      setForm({
        title: "",
        author: "",
        date_published: "",
        ongoing: "",
      });
      navigate("/write");
    } catch (error) {
      window.alert(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        name="title"
        value={form.title}
        onChange={updateForm}
        placeholder="Title"
        required
      />
      <input
        name="author"
        value={form.author}
        onChange={updateForm}
        placeholder="Author"
        required
      />
      <input
        name="body"
        value={form.body}
        onChange={updateForm}
        placeholder="Body"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
