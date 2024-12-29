import mongoose,  {Schema, Document} from "mongoose";  //we need document as we are introducing type safety and using type script where if we are using javaScript then we don't need it.



//Message Schema
export interface Message extends Document{
  content: string; // in typescript we write string where `s` is a small.
  createdAt: Date;
}

// whenever we make custom schema we define type in Schema aur schema ke andar kaunsa Schema , message ka Schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        //in mongoose we write string where `S` is a capital.
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

//User Schema
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string; 
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    verifyCode: {
      type: String,
      required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
   
    messages:[MessageSchema],
  });


  //nextjs mein hum aise export karte hain kyuki NextJS edge peh run karta hain...
const UserModel = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>("User", UserSchema);
export default UserModel;