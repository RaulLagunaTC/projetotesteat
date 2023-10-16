//modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//routes
//midlewares

//config
const dbName = "partytime";
const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//atrelando a primeira rota
app.get("/", (req, res)=>{
    res.json({message : "A rota de teste, será trocada"})
})

//escutar ou entende a porta 3000
app.listen(port, ()=>{
    console.log(`o backend esta na porta 3000 ${port}`)
})