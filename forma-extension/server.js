import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws';

const PORT = 3006;

const app = express()
app.use(cors())

app.use(express.static('www'))

app.use('*', (req, res)=>{
    res.send('www/index.html')
})

const server = app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT} ...`)
})

const wss = new WebSocketServer({ server });

wss.on('connection', function(ws) {
  console.log("client joined.");

  ws.on('message', function(data) {
    if (typeof(data) === "string") {
      // client sent a string
      // console.log("string received from client -> '" + data + "'");
      wss.clients.forEach(client => client.send(data))

    } else {
      // console.log("binary received from client -> " + Array.from(data).join(", ") + "");
    //   console.log('binary received')
      wss.clients.forEach(client => client.send(data))
    }
  });

  ws.on('close', function() {
    console.log("client left.");
  });
});