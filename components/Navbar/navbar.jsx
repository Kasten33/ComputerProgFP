import Link from "next/link";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div classname={styles.navbar.item}>
        <Link href="/">Home</Link>
      </div>
      <div classname={styles.navbar.item}>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
};

export default NavBar;
