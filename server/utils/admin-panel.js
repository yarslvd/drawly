const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSSequelize = require("@adminjs/sequelize");
const session = require("express-session");
const db = require("../models/db");

const DEFAULT_ADMIN = {
  email: "admin@gmail.com",
  password: "password",
};

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const admin = new AdminJS({
  resources: [db.users, db.tokens],
});

const AdminJSRouter = () => {
  return AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: "adminjs",
      cookiePassword: "sessionsecret",
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: "sessionsecret",
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      },
      name: "adminjs",
    }
  );
  // app.use(admin.options.rootPath, adminRouter)

  // app.listen(PORT, () => {
  //   console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  // })
};

module.exports = {
  AdminJSRouter,
  admin,
};
