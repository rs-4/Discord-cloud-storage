import express from 'express'
import dotenv from 'dotenv'
import Mainrouter from './routes/index.route'
import FileHandlingClass from './class/fileHandling.class'



(async () => {
  dotenv.config()
  if (!process.env.DISCORD_TOKEN) throw new Error('Discord token is missing')


  const NewClass = new FileHandlingClass(process.env.DISCORD_TOKEN)
  await NewClass.uploadFile('./files/test10KO.txt')
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