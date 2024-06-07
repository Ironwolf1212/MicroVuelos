require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (err) => {console.log('Error de conexión:', err)})
db.once('open', () => {console.log('Conexión establecida')})

app.use(express.json())

const Router = require('./routes/router')
app.use('/vuelos', Router)

app.listen(3001, () => { console.log('Server is running on port 3001') })