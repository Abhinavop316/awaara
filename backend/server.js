require("dotenv").config();
const connectdb = require("./src/db/db");
const app = require("./src/app");

connectdb()


const { PORT } = process.env;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})
