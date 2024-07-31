import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "./SignOutButton";
import { BiCollapse, BiMenu } from "react-icons/bi";
import { useState } from "react";

const Header = () => {
  const { isLoggedIn, isAdmin } = useAppContext();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  return (
    <div className="bg-blue-800 py-6 px-3">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">HotelHub.com</Link>
        </span>
        {!showMenu && (
          <span
            className="flex md:hidden justify-center items-center"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <BiMenu size={32} color="white" />
          </span>
        )}
        {showMenu && (
          <div className="flex flex-col justify-between min-w-[150px] absolute right-2 bg-blue-800 border border-slate-300 rounded-md">
            <span className="flex  flex-col gap-4 md:hidden space-x-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="flex items-center text-white font-bold hover:bg-blue-600 px-2"
                  >
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/my-hotels"
                      className="flex items-center text-white font-bold hover:bg-blue-600"
                    >
                      My Hotels
                    </Link>
                  )}
                  <div className="p-0">
                    <SignOutButton />
                  </div>
                </>
              ) : (
                <div className="p-0">
                  <Link
                    to="/sign-in"
                    className="flex items-center bg-white text-blue-600 p-2 font-bold hover:bg-gray-100"
                  >
                    Sign-In
                  </Link>
                </div>
              )}
            </span>
            <span
              className="flex md:hidden p-4 text-white text-xl"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              Close
            </span>
          </div>
        )}
        <span className="hidden md:flex space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center text-white font-bold hover:bg-blue-600 px-3"
              >
                My Bookings
              </Link>
              {isAdmin && (
                <Link
                  to="/my-hotels"
                  className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                >
                  My Hotels
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex items-center bg-white text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign-In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
