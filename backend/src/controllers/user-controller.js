import sendMail from "../helpers/generateMail";
import generateToken from "../helpers/generateToken";
import hashPassword, { comparePassword } from "../helpers/hashPassword";
import User from "../models/user-model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";

const Register = catchAsync(async (req, res, next) => {
  const { name, email, gstin, pan, address, contact, account, password } =
    req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError(`User Already Exists!`, 400));

  // user
  const hashedPassword = await hashPassword(password);
  const user = await new User({
    name,
    email,
    gstin,
    pan,
    account,
    address: {
      street: address.street,
      city: address.city,
      state: address.state,
      pin: address.pin,
      country: address.country,
    },
    contact,
    password: hashedPassword,
  });

  const { error } = user.joiValidate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(", ");
    return next(new AppError(msg, 400));
  }

  const newUser = await user.save();

  res.status(201).json({
    status: "true",
    message: "user created!",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      contact: newUser.contact,
    },
  });
});

const Login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return next(new AppError(`Unauthorized User!`, 401));
  } else if (await comparePassword(password, existingUser.password)) {
    // generate token
    const token = generateToken(
      { _id: existingUser._id, name: existingUser.name },
      "1d"
    );
    console.log(token);
    res.status(200).json({
      status: "true",
      message: "Logged in successfully",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        gstin: existingUser.gstin,
        pan: existingUser.pan,
        account: existingUser.account,
        address: existingUser.address,
        contact: existingUser.contact,
      },
      token,
    });
  } else next(new AppError("Please provide valid credentials!", 400));
});

const getAllUsers = catchAsync(async (req, res, next) => {});

const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id });

  if (!user) return next(new AppError("User not found!", 404));

  res.status(200).json({
    status: "true",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      gstin: user.gstin,
      pan: user.pan,
      account: user.account,
      address: user.address,
      contact: user.contact,
    },
  });
});

const deleteUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete({ _id: id });

  if (!user) return next(new AppError("User not found!", 404));

  res.status(200).json({
    status: "true",
    message: "User Deleted Successfully!",
  });
});

const forgetPasswordHandler = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });

  console.log("user: ", user);

  if (!user) return next(new AppError("User not found!", 404));

  const resetToken = generateToken({ _id: user._id, email: user.email }, "1d");

  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset/password/${resetToken}`;
  const message = {
    title: "Reset Password",
    description: `<p>A password reset event has been triggered. The password reset window is limited for 10mins. </p>
        <p>If you do not reset your password within 10mins, you will need to submit a new request.</p>
        <p>To complete the password reset process, visit the following link: </p>
        <a href="${url}">
            <button style="color: purple;">Reset Your Password</button>
        </a>

        <p>Username: ${user.email}</p>`,
  };

  try {
    await sendMail({
      // user: user.email,
      user: "aakansha71089@gmail.com",
      subject: "Password Reset ▶️",
      message,
    });

    user.passwordResetToken = resetToken;
    user.save();

    res.status(200).json({
      status: "true",
      message: "Password reset link send to the user mail successfully!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.save();
    next(new AppError("Error!"));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  const { _id } = jwt.verify(token, process.env.SECRET_KEY);

  const hashedPassword = await hashPassword(password);
  await User.findByIdAndUpdate(
    { _id },
    { $set: { password: hashedPassword, passwordResetToken: "" } }
  );

  res
    .status(200)
    .json({ status: "true", message: "Password updated successfully!" });
});

const checkUserAuth = catchAsync(async (req, res) => {
  res.status(200).json({ status: "true", message: "UserExists!" });
});

export {
  Register,
  Login,
  getAllUsers,
  getUserById,
  deleteUserById,
  forgetPasswordHandler,
  resetPassword,
  checkUserAuth,
};
