import NavBar from "../components/Navbar/NavBar";
import EditChapter from "../components/EditChapters/EditChapter";
import { useRouter } from "next/router";
import React from "react";

export default function EditChaptersPage() {
  const router = useRouter();
  const { bookId } = router.query; // Extract bookId from query parameters

  console.log("Rendering ComposeC with bookId:", bookId); // Debugging log

  return (
    <div>
      <NavBar />
      {bookId ? <EditChapter bookId={bookId} /> : <p>Loading...</p>}
    </div>
  );
}
