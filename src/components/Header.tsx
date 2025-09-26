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
import { Badge } from "@/components/ui/badge";
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
import { BarChart3, ChevronDown, History, LogIn, LogOut, MessageSquare, Mic, Settings, Sparkles, Target, User } from 'lucide-react';
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
    {
      name: "Speech Analyzer",
      path: "/speech-analyzer",
      icon: Mic,
      description: "Analyze your speech patterns"
    },
    {
      name: "Practice Sessions",
      path: "/practice-session",
      icon: Target,
      description: "Improve with guided practice"
    },
    {
      name: "Speech Refinement",
      path: "/speech-refinement",
      icon: Sparkles,
      description: "Polish your speaking style"
    },
    {
      name: "Analysis History",
      path: "/analysis-history",
      icon: BarChart3,
      description: "View your progress over time"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and title */}
            <div
              className="flex items-center cursor-pointer group transition-all duration-200"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl mr-3 shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  SpeakSmart
                </span>
                <span className="text-xs text-gray-500 font-medium hidden sm:block">
                  AI Speech Analysis
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className={`
                      flex items-center space-x-2 px-4 py-2 h-10 rounded-lg transition-all duration-200 font-medium
                      ${isActive(link.path)
                        ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                    onClick={() => navigate(link.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{link.name}</span>
                  </Button>
                );
              })}
            </nav>

            {/* Medium screen navigation */}
            <nav className="hidden md:flex lg:hidden items-center space-x-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant={isActive(link.path) ? "default" : "ghost"}
                    size="sm"
                    className={`
                      flex items-center justify-center p-2 rounded-lg transition-all duration-200
                      ${isActive(link.path)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }
                    `}
                    onClick={() => navigate(link.path)}
                    title={link.description}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Menu"
                    className="relative h-10 w-10 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 group"
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <div className={`absolute w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                      <div className={`absolute w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                      <div className={`absolute w-5 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[90%] max-w-[400px] bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 p-0">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <SheetHeader>
                      <SheetTitle className="flex items-center text-left text-white">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 shadow-lg">
                          <Mic className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <span className="text-xl font-bold">SpeakSmart</span>
                          <p className="text-blue-100 font-normal mt-1 text-sm">
                            AI-Powered Speech Analysis
                          </p>
                        </div>
                      </SheetTitle>
                    </SheetHeader>

                    {/* User Profile in Header (if authenticated) */}
                    {isAuthenticated && userInfo && (
                      <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                            <AvatarImage src={userInfo?.profilePicCloudUrl} alt={userInfo?.username} />
                            <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                              {userInfo?.name != undefined ? userInfo.name.charAt(0).toUpperCase() : userInfo?.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate text-base">
                              {userInfo?.name || userInfo?.username}
                            </p>
                            <p className="text-blue-100 truncate text-sm">{userInfo?.email}</p>
                            <div className="flex items-center mt-1">
                              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                              <Badge variant="secondary" className="bg-white/20 text-white text-xs hover:bg-white/30 border-0">
                                Premium Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Main Navigation */}
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Navigation
                      </h3>
                      {navigationLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                          <Button
                            key={link.path}
                            variant={isActive(link.path) ? "default" : "ghost"}
                            className={`
                              w-full justify-start p-4 h-auto rounded-xl transition-all duration-300 group
                              ${isActive(link.path)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                              }
                              animate-fade-in-up
                            `}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => {
                              navigate(link.path);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className={`
                                p-2 rounded-lg transition-all duration-200
                                ${isActive(link.path)
                                  ? 'bg-white/20'
                                  : 'bg-gray-100 group-hover:bg-blue-100'
                                }
                              `}>
                                <Icon className={`
                                  h-5 w-5 transition-colors duration-200
                                  ${isActive(link.path) ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}
                                `} />
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold text-sm">{link.name}</div>
                                <div className={`text-xs mt-0.5 ${isActive(link.path) ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-500'}`}>
                                  {link.description}
                                </div>
                              </div>
                              {isActive(link.path) && (
                                <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>

                    {/* User Actions (if authenticated) */}
                    {isAuthenticated && (
                      <div className="space-y-2 pt-4 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Account
                        </h3>

                        <Button
                          variant="ghost"
                          className="w-full justify-start p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                          onClick={() => {
                            navigate("/profile");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                              <User size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                            </div>
                            <div className="text-left flex-1">
                              <span className="font-medium text-gray-900">Profile Settings</span>
                              <div className="text-xs text-gray-500 mt-0.5">Manage your account</div>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                          onClick={() => {
                            navigate("/settings");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                              <Settings size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                            </div>
                            <div className="text-left flex-1">
                              <span className="font-medium text-gray-900">App Settings</span>
                              <div className="text-xs text-gray-500 mt-0.5">Customize preferences</div>
                            </div>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start p-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group mt-4"
                          onClick={() => {
                            handleLogoutClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-200">
                              <LogOut size={18} className="text-red-600" />
                            </div>
                            <div className="text-left flex-1">
                              <span className="font-medium">Sign Out</span>
                              <div className="text-xs text-red-500 mt-0.5">End your session</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    )}

                    {/* Authentication CTA (if not authenticated) */}
                    {!isAuthenticated && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Get Started
                        </h3>

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                          <div className="text-center mb-4">
                            <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-gray-900 mb-1">Unlock Full Potential</h4>
                            <p className="text-sm text-gray-600">
                              Sign in to access personalized speech analysis, progress tracking, and premium features.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium py-3 rounded-xl"
                              onClick={() => {
                                navigate("/login");
                                setMobileMenuOpen(false);
                              }}
                            >
                              <LogIn className="mr-2 h-5 w-5" />
                              Sign In
                            </Button>

                            <Button
                              variant="outline"
                              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-200 py-3 rounded-xl"
                              onClick={() => {
                                navigate("/register");
                                setMobileMenuOpen(false);
                              }}
                            >
                              Create Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Section */}
                    <div className="pt-6 border-t border-gray-200">
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <Sparkles className="h-4 w-4 text-gray-400" />
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">Need assistance?</p>
                          <a
                            href="https://www.linkedin.com/in/aman-verma403/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Developer
                          </a>
                        </div>

                        <p className="text-xs text-gray-400 pt-2">
                          © 2025 SpeakSmart. Made with ❤️
                        </p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* User dropdown (desktop) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* User status indicator */}
                <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">Online</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <Avatar className="h-9 w-9 border-2 border-blue-200 shadow-sm">
                        <AvatarImage src={userInfo?.profilePicCloudUrl} alt={userInfo?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold">
                          {userInfo?.name != undefined ? userInfo.name.charAt(0).toUpperCase() : userInfo?.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden lg:block text-left">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                          {userInfo?.name || userInfo?.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          Premium Account
                        </p>
                      </div>
                      <ChevronDown size={16} className="text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64 p-2 bg-white border border-gray-200 shadow-xl rounded-xl">
                    <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-blue-200">
                          <AvatarImage src={userInfo?.profilePicCloudUrl} alt={userInfo?.username} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {userInfo?.name != undefined ? userInfo.name.charAt(0).toUpperCase() : userInfo?.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {userInfo?.name || userInfo?.username}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Premium User
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuGroup className="space-y-1">
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                      >
                        <User size={18} className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">Profile Settings</div>
                          <div className="text-xs text-gray-500">Manage your account</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/analysis-history")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                      >
                        <History size={18} className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">Analysis History</div>
                          <div className="text-xs text-gray-500">View past reports</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/settings")}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                      >
                        <Settings size={18} className="text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">App Settings</div>
                          <div className="text-xs text-gray-500">Customize your experience</div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 cursor-pointer transition-colors duration-200 text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={handleLogoutClick}
                    >
                      <LogOut size={18} />
                      <div>
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs opacity-80">End your session</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <div className="p-3 text-center bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">Need help?</p>
                      <a
                        href="https://www.linkedin.com/in/aman-verma403/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                      >
                        Contact Developer
                      </a>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium px-4 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
                <Button
                  size="sm"
                  className="font-medium px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl rounded-xl">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl font-semibold text-gray-900">
              Sign Out Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 leading-relaxed">
              Are you sure you want to sign out of your SpeakSmart account?
              You'll need to sign in again to access your personalized features and analysis history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <AlertDialogCancel className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Stay Signed In
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;