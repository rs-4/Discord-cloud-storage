import { Request, Response, NextFunction } from "express";

const downloadParse = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.DISCORD_TOKEN)
    return res.status(500).send('Discord token is missing')
  if (!req.query.id && !req.query.name)
    return res.status(400).send('Id or name is needed')
  next()
}

export default downloadParse