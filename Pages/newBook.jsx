import React from "react";
import NavBar from "../components/Navbar/navbar.jsx";
import ComposeB from "../components/WritePage/composeBook.jsx";
import ComposeC from "../components/WritePage/composeChapter.jsx";

export default function Book() {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <ComposeB />
      <ComposeC />
    </div>
  );
}
