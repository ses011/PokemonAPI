const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const cCode = fs.readFileSync(`${__dirname}/../client/client.js`);
const data = JSON.parse(fs.readFileSync(`${__dirname}/../src/pokedex.json`));

const sendResponseClient = (content, response, type) => {
    response.writeHead(200, { "Content-Type": type });
    response.write(content);
    response.end();
}

const sendResponseData = (code, content, response, type) => {
    content = JSON.stringify(content);

    response.writeHead(code, { 
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(content, "utf8")
    });

    response.write(content);
    response.end();
}

const getData = (req, res) => {
    console.log("getData");
    let n, t, e;
    let selections = data;

    if (req.query.name) {
        n = req.query.name.toLowerCase();
        console.log(`Name: ${n}`);
        selections = selections.filter((pokemon) => pokemon.name.toLowerCase().includes(n));
    }
    // if (req.query.type) {
    //     t = req.query.type;
    //     selections = selections.filter((pokemon) => pokemon.name.toLowerCase().includes(n));
    // }
    // if (req.query.effective) {
    //     e = req.query.effective;
    //     selections = selections.filter((pokemon) => pokemon.name.toLowerCase().includes(n));
    // }

    sendResponseData(200, selections, res, "array");
}   

const getIndex = (req, res) => {
    sendResponseClient(index, res, 'text/html');
}

const getStyle = (req, res) => {
    sendResponseClient(style, res, 'text/css');
}

const getCode = (req, res) => {
    sendResponseClient(cCode, res, 'application/javascript');
}

const notFound = (req, res) => {
    sendResponseData(400, "Invalid request", res, "");
}

module.exports = {
    getIndex,
    getStyle,
    getCode,
    getData,
    notFound
}