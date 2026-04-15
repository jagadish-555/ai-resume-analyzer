import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router";
import "./auth.form.scss";
import LoadingScreen from "../../../components/LoadingScreen";
import { LogoMark } from "../../../components/Logo";

const Register = () => {

    const navigate = useNavigate();
    const { loading, user, handleRegister } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate("/home", { replace: true })
        }
    }, [loading, user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("")
        setSubmitting(true)
        const result = await handleRegister({ username, email, password });
        if (result.success) {
            navigate("/home");
            return
        }

        setErrorMessage(result.message)
        setSubmitting(false)
    };

    if (loading) {
        return <LoadingScreen message="Loading..." />
    }

    if (user) {
        return null
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
                        <h2>Start your interview prep journey</h2>
                        <p>Join thousands of candidates using AI to prepare smarter, practice better, and land their dream roles.</p>
                    </div>
                    <div className="auth-hero__features">
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </span>
                            <span>AI-generated mock interview questions</span>
                        </div>
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                            </span>
                            <span>Skill gap identification & analysis</span>
                        </div>
                        <div className="auth-hero__feature">
                            <span className="feature-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </span>
                            <span>Personalized study schedules</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="form-container">
                    <div className="form-header">
                        <h1>Create account</h1>
                        <p className="form-subtitle">Get started with personalized interview preparation.</p>
                    </div>
                    {errorMessage && (
                        <div className="form-error" role="alert">
                            <span>{errorMessage}</span>
                            <button type="button" className="form-error__dismiss" aria-label="Dismiss" onClick={() => setErrorMessage("")}>×</button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text" id="username" name="username" placeholder="johndoe"
                                autoComplete="username" required />
                        </div>
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
                                autoComplete="new-password" required minLength={6} />
                        </div>
                        <button className="button primary-button auth-submit" type="submit" disabled={submitting} aria-busy={submitting}>
                            {submitting ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </main>
    )
}

export default Register;