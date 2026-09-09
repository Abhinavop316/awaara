const mongoose = require("mongoose")


const connectdb = async () => {
    try {
        const connecting_string = `mongodb+srv://${process.env.db_user}:${process.env.db_password}@awaaradb.bxzirxk.mongodb.net/${process.env.db_name}`;
        await mongoose.connect(connecting_string)
        console.log("DB connection successfull")
    } catch (err) {
        console.log("DB connection failed",err)
    }
}

module.exports = connectdb