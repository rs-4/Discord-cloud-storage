import { Request, Response, NextFunction } from "express";

const uploadParse = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.DISCORD_TOKEN)
    return res.status(500).send('Discord token is missing')
  if (!req.query.filename)
    return res.status(400).send('No filename found')
  if (!req.body)
    return res.status(400).send('No file found')
  next()
}

export default uploadParse