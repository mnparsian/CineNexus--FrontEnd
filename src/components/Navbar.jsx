import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar({ centerContent, authUser, onLogout, onLoginClick, onSignupClick, showAuthButtons = true }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/30 backdrop-blur-lg shadow-sm border-b border-border dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar Row */}
        <div className=" h-14 items-center justify-between min-[840px]:flex max-[840px]:hidden ">
          {/* Left: Logo */}
          <Link to="/">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-lg font-bold cursor-pointer">CineNexus</h1>
            </div>
          </Link>

          {/* Center Content */}
          <div className="flex-1 flex justify-center ">
            <div className="max-w-xl w-full px-2">{centerContent}</div>
          </div>

          {/* Right Content */}
          <div className="flex items-center gap-3">
            {authUser && showAuthButtons ? (
              <>
                <Link to={"/dashboard"}>
                  <div className="cursor-pointer">
                    <Avatar>
                      <AvatarImage src={authUser.profileImage || undefined} alt={authUser.username} />
                      <AvatarFallback>{authUser.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
                <Button
                  /* variant="ghost" */ onClick={onLogout}
                  className="text-white  bg-gray-900/70 dark:bg-white/10 transition-colors duration-300 ease-in-out "
                >
                  Logout
                </Button>
              </>
            ) : showAuthButtons ? (
              <>
                <Button
                  /* variant="outline"  */ onClick={onLoginClick}
                  className="text-white  bg-gray-900/70 dark:bg-white/10 transition-colors duration-300 ease-in-out "
                >
                  Login
                </Button>
                <Button onClick={onSignupClick} className="text-white  bg-gray-900/70 dark:bg-white/10 transition-colors duration-300 ease-in-out ">
                  Sign up
                </Button>
              </>
            ) : null}
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="flex min-[840px]:hidden h-14 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate("/")}>
              CineNexus
            </h1>
          </div>

          {/* Mobile Toggle */}
          <div>
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Content */}
        {menuOpen && (
          <div className="min-[840px]:hidden py-4">
            <div className="flex flex-col  gap-2">
              <div className="flex justify-between">
                {authUser && showAuthButtons ? (
                  <>
                    <Link to={"/dashboard"}>
                      <div className="cursor-pointer">
                        <Avatar>
                          <AvatarImage src={authUser.profileImage || undefined} alt={authUser.username} />
                          <AvatarFallback>{authUser.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </Link>

                    <Button variant="ghost" onClick={onLogout}>
                      Logout
                    </Button>
                  </>
                ) : showAuthButtons ? (
                  <>
                    <div>
                      <Button variant="outline" onClick={onLoginClick} className="mx-2">
                        Login
                      </Button>
                      <Button onClick={onSignupClick}>Sign up</Button>
                    </div>
                  </>
                ) : null}
                <ThemeSwitcher />
              </div>
              <div className="w-full px-2">{centerContent}</div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
