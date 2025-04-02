import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureUnderDevelopment = () => {
    return (
        <div className="flex items-center justify-center w-full h-full p-4 mt-8">
            <Card className="w-full max-w-md shadow-lg border-2 border-blue-200">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <AlertCircle className="h-16 w-16 text-amber-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Feature Under Development</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                        I am working hard to bring you something amazing
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4 text-gray-700">
                        I'm working on this feature to deliver the best possible experience.
                        Thank you for your understanding as it takes shape.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pt-2">
                    <Link to="/">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Back to Dashboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
};

export default FeatureUnderDevelopment;