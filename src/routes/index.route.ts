import { Router } from "express";
import fileRouter from "../controllers/file.controllers";

const Mainrouter = Router()

Mainrouter.use("/file", fileRouter)

export default Mainrouter