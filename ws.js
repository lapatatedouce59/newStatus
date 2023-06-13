const {WebSocket, WebSocketServer} = require('ws');
const wss = new WebSocket.Server({ port: 8082 });
const {v4} = require('uuid')
const fs = require('fs')
const logger = require('./logger')

/*const server = https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/patate.ddns.net/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/patate.ddns.net/privkey.pem')
})

const wss = new WebSocketServer({server});

server.listen(8082, function listening() {
    console.log('Address: ', wss.address());
});*/
const papi = require('./server.json')

const clients = {}

function apiSave(){
    console.log('action')
    fs.writeFileSync('./server.json', JSON.stringify(game, null, 2));

    wss.broadcast(JSON.stringify({
        op: 100,
        content: papi
    }))
    logger.message('broadcast','NEW SERVER DATA => REFRESH')
    //ws.send();
}

wss.on('connection', (ws, req) => {
    let newUUID;
    let clientIp=req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    logger.client(true, clientIp)
    newUUID = v4();
    ws.id=newUUID

    ws.on('message', msg => {
        let data = false
        try{
            data = JSON.parse(msg);
        } catch (error) {
            logger.error(error)
        }
        op = data.op;

        if(op===100) return;

        switch(op){
            case 1 :
                ws.ip = clientIp
                ws.instance = 'PUBLIC'
                ws.uuid = newUUID
                clients[ws.id]=ws
                logger.identify(ws.ip, ws.uuid, ws.instance)
                logger.message('outcome','server.json')
                ws.send(JSON.stringify({op: 2, uuid: newUUID, content: papi}));
                break;
        }
    })
    ws.on("close", ()=>{
        delete clients[ws.id];
        logger.leave(ws.ip, ws.instance)
    });
})