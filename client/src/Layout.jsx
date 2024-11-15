import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
      <div className="bg-gradient-to-r from-green-400 via-blue-400 to-blue-600">
        <Navbar />
        <div className="pt-20 md:pt-5 overflow-hidden min-h-screen">
          <Outlet />
        </div>
      </div>
    );
}

export default Layout