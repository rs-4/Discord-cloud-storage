import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import Mainrouter from './routes/index.route'

require('./mongoConnection');

(async () => {
  const app = express()

  app.get("/", (req, res) => {
    res.status(418).send('This is a cloud service provider using discord')
  })

  app.use("/api", Mainrouter)

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
  })

})();

