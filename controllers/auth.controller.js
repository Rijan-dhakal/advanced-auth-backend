import { User } from "../models/user.model.js";
import { customError } from "../utils/customError.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

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
    const alreadyExist = await User.findOne({ email });
    if (alreadyExist) customError("User already exist", 400);

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
    
    // generating a jwt
    generateTokenAndSetCookie(res, newUser._id);

    //sending otp
    sendOtpEmail(newUser.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created and OTP sent successfully",
      user: {
        ...newUser._doc,
        password: undefined, // do not include password in the response
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {};

export const logout = async (req, res, next) => {};
