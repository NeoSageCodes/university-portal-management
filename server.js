require("dotenv").config();
const express = require("express");
const app = express();
require("./database/database");
const departmentRouter = require("./routes/department");
const courseRouter = require("./routes/course");
const PORT = process.env.PORT || 2000

app.use(express.json());
app.use("/departments",departmentRouter);
app.use("/courses", courseRouter);


app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});