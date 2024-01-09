import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res, next) => {
  // get the details from the user frontend
  const { fullName, email, password, username } = req.body;
  console.log(fullName, email, password, username);

  // Check if the field are empty or not
  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check if the users exists or not
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, 'User with username or email  Already exists');
  }

  // Check if the images and avatar are sent by the user or not
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // Uploading the avatar and coverimage to the cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required');
  }

  // Entry the new created user in the database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.toLowerCase(),
  });

  // Check if the user is created or not
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Internal Server Error while registring the user');
  }

  // now response the user
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, 'User Registered Successfuly'));
});

export { registerUser };
