import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleOAuth } from '@/src/controllers/authController';
import prisma from '@/src/lib/db';
import { saveSessionToRedis, getSessionFromRedis } from '@/src/util/redisSession';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
})

passport.deserializeUser(async (id: number, done) => {
  try { 
    const user = await prisma.user.findUnique({ where: {id} })
    done(null, user);
  } catch (err) {
    done(err, null);
  }
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
      passReqToCallback: true, // reqを渡すために必要
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try { 
        const user = await googleOAuth(profile, req);
        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

export default passport