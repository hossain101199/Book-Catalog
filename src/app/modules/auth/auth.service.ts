import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createUserInDB = async (payload: IUser): Promise<IUser> => {
  const createdUser = await User.create(payload);
  return createdUser;
};

export const authService = {
  createUserInDB,
};
