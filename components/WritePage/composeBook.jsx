import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

axios.defaults.baseURL="http://localhost:3001";

const ComposeB = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();

  function updateForm(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/addBook", form);
      setForm({
        title: "",
        description: "",
      });
      router.push("/newChapter");
    } catch (error) {
      window.alert(error);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={updateForm}
          placeholder="Title"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={updateForm}
          placeholder="Description"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ComposeB;
