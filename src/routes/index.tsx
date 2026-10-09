import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/studio/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) {
    return (
      <main className="boot">
        <p className="bootKicker">Festival of Bharat</p>
        <h1>Reel studio</h1>
        <p>Opening the desk…</p>
      </main>
    );
  }
  return <Studio />;
}
