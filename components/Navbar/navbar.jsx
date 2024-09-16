import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarItem}>
        <Link href="/">Home</Link>
      </div>
      <div className={styles.navbarItem}>
        <Link href="/new">New</Link>
      </div>
      <div className={styles.navbarItem}>
        <Link href="/newBook">Write</Link>
      </div>
      <div className={styles.navbarItem}>
        {isLoggedIn ? (
          <Link href="/account">Account</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
