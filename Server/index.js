import {createRequire} from "module"
import { ChatGPTAPI } from "chatgpt";
const require=createRequire(import.meta.url)
const express=require("express")
const port=4000;
const puppeteer=require('puppeteer')
const app=express()
const cors=require('cors')

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors())

app.get('/api',(req,res)=>{
    res.json({
        message:'api cooking',
    })
})
async function chatgptFunction(content){
    const api=new ChatGPTAPI({
        apikey:process.env.GPT_API
    })
    await api.initSession();
    const getBrandName=await api.sendMessage(
        `I have a raw text of a website,what is the brand name in a single`
    );
    const getBrandDescription=await api.sendMessage(
        `I have a raw text of a website, can you extract the description of`
    );
    return{
        getBrandName:getBrandName.response,
        brandDescription:getBrandDescription.response,
    }
};
const database=[];
const generateID=()=>Math.random().toString(36).substring(2,10);

app.get('/api/url',(req,res)=>{
    const {url}=req.body;
    (async ()=>{
        const browser=await puppeteer.launch()
        const page=await browser.newPage();
        await page.goto(url);

        const websiteContent=await page.evaluate(()=>{
            return document=getElement.innerText.trim()
        });
        const websiteOgImage=await page.evaluate(()=>{
            const metas=document.getElementsByTagName("meta")
            for(let i=0;i<metas.length;i++){
                if(metas[i].getAttribute("property") === "og:image"){
                    return metas[i].getAttribute("content");
                }
            }
        });
        let result=await chatgptFunction(websiteContent);
        result.brandImage=websiteOgImage;
        result.id=generateID();
        database.push(result)
        return res.json({
            message:"Request succcessful!",
            database,
        });
         await browser.close();
       
        
    })();
   
});

app.listen(port,()=>{
    console.log(`server up  oon port ${port}`)
})