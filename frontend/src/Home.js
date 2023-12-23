import React,{useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleClick =() => {
        localStorage.removeItem("token");
        navigate('/login');
}

//to fetch user specific data
const handleFetchData = async() => {
    const res = await axios.get("http://localhost:8000/user/getuser", { headers: {"Authorization" : `Bearer ${token}`} });
    setData(res.data.user);
}

useEffect(()=>{
    handleFetchData();
},[])

return (
    <>
    <div className="position-fixed top-0 end-0 p-3">
        <button type="button" className="btn btn-info" onClick={handleClick}>SignOut</button>
    </div>
    <div className="d-flex align-items-center justify-content-center vh-100 text-white">
    <h1>Welcome {data}!!</h1>
    </div>
    </>
  )
}

export default Home
