import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import validateLoginData from "../utils/validation/validateLoginData.js";
import validateSignupData from "../utils/validation/validateSignupData.js";

export async function signup(req, res) {
  try {
    // Validate signup data
    const { success, error } = validateSignupData(req.body);
    if (!success) {
      return res.status(400).json({ message: error });
    }

    const { name, username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username is already taken. Please choose another one.",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message:
          "Email is already registered. Please use another email address.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    generateTokenAndSetCookie(savedUser._id, res);

    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    res.status(201).json({
      user: userWithoutPassword,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Error in signup controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function login(req, res) {
  try {
    // Validate login data
    const { success, error } = validateLoginData(req.body);
    if (!success) {
      return res.status(400).json({ message: error });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found. Please check your email or sign up.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Incorrect password. Please try again." });
    }

    generateTokenAndSetCookie(user._id, res);

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      user: userWithoutPassword,
      message: "User Logged in successfully",
    });
  } catch (err) {
    console.error("Error in login controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt");

    res
      .status(200)
      .json({ message: "You've been successfully logged out. See you soon!" });
  } catch (err) {
    console.error("Error in logout controller: " + err.message);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
}
