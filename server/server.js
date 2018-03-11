const path    = require('path'),
			express = require('express');

const publicPath = path.join(__dirname, '../public');

let app = express();

app.use(express.static(publicPath));

app.listen(3000, () => {
	console.log('Now listening on port 3000');
});