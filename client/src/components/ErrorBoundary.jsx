import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught a frontend rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV || process.env.NODE_ENV !== 'production';

      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: isDev && this.state.error ? '800px' : '520px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              An unexpected error occurred while rendering this section. You can refresh the page or return to the home page.
            </p>

            {isDev && this.state.error && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  color: '#991b1b',
                  overflowX: 'auto',
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: '0.4rem' }}>
                  {this.state.error.name || 'Error'}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      color: '#b91c1c',
                    }}
                  >
                    {this.state.error.stack}
                  </pre>
                )}
                {this.state.errorInfo?.componentStack && (
                  <details style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                    <summary style={{ fontWeight: 700 }}>Component Stack</summary>
                    <pre
                      style={{
                        marginTop: '0.3rem',
                        fontFamily: 'monospace',
                        fontSize: '0.7rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  borderRadius: '8px',
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <Home size={16} />
                <span>Go Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
