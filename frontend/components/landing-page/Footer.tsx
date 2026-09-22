export default function Footer() {
  return (
    <footer className="bg-[#14181A] px-6 py-8 text-sm text-neutral-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row">
        <span>© {new Date().getFullYear()} Bizview. Built by a developer, for small businesses.</span>
        <a href="https://github.com/abdulganiy-ibrahim/Business-Management-System" className="hover:text-white">
          View the code
        </a>
      </div>
    </footer>
  );
}