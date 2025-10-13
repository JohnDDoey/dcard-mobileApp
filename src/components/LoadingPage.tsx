'use client';

import { useEffect, useState } from 'react';

interface LoadingPageProps {
  onComplete: () => void;
  loadingTime?: number;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete, loadingTime = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animation des points
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Animation de la barre de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(dotsInterval);
          setTimeout(onComplete, 500); // Délai avant de passer à la suite
          return 100;
        }
        return prev + 2;
      });
    }, loadingTime / 50);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [onComplete, loadingTime]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      {/* Spinner de chargement */}
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
      </div>

      {/* Texte de chargement */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
          Loading{dots}
        </h2>
        <p className="text-gray-200 drop-shadow-md">
          Preparing your experience
        </p>
      </div>

      {/* Barre de progression */}
      <div className="w-80 max-w-md">
        <div className="bg-black/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-white text-sm drop-shadow-md">
            {progress}%
          </span>
        </div>
      </div>

      {/* Éléments décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Particules flottantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

export default LoadingPage;

