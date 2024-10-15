const http = require('http');
const query = require('querystring');

const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responses.getIndex,
  '': responses.getIndex,
  index: responses.getIndex,
  '/style.css': responses.getStyle,
  '/client.js': responses.getCode,
  '/search': responses.getData,

};

const parseBody = (req, res, handler) => {
  const body = [];

  req.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const bodyStr = Buffer.concat(body).toString();
    req.body = query.parse(bodyStr);
    handler(req, res);
  });
};

const handlePost = (req, res, url) => {
  if (url.pathname.includes('/addPokemon')) {
    console.log("POST add poke");
    parseBody(req, res, responses.addData);
  } else if (url.pathname.includes('/editPokemon')) {
    parseBody(req, res, responses.editData);
  }
};

const onRequest = (request, response) => {
  console.log(request.url);

  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  request.query = Object.fromEntries(parsedUrl.searchParams);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  }
  else if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    responses.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port 127.0.0.1:${port}`);
});
