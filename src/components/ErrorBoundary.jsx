import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorBoundary({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (error) => {
      console.error('Page Error:', error);
      navigate('/');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [navigate]);

  return children;
}