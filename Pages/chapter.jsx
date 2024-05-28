import NavBar from "../components/Navbar/navbar.jsx";
import Title from "../components/WritePage/compose.jsx";
import Body from "../components/WritePage/compose.jsx";

export default function Chapter() {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <h1>
        <Title />
      </h1>
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
