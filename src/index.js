import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const apiRoot = process.env.API_ROOT

const app = express()
app.use(express.json())

app.get("/user", (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})

export default app