import { RequestHandler } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';

const verifyAuthToken: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken) {
      throw new ApiError(401, 'Authorization token not provided');
    }

    const authTokenData = jwt.verify(
      authToken,
      config.jwt.secret as Secret
    ) as JwtPayload;

    if (!authTokenData) {
      throw new ApiError(401, 'Invalid authorization token');
    }

    req.verifiedUser = authTokenData;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAuthToken;
