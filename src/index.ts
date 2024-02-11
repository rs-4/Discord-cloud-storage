import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import Mainrouter from './routes/index.route'
import FileHandlingClass from './class/fileHandling.class'
import FileInfo from './models/fileInfo.model'
import axios from 'axios';
require('./mongoConnection');


import fs from 'fs'

(async () => {

  if (!process.env.DISCORD_TOKEN) throw new Error('Discord token is missing')

  const testNAME = 'WebStorm.exe'

  const NewClass = new FileHandlingClass(process.env.DISCORD_TOKEN)

  if (await FileInfo.findOne({ filename: testNAME }))
    return console.log('File already exists')

  const nfo = await NewClass.uploadFile(`./files/${testNAME}`)

  const fileInfo = new FileInfo({
    filename: nfo.filename,
    part: nfo.part,
    size: nfo.size,
    files: nfo.files
  })
  await fileInfo.save()

  const buffer = await NewClass.retrieveFileByName(testNAME)
  if (!buffer) return console.log('No buffer found')
  fs.writeFileSync(`./${testNAME}`, buffer, 'binary')

})();

// const app = express()
// app.use(express.json())

// app.get("/", (req, res) => {
//   res.status(418).send('This is a cloud service provider using discord')
// })

// app.use("/api", Mainrouter)

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`)
// })