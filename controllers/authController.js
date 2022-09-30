const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  console.log('RECEIVING REQUEST', req.session);
  try {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashPassword,
    });
    req.session.user = newUser;
    return res.status(201).json({
      status: "success",
      data: {
        user: newUser
      }
    })
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      status: "fail"
    })
  }
};


exports.login = async (req, res) => {
  console.log('RECEIVING REQUEST', req.session);

  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: "user not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "password is incorrect"
      });
    }

    req.session.user = user;
    return res.status(200).json({
      status: "success"
    })

  } catch (e) {
    console.error(e);
    return res.status(400).json({
      status: "fail"
    })
  }
}