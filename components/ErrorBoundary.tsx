"use client"
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error !== null && error instanceof Error) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    } else {
      console.error('Error caught by ErrorBoundary:', new Error("An unknown error occurred"), errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      if (FallbackComponent) {
        if (this.state.error !== null && this.state.error instanceof Error) {
          return <FallbackComponent error={this.state.error} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />;
        } else {
          return <FallbackComponent error={new Error("An unknown error occurred")} resetErrorBoundary={() => this.setState({ hasError: false, error: null })} />;
        }
      }
      
      if (this.state.error !== null && this.state.error instanceof Error) {
        return (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
          </div>
        );
      } else {
        return (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">An unknown error occurred</h2>
          </div>
        );
      }
    }

    return this.props.children;
  }
}

export default ErrorBoundary;