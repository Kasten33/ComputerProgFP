import { React } from "react";
import NavBar from "../components/Navbar/navbar.jsx";
import { useRouter } from "next/router";
import ComposeC from "../components/WritePage/composeChapter.jsx";

export default function Chapter() {
  const router = useRouter();
  const { bookId } = router.query; // Extract bookId from query parameters

  console.log("Rendering ComposeC with bookId:", bookId); // Debugging log

  return (
    <div>
      <NavBar />
      {bookId ? (
        <ComposeC bookId={bookId} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
