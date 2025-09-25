import { loginUser } from '@/api/apiRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SocialLoginButton from '@/components/SocialLoginButton';
import { Eye, EyeOff, Mic, Target, TrendingUp, Bot } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = ({ setIsAuthenticated }: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      console.log(res);
      localStorage.setItem('authToken', res.data);
      setIsAuthenticated(true);
      navigate("/")
    } catch (e) {
      toast.error((e as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 border border-white/25 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border border-white/15 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl shadow-2xl mb-6">
              <Mic className="h-16 w-16 text-white mx-auto" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              SpeakSmart
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-md leading-relaxed">
              Welcome back! Continue your journey to master communication skills with AI-powered insights
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Personalized Analysis</h3>
                <p className="text-blue-100 text-sm">Get detailed insights into your speaking patterns</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Track Progress</h3>
                <p className="text-blue-100 text-sm">Monitor your improvement over time</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">AI-Powered Feedback</h3>
                <p className="text-blue-100 text-sm">Receive intelligent recommendations</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-blue-200 text-sm italic">
            "Every conversation is an opportunity to improve"
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Mic className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SpeakSmart
              </h1>
            </div>
          </div>


          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 px-6 pt-6 pb-4">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome back</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Sign in to your SpeakSmart account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-4">
              <div className="space-y-4">
                {/* Social Login Buttons */}
                <div className="flex justify-center gap-4">
                  <SocialLoginButton provider="google" disabled={isLoading} variant="icon" />
                  <SocialLoginButton provider="github" disabled={isLoading} variant="icon" />
                  <SocialLoginButton provider="linkedin" disabled={isLoading} variant="icon" />
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500 font-medium">Or continue with email</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter Password here'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-end">
                      <Link to="/reset-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center px-6 pb-6 pt-2">
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 hover:underline transition-colors">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;