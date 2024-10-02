const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const data = fs.readFileSync(`./pokedex.json`);

module.exports = {


}