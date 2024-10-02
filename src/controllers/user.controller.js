import { UserModal } from "../models/User.model.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";

const registerUser = async (req, res) => {
  // get user details from post man based on modals
  // valdation not empty
  // check if user already exists by email and userName
  // check for images and avatar
  // if available then upload them on cloudnary
  // check images uploaded on cloudnary successfully

  const { userName, email, fullName , dob, password } =
    req.body;

  const response = [userName, email, fullName, password];

  if (response.every((resp) => resp === "undefined" && resp.trim() === "")) {
    return res.status(400).json({ message: "All Fields are required" });
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
    return res.status(400).json({ message: "Profile Image is required..." });
  }

  const _uploadProfileImage = await uploadOnCloudnary(_localProfileImage);
  const _uploadCoverImage = await uploadOnCloudnary(_localCoverImage);
  
  if (!_uploadProfileImage) {
    return res.status(200).json({
      message: "Profile Image is required",
    });
  }

  const user = await UserModal.create({
    fullName,
    profileImage: _uploadProfileImage.url,
    coverImage: _uploadCoverImage.url || "",
    email,
    userName,
    password,
    dob:dob||"",
  });

  const createdUser = await UserModal.findById(user._id).select("-password");
  if (!createdUser) {
    return res
      .status(500)
      .json({ message: "something went wrong while registering user" });
  }

  res.status(200).json({ message: "success", data: createdUser });
};

export { registerUser };
