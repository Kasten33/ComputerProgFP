import UBook from "../components/UBook/UBook";
import NavBar from "../components/Navbar/navbar";
import { useRouter } from "next/router";
import { React } from "react";

export default function updateBook() {
    const router = useRouter();
    const { bookId } = router.query; // Extract bookId from query parameters
  
    console.log("Rendering ComposeC with bookId:", bookId); // Debugging log
  
    return (
      <div>
        <NavBar />
        {bookId ? (
          <UBook bookId={bookId} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
  