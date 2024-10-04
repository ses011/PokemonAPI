const http = require('http');

const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
	'/': responses.getIndex,
	'': responses.getIndex,
	index: responses.getIndex,
	'/style.css': responses.getStyle,
	'/client.js': responses.getCode,
};  

const onRequest = (request, response) => {
	console.log(request.url);

	const protocol = request.connection.encrypted ? 'https' : 'http';
  	const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
	request.query = Object.fromEntries(parsedUrl.searchParams);

	if (urlStruct[parsedUrl.pathname]) {
		urlStruct[parsedUrl.pathname](request, response);
	  } else {
		responses.notFound(request, response);
	  }
}

http.createServer(onRequest).listen(port, () => {
	console.log(`Listening on port 127.0.0.1:${port}`);
});