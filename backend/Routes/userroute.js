const express = require("express");
const mongoose = require("mongoose");
const Register = require("./../Models/register");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET;

const router = express.Router();

//To get the bearer token
const ensureToken = (req,res,next) =>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !=='undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else{
        res.sendStatus(403);
    }
}

//to verify the token
const verifyToken = (req,res,next) => {
    jwt.verify(req.token, SECRET_KEY, (err,decoded) => {
        if(err){
            res.sendStatus(403);
        }
        else{
            req.decoded = decoded;
            next();
        }
    })
}

//to validate inputs
const validateInputs = (email, password) => {
    if(!email){
        throw new Error("EmailId is empty");
    }
    var regex = /^([a-zA-Z0-9_\.\-]+)@([\da-zA-Z\.\-]+)\.([a-zA-Z\.]{2,6})$/;
    const res = email.match(regex);
    if(!res){
        throw new Error("Invalid email address");
    }
    if(!password){
        throw new Error("Password is empty");
    }
    if(password.length < 8){
        throw new Error("Minimum 8 characters");
    }
    if(!/\d/.test(password)){
        throw new Error("Minimum one number required");
    }
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!specialChars.test(password)){
        throw new Error("Minimum one special character required");
    }    
}

//To create users
router.post('/register', async(req, res) => {
    try{
    const {fullname, email, password} = req.body;
    try{
        validateInputs(email,password)
    }
    catch(err){
        return res.status(400).json({message: err.message})
    }
    const alreadyexists = await Register.findOne({email});
    if(alreadyexists){
        return res.status(400).json({message: "User already exists"});
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Register.create({
        fullname: fullname,
        email: email,
        password: hashedPassword
    })

    return res.status(201).json({message: "User created successfully"});
    }
    catch(err){
        return res.status(500).json({message:"Something went wrong"});
    }
})

//To login users
router.post('/login', async(req, res) => {
    try{
    const {email, password} = req.body;
    const existinguser = await Register.findOne({email});
    if(!existinguser){
        return res.status(404).json({message: "User not found"});
    }
    
    const matchedPassword = await bcrypt.compare(password, existinguser.password);

    if(!matchedPassword){
        return res.status(400).json({message: "Invalid credentials"});
    }

    const token = jwt.sign({email: existinguser.email, id:existinguser._id}, SECRET_KEY );
    return res.status(200).json({user: existinguser, token: token});
    }
    catch(err){
        console.log("login error", err);
        return res.status(500).json({message:"Something went wrong"});
    }
})

//To get user details
router.get('/getuser', ensureToken, verifyToken, async(req,res) => {
    try {
        const userId = req.decoded.id;
        const objectId = new mongoose.Types.ObjectId(userId);
        const user = await Register.findOne({ _id: objectId});
        return res.status(200).json({ user: user.fullname });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong" });
    }
})

module.exports = router; 