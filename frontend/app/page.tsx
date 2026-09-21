import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        Business Management system
        <br></br>
        <Link href="/signup">
          register now
        </Link>
      </div>
    </main>
  );
}
