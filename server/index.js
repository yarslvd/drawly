require("dotenv").config();
const express = require("express");
var cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { parseWhitelist } = require("./utils/cors");

const whitelist = parseWhitelist(process.env.CORS_ORIGINS);

var corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log({ origin });
      callback(new Error("Not allowed by CORS " + origin));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json());
app.use(
  cookieParser({
    sameSite: "none",
    httpOnly: true,
    secure: false,
  })
);

const authRouter = require("./routes/auth-routes");
const usersRouter = require("./routes/users-routes");
const canvasesRouter = require("./routes/canvases-routes");
const participantsRouter = require("./routes/participants-routes");
const { AdminJSRouter, admin } = require("./utils/admin-panel");

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/canvases", canvasesRouter);
app.use("/api/participants", participantsRouter);
app.use(admin.options.rootPath, AdminJSRouter());
// app.use(bodyParser());

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}/`);
});
