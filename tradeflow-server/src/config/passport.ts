import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

// Local Strategy (Email/Password)
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return done(null, false, { message: "Invalid email or password" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found in Google profile"));

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              fullName: profile.displayName,
              passwordHash: "SSO_USER", // SSO users don't have passwords
              avatarUrl: profile.photos?.[0].value,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Microsoft Strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID || "placeholder",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "placeholder",
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ["user.read"],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error("No email found in Microsoft profile"));

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              fullName: profile.displayName,
              passwordHash: "SSO_USER",
              avatarUrl: null,
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
