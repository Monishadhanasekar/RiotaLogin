import './App.css';
import React,{useState} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';

const SignupForm = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [servererror, setServerError] = useState('');
    const navigate = useNavigate();

    //To handle input validations
    const handleValidation = (fullname,email, password) => {
        const newErrors = {};

        if (!fullname) {
          newErrors.fullname = "Full name is required";
        }

        if (!email) {
           newErrors.email = "Email is empty";
        } else {
            var regex = /^([a-zA-Z0-9_\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/;
            const res = email.match(regex);
            if (!res) {
                newErrors.email = "Invalid email address";
            }
        }

        if (!password) {
           newErrors.password = "Password is empty";
        } else {
            if (password.length < 8) {
                newErrors.password = "Minimum 8 characters";
            }
            if (!/\d/.test(password)) {
                newErrors.password = "Minimum one number required";
            }
            const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
            if (!specialChars.test(password)) {
                newErrors.password = "Minimum one special character required";
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    //To handle fullname changes
    const handleFullnameChange = (e) => {
        setErrors((prevErrors) => ({ ...prevErrors, fullname: '' }));
        setFullname(e.target.value);
    };

    //To handle email changes
    const handleEmailChange = (e) => {
        setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        setEmail(e.target.value);
    };

    //To handle password changes
    const handlePasswordChange = (e) => {
        setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        setPassword(e.target.value);
    };
      
    //To register users
    const handleClick = async (e) => {
        e.preventDefault();
        const isValid = handleValidation(fullname,email, password);
        if (Object.keys(isValid).length === 0) {
            try {
                const res = await axios.post("https://riota-login.onrender.com/user/register", { fullname, email, password });
                navigate('/login');
            } catch (err) {
                if (err.response && err.response.data && err.response.data.message) {
                    const serverErrors = err.response.data.message;
                    setServerError(serverErrors);
                }
            }
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
             <div className="container p-4 m-4 rounded text-white w-25 h-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7) !important' }}>
                <h4 className='text-center'>Signup</h4>
                <form onSubmit={handleClick}>
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullname"
                            placeholder="Enter fullname"
                            onChange={handleFullnameChange}
                        />
                        {errors.fullname && (
                            <div className='text-danger'>{errors.fullname}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            onChange={handleEmailChange}
                        />
                         {errors.email && (
                            <div className='text-danger'>{errors.email}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                        />
                         {errors.password && (
                            <div className='text-danger'>{errors.password}</div>
                        )}
                    </div>
                    {servererror && (
                        <div className='bg-danger text-white p-3 m-3 text-center'>{servererror}</div>
                    )}
                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
                <div className="mt-3">
                    Already registered? <Link to="/login">Sign in here</Link>.
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
