import React, { useState } from "react";
import Link from "next/link";
import NavBar from "../components/Navbar/navbar.jsx";
import Compose from "../components/WritePage/compose.jsx";

export default function Write() {
  const [showCompose, setShowCompose] = useState(false);

  const handleComposeClick = () => {
    setShowCompose(true);
  };

  const handleSubmit = () => {
    setShowCompose(false);
  };

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <button onClick={handleComposeClick}>Compose</button>
      {showCompose && <Compose onSubmit={handleSubmit} />}
    </div>
  );
}
