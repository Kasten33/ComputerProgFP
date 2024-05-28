import NavBar from "../components/Navbar/navbar.jsx";
import Title from "../components/WritePage/compose.jsx";
import Body from "../components/WritePage/compose.jsx";
import Book from "./models/book.js";

export default function Chapter() {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <h1></h1>
      <p>
        <Body />
      </p>
      <br />
      <div>
        <button>Previous</button>
        <button>Index</button>
        <button>Next</button>
      </div>
    </div>
  );
}
