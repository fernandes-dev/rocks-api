import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { userTypesConfig } from '../../configs/userTypes.config';
import { database } from '../../database';
import { User } from '../../modules/users/entities/user';
import { UserType } from '../../modules/users/entities/user-type';
import { isUUID } from 'class-validator';

export type IReqContext = {
  req: {
    headers: {
      authorization: string;
    };
  };
};

export const ensureUserAuthenticated = async (
  context: IReqContext,
  userTypes: (keyof typeof userTypesConfig)[],
): Promise<User> => {
  const [, token] = context.req.headers.authorization.split(' ');

  if (!token) throw new Error('token not provided');

  if (!isUUID(token)) throw new UnauthorizedException('invalid token');

  let foundUser: ({ user_types: UserType } & User) | undefined;

  try {
    foundUser = await database.users.findUnique({
      where: { token },
      include: { user_types: true },
    });
  } catch (error) {
    throw new InternalServerErrorException('internal server error');
  }

  if (!foundUser) throw new NotFoundException('user not found');

  let isValid = false;

  for (const userType of userTypes) {
    if (foundUser.user_types.title === userTypesConfig[userType])
      isValid = true;
  }

  if (!isValid) throw new UnauthorizedException('unauthorized');

  return foundUser;
};
