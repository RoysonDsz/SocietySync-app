import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const dbConnect = await mongoose.connect('mongodb+srv://visionflowchatgpt:ve1V1P5zwKeTsi9p@cluster0.iz0xs.mongodb.net/society-management');
        console.log("Connected to", dbConnect.connection.host)
    } catch (error) {
        console.log(error)
    }
}
 export default connectDB;