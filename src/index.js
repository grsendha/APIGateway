const express = require("express");
const { PORT } = require("./config/serverConfig");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const axios = require("axios");

const setupServer = () => {
  const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 5,
  });

  app.use(morgan("combined"));
  app.use(limiter);

  app.use("/bookingservice", async (req, res, next) => {
    console.log("TOKEN IS ", req.headers["x-access-token"]);
    try {
      const response = await axios.get(
        "http://localhost:6000/api/v1/isAuthenticated",
        {
          headers: {
            "x-access-token": req.headers["x-access-token"],
          },
        }
      );
      console.log("RESPONSE IS ", response.data);
      if (response.data.success) {
        next();
      } else {
        return res.status(401).json({
          message: "unauthorized access",
        });
      }
    } catch (error) {
      return res.status(401).json({
        message: "unauthorized access",
      });
    }
  });

  app.use(
    "/bookingservice",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
  /*
  app.get("/home", async (req, res) => {
    console.log("TOKEN IS ", req.headers["x-access-token"]);
    const response = await axios.get(
      "http://localhost:6000/api/v1/isAuthenticated",
      {
        headers: {
          "x-access-token": req.headers["x-access-token"],
        },
      }
    );
    console.log("RESPONSE IS ", response.data);
    return res.json({
      message: "Hello World",
    });
  });*/

  app.get("/home", async (req, res) => {
    return res.json({
      message: "Hello World",
    });
  });
  app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`);
  });
};

setupServer();
