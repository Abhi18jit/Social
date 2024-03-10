const {z} = require("zod");

const registerSchema=z.object({
    username: z
    .string({required_error:"username is mandatory"})
    .trim()
    .min(3,{message:"MinLength of name Is 3 characters"})
    .max(20,{message:"username exceeds 20 characters"}),

    fullname: z
    .string({required_error:"fullname is required"})
    .trim()
    .min(3,{message:"MinLength of fullname Is 3 characters"}),

    password: z
    .string({required_error:"Password is required"})
    .trim()
    .min(5,{message:"MinLength of password should be more than 5"})

})

module.exports=registerSchema;