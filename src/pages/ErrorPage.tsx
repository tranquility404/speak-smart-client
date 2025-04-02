import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Home, Search } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-col items-center pt-10 pb-6">
            {/* SVG Animation for 404 */}
            <svg width="200" height="120" viewBox="0 0 200 120" className="mb-4">
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" 
                className="text-gray-200 stroke-gray-800" 
                style={{ 
                  fontSize: '70px', 
                  fontWeight: 'bold',
                  fill: 'none',
                  strokeWidth: '1.5px',
                  strokeLinejoin: 'round'
                }}>
                404
              </text>
              <path id="motionPath" d="M 40,60 C 70,30 130,30 160,60" fill="none" stroke="transparent" />
              <circle r="6" fill="#ef4444">
                <animateMotion 
                  dur="3s" 
                  repeatCount="indefinite" 
                  path="M 40,60 C 70,30 130,30 160,60" />
              </circle>
            </svg>
            
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Page Not Found</h1>
            <p className="text-gray-500 text-center mt-2">
              We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className="bg-gray-100 rounded-lg p-4 flex items-start space-x-3">
              <div className="mt-1">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Looking for something?</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Try searching for what you need or return to the homepage to start fresh.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col justify-center sm:flex-row gap-3 pb-8">
            <Button 
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              onClick={() => window.location.href = '/'}
            >
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          Need assistance? <a href="https://www.linkedin.com/in/aman-verma403/" target='_blank' className="text-blue-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;