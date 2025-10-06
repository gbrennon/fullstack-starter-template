import { noAuthProcedure, router, procedure } from '../../server/trpc';
import { userCredentialsSchema, signUpSchema, updateProfileSchema } from './auth.dtos';
import { signIn, signUp, updateProfile } from './auth.service';

export const authRouter = router({
  signUp: noAuthProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => signUp(input, ctx)),

  signIn: noAuthProcedure
    .input(userCredentialsSchema)
    .mutation(async ({ input, ctx }) => signIn(input, ctx)),

  updateProfile: procedure
    .input(updateProfileSchema)
    .mutation(async ({ input, ctx }) => updateProfile(input, ctx.user.id, ctx)),
});
