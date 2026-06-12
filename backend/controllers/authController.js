const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// register
const register = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    const user = await User.findOne({email});

    if (user) {
      return res.status(409).json({
        message: `User with this email ${email} already registered`,
      });
    }
    const hashedPassword =await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password:hashedPassword, role, status });
    await newUser.save();
    res.status(201).json({ message: `User registered with name: ${name}` });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: `User with this email ${email} is not found`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = { register, login };
