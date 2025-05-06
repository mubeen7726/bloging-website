import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/Users";
import DBconnect from "@/lib/DBconnect";
import { sendEmail } from "@/lib/email";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await DBconnect();

      const existingUserByEmail = await User.findOne({ email: user.email });

      if (!existingUserByEmail) {
        // New user
        const baseUsername =
          user.name?.toLowerCase().replace(/\s+/g, "_") || "unknown_user";
        let username = baseUsername;
        let counter = 1;

        while (await User.findOne({ Username: username })) {
          username = `${baseUsername}_${counter}`;
          counter++;
        }

        await User.create({
          Username: username,
          providerUserId: account?.providerAccountId,
          image: user.image,
          email: user.email,
        });

        await sendEmail({
          to: user.email!,
          subject: "👋 Welcome to Blogs – Let's Get You Started!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
              <h2 style="color: #2c3e50;">Hi ${user.name},</h2>
              <p style="font-size: 16px; color: #333;">
                Welcome to <strong>Blogs</strong> – your new home for discovering, creating, and sharing amazing stories and ideas.
              </p>
              <p style="font-size: 16px; color: #333;">
                We've created your account and set up everything for you. Start exploring a world of insightful and inspiring content, or publish your very first blog with us!
              </p>
              <a href="http://localhost:3000/" style="display: inline-block; margin-top: 20px; background-color: #0070f3; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">
                Blogs
              </a>
              <p style="margin-top: 30px; font-size: 14px; color: #888;">
                Thanks for joining us,<br />
                The Blogs Team
              </p>
            </div>
          `,
        });
      } else {
        // Existing user
        if (!existingUserByEmail.providerUserId) {
          existingUserByEmail.providerUserId = account?.providerAccountId;
          await existingUserByEmail.save();
        }

        await sendEmail({
          to: user.email!,
          subject: "👋 Welcome Back to Blogs!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #fdfdfd; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
              <h2 style="color: #34495e;">Hello ${user.name},</h2>
              <p style="font-size: 16px; color: #444;">
                It's great to see you again on <strong>Blogs</strong>! We've missed you.
              </p>
              <p style="font-size: 16px; color: #444;">
                Dive back into your favorite reads, discover trending blogs, or write something new to share your thoughts with the world.
              </p>
              <a href="http://localhost:3000/" style="display: inline-block; margin-top: 20px; background-color: #28a745; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none;">
                 Blogging
              </a>
              <p style="margin-top: 30px; font-size: 14px; color: #999;">
                Happy writing,<br />
                The Blogs Team
              </p>
            </div>
          `,
        });
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
