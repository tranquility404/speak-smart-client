import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';

import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Lazy load all components
const AuthCallback = lazy(() => import('./components/AuthCallback'));
const Header = lazy(() => import('./components/Header'));
const AnalysisReport = lazy(() => import('./pages/analysis-report/AnalysisReport').then(module => ({ default: module.AnalysisReport })));
const AnalysisRequestsList = lazy(() => import('./pages/AnalysisRequestsList'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegistrationPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const FeatureUnderDevelopment = lazy(() => import('./pages/FeatureUnderDevelopment'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RecentAnalysisList = lazy(() => import('./pages/recent-analysis/RecentAnalysis'));
const SpeechGenerator = lazy(() => import('./pages/SpeechGenerator'));
const SpeechRefinement = lazy(() => import('./pages/SpeechRefinement'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const HomePage = lazy(() => import('./pages/HomePage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return (
      <>
        {children}
      </>
    );
  };

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/code/google" element={<AuthCallback provider="google" setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/auth/code/github" element={<AuthCallback provider="github" setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/auth/code/linkedin" element={<AuthCallback provider="linkedin" setIsAuthenticated={setIsAuthenticated} />} />

          <Route path="*" element={<ErrorPage />} />

          <Route element={
            <Suspense fallback={<PageLoader />}>
              <Header isAuthenticated={isAuthenticated} />
              <Outlet />
              <PWAInstallPrompt />
            </Suspense>
          }>

            {/* Public routes (for non-authenticated users) */}

            <Route path="/landing" element={<LandingPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Home route - protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/analyse-report/:id"
              element={
                <ProtectedRoute>
                  <AnalysisReport type='live' />
                </ProtectedRoute>
              }
            />

            <Route
              path="/speech-analyzer"
              element={
                <ProtectedRoute>
                  <SpeechGenerator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis-history"
              element={
                <ProtectedRoute>
                  <RecentAnalysisList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis-request"
              element={
                <ProtectedRoute>
                  <AnalysisRequestsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analysis-history/:id"
              element={
                <ProtectedRoute>
                  <AnalysisReport type='old' />
                </ProtectedRoute>
              }
            />

            <Route
              path="/speech-refinement"
              element={
                <ProtectedRoute>
                  <SpeechRefinement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/practice-session"
              element={
                <ProtectedRoute>
                  {/* <PracticeSession /> */}
                  <FeatureUnderDevelopment />
                </ProtectedRoute>
              }
            />

            <Route
              path='/leaderboard'
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='/settings'
              element={<FeatureUnderDevelopment />}
            />
            <Route
              path='/profile'
              element={<FeatureUnderDevelopment />}
            />


            {/*<Route
            path="/practice-session/impromptu-exercise"
            element={
              <ProtectedRoute>
                <ImpromptuExercise />
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice-session/interview/:type"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice-session/slow-fast-exercise"
            element={
              <ProtectedRoute>
                <SlowFastDrillExercise />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis-history"
            element={
              <ProtectedRoute>
                <AnalysisHistory analyses={[
                  {
                    id: '1',
                    title: 'Q1 Performance Review',
                    date: new Date('2025-03-15'),
                    score: 82
                  },
                  {
                    id: '2',
                    title: 'Marketing Campaign Analysis',
                    date: new Date('2025-02-28'),
                    score: 64
                  },
                  {
                    id: '3',
                    title: 'Customer Satisfaction Survey',
                    date: new Date('2025-01-10'),
                    score: 45
                  }
                ]} />
              </ProtectedRoute>
            }
          /> */}

          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;