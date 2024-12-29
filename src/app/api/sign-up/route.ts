import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {

    await dbConnect()

    try {
        // here in the below code it means, I am taking only the ` username, email, password` value from the json of the request.
        const { username, email, password } = await request.json();
        
        // username database mein exist karta hain same naam se aur `verified` hain
        const existingVerifiedUserByUsername = await UserModel.findOne({
          username,
          isVerified: true,
        });
        if (existingVerifiedUserByUsername) {
          return Response.json(
            {
              success: false,
              message: 'Username is already taken',
            },
            { status: 400 }
          );
        }
      
        // `email` database mein exist karta hain same naam se 
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      
        if (existingUserByEmail) {
          //email exist but verified or not verified, we are checking here in below if else case. 
          if (existingUserByEmail.isVerified) {
            return Response.json(
              {
                success: false,
                message: 'User already exists with this email',
              },
              { status: 400 }
            );
          } 
          else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
          }
        } 
        // user nahi mila darabasr mein toh user aya hi pehli baar hain toh user toh regiter karna hain
        else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);
        
          // saving user insde the database
          const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
          });
        
          await newUser.save();
        }
      
        // Send verification email
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );
        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            { status: 500 }
          );
        }
      
        return Response.json(
          {
            success: true,
            message: 'User registered successfully. Please verify your account.',
          },
          { status: 201 }
        ); 

    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
          {
            success: false,
            message: 'Error registering user',
          },
          { status: 500 }
        );
      }
}
