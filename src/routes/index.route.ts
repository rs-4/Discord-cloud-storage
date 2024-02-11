import { Router } from "express";
import Filerouter from "../controllers/file.controllers";

const Mainrouter = Router()

Mainrouter.use("/file", Filerouter)

export default Mainrouter