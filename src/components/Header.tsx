import { getMyUserInfo } from '@/api/apiRequests';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserInfo } from '@/types/userInfo';
import { ChevronDown, History, LogIn, LogOut, Menu, Mic, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated = false }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const res = await getMyUserInfo();
        setUserInfo(res.data);
      } catch (error) {
        console.error("Failed to load user info:", error);
      }
    };
    
    if (isAuthenticated) loadUserInfo();
  }, [isAuthenticated]);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const navigationLinks = [
    { name: "Speech Analyzer", path: "/speech-analyzer" },
    { name: "Practice Sessions", path: "/practice-session" },
    { name: "Speech Refinement", path: "/speech-refinement" },
    { name: "Analysis History", path: "/analysis-history" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and title */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate("/")}
            >
              <div className="bg-primary p-2 rounded-lg mr-2.5 shadow-sm">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">SpeakSmart</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {navigationLinks.map((link) => (
                <Button
                  key={link.path}
                  variant={isActive(link.path) ? "default" : "ghost"} 
                  className={`text-sm lg:text-base ${isActive(link.path) ? '' : 'text-gray-700 hover:text-primary'}`}
                  onClick={() => navigate(link.path)}
                >
                  {link.name}
                </Button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <SheetHeader className="mb-4">
                    <SheetTitle className="flex items-center">
                      <div className="bg-primary p-1.5 rounded-lg mr-2">
                        <Mic className="h-4 w-4 text-white" />
                      </div>
                      <span>SpeakSmart</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-1">
                    {navigationLinks.map((link) => (
                      <Button
                        key={link.path}
                        variant={isActive(link.path) ? "default" : "ghost"}
                        className={`justify-start ${isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-gray-700'}`}
                        onClick={() => {
                          navigate(link.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {link.name}
                      </Button>
                    ))}
                    
                    {isAuthenticated && (
                      <>
                        <div className="py-2 my-2 border-t border-gray-100">
                          <div className="px-1 py-3">
                            <p className="font-medium text-gray-900">{userInfo?.first_name} {userInfo?.last_name}</p>
                            <p className="text-sm text-gray-500 truncate">{userInfo?.email}</p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            navigate("/profile");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <User size={16} className="mr-3 text-gray-500" />
                          Profile
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="justify-start"
                          onClick={() => {
                            navigate("/settings");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <Settings size={16} className="mr-3 text-gray-500" />
                          Settings
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            handleLogoutClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </Button>
                      </>
                    )}
                    
                    {!isAuthenticated && (
                      <Button 
                        className="w-full mt-4"
                        onClick={() => {
                          navigate("/login");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* User dropdown (desktop) */}
            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded-full"
                    >
                      <Avatar className="h-8 w-8 border-2 border-primary/10">
                        <AvatarImage src={userInfo?.profile_pic_url} alt={userInfo?.first_name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {userInfo?.first_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown size={16} className="text-gray-500 transition-transform duration-200" />
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-gray-900">{userInfo?.first_name} {userInfo?.last_name}</p>
                        <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User size={16} className="mr-3 text-gray-500" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/analysis-history")}>
                        <History size={16} className="mr-3 text-gray-500" />
                        History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings size={16} className="mr-3 text-gray-500" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500 focus:bg-red-50"
                      onClick={handleLogoutClick}
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="py-2 text-center text-xs text-gray-500">
                      <a href="https://www.linkedin.com/in/aman-verma403/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Contact Developer
                      </a>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:block">
                <Button 
                  size="sm" 
                  className="font-medium px-6"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogoutConfirm} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;