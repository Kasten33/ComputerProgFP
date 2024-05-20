import Link from "next/link";
import NavBar from "../components/Navbar/navbar.jsx";
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <NavBar />
      <Link href="/about">wow</Link>
    </div>
  );
}
