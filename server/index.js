import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js"
import { register } from "./controlers/auth.js";
import { createPost } from "./controlers/posts.js";
import { verifyToken } from './middleware/auth.js';
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); //set the directory of where we keep our assets, in our case it'll be the images that we store

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb){ //this is how you save your files
        cb(null, "public/assets"); //anytime someone uploads file onto website then it's going to say destination to save 
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    } //lot of this configurations coming from the package instruction 
    //oll of this instruction are from the GitHub repo of multer
})

const upload = multer({storage});

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=>{console.log(`${error} did not connect`)});

//KOMANDA ZA POKRETANJE node index.js !!!!!!!!