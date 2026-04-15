const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

function shouldUseSecureCookies() {
  const explicitCookieSecure = process.env.COOKIE_SECURE;

  if (explicitCookieSecure === "true") {
    return true;
  }

  if (explicitCookieSecure === "false") {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return true;
  }

  const configuredOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  // If a real HTTPS frontend origin is configured, prefer secure cookies.
  const hasHttpsNonLocalOrigin = configuredOrigins.some((origin) => {
    return (
      origin.startsWith("https://") &&
      !origin.includes("localhost") &&
      !origin.includes("127.0.0.1")
    );
  });

  return hasHttpsNonLocalOrigin;
}

const shouldUseSecureCookie = shouldUseSecureCookies();
const cookieSameSite = shouldUseSecureCookie ? "none" : "lax";

const authCookieOptions = {
  httpOnly: true,
  secure: shouldUseSecureCookie,
  sameSite: cookieSameSite,
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const clearAuthCookieOptions = {
  httpOnly: true,
  secure: shouldUseSecureCookie,
  sameSite: cookieSameSite,
  path: "/",
};

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function normalizeUsername(username = "") {
  return username.trim();
}

function handleAuthPersistenceError(err, res) {
  // Mongo duplicate key error (email/username unique collision).
  if (err?.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || err.keyValue || {})[0];
    const allowedFields = ["username", "email"];
    const message = allowedFields.includes(duplicateField)
      ? `${duplicateField} is already in use`
      : "User already exists with this username or email";
    return res.status(409).json({ message });
  }

  // Schema validation errors should be client-visible 400s.
  if (err?.name === "ValidationError") {
    const firstValidationMessage = Object.values(err.errors || {})[0]?.message;
    return res.status(400).json({
      message: firstValidationMessage || "Invalid user data",
    });
  }

  return null;
}

async function registerUserController(req, res) {
  try {
    const username = normalizeUsername(req.body?.username || "");
    const email = normalizeEmail(req.body?.email || "");
    const password = req.body?.password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Register error: JWT_SECRET is missing");
      return res.status(500).json({ message: "Internal server error" });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "User already exists with this username or email" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, authCookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);

    const handledResponse = handleAuthPersistenceError(err, res);
    if (handledResponse) {
      return handledResponse;
    }

    res.status(500).json({ message: "Internal server error" });
  }
}

async function loginUserController(req, res) {
  try {
    const email = normalizeEmail(req.body?.email || "");
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Login error: JWT_SECRET is missing");
      return res.status(500).json({ message: "Internal server error" });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, authCookieOptions);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token", clearAuthCookieOptions);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getMeController(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    
    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getSessionController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({
      message: "No active session",
      authenticated: false,
      user: null,
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
  if (isTokenBlacklisted) {
    return res.status(200).json({
      message: "Session expired",
      authenticated: false,
      user: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(200).json({
        message: "Session user not found",
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      message: "Session active",
      authenticated: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(200).json({
      message: "Invalid session",
      authenticated: false,
      user: null,
    });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  getSessionController
};
