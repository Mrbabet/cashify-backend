const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const corsOptions = require('./config/corsOptions');
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 8000;
const DB_HOST = process.env.DB_HOST;
const authRouter = require("./routes/auth.js");
const usersRouter = require("./routes/users");
const usersTransactionRouter = require("./routes/transactions");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const verifyJWT = require('./middlewares/jwt.js')
const cookieParser = require('cookie-parser');

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", authRouter);
app.use(verifyJWT)
app.use("/users", usersRouter);
app.use("/transaction", usersTransactionRouter);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
