'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-full space-y-8 text-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We encountered an unexpected error. Please try again.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <pre className="bg-gray-100 p-4 rounded text-left text-xs overflow-auto mb-4 text-red-600">
                    {this.state.error.toString()}
                  </pre>
                )}
              </div>
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <a
                href="/"
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                Go to Home
              </a>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
