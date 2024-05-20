import Link from "next/link";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
  );
};

export default NavBar;
