const User = require("../models/users");

const jwt = require('jsonwebtoken');  

const bcrypt = require('bcrypt');

const register = async (req, res) => {
   try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      description,
      type,
      role,
      status,
    } = req.body;

    if (email === password || username === password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Invalid Credentials Required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email Already Exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      firstName,
      lastName,
      description,
      type,
      role,
      status,
    });

    await newUser.save();

    res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({email, username});

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Email or Password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "secret-key",
      { expiresIn: "1h" }
    );
    res.status(201).json({
      status: true,
      message: "User Login Successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error"});
  }
};

const getUser = async (req, res) => {
 try {
    const { page = 1, limit = 10, type, role, search } = req.query;

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.max(parseInt(limit), 1);

    const filterOptions = {};
    
    if (type) {
      filterOptions.type = type;
    }
    
    if (role) {
      filterOptions.role = role;
    }

    if (search) {
      filterOptions.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (pageNumber - 1) * limitNumber;

    const userList = await User.find(filterOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalCount = await User.countDocuments(filterOptions);

    res.status(200).json({
      status: 200,
      message: "User Data Retrieved Successfully",
      data: userList,
      page: pageNumber,
      limit: limitNumber,
      totalCount: totalCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletingUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userdata = await User.findById(userId);

    const userRequesting = await User.findById(userdata);
    if (!userRequesting) {
      return res.status(403).json({ status: 403, message: "Requesting User Not Found" });
    }

    if (!(userRequesting.role.includes("PROJECT_MANAGER") || userRequesting.role.includes("ADMIN"))) {
      return res.status(403).json({
        status: 403,
        message: "Only Project Manager or Admin can add permissions",
      });
    }

    if (!userdata) {
      return res.status(404).json({ status: 404, message: "Target User Not Found" });
    }

    await User.findByIdAndUpdate(userId, { status: 'DEACTIVE' });

    res.status(200).json({ status: true, message: "User Deactivated Successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateData = req.body;
    
    const userId = req.params.id;

    let updateFields = {};
    for (const key in updateData) {
      if (
        updateData[key] !== null &&
        updateData[key] !== undefined &&
        updateData[key] !== ""
      ) {
        updateFields[key] = updateData[key];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "No Fields To Update" });
    }

    const data = await User.findByIdAndUpdate(
      userId, 
      updateFields, 
      { new: true }  
    );

    if (!data) {
      return res
        .status(404)
        .json({ status: 404, message: "User Not Found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "User Data Updated Successfully", data });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  getUser,
  deletingUser,
  updateUser,
};