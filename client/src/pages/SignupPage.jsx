import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {    

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCloseAlert = () => {
        setError(""); // Clear error message on dismiss
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3001/user/signup', {
            name,
            email,
            password
        })
        .then((response) => {
            console.log(response);
            navigate("/login");
            setError(null);
            setName("");
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
        // console.log("name", name);
        // console.log("password", password);

    }

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
        <h2><center>Sign Up</center></h2>

            <form onSubmit={handleSubmit}>
                {error &&
                    <div className="alert alert-danger alert-dismissible">
                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseAlert}></button>
                        <strong>Error!</strong> {error}
                    </div>
                }
                <div className="mb-3">
                    <label htmlFor="name">
                        <strong>Name</strong>
                    </label>
                    <input type="text"
                    required
                    placeholder='Enter Name' 
                    autoComplete='off'
                    id="name"
                    name='name' 
                    className='form-control rounded-0'
                    onChange={(e) => setName(e.target.value)}
                    />
                </div>
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
                    Sign Up
                </button>
            </form>
            <div className="d-flex justify-content-start mt-3">
                <p className="mb-0">Already have an account?</p>
                <Link to="/login" className="text-decoration-none">
                    Login
                </Link>
            </div>
                
            
        </div>
    </div>
  );
}

export default Signup;