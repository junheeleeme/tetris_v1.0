"use strict";

const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');
const port = 8001;

const bodyParser = require('body-parser');                                                                     

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static(path.join(__dirname, '/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/tetris.html'));
})

app.get('/rank?', (req, res) => {

    fs.readFile('./rank.json', 'utf8', (err, json)=>{

        if(!err){
            
            const rankData = JSON.parse(json);
            const last = rankData.length-1;
        
            if(rankData[last].score < req.query.score){ //10위 점수와 비교
                res.status(200).send("ranker");
            }else{
                res.status(200).send("user");
            }

        }else{
            console.log(err);
        }
    })
    
});

app.get('/readrank', (req, res) => {
    
    fs.readFile('./rank.json', 'utf8', (err, json)=>{
        if(!err){
            res.status(200).send(JSON.parse(json));
        }else{
            res.status(400).send();
            console.log(err);
        }
    });
})

app.post('/rank', (req, res) => {
    
    console.log(req.body)
    
    fs.readFile('./rank.json', 'utf8', (err, json)=>{
        if(!err){

            const rankData = JSON.parse(json);        
            rankData.push(req.body);

            rankData.sort((a, b)=>{
                return b.score - a.score;
            });

            if(rankData.length > 4){
                rankData.splice(5, 1);
            }


            fs.writeFile('./rank.json', JSON.stringify(rankData), 'utf8', (err)=>{
                if(err){
                    console.log(err)
                }
            });
            

        }
    })
    res.status(200).send('ok');

});

app.post('/')


app.listen(port, (err)=>{
    if(!err){
        console.log("success!")
    }else{
        console.log(err)
    }
})

