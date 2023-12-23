import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import image from './Assests/fullmoon.jpg'

function App() {
  const myStyle = {
    backgroundImage: `url(${image})`, 
    height: "100vh",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
};
  return (
    <div style={myStyle}>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/> 
      <Route path='/home' element={<Home/>}/> 
      <Route path='/signup' element={<Signup/>}/> 
      <Route path='/login' element={<Login />}/>
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
