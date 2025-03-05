import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { comparePassword } from "../utils/hash";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email: string, password: string, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

export default passport;
