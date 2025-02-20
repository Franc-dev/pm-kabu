import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16'
};

const colorClasses = {
  primary: 'border-blue-500',
  secondary: 'border-purple-500',
  white: 'border-white'
};

export const Loader = ({
  size = 'md',
  color = 'primary',
  className = '',
  text
}: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div 
          className={`absolute w-full h-full rounded-full border-4 border-t-transparent animate-spin ${colorClasses[color]}`}
        />
      </div>
      {text && (
        <div className="flex items-center gap-2">
          <span className="inline-block w-5 h-5">
            <div className={`w-full h-full rounded-full border-2 border-t-transparent animate-spin ${colorClasses[color]}`} />
          </span>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

// Helper hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError
  };
};

// HOC for adding loading state to components
export function withLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLoadingComponent({
    isLoading,
    ...props
  }: P & { isLoading: boolean }) {
    if (isLoading) {
      return <Loader />;
    }
    return <WrappedComponent {...(props as P)} />;
  };
}

export default Loader;