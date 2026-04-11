import { Component } from 'react';
import { Link } from 'react-router';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '24px',
                    backgroundColor: '#F7F7F5',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '48px', lineHeight: 1 }}>⚠️</p>
                    <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>Something went wrong</h1>
                    <p style={{ fontSize: '14px', color: '#6b6b6b', maxWidth: '360px' }}>
                        An unexpected error occurred. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.href = '/';
                        }}
                        style={{
                            marginTop: '8px',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#534AB7',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Go to home
                    </button>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
