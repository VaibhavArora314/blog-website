import { Hono } from "hono";
import { rootRouter } from "./routes";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use('/*',cors());

app.route('/api/v1',rootRouter);

export default app;
