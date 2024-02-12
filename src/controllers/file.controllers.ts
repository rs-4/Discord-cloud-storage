import { Request, Response, Router } from "express";
import FileHandlingClass from '../class/fileHandling.class'
import FileInfo from '../models/fileInfo.model'
import uploadParse from "../middleware/uploadParse";
import downloadParse from "../middleware/downloadIdParse";
import checkFileExist from "../middleware/checkFileExist";
import bodyParser from "body-parser";

const fileRouter = Router()

fileRouter.get('/', (req: Request, res: Response) => {
  return res.status(418).send('This is a cloud service provider using discord')
})

fileRouter.post('/upload', bodyParser.raw({ type: 'application/octet-stream', limit: '5gb' }), uploadParse, checkFileExist)
fileRouter.post('/upload', async (req: Request, res: Response) => {

  const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)

  const nfo = await fileClass.uploadFileFromBuffer(req.body, req.query.filename as string)
  const fileInfo = new FileInfo(nfo)
  await fileInfo.save()

  return res.status(200).send('File uploaded')

})

fileRouter.get('/download', downloadParse,  async (req: Request, res: Response) => {
  const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)
  const {id, name} = req.query
  var file: {buffer: Buffer; filename: string;} | null = null

  if (!id) {
    file = await fileClass.retrieveFileByName(name as string)
  } else
    file = await fileClass.retrieveFileById(id as string)

  if (!file)
    return res.status(404).send('File not found')

  res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`)
  res.setHeader('Content-Type', 'application/octet-stream')
  return res.status(200).send(file.buffer)
})

export default fileRouter