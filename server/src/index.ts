import { ValitaError } from "@badrap/valita";
import compression from "compression";
import cookieParser from "cookie-parser";
import express, { ErrorRequestHandler } from "express";
import helmet from "helmet";
import createError from "http-errors";
import morgan from "morgan";
import { env } from "./envConfig.js";
import routes from "./routes.js";
const app = express();

console.log("NODE_ENV:", env.NODE_ENV);

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(morgan("[:date] :method :url - :status"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "*.reddit.com"],
        imgSrc: ["'self'", "*.redd.it", "*.imgur.com"]
      }
    }
  })
);
app.use(routes);

if (env.NODE_ENV === "production") {
  const clientDist = `${new URL("../../client", import.meta.url).pathname}/dist`;
  app.use(express.static(clientDist));

  app.get("/*", (_req, res, next) => {
    try {
      res.sendFile(`${clientDist}/index.html`);
    } catch (error) {
      next(error);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(((error, _req, res, _next) => {
  if (error instanceof ValitaError) {
    console.log(error.message);
    res.sendStatus(400);
  } else if (createError.isHttpError(error)) {
    console.log(`${error.name}: ${error.message}`);
    res.sendStatus(error.status);
  } else {
    console.log("express error:", error.message);
    res.sendStatus(500);
  }
}) as ErrorRequestHandler);

app.listen(env.PORT, () => console.log("server started on port:", env.PORT));
