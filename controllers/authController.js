const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  console.log('RECEIVING REQUEST', req.body);
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashPassword,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser
      }
    })
  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "fail"
    })
  }
};


exports.login = async (req, res) => {

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: "user not found"
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        status: "fail",
        message: "password is incorrect"
      });
      return;
    }

    res.status(200).json({
      status: "success"
    })

  } catch (e) {
    console.error(e);
    res.status(400).json({
      status: "fail"
    })
  }
}