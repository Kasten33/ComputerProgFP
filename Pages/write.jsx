import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
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
    <Router>
      <div>
        <div>
          <NavBar />
        </div>
        <button onClick={handleComposeClick}>Compose</button>
        {showCompose && <Compose onSubmit={handleSubmit} />}
      </div>
    </Router>
  );
}
