function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-4 text-blue-900 text-left" style={{backgroundColor: '#e5e7eb'}}>
      <a href="/" className="font-bold text-xl italic no-underline text-blue-900">Bode</a>
      <ul className="flex gap-8 list-none m-0 p-0">
        <li>
          <a href="/" className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm">
            Home
          </a>
        </li>
        <li>
          <a href="/#contact" className="no-underline text-blue-900 font-semibold italic hover:text-purple-600 transition-colors text-sm">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
