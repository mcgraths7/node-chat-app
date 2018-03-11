const path    = require('path'),
			express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});