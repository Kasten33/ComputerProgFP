import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../../api/controllers/books";

export default function Compose() {
  const [form, setForm] = useState({
    title: "",
    description: "",
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
        description: "",
      });
      navigate("/newChapter");
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
        name="decription"
        value={form.description}
        onChange={updateForm}
        placeholder="Description"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
