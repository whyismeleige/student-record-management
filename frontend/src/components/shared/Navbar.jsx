// components/shared/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GraduationCap, BookOpen, Menu, X } from "lucide-react";
import { APP_CONFIG } from "@/config";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-amber-50 border-b-2 border-stone-900">
      <div className="container mx-auto px-6 h-18 flex items-center justify-between py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-orange-500 border-2 border-stone-900 text-white p-1.5 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <span className="font-serif font-black text-xl tracking-tight text-stone-900">
            {APP_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="font-mono font-bold text-stone-700 hover:bg-orange-100 hover:text-stone-900"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Records
                </Button>
              </Link>

              <div className="w-0.5 h-6 bg-stone-300 mx-1"></div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-stone-900 rounded-lg shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                    <div className="w-6 h-6 bg-stone-900 rounded-full text-white flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0) || "A"}
                    </div>
                    <span className="font-bold text-sm text-stone-900">
                      {user.name || "Admin"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 mt-2 p-0 border-2 border-stone-900 rounded-lg bg-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]"
                >
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="p-3 hover:bg-orange-100 font-bold border-b-2 border-stone-100 cursor-pointer"
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="p-3 hover:bg-red-50 text-red-600 font-bold cursor-pointer"
                  >
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-bold text-stone-700 hover:underline decoration-2 underline-offset-4"
              >
                Log In
              </Link>
              <Link to="/register">
                <Button className="bg-stone-900 hover:bg-stone-800 text-white border-2 border-transparent rounded-lg px-6 font-bold shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] hover:shadow-[1px_1px_0px_0px_rgba(249,115,22,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden border-2 border-stone-900 p-1.5 rounded bg-white shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] active:shadow-none active:translate-y-1 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-stone-900 bg-white p-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block w-full p-3 bg-orange-50 border-2 border-stone-900 rounded font-bold text-center shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block w-full p-3 bg-red-50 border-2 border-red-200 text-red-600 rounded font-bold text-center"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-center font-bold py-2"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block w-full p-3 bg-stone-900 text-white rounded font-bold text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}