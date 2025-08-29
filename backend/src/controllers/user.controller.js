import {User} from '../models/user.js'
import httpStatus from 'http-status'
import bcrypt ,{hash} from 'bcrypt'
import {generateToken,validateToken} from '../utils/token.js'

// token middleware


// register
const register = async(req,res)=>{
    if (!req.body) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Request body is missing",
            data: req.body
        });
    }
    
    const { name, username, email, password } = req.body

    try{
        const existingUser = await User.findOne({ username })
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"user already exisits"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({name, email, username, password:hashedPassword});
        await newUser.save();

        res.status(httpStatus[202]).json({message:"user registered", success: true})

    } catch(err) {
        res.status(httpStatus[500]).json({message:"error registering user"})
        return
    }
}

// login

const login = async(req,res)=>{
    const {username, password} = req.body
    if (username == "" || password == "") {
        return res.status(httpStatus.BAD_REQUEST).json({message:"username and password required"})
    }

    try{
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(httpStatus.BAD_REQUEST).json({message:"User not found"})
        }
        const isValidPassword = await bcrypt.compare(password,user.password)
        if (!isValidPassword) {
            return res.status(httpStatus.UNAUTHORIZED).json({message:"invalid credentials, try again"})
        }
        const token = generateToken(user.email, user.username)
        user.token = token
        await user.save()
        res.status(httpStatus.OK).json({success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                },
                token
            }})
    } catch(err) {
       console.log(err)
       res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"something went wrong"})
       return
    }
}

const updateProfile = async(req,res) =>{
    try{
        const { username } = req.user;
        const user = await User.findOneAndUpdate({username},req.body,{runValidators:true, new:true});

        if(!user){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"User not found"})
        }

        return res.status(httpStatus.OK).json({message:"profile update successfull",data:user})
    }catch(err){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"something went wrong"})
    }
}

export { register, login, updateProfile }