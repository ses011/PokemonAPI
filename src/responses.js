const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const cCode = fs.readFileSync(`${__dirname}/../client/client.js`);
const data = fs.readFileSync(`./pokedex.json`);

const sendResponseClient = (content, response, type) => {
    response.writeHead(200, { "Content-Type": type });
    response.write(content);
    response.end();
}

const sendResponseData = (code, content, response) => {


}

const byName = () => {


}

const byType = () => {


}

const getIndex = (req, res) => {
    sendResponseClient(index, res, 'text/html');
}

const getStyle = (req, res) => {
    sendResponseClient(style, res, 'text/css');
}

const getCode = (req, res) => {
    sendResponseClient(cCode, res, 'text/javascript');
}

module.exports = {
    getIndex,
    getStyle,
    getCode,
    byName,
    byType
}