const express=require('express');
const request=require('request');
const bodyparser=require('body-parser');
const cors=require('cors');
const { restart } = require('nodemon');
const app=express();
require('dotenv/config');
Id1=process.env.Id1;
Secret1=process.env.Secret1;
Id2=process.env.Id2;
Secret2=process.env.Secret2;
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