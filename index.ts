const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("./user.json");
console.log(decoder.decode(data));

var name:string
function ShowName(name:string){
    console.log(` 大爷 ${name}，你好啊~`)
}
ShowName("老王")