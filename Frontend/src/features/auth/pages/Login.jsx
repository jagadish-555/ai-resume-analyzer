import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "./auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from "../../../components/LoadingScreen";
import { LogoMark } from "../../../components/Logo";

const Login = () => {
    const navigate = useNavigate();
    const { loading, handleLogin } = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("")
        setSubmitting(true)
        const result = await handleLogin({ email, password });
        if (result.success) {
            navigate("/");
            return
        }

        setErrorMessage(result.message)
        setSubmitting(false)
    }

    if (loading) {
        return <LoadingScreen message="Loading..." />
    }

    return (
        <main className="auth-page">
            <div className="auth-hero">
                <div className="auth-hero__content">
                    <Link className="hero-brand" to="/">
                        <LogoMark size={28} />
                        <span>PrepAI</span>
                    </Link>
                    <div className="auth-hero__copy">
                        <h2>Ace every interview with AI-powered preparation</h2>
                        <p>Upload your resume, paste a job description, and get tailored questions, skill gap analysis, and a personalized study plan in seconds.</p>
                    </div>
                    <div className="auth-hero__features">
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            </span>
                            <span>Resume analysis & match scoring</span>
                        </div>
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                            </span>
                            <span>Tailored technical & behavioral questions</span>
                        </div>
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </span>
                            <span>Day-by-day preparation plans</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="form-container">
                    <div className="form-header">
                        <h1>Welcome back</h1>
                        <p className="form-subtitle">Sign in to continue preparing with PrepAI.</p>
                    </div>
                    {errorMessage && (
                        <div className="form-error" role="alert">
                            <span>{errorMessage}</span>
                            <button type="button" className="form-error__dismiss" aria-label="Dismiss" onClick={() => setErrorMessage("")}>×</button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" id="email" name="email" placeholder="you@example.com"
                                autoComplete="email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" id="password" name="password" placeholder="••••••••"
                                autoComplete="current-password" required />
                        </div>
                        <button className="button primary-button auth-submit" type="submit" disabled={submitting} aria-busy={submitting}>
                            {submitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    <p className="auth-switch">Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Login;
