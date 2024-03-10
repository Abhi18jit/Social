const {z}=require("zod");

const loginSchema=z.object({
    username: z
    .string({required_error:"Please Enter a valid username"})
    .trim()
    .min(5,{message:"Username is too short"}),

    password: z
    .string({required_error:"Please enter correct password"})
    .trim()
    .min(5,{message:"MinLength of password should be more than 5"}),
});

module.exports=loginSchema;