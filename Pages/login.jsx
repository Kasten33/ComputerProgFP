import { useState, useEffect } from "react";
import { Login, SignUp } from "../components/Login/login.jsx";
import NavBar from "../components/Navbar/navbar.jsx";

let BrowserRouter;
if (typeof window !== "undefined") {
  BrowserRouter = require("react-router-dom").BrowserRouter;
}

export default function login() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // after first render, setIsMounted to true
  }, []);

  if (!isMounted) {
    return null; // if not yet mounted, return null
  }

  return (
    <BrowserRouter>
      <div>
        <h1>Login / Sign Up</h1>
        <div>
          <NavBar />
        </div>
        <div>
          <SignUp />
          <Login />
        </div>
      </div>
    </BrowserRouter>
  );
}
