import { NextFunction, Request, Response } from 'express';
import { validUserTypes } from 'src/configs/userTypes.config';
import { database } from 'src/database';

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userTypes: validUserTypes[],
) => {
  const [, token] = req.headers.authorization.split(' ');

  const foundUser = await database.users.findUnique({
    where: { token },
    include: { user_types: { select: { title: true } } },
  });

  let isValid = false;

  for (const userType of userTypes) {
    if (foundUser.user_types.title === userType) isValid = true;
  }

  if (isValid) return next();

  return res.status(401).json({ message: 'unauthorized' });
};
