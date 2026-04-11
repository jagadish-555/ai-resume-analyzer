import React,{useState} from "react";
import { useAuth } from "../hooks/useAuth";
import {useNavigate, Link} from "react-router";
import "./auth.form.scss";

const Register = () => {

    const navigate = useNavigate();
    const {loading, handleRegister} = useAuth();
    const [username, setusername] = React.useState("");
    const [email, setemail] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("")
        const result = await handleRegister({username, email, password});
        if (result.success) {
            navigate("/");
            return
        }

        setErrorMessage(result.message)
    };
    

    return (
        <main className="auth-page">
            <nav className="auth-nav">
                <Link className="brand" to="/">
                    <span className="brand__dot" aria-hidden="true"></span>
                    <span className="brand__text">PrepAI</span>
                </Link>
            </nav>
            <div className="form-container">
                <h1>Create account</h1>
                <p className="form-subtitle">Get started with personalized interview preparation.</p>
                {errorMessage && <p className="form-error">{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                        onChange={(e)=>{setusername(e.target.value)}}
                        type="text" id="username" name="username" placeholder="Enter username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                        onChange={(e)=>{setemail(e.target.value)}}
                        type="email" id="email" name="email" placeholder="Enter email address" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                        onChange={(e)=>{setpassword(e.target.value)}}
                        type="password" id="password" name="password" placeholder="Enter password" />
                    </div>
                    
                    <button className="button primary-button" type="submit">Register</button>
                </form>
                <div className="auth-divider">or</div>
                <button className="button oauth-button" type="button">
                    <span className="oauth-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="16" height="16" role="img" aria-label="Google">
                            <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.25-.19-1.8H12v3.48h5.52c-.11.86-.69 2.15-1.99 3.02l-.02.12 2.89 2.24.2.02c1.84-1.7 2.9-4.19 2.9-7.08Z"/>
                            <path fill="#34A853" d="M12 22c2.7 0 4.97-.89 6.63-2.41l-3.16-2.38c-.85.59-1.99 1.01-3.47 1.01-2.64 0-4.87-1.74-5.67-4.15l-.11.01-3 2.33-.04.11A10 10 0 0 0 12 22Z"/>
                            <path fill="#FBBC05" d="M6.33 14.07A5.98 5.98 0 0 1 6 12c0-.72.12-1.42.32-2.07l-.01-.14-3.04-2.37-.1.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.53l3.26-2.46Z"/>
                            <path fill="#EA4335" d="M12 5.77c1.87 0 3.13.8 3.85 1.47l2.82-2.75C16.96 2.88 14.7 2 12 2a10 10 0 0 0-8.82 5.47l3.15 2.46c.81-2.41 3.04-4.16 5.67-4.16Z"/>
                        </svg>
                    </span>
                    Continue with Google
                </button>
                <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register;