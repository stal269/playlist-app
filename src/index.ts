import app from './app';
const spdy = require('spdy');
const fs = require('fs');

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const server = spdy.createServer(options, app.express);
const port: string | number = process.env.PORT || 3000;

server.listen(port, (err: Error) => {
    if (err) return console.log(err);

    return console.log(`server is listening on ${ port }`);
});