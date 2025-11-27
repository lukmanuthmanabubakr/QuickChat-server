import User from "../models/User";

//API to register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if(userExists){
        return res.json({success: false, message: "User already exists"})
    }
    const user = await User.create({name, email, password})
  } catch (error) {}
};
