import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    name: z.string().min(6),
    password: z.string().optional()
})

export type SignupInput = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().optional()
})

export type SigninInput = z.infer<typeof signinInput>;

export const createBlogInput = z.object({
    title: z.string().email(),
    content: z.string().min(6)
})

export type CreateBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
    title: z.string().email(),
    content: z.string().min(6),
    id: z.string().optional()
})

export type UpdateBlogInput = z.infer<typeof updateBlogInput>;