import './App.css';
import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, Link} from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [servererror, setServerError] = useState('');
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if(token){
            navigate('/home');
        }
    },[]);

    //To handle input validations
    const handleValidation =(email, password) =>{
        const newErrors = {};
        if(!email){
            newErrors.email = "Email is required"
        }
        if(!password){
            newErrors.password = "Password is required"
        }
        setError(newErrors);
        return newErrors;
    }

    //To handle email changes
    const handleEmailChange = (e) => {
        setError((prevErrors) => ({ ...prevErrors, email: '' }));
        setEmail(e.target.value);
      };

    //To handle password changes
    const handlePasswordChange = (e) => {
        setError((prevErrors) => ({ ...prevErrors, password: '' }));
        setPassword(e.target.value);
    };

    //Login call
    const handleClick = async (e) =>{
        e.preventDefault();
        const isValid = handleValidation(email,password);
        if(Object.keys(isValid).length == 0){
            try{
                const res = await axios.post("https://riota-login.onrender.com/user/login", {email,password});
                localStorage.setItem('token', res.data.token);
                navigate('/home');        
            }
            catch(err){
                setServerError(err.response.data.message);
            }
        }
    }

return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container p-4 m-4 rounded text-white w-25 h-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2) !important' }}>
        <h4 className='text-center'>Login</h4>
        <form onSubmit={handleClick}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              onChange={handleEmailChange}
            />
          </div>
          {error.email && (
            <div className='text-danger'>{error.email}</div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={handlePasswordChange}
            />
          </div>
          {error.password && (
            <div className='text-danger'>{error.password}</div>
          )}
          {servererror && (
            <div className='bg-danger text-white p-3 m-3 text-center'>{servererror}</div>
          )}
          <button type="submit" className="btn btn-info mt-3">
            Submit
          </button>
        </form>
        <p className="mt-3 info">
          Not registered? <Link to="/signup">Signup here</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
