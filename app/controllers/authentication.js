const authService = require('../services/autservices');
const register = async (req, res) => {
  const{email,password,role} = req.body;
  //The following will help validate the email if they are Concordia users or not
  if (!authService.isConcordiaEmail(email)){
    return res.status(400).json({error: 'Only Concordia users are allowed to access' });
  }
  try {
    const user = await authService.registerUser(email, password, role);
    res.status(201).json({message: 'User registered successfully', user });
  }catch (err){
    res.status(500).json({error: 'Registration failed', details: err.message });
  }
};
const login=async (req,res) => {
  const { email, password }=req.body;

  try{
    const token=await authService.loginUser(email,password);
    res.status(200).json({token});
  } catch (err){
    res.status(400).json({error:err.message});
  }
};
module.exports={
  register,
  login,
};
