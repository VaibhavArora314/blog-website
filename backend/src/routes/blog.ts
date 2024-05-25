import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@vaibhav314/blog-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";

    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user) {
      c.set("userId", user?.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "Invalid token/credentials",
      });
    }
  } catch (error) {
    c.status(403);
    return c.json({
      message: "Invalid token/credentials",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs"
    })
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
      },
    });

    return c.json({
      blog: {
        id: blog.id,
      },
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while creating blog!",
    });
  }
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs"
    })
  }

  try {
    const blog = await prisma.blog.update({
      where: {
        id: body.id,
        authorId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json({
      blog: {
        id: blog.id,
      },
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while updating blog!",
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id,
      },
    });

    return c.json({
      blog,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      messgae: "Error while fetching blog!",
    });
  }
});

blogRouter.get("/", async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany();

    return c.json({
      blogs,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      messgae: "Error while fetching blog!",
    });
  }
});
