import { Hono } from "hono";
import { sign } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashPassword, verifyPassword } from "../helpers/hash";
import { signupInput, signinInput } from "@vaibhav314/blog-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "Invalid inputs"
    })
  }

  try {
    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      message: "Account Created!",
      user,
      token: jwt,
    });
  } catch (error) {
    c.status(411);
    console.log(error);
    return c.json({
      error: "Invalid Credentials",
    });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      error: "Invalid inputs"
    })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        error: "No such user exists!",
      });
    }

    const matchPassword = await verifyPassword(
      user.passwordHash,
      body.password
    );

    if (!matchPassword) {
      c.status(403);
      return c.json({
        error: "Wrong Password!",
      });
    }

    const jwt = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      message: "Signed in!",
      token: jwt,
    });
  } catch (error) {
    c.status(411);
    console.log(error);
    return c.json({
      error: "Invalid Credentials",
    });
  }
});
