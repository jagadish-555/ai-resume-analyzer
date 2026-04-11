import React,{useState} from "react";
import { useAuth } from "../hooks/useAuth";
import {useNavigate, Link} from "react-router";

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
        <main>
            <div className="form-container">
                <h1>Register</h1>
                {errorMessage && <p style={{ color: "#b91c1c" }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit} >
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
                    
                    <button className="button primary-button">Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register;