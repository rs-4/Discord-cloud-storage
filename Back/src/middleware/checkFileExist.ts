import { Request, Response, NextFunction } from "express";
import FileInfo from "../models/fileInfo.model";

const checkFileExist = async (req: Request, res: Response, next: NextFunction) => {

  const { filename } = req.query
  if (await FileInfo.findOne({ filename }))
    return res.status(400).send('File already exist')
  next()
}

export default checkFileExist