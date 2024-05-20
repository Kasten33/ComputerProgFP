import Link from "next/link";
import "./Navbar.scss";

const NavBar = () => {
  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
  );
};

export default NavBar;
