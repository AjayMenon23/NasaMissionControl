import {Application, send} from "https://deno.land/x/oak@v5.0.0/mod.ts"
import api from "./api.ts"
import * as log from "https://deno.land/std/log/mod.ts"

const app = new Application();
const PORT = 8000;

await log.setup({
    handlers:{
        console:new log.handlers.ConsoleHandler("INFO")
    },
    loggers:{
        default:{
            level:"INFO",
            handlers:["console"],
        }
    }


})

app.addEventListener("error",(event)=>{
    log.error(event.error)
})

app.use(async (ctx, next)=>{
    try {
        await next();
    }
    catch (err){
        log.error(err);
        ctx.response.body="Internal server error"
        throw err;
    }
    })

app.use(async (ctx,next)=>{
    await next();
    const time= ctx.response.headers.get("X-Response_Time")
    log.info(`${ctx.request.method} ${ctx.request.url} ${time}`)
})


app.use(async (ctx,next)=>{
    log.info(`${ctx.request.method} ${ctx.request.url.pathname}`)
    const start = Date.now()
    await next();
    const end = Date.now()-start;
    ctx.response.headers.set("X-Response_Time",`${end}ms`)

   
    
})

app.use(api.routes());
 app.use(api.allowedMethods())


app.use(async(ctx,next)=>{
    ctx.response.body = "NASA Mission Control API";
    await next();
})



app.use(async (ctx)=>{
    
    const filePath = ctx.request.url.pathname;
    const fileWhitelist=["/images/favicon.png",
        "/javascripts/script.js",
        "/stylesheets/style.css",
        "/index.html",
        "/videos/space.mp4"
    ];
    if(fileWhitelist.includes(filePath)){
    await send(ctx,`${filePath}`, {
        root:`${Deno.cwd()}/public`
    });
    }
})



if(import.meta.main){
    log.info(`Starting server on port ${PORT}....`)
   await app.listen({
        port : PORT
    })
}