import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../../components/common/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin ErrorBoundary caught error]:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-navy mb-2">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
            An unexpected error occurred while rendering this module. You can reload the page or contact support if the issue persists.
          </p>
          {this.state.error?.message && (
            <pre className="text-[11px] font-mono bg-slate-100 text-slate-700 p-3 rounded-xl border border-slate-200 max-w-lg overflow-x-auto mb-6">
              {this.state.error.message}
            </pre>
          )}
          <Button variant="primary" icon={RefreshCw} onClick={this.handleRetry}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

