import { Hono } from "hono";
import { userRouter } from "./user";
import { blogRouter } from "./blog";

export const rootRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }>();

rootRouter.route('/user',userRouter);
rootRouter.route('/blog',blogRouter);