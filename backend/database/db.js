import mongoose from "mongoose";

const connectDb= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"pinterest"
        })
        console.log("hii")
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;