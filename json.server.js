const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const fs = require('fs');
const request = require('request');
server.use(middlewares)
server.use(jsonServer.bodyParser)

// I don't know how to do that in another way...
server.put('/tasks', (req, res) => {
    let tasks = req.body;
    tasks.map(task => {
        request({ url: `http://localhost:3000/tasks/${task.id}`, method: 'PUT', json: task });
    })
    res.send('OK');
});

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
});