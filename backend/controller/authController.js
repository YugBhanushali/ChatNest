const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtSecret = "your-secret-key";

exports.signup = async (req, res) => {
  try {
    const { username, userId, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      userId,
      password: hashedPassword,
      email,
    });
    await user.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email) });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user.userId }, jwtSecret, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ message: "Login successful", token, user: user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const { userId } = req.query;

    // Perform any necessary validation or verification of userId and token
    // For example, check if the token is valid and matches the user's token
    // (This validation depends on your authentication mechanism)

    // Clear the session or token, or perform any other necessary logout operations
    // For example, if using JWT, you might invalidate the token

    // Return success response
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkLogin = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }
    jwt.verify(token, "your-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      res.status(200).json({ loggedIn: true, userId: decoded.userId });
    });
  } catch (err) {
    console.error("Error checking login:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
