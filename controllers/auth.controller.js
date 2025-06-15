import { User } from "../models/user.model.js";
import { customError } from "../utils/customError.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendOtpEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      customError("All fields are required", 400);

    if (username.length < 3 || username.length > 20)
      customError("Username must be between 3 and 20 characters long.", 400);
    // checking if username contains only letters and numbers
    if (!/^[a-zA-Z0-9]+$/.test(username))
      customError("Username must contain only letters and numbers.", 400);
    // checking password length
    if (password.length < 6)
      customError("Password must be at least 6 characters long.", 400);
    // checking if email is valid
    if (!/^\S+@\S+\.\S+$/.test(email))
      customError("Please provide a valid email address.", 400);

    // checking if user already exist
    const alreadyExist = await User.findOne({ 
      $or: [{ email }, { username }]
     });

    if (alreadyExist) customError("Email or username already exist", 400);

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = generateVerificationToken();


    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
     

    //sending otp
    sendOtpEmail(newUser.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created and OTP sent successfully",
      user: {
        ...newUser._doc,
         password: undefined, // do not include password in the response
        verificationToken: undefined, // do not include verification token in the response
        verificationTokenExpiresAt: undefined, // do not include verification token expiry in the response
        lastLogin: undefined, // do not include last login in the response
        resetPasswordToken: undefined, // do not include reset password token in the response
        resetPasswordExpiresAt: undefined, // do not include reset password expiry in the response
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token, userId } = req.body;
    if (!token || !userId) customError("Token and userId is required", 400);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) customError("Invalid or expired token", 400);

    if (user._id.toString() !== userId) customError("Invalid user", 400);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    generateTokenAndSetCookie(res, user._id);
    
    await sendWelcomeEmail(user.email, user.username); 

    res.status(200).json({
      success: true,
      message: "Email verified successfully and logged in",
    })
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => { 
  try {
    const { email, password } = req.body;
    if (!email || !password) customError("All fields are required", 400);

    // checking if email is valid
    if (!/^\S+@\S+\.\S+$/.test(email))
      customError("Please provide a valid email address.", 400);

    // checking if user exists
    const user = await User.findOne({ email });
    if (!user) customError("Invalid credentials", 401);

    // checking if user is verified
    if (!user.isVerified) customError("Please verify your email first", 403);

    // checking password
    const passwordMatched = await bcrypt.compare(password, user.password)

    if(!passwordMatched) customError("Incorrect credintials") 

      generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined, // do not include password in the response
        verificationToken: undefined, // do not include verification token in the response
        verificationTokenExpiresAt: undefined, // do not include verification token expiry in the response
        lastLogin: undefined, // do not include last login in the response
        resetPasswordToken: undefined, // do not include reset password token in the response
        resetPasswordExpiresAt: undefined, // do not include reset password expiry in the response
      },          
    });
} catch(err){
  next(err)
}
};

export const logout = async (req, res ) => { 

  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });

};

export const forgotPassword = async (req, res, next) => {
  
  const {email} = req.body
  try {
    
    const user = await User.findOne({email})

    if (!user) customError("Email not registered", 404);

    const resetToken = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; 

    await user.save();
    
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    next(error)
  }
};

export const resetPassword = async (req, res, next) => {
  
  try {

  const {newPassword} = req.body
  
  if(!newPassword) customError("All fields are required", 400)

  const token = req.query.token;

  if(!token) customError("Reset token is required", 400)

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: {$gt: Date.now()}
  })

  if(!user) customError("Invalid or expired reset token", 400)


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;

  await user.save()

  await sendPasswordResetSuccessEmail(user.email)

  res.status(200).json({
    success:true,
    message:"Password reset successful"
  })

} catch (error) {
  next(error)
}

}; 

export const homePage = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the homepage",
    user: {
      ...req.user._doc,
      password: undefined, // do not include password in the response
      verificationToken: undefined, // do not include verification token in the response
      verificationTokenExpiresAt: undefined, // do not include verification token expiry in the response
      lastLogin: undefined, // do not include last login in the response
      resetPasswordToken: undefined, // do not include reset password token in the response
      resetPasswordExpiresAt: undefined, // do not include reset password expiry in the response
    },
  });
};
  