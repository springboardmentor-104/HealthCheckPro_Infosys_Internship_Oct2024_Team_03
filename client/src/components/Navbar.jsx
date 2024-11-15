import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md shadow-md p-4 fixed top-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <h1 className="font-bold font-sans text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
            HealthCheckPro
          </h1>
        </div>
        <div className="hidden md:flex justify-between space-x-5">
          <Link to="/" className="hover:cursor-pointer text-blue-500 hover:text-green-400 font-medium">
            Home
          </Link>
          <Link to="/articles" className="hover:cursor-pointer text-blue-500 hover:text-green-400 font-medium">
            Articles
          </Link>
          <Link to="/assessment" className="hover:cursor-pointer text-blue-500 hover:text-green-400 font-medium">
            Assessment
          </Link>
          <Link to="/dashboard" className="hover:cursor-pointer text-blue-500 hover:text-green-400 font-medium">
            Dashboard
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-blue-500 hover:text-green-500 focus:outline-none mb-0"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Content className="md:hidden flex flex-col items-center space-y-2 mt-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="hover:cursor-pointer text-blue-500 hover:text-green-500 font-medium">
            Home
          </Link>
          <Link to="/articles" onClick={() => setIsOpen(false)} className="hover:cursor-pointer text-blue-500 hover:text-green-500 font-medium">
            Articles
          </Link>
          <Link to="/assessment" onClick={() => setIsOpen(false)} className="hover:cursor-pointer text-blue-500 hover:text-green-500 font-medium">
            Assessment
          </Link>
          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="hover:cursor-pointer text-blue-500 hover:text-green-500 font-medium">
            Dashboard
          </Link>
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
};

export default Navbar;
