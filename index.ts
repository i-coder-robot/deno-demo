const decoder = new TextDecoder("utf-8");
const data = await Deno.readFile("./user.json");
console.log(decoder.decode(data));

var name: string

function ShowName(name: string) {
    console.log(` 大爷 ${name}，你好啊~`)
}

ShowName("老王")

import {Application, Router} from "https://deno.land/x/oak/mod.ts"

const router = new Router();
router.get("/", (context: any) => {
    context.response.body = "Hello Deno"
})

router.get("/getUser", (context: any) => {
    try {
        const decoder = new TextDecoder("utf-8")
        const data = Deno.readFileSync("./user.json")
        console.log(decoder.decode(data))
        context.response.body = decoder.decode(data)
    } catch (err) {
        console.log(err)
        context.response.status = 500;
        context.response.body = err
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
            context.response.body = `用户ID ${context.params.id} 不存在~`
        }
    } catch (err) {
        console.log(err)
        context.response.status = 500;
        context.response.body = err
    }

})

router.post("/addUser", (context: any) => {
    try {
        const decoder = new TextDecoder();
        const data = Deno.readFileSync("./user.json")
        const users = JSON.parse(decoder.decode(data))
        var len = Object.keys(users).length
        var user: any = {
            "id": len + 1,
            "name": "New User",
        }
        users[user["id"]] = user
        console.log(`------------------`)
        console.log(users)
        const encoder = new TextEncoder()
        const updatedUser = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
        context.response.status = 201
        context.response.body = "添加用户成功"
    } catch (err) {
        console.log(err)
        context.response.status = 500;
        context.response.body = err
    }
})

router.delete("/deleteUser/:id", (context: any) => {
    try {
        const decoder = new TextDecoder();
        const data = Deno.readFileSync("./user.json")
        const users = JSON.parse(decoder.decode(data))
        if (context.params && context.params.id) {
            var idx = 0
            for (let item of users) {
                console.log(item)
                if (item["id"] == context.params.id) {
                    // delete users[context.params.id]
                    users.splice(idx, 1)
                    console.log(`-----delete user-----`)
                    console.log(users)
                    const encoder = new TextEncoder()
                    const updatedUser = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
                    context.response.status = 201
                    context.response.body = `删除用户${context.params.id}成功`
                } else {
                    console.log("没找到")
                }
                idx = idx + 1
            }

        } else {
            context.response.status = 201
            context.response.body = `用户${context.params.id}不存在`
        }
    } catch (err) {
        console.log(err)
        context.response.status = 500;
        context.response.body = err
    }
})

router.put("/updateUser/:id", async (context: any) => {
    try {
        const decoder = new TextDecoder();
        const data = Deno.readFileSync("./user.json")
        const users = JSON.parse(decoder.decode(data))
        const body = await context.request.body().then((user: Object) => user)
        if (context.params && context.params.id && body.value) {
            for (let item of users) {
                console.log(JSON.stringify(item))
                const id = item["id"]
                console.log(`id==${id}`)
                console.log(`context.params.id==${context.params.id}`)
                if (id == context.params.id) {
                    console.log("相等")
                    item["name"] = body.value["name"]
                    break
                }
            }
            const encoder = new TextEncoder()
            const updatedUser = Deno.writeFileSync("./user.json", encoder.encode(JSON.stringify(users)))
            context.response.status = 201
            context.response.body = "更新用户成功"
        } else {
            context.response.status = 500
            context.response.body = "参数错误"
        }

    } catch (err) {
        console.log(err)
        context.response.status = 500;
        context.response.body = err
    }
})

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
console.log("服务器地址是 http://localhost:8888")
await app.listen({port: 8888})
