require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose')
const helmet = require('helmet')

const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(express.json())
// app.use(express.urlencoded())

//Mongoose Connection
mongoose
    .connect(process.env.DATABASE || 'mongodb://localhost:27017/dontGoDepresso')
    .then(() => { console.log('Database Connected') })
    .catch((err) => { console.log('databaseError: ',err) })


app.get('/', (req, res) => {
    res.status(200).json({ 'status': 'Ok' })
})

app.listen(PORT, () => {
    console.log(`Server is live at ${PORT}`)
})