import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {    

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
   
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/user/login', {
            email,
            password
        })
        .then((response) => {
            console.log("response from login api", response);
            // console.log(response?.headers?.authorization.split(" ")[1]);
            if(response?.headers?.has("authorization")){
                const token = response?.headers?.authorization.split(" ")[1];
                localStorage.setItem('token', token);
            }
            navigate("/home");
            setError(null);
            setEmail("");
            setPassword("");
        })
        .catch((error) => {
            console.log(error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        });
        // console.log("email", email);
        // console.log("password", password);
    }

    const handleCloseAlert = () => {
        setError(""); // Clear error message on dismiss
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){ // validate token
            // console.log("token in useEffect", token);
            axios.post('http://localhost:3001/user/validateToken', {token})
            .then((response) => {
                console.log("response from validate token api on login page", response);
                navigate("/home");
            })
            .catch((error) => {
                // console.log("token validation error");
                localStorage.removeItem('token');
            });
        }
    }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
            <h2><center>Login</center></h2>
            <form onSubmit={handleSubmit}>
                {error &&
                    <div className="alert alert-danger alert-dismissible">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAlert}></button>
                        <strong>Error!</strong> {error}
                    </div>
                    }
                
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input type="email"
                    required
                    placeholder='Enter Email' 
                    autoComplete='off'
                    id="email"
                    name='email' 
                    className='form-control rounded-0' 
                    onChange={(e) => setEmail(e.target.value)}

                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password">
                        <strong>Password</strong>
                    </label>
                    <input type="password"
                    required
                    placeholder='Enter Password'
                    id="password"
                    name='password' 
                    className='form-control rounded-0' 
                    onChange={(e) => setPassword(e.target.value)}

                    />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Login
                </button>
                </form>
                <div className="d-flex justify-content-start mt-3">
                    <p className="mb-0">Don't have an account?</p>
                    <Link to="/signup" className="text-decoration-none">
                        Sign Up
                    </Link>
                </div>
        </div>
    </div>
  );
}

export default Login;