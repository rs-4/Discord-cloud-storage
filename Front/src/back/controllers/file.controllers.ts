import { Request, Response, Router } from "express";
import FileHandlingClass from '../class/fileHandling.class'
import FileInfo from '../models/fileInfo.model'
import uploadParse from "../middleware/uploadParse";
import downloadParse from "../middleware/downloadIdParse";
import checkFileExist from "../middleware/checkFileExist";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';
import socketIo from 'socket.io';

const fileRouter = Router()

fileRouter.get('/', async (req: Request, res: Response) => {
  const data = await FileInfo.find();
  if (!data)
    return res.status(404).send('No document found')

  var ret = [];

  for (let x = 0; x < data.length; x++) {
    ret.push({ id: data[x]._id, name: data[x].filename, size: data[x].size });
  }

  return res.status(200).send(ret)
})

fileRouter.get('/upload', async (req: Request, res: Response) => {

  // Generate a unique download token
  const uploadToken = uuidv4();

  // Emit the download token to the client over Socket.IO
  const io: socketIo.Server = req.app.get('socketIo');
  io.emit(`downloadToken:${uploadToken}`, { uploadToken });

  // Now, return the download token to the client to initiate the download
  return res.status(200).json({ uploadToken });
});


fileRouter.post('/upload', bodyParser.raw({ type: 'application/octet-stream', limit: '5gb' }), uploadParse, checkFileExist)
fileRouter.post('/upload', async (req: Request, res: Response) => {

  const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)

  const io: socketIo.Server = req.app.get('socketIo');

  const nfo = await fileClass.uploadFileFromBuffer(req.body, req.query.filename as string, req.query.uploadToken as string, io)
  const fileInfo = new FileInfo(nfo)
  await fileInfo.save()

  return res.status(200).send('File uploaded')

})


fileRouter.post('/download', downloadParse, async (req: Request, res: Response) => {
  const { id, name } = req.query;

  let file;

  if (!id) {
    file = await FileInfo.findOne({ filename: name as string });
  } else {
    file = await FileInfo.findById(id as string);
  }

  if (!file) {
    return res.status(404).send('File not found');
  }

  // Generate a unique download token
  const downloadToken = uuidv4();

  // Emit the download token to the client over Socket.IO
  const io: socketIo.Server = req.app.get('socketIo');
  io.emit(`downloadToken:${downloadToken}`, { downloadToken });

  // Now, return the download token to the client to initiate the download
  return res.status(200).json({ downloadToken, fileId: file._id });
});

fileRouter.get('/download', downloadParse, async (req: Request, res: Response) => {
  const fileClass = new FileHandlingClass(process.env.DISCORD_TOKEN as string)
  const { id, name, downloadToken } = req.query
  var file: { buffer: Buffer; filename: string; } | null = null

  const io: socketIo.Server = req.app.get('socketIo');

  if (!id) {
    file = await fileClass.retrieveFileByName(name as string, downloadToken as string, io)
  } else
    file = await fileClass.retrieveFileById(id as string, downloadToken as string, io)

  if (!file)
    return res.status(404).send('File not found')

  res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`)
  res.setHeader('Content-Type', 'application/octet-stream')
  return res.status(200).send(file.buffer)
})

export default fileRouter