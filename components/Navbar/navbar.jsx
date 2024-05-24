import Link from "next/link";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  return (
    <div className={styles.navbar}>
      <div classname={styles.navbar.item}>
        <Link href="/">Home</Link>
      </div>
      <div classname={styles.navbar.item}>
        <Link href="/new">New</Link>
      </div>
      <div classname={styles.navbar.item}>
        <Link href="/write">Compose</Link>
      </div>
      <div classname={styles.navbar.item}>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
};

export default NavBar;
