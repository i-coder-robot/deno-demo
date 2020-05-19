const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("./user.json");
console.log(decoder.decode(data));

var name:string
function ShowName(name:string){
    console.log(` 大爷 ${name}，你好啊~`)
}
ShowName("老王")

import {Application,Router} from "https://deno.land/x/oak/mod.ts"
const router = new Router();
router.get("/",(context:any)=>{
  context.response.body="Hello Deno"
})

router.get("/getUser",(context:any)=>{
  try{
    const decoder = new TextDecoder("utf-8")
    const data = Deno.readFileSync("./user.json")
    console.log(decoder.decode(data))
    context.response.body = decoder.decode(data)
  }catch(err){
    console.log(err)
    context.response.status=500;
    context.response.body=err
  }
})

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log("服务器地址是 http://localhost:8888")
await app.listen({port:8888})