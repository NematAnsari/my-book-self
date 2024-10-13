import { UserModal } from "../models/User.model.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModal.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh Token into databaseu
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error", error);
  }
};

const registerUser = async (req, res) => {
  // get user details from post man based on modals
  // valdation not empty
  // check if user already exists by email and userName
  // check for images and avatar
  // if available then upload them on cloudnary
  // check images uploaded on cloudnary successfully

  const { userName, email, fullName, dob, password } = req.body;

  const response = [userName, email, fullName, password];

  if (response.every((resp) => resp === "undefined" && resp.trim() === "")) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  if (dob) {
    const parsedDate = Date.parse(dob);
    const currentDate = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(currentDate.getFullYear() - 100);

    // Check if the date is valid and within the allowed range
    if (
      isNaN(parsedDate) ||
      parsedDate > currentDate ||
      parsedDate < hundredYearsAgo
    ) {
      return res.status(400).json({
        message:
          "Invalid date of birth. It must be within the last 100 years and not in the future.",
      });
    }
  } else {
    return res.status(400).json({ message: "Date of birth is required" });
  }

  const existedUser = await UserModal.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    return res.status(400).json({ message: "Email Already existed" });
  }
  const _localProfileImage = req.files?.profileImage[0]?.path;
  const _localCoverImage = req.files?.coverImage[0]?.path;

  if (!_localProfileImage) {
    return res
      .status(400)
      .json({ message: "local Profile Image is required..." });
  }

  if (!_localCoverImage) {
    return res.status(400).json({ message: "Cover Image is required..." });
  }

  const _uploadProfileImage = await uploadOnCloudnary(_localProfileImage);
  const _uploadCoverImage = await uploadOnCloudnary(_localCoverImage);

  if (!_uploadProfileImage) {
    return res.status(200).json({
      message: "cloudnary Profile Image is required",
    });
  }
  if (!_uploadCoverImage) {
    return res.status(200).json({
      message: "Cover Image is required",
    });
  }
  const user = await UserModal.create({
    fullName,
    profileImage: _uploadProfileImage.url,
    coverImage: _uploadCoverImage.url,
    email,
    userName,
    password,
    dob: dob || "",
  });

  const createdUser = await UserModal.findById(user._id).select("-password");
  if (!createdUser) {
    return res
      .status(500)
      .json({ message: "something went wrong while registering user" });
  }

  res.status(200).json({ message: "success", data: createdUser });
};

const userLogin = async (req, res) => {
  // get req.body data
  // email or userName,
  // find the user
  // password check
  // access and refresh
  // send cookie
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  const isUserAvialable = await UserModal.findOne({ email });

  if (!isUserAvialable) {
    return res.status(404).json({
      message: "this user is not exist",
    });
  }

  const isPassowrdValid = await isUserAvialable?.isPasswordCorrect(password);
  if (!isPassowrdValid) {
    return res.status(400).json({
      message: "Invalid Password Please check password and try to login again",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    isUserAvialable?._id
  );

  const loggedInUser = await UserModal.findById(isUserAvialable._id).select(
    "-password -refreshToken"
  );
  // while sending cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      data: loggedInUser,
      accessToken,
      refreshToken,
      message: "LoggedIn successfully",
    });
};

const logoutUser = async (req, res) => {
  const _user = await UserModal.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({
      message: "Logout successsfully",
    });
};

const forgotPassword = async(req,res)=>{
  console.log("req.body",req.body);
}

const resetPassword = async(req,res)=>{
  console.log("res",res.body);
}

const getAllUsers = async(req,res)=>{

  
  const user = await UserModal.find().select("-password -refreshToken");
    if(!user){
    return res.status(401).json({
      message:"No User found"
    })}


    return res.status(200).json({
    data:user,
    message:"Success"
  })
}

export { registerUser, userLogin, logoutUser,forgotPassword,resetPassword,getAllUsers };
