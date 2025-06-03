import User from "../model/auth.model.js";
import Charger from "./../model/crud.model.js";
import bcrypt from "bcryptjs";
import generatetoken from '../utils/generatetoken.js';
import mongoose from "mongoose";

// Helper function to validate charge station format
const validateChargeStation = (stations) => {
    if (!Array.isArray(stations)) return false;
    return stations.every(station =>
        station.name &&
        typeof station.location?.latitude === 'number' &&
        typeof station.location?.longitude === 'number' &&
        ["Active", "Inactive"].includes(station.status) &&
        typeof station.powerOutput === 'number' &&
        typeof station.connectorType === 'string'
    );
};

export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password} = req.body;

        if (!username || !fullname || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });
        if (existingEmail || existingUsername) {
            return res.status(400).json({ error: "Email or username already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // if (chargestation.length > 0 && !validateChargeStation(chargestation)) {
        //     return res.status(400).json({ error: "Invalid charging station format" });
        // }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            fullname,
            email,
            password: hashedPassword,
        });

        // If charging stations provided, create them and associate with user
        // if (chargestation.length > 0) {
        //     const stationsWithUser = chargestation.map(station => ({
        //         ...station,
        //         user: newUser._id
        //     }));
        //     await Charger.insertMany(stationsWithUser);
        // }

        generatetoken(newUser._id, res);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, user?.password || "");

        if (!user || !isMatch) {
            return res.status(401).json({ error: "Email or password is incorrect" });
        }

        generatetoken(user._id, res);

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getme = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const stations = await Charger.find({ user: user._id });

        return res.status(200).json({ ...user.toObject(), chargestations: stations });
    } catch (error) {
        console.error("GetMe Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
