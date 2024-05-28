import React, { useState } from "react";

const Title = () => {
  const [title, setTitle] = useState("");

  return (
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};

const Body = () => {
  const [body, setBody] = useState("");

  return (
    <textarea
      placeholder="Chapter Contents"
      value={body}
      onChange={(e) => setBody(e.target.value)}
    />
  );
};

export { Title, Body };
