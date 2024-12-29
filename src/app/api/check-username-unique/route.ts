import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UseranameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect()

    try {
      const {searchParams} = new URL(request.url)
      const queryParam ={
          username: searchParams.get('username')
      }
      //validate with ZOD
      const result = UseranameQuerySchema.safeParse(queryParam)
      console.log(result);  //TODO: remove after testing
      if(!result.success) {
          const usernameErrors = result.error.format().username?._errors || []
          return Response.json({
              success: false,
              message: usernameErrors?.length > 0 ? usernameErrors.join(', '):'Invalid query parameters'
          }, {status: 400})
      }
      const { username } = result.data;
      //database se query karo ,  datbase se leke aoo data, check karo sahi result hzin ki nhi hain...
      const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
      if(existingVerifiedUser){
          return Response.json(
              {
                success: false,
                message: 'username is already taken',
              },
              { status: 400 }
            );
      }else{
          return Response.json(
              {
                success: true,
                message: 'username is unique',
              },
              { status: 200 }
            );
      }
    }  catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
          {
            success: false,
            message: 'Error checking username',
          },
          { status: 500 }
        );
      }
}