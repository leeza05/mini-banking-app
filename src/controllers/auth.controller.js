import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async(req,res)=>{
    const{email,password}= req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:'All fields are required'});
        }
        const user= await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'Invalid Credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid Credentials'});
        }
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '1d'},
        );
        return res.status(200).json(
            {token,
                user:{
                id: user._id,
                name: user.name,
                email: user.email
                }
            }
        )
    }
    catch(error){
        console.error('Login error:', error);
        return res.status(500).json({message:'Internal server error'});
    }
}

