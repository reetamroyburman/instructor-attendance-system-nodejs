const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config("./.env");
const cookieParser = require("cookie-parser");
const dbConnect = require("./dbConnect");

const instructorRouter = require("./routers/authRouter");
const attendanceRouter = require("./routers/attendanceRouter.js");
// const userRouter = require("./routers/userRouter");

const app = express();

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());


app.use("/api/instructor", instructorRouter);
app.use("/api/attendance", attendanceRouter);

// app.use("/posts", postsRouter);
// app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.status(200).send("OK from Server");
});

const PORT = process.env.PORT || 4000;

dbConnect();
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
