import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiChevronDown, FiChevronUp } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught Error captured by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-xl)',
            backgroundColor: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-2xl)',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg)',
                fontSize: '2rem',
              }}
            >
              <FiAlertTriangle />
            </div>

            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: 'var(--spacing-sm)',
                letterSpacing: '-0.02em',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-md)',
                marginBottom: 'var(--spacing-xl)',
                lineHeight: '1.6',
              }}
            >
              An unexpected application error occurred. Don't worry, our team of campus devs is on it!
            </p>

            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <FiRefreshCw /> Reload App
              </button>
              <a
                href="/"
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                <FiHome /> Go to Home
              </a>
            </div>

            {/* Error details toggle */}
            <div style={{ textAlign: 'left', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
              <button
                onClick={this.toggleDetails}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--font-size-xs)',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {this.state.showDetails ? <FiChevronUp /> : <FiChevronDown />}
                {this.state.showDetails ? 'Hide technical logs' : 'View technical logs'}
              </button>

              {this.state.showDetails && (
                <div
                  style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: '#0d1117',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    overflowX: 'auto',
                    maxHeight: '200px',
                  }}
                >
                  <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 'var(--font-size-xs)', marginBottom: '8px' }}>
                    {this.state.error && this.state.error.toString()}
                  </p>
                  <pre
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                    }}
                  >
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
