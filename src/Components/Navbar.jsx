import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          ZS WEAR
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm hover:text-gray-500">
            Home
          </Link>

          <Link to="/men" className="text-sm hover:text-gray-500">
            Men
          </Link>

          <Link to="/women" className="text-sm hover:text-gray-500">
            Women
          </Link>

          <Link to="/collection" className="text-sm hover:text-gray-500">
            Collections
          </Link>
        </div>

        {/* Desktop Button */}
        <button className="hidden rounded-full bg-black px-5 py-2.5 text-sm text-white hover:bg-gray-800 md:block">
          Shop Now
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl md:hidden"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-6 pb-6">

          <div className="flex flex-col gap-5 pt-5">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-sm"
            >
              Home
            </Link>

            <Link
              to="/men"
              onClick={() => setMenuOpen(false)}
              className="text-sm"
            >
              Men
            </Link>

            <Link
              to="/women"
              onClick={() => setMenuOpen(false)}
              className="text-sm"
            >
              Women
            </Link>

            <Link
              to="/collection"
              onClick={() => setMenuOpen(false)}
              className="text-sm"
            >
              Collections
            </Link>

            <button className="w-fit rounded-full bg-black px-5 py-2.5 text-sm text-white">
              Shop Now
            </button>

          </div>

        </div>
      </div>

    </nav>
  );
}

export default Navbar;