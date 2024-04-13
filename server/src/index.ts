import { env } from "./envConfig.js";
import { ValitaError } from "@badrap/valita";
import morgan from "morgan";
import helmet from "helmet";
import createError from "http-errors";
import compression from "compression";
import routes from "./routes.js";

import express, { ErrorRequestHandler } from "express";
const app = express();

console.log("NODE_ENV:", env.NODE_ENV);

app.use(compression());
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
app.use(express.json());
app.use(routes);

const folderPath = `${new URL("../../client", import.meta.url).pathname}/dist`;
app.use(express.static(folderPath));

app.get("/*", (_req, res, next) => {
  try {
    res.sendFile(`${folderPath}/index.html`);
  } catch (error) {
    next(error);
  }
});

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

app.listen(env.PORT, () => {
  console.log("server started on port:", env.PORT);
});
