import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../features/user/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    setIsOpen(false);
    console.log("Logged out!");
  };

  useEffect(() => {
    console.log("currentpath: ", location.pathname);
  }, [location])

  return (
    <nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-md shadow-md py-2 md:py-3 px-4 lg:px-6 fixed top-0 w-full z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-2 items-center">
          <div className="bg-white p-1 rounded-full">
            <img src="../../logo-cropped.png" className="w-8" alt="" />
          </div>
          <h1 className="font-bold font-sans text-2xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
            HealthCheckPro
          </h1>
        </div>
        <div className="hidden md:flex justify-between space-x-5">
          <Link
            to="/"
            className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
              location.pathname === "/" ? "font-bold" : "font-medium"
            }`}
          >
            Home
          </Link>
          {!isAuthenticated && (
            <Link
              to="/signin"
              className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
                location.pathname === "/signin" ? "font-bold" : "font-medium"
              }`}
            >
              {location.pathname === "/signin" ? "" : "Sign In"}
            </Link>
          )}
          {isAuthenticated && (
            <>
              <Link
                to="/assessment"
                className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
                  location.pathname === "/assessment"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Assessment
              </Link>
              <Link
                to="/leaderboard"
                className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
                  location.pathname === "/leaderboard"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Leaderboard
              </Link>
              <Link
                to="/dashboard"
                className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
                  location.pathname === "/dashboard"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Dashboard
              </Link>

              {/\/report\/attempt\/[^/]+/.test(location.pathname) && (
                <Link
                  to="/report"
                  className={`hover:cursor-pointer text-blue-500 hover:text-green-400 font-bold`}
                >
                  Report
                </Link>
              )}

              <Link
                to={location.pathname === "/" ? "/" : "/signin"}
                onClick={logout}
                className="hover:cursor-pointer text-red-400 hover:text-red-500 font-medium"
              >
                Logout
              </Link>
            </>
          )}
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
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
              location.pathname === "/" ? "font-bold" : "font-medium"
            }`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/assessment"
                onClick={() => setIsOpen(false)}
                className={`hover:cursor-pointer text-blue-500 hover:text-green-500 ${
                  location.pathname === "/assessment"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Assessment
              </Link>
              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className={`hover:cursor-pointer text-blue-500 hover:text-green-500 ${
                  location.pathname === "/leaderboard"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Leaderboard
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`hover:cursor-pointer text-blue-500 hover:text-green-500 ${
                  location.pathname === "/dashboard"
                    ? "font-bold"
                    : "font-medium"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/signin"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="hover:cursor-pointer text-red-400 hover:text-red-500 font-medium"
              >
                Logout
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <Link
              to="/signin"
              onClick={() => setIsOpen(false)}
              className={`hover:cursor-pointer text-blue-500 hover:text-green-400 ${
                location.pathname === "/signin" ? "font-bold" : "font-medium"
              }`}
            >
              {location.pathname === "/signin" ? "" : "Sign In"}
            </Link>
          )}
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
};

export default Navbar;
