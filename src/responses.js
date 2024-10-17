const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const documentation = fs.readFileSync(`${__dirname}/../client/documentation.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const cCode = fs.readFileSync(`${__dirname}/../client/client.js`);
const data = JSON.parse(fs.readFileSync(`${__dirname}/../src/pokedex.json`));
const weakTo = JSON.parse(fs.readFileSync(`${__dirname}/../src/weaknesses.json`));

const sendResponseData = (code, val, res, type) => {
  let content = val;
  if (type === 'application/json') {
    content = JSON.stringify(val);
  }

  res.writeHead(code, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  res.write(content);
  res.end();
};

const sendHead = (code, res) => {
  res.writeHead(code);
  res.end();
};

const getData = (selections, res) => {
  if (selections.length === 0) {
    sendResponseData(204, 'No data fits those search parameters- try a less specific search', res, 'text/plain');
    return;
  }

  sendResponseData(200, selections, res, 'application/json');
};

const searchName = (req, res) => {
  const pokeName = req.query.name.toLowerCase();
  const selections = data.filter((pokemon) => pokemon.name.toLowerCase().includes(pokeName));

  getData(selections, res);
};

const searchType = (req, res) => {
  const pokeType = req.query.type;
  const selections = data.filter((pokemon) => pokemon.type.includes(pokeType));

  getData(selections, res);
};

const searchEffective = (req, res) => {
  const pokeWeak = req.query.effective;

  const selections = data.filter((pokemon) => {
    let match = false;
    weakTo[pokeWeak].forEach((elem) => {
      if (pokemon.type.includes(elem)) {
        match = true;
      }
    });

    return match;
  });

  getData(selections, res);
};

const getAll = (req, res) => {
  getData(data, res);
};

const postData = (poke, body) => {
  const newPoke = poke;
  if (body.height) {
    newPoke.name = body.name;
  }
  if (body.weight) {
    newPoke.name = body.name;
  }

  if (body.type1 && body.type2) {
    newPoke.type = [body.type1, body.type2];
  } else if (body.type1) {
    newPoke.type = [body.type1];
  } else if (body.type2) {
    newPoke.type = [body.type2];
  }

  return newPoke;
};

// Assumes req.body is a json object similar to how a single pokemon object is stored
// Will likely change this later to not update at all if a field is left empty
const editData = (req, res) => {
  let poke;
  const { body } = req;

  data.forEach((element) => {
    // console.log(`${element.id}: ${body.id}`)
    if (element.id.toString() === body.id.toString()) {
      poke = element;

      if (body.name) {
        poke.name = body.name;
      }
    } else if (element.name === req.body.name) {
      poke = element;
    }
  });

  if (!poke) {
    sendResponseData(400, 'That pokemon is not in the dataset', res, 'text/plain');
    return;
  }

  poke = postData(poke, body);

  data[poke.id - 1] = poke;
  sendResponseData(204, 'Pokemon updated', res, 'text/plain');
};

// This causes data to be out of order, but should still work the same
const addData = (req, res) => {
  let newPoke = {};
  newPoke.id = data[data.length - 1].id + 1;
  newPoke.num = newPoke.id.toString();

  const { body } = req;

  if (body.name) {
    newPoke.name = body.name;
  }

  newPoke = postData(newPoke, body);

  data.push(newPoke);

  sendResponseData(201, 'Pokemon added', res, 'text/plain');
};

const getIndex = (req, res) => {
  sendResponseData(200, index, res, 'text/html');
};

const getDocumentation = (req, res) => {
  sendResponseData(200, documentation, res, 'text/html');
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
  getDocumentation,
  getStyle,
  getCode,
  searchName,
  searchType,
  searchEffective,
  getAll,
  addData,
  editData,
  notFound,
};
