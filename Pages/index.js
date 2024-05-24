import Link from "next/link";
import NavBar from "../components/Navbar/navbar.jsx";
import Search from "../components/Search/search.jsx";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <Search />
      </div>
      <div>
        <NavBar />
      </div>
      <p>Welcome! Click on New or Search for books.</p>
      <br />
      <p>Home page TB Developed </p>
    </div>
  );
}
