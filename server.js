import express from "express"
import 'dotenv/config'
import cors from 'cors'

const app = express()

//Middleware
app.use(cors())
app.use(express.json())