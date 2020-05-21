const decoder = new TextDecoder("utf-8")
const data = await Deno.readFile("./user.json")
console.log(decoder.decode(data))

var name: string

function ShowName(name: string) {
    console.log(`大爷 ${name},你好，今天有时间来玩儿啊~`)
}

ShowName("老王")


import {Application, Router} from "https://deno.land/x/oak/mod.ts"

const router = new Router()

router.get("/", (context: any) => {
    try {
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        console.log(decoder.decode(data))
        context.response.body = decoder.decode(data)
    } catch (e) {
        console.log(e)
        context.response.status = 500
        context.response.body = e
    }
})

router.get("/getUser/:id", (context: any) => {
    try {
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        console.log(decoder.decode(data))
        const users = JSON.parse(decoder.decode(data))
        if (context.params && context.params.id) {
            const user = users[context.params.id - 1]
            context.response.body = user
        } else {
            context.response.status = 404
            context.response.body = `用户 ID${context.params.id}不存在`
        }
    } catch (e) {
        console.log(e)
        context.response.status = 500
        context.response.body = e
    }
})

router.post("/addUser", (context: any) => {
    try {
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        console.log(decoder.decode(data))
        const users = JSON.parse(decoder.decode(data))
        console.log(users)
        var len = Object.keys(users).length
        var user: any = {
            "id": len + 1,
            "name": "New User",
        }
        users[user["id"]] = user
        const encoder = new TextEncoder()
        console.log(users)
        const updated = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
        context.response.status = 201
        context.response.body = "添加用户成功"
    } catch (e) {
        context.log(e)
        context.response.status = 500
        context.response.body = e
    }
})

router.delete("/deleteUser/:id", (context: any) => {
    try {
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        console.log(decoder.decode(data))
        const users = JSON.parse(decoder.decode(data))
        if (context.params && context.params.id) {
            var idx = 0
            for (let item of users) {
                if (item["id"] == context.params.id) {
                    users.splice(idx, 1)
                    const encoder = new TextEncoder()
                    const deletedUser = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
                    context.response.status = 200
                    context.response.body = `删除用户${context.params.id}成功`
                }
                idx = idx + 1
            }
        }
    } catch (e) {
        console.log(e)
        context.response.status = 500
        context.response.body = e
    }
})

router.put("/updateUser/:id", async (context: any) => {
    try {
        console.log("updateUser....")
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        const users = JSON.parse(decoder.decode(data))
        console.log(decoder.decode(data))
        const body = await context.request.body().then((user: Object) => user)
        const newUser= JSON.parse(body.value)
        if (context.params && context.params.id && body.value) {
            for (let item of users) {
                const id = item["id"]
                if (id == context.params.id) {
                    item["name"] = newUser["name"]
                    break
                }
            }
            const encoder = new TextEncoder()
            const deletedUser = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
            context.response.status = 200
            context.response.body = `更新用户${context.params.id}成功`
        }
    } catch (e) {
        console.log(e)
        context.response.status = 500
        context.response.body = e
    }
})

const app = new Application();
app.use(router.routes())
app.use(router.allowedMethods())
console.log("服务器地址是 http://localhost:8887")
await app.listen({port: 8887})
