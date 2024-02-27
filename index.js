const app = require('express')()
const server = require('http').createServer(app)
const { join } = require("path")
const io = require('socket.io')(server)

app.get('/', (req, res) => {
    res.sendFile(join(__dirname + "/index.html"))
})
// {
//     "cell": index.target.id,
//     "clientId":clientId
// }
let clients = {
    "0":null,
    "1":null
}

io.on("connection", (socket) => {
    socket.emit("userId", socket.id)
    if (clients[0]===null && clients[1]===null){
        clients[0] = socket.id
    }
    else{
        clients[1] = socket.id
    }
    console.log(clients)
    let symbol = null
    if (clients[0]===socket.id){
        symbol = "0"
    }
    if (clients[1]===socket.id){
        symbol = "1"
    }
    socket.on("cell-id", (payload) => {
        const newPayload = {
            "cell" :payload.cell,
            "clientId":payload.clientId,
            "txt":symbol
        }
        // if (!clients[0]){
        //     clients[0] = payload.clientId
        // }
        io.emit("cell-id-server", newPayload)
    })

})

server.listen(3000, () => console.log("Server Listening at 3000."))