import { inferAsyncReturnType, TRPCError } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { verify } from 'jsonwebtoken';
import { authConfig } from '../configs/auth.config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

async function decodeAndVerifyJwtToken(token: string): Promise<User> {
  const decoded = verify(token, authConfig.secretKey) as any;
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.roles,
  };
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  if (req.headers.authorization) {
    try {
      const user = await decodeAndVerifyJwtToken(
        req.headers.authorization.split(' ')[1]
      );
      return { req, res, prisma, user };
    } catch (err) {
      throw new TRPCError({ message: 'Unauthorized', code: 'UNAUTHORIZED' });
    }
  }

  return { req, res, prisma };
}

export type Context = inferAsyncReturnType<typeof createContext>;
