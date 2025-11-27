import express from "express"
import 'dotenv/config'
import cors from 'cors'

const app = express()

//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.get('/', (req, res) => res.send('Ai server is running...'))

const PORT = process.env.PORT || 3590

app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})