const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const cCode = fs.readFileSync(`${__dirname}/../client/client.js`);
const data = JSON.parse(fs.readFileSync(`${__dirname}/../src/pokedex.json`));
const strong = JSON.parse(fs.readFileSync(`${__dirname}/../src/strengths.json`));

const sendResponseData = (code, val, response, type) => {
  let content = val;
  if (type === 'application/json') {
    content = JSON.stringify(val);
  }

  response.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

const sendHead = (code, res) => {
  res.writeHead(code);
  res.end();
};

const getData = (req, res) => {
  let n; let t; let e;
  let selections = data;

  if (req.query.name) {
    n = req.query.name.toLowerCase();
    selections = selections.filter((pokemon) => pokemon.name.toLowerCase().includes(n));
  }
  if (req.query.type) {
    t = req.query.type;
    selections = selections.filter((pokemon) => pokemon.type.includes(t));
  }
  if (req.query.effective) {
    e = req.query.effective;
    console.log(e);
    console.log(strong);

    selections = selections.filter((pokemon) => {
      for (const elem of strong.e) {
        if (pokemon.type.includes(elem)) {
          return true;
        }
      }
      return false;
    });
  }

  if (selections.length === 0) {
    sendHead(204, res);
    return;
  }

  sendResponseData(200, selections, res, 'application/json');
};

// Assumes req.body is a json object similar to how a single pokemon object is stored
// Will likely change this later to not update at all if a field is left empty
const editData = (req, res) => {
  const poke = data[req.body.id - 1];

  poke.name = req.body.name;
  poke.img = req.body.name;
  poke.type = req.body.type;
  poke.height = req.body.height;
  poke.weight = req.body.weight;
  poke.weaknesses = req.body.weaknesses;

  data[req.body.id - 1] = poke;
  sendResponseData(202, 'Pokemon updated', res, 'text/plain');
};

// This causes data to be out of order, but should still work the same
const addData = (req, res) => {
  const newPoke = req.body;

  newPoke.id = data[data.length - 1].id + 1;
  newPoke.num = newPoke.id.toString();

  data.push(JSON.stringify(newPoke));
  console.log(data);

  sendResponseData(201, 'Pokemon added', res, 'text/plain');
};

const getIndex = (req, res) => {
  sendResponseData(200, index, res, 'text/html');
};

const getStyle = (req, res) => {
  sendResponseData(200, style, res, 'text/css');
};

const getCode = (req, res) => {
  sendResponseData(200, cCode, res, 'application/javascript');
};

const notFound = (req, res) => {
  sendHead(400, res);
};

module.exports = {
  getIndex,
  getStyle,
  getCode,
  getData,
  addData,
  editData,
  notFound,
};
