const express = require("express");
const dotenv =require("dotenv")
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes")
const {notFound,errorHandler}=require('./middleware/errorMiddleware')
const messageRoutes=require("./routes/messageRoutes")

const app = express();
app.use(express.json());
dotenv.config();
connectDB();


app.get("/", (req, res) => {
  res.send("API IS RUNNING SUCCESSFULLY");
});
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
//   //console.log(req);
// });

// app.get('/api/chat/:id', (req, res) => {
//  // console.log(req);
//   const singleChat=chats.find((c)=> c._id===req.params.id) ;
//   res.send(singleChat);
// });


app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes)

app.use(notFound);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server=app.listen(5000, console.log(`Server started at port ${PORT}`));

