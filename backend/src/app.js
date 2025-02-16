const express = require("express")
const aiRoutes = require('./routes/ai.routes')
const cors =  require('cors')
const app = express()

app.get("/", (req, res)=>{
    res.send("Hello World")
})
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY);


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.use('/ai', aiRoutes);

module.exports = app