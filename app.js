const express=require('express');
const request=require('request');
const bodyparser=require('body-parser');
const cors=require('cors');
const { restart } = require('nodemon');
const app=express();
require('dotenv/config');
Id1="6343f52e230389cc45a13f7574384ece";
Secret1="21dc037131ca040bc48607944285899d4dd378cc5d4066ad998b04494e14723c";
Id2="a8006db2c789e3c148683a4bf63f38aa";
Secret2="454990529708473b2dcda5c36bbedd021373d18b50be7762c5c786dd977a8b22";
app.use(bodyparser.json());
app.use(cors());
const checkCredit=(id,secret)=>{
    request({
        url: 'https://api.jdoodle.com/v1/credit-spent',
        method: "POST",
        json: {
            clientId:id,
            clientSecret:secret,
        }
    },
      (error, response, body)=>{
        console.log(body);
        if(body.used!=200 && body.error==null && error==null)
        {   
            return 1;
        }
        else{
            return 0;
        }
        
    });
}
app.post('/compile',(req,res)=>{
    request({
        url: 'https://api.jdoodle.com/v1/credit-spent',
        method: "POST",
        json: {
            clientId:Id1,
            clientSecret:Secret1,
        }
    },
      (error, response, body)=>{
        console.log(body);
        if(body.used!=200 && body.error==null && error==null)
        {   
            var program={
                
                clientId:Id1,
                clientSecret:Secret1,
                script:req.body.script,
                stdin:req.body.stdin,
                language:req.body.language,
                versionIndex:req.body.versionIndex
            }
            request({
                url: 'https://api.jdoodle.com/v1/execute',
                method: "POST",
                json: program,
            },
              (error, response, body)=>{
                console.log(body);
               res.send(body); 
            });
        }
        else{
            request({
                url: 'https://api.jdoodle.com/v1/credit-spent',
                method: "POST",
                json: {
                    clientId:Id2,
                    clientSecret:Secret2,
                }
            },
              (error, response, body)=>{
                console.log(body);
                if(body.used!=200 && body.error==null && error==null)
                {   
                    var program={
                
                        clientId:Id2,
                        clientSecret:Secret2,
                        script:req.body.script,
                        stdin:req.body.stdin,
                        language:req.body.language,
                        versionIndex:req.body.versionIndex
                    }
                    request({
                        url: 'https://api.jdoodle.com/v1/execute',
                        method: "POST",
                        json: program,
                    },
                      (error, response, body)=>{
                        console.log(body);
                       res.send(body); 
                    });     
                }
                else{
                    res.send({output:"Quota Exceeded"});
                }
                
            });
        }
        
    });
});
app.post('/check',(req,res)=>{
    console.log(req.body);
    res.send(req.body);
});
app.get('/',(req,res)=>{
    res.send("Working");
});
app.listen(process.env.PORT ||  5000);