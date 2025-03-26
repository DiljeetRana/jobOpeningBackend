const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");
require('dotenv').config();

const dbConnect = () => {
    mongoose.connect("mongodb://localhost:27017/Job", {}).then((async() => {
        console.log("Connected");
        // try {
        //     await Candidate.collection.dropIndex("email_1");
        //     console.log("✅ Email index removed");
        // } catch (error) {
        //     console.error("❌ Error dropping index:", error.message);
        // }
    })).catch((error) => {
        console.log("error for connection", error);
    })
}
module.exports = dbConnect;