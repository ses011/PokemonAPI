const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const cCode = fs.readFileSync(`${__dirname}/../client/client.js`);
const data = JSON.parse(fs.readFileSync(`${__dirname}/../src/pokedex.json`));
const strengths = JSON.parse(fs.readFileSync(`${__dirname}/../src/strengths.json`));


const sendResponseData = (code, content, response, type) => {
    content = JSON.stringify(content);

    response.writeHead(code, { 
        "Content-Type": type,
        "Content-Length": Buffer.byteLength(content, "utf8")
    });

    response.write(content);
    response.end();
}

const sendHead = (code, res) => {
    res.writeHead(code);
    res.end();
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
    if (req.query.type) {
        t = req.query.type;
        selections = selections.filter((pokemon) => pokemon.type.includes(t));
    }
    if (req.query.effective) {
        e = req.query.effective;
        const strong = strengths.filter(obj => obj.type === e); 

        selections = selections.filter((pokemon) => {
            strong.forEach(element => {
                if (pokemon.weaknesses.includes(element)) {
                    return true;
                }
                return false;
            });

        });
    }

    if (selections.length === 0) {
        sendHead(204, res);
    }

    sendResponseData(200, selections, res, "application/json");
}   

const editData = (req, res) => {
    let poke = data[req.body.id - 1];

    poke.name = req.body.name;
    poke.img = req.body.name;
    poke.type = req.body.type;
    poke.height = req.body.height;
    poke.weight = req.body.weight;
    poke.weaknesses = req.body.weaknesses;

    data[req.body.id - 1] = poke;
    sendResponseData(202, "Pokemon updated", res, "text/html")
}

const addData = (req, res) => {
    let newPoke = req.body;

    newPoke.id = data[data.length - 1].id + 1;
    newPoke.num = newPoke.id.toString();
    
    data.push(newPoke);

    sendResponseData(201, "Pokemon added", res, "text/html")
}

const getIndex = (req, res) => {
    sendResponseData(200, index, res, 'text/html');
}

const getStyle = (req, res) => {
    sendResponseData(200, style, res, 'text/css');
}

const getCode = (req, res) => {
    sendResponseData(200, cCode, res, 'application/javascript');
}

const notFound = (req, res) => {
    sendHead(400, res);
}

module.exports = {
    getIndex,
    getStyle,
    getCode,
    getData,
    addData,
    editData,
    notFound
}