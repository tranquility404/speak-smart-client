import { ReactNode, useEffect, useState } from 'react';

import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Header from './components/Header';
import { AnalysisReport } from './pages/analysis-report/AnalysisReport';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegistrationPage';
import ErrorPage from './pages/ErrorPage';
import FeatureUnderDevelopment from './pages/FeatureUnderDevelopment';
import LandingPage from './pages/LandingPage';
import SpeechGenerator from './pages/SpeechGenerator';
import SpeechRefinement from './pages/SpeechRefinement';
import RecentAnalysisList from './pages/recent-analysis/RecentAnalysis';

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
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />

        <Route path="*" element={ <ErrorPage /> } />

        <Route element={
          <>
            <Header isAuthenticated={isAuthenticated} />
            <Outlet />
          </>
        }>
          
          {/* Public routes (for non-authenticated users) */}

          <Route path="/" element={<LandingPage />} />

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
    </Router>
  );
};

export default App;