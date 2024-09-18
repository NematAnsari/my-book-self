import mongoose from "mongoose";
import appConstant from "../app-constant.js";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONOGODB_URL}/${appConstant.DB_Name}`
    );

    console.log("Database connected:");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export default connectDB;

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONOGODB_URL}/${appConstant.DB_Name}`);
//     app.on("error",(error)=>{
//         console.warn("error",error)
//     })
//     app.listen(process.env.PORT,()=>{
//         console.log("App is listening on this port ",process.env.PORT)
//     })
//   } catch (error) {
//     console.warn(error);
//   }
// })();
