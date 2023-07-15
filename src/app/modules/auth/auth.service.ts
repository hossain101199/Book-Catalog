import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const createUserInDB = async (payload: IUser): Promise<IUser> => {
  const createdUser = await User.create(payload);
  return createdUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.findOne(
    { email },
    { name: 1, email: 1, password: 1 }
  );
  // const isUserExist = await User.isUserExist(id);

  if (isUserExist) {
    // if (await User.isPasswordMatched(password, isUserExist.password)) {
    if (await bcrypt.compare(password, isUserExist.password)) {
      const { id, name, email } = isUserExist;

      const accessToken = jwt.sign(
        {
          id,
          name,
          email,
        },
        config.jwt.secret as Secret,
        { expiresIn: config.jwt.expires_in }
      );

      return {
        accessToken,
      };
    } else {
      throw new ApiError(401, 'Password is incorrect');
    }
  } else {
    throw new ApiError(404, 'User does not exist');
  }
};

export const authService = {
  createUserInDB,
  loginUser,
};
