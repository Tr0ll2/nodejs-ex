//	OpenShift sample Node application
var express = require('express'),
		app		 = express(),
		morgan	= require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
		ip	 = process.env.IP	 || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
		mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
		mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
	var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
			mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
			mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
			mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
			mongoPassword = process.env[mongoServiceName + '_PASSWORD']
			mongoUser = process.env[mongoServiceName + '_USER'];

	if (mongoHost && mongoPort && mongoDatabase) {
		mongoURLLabel = mongoURL = 'mongodb://';
		if (mongoUser && mongoPassword) {
			mongoURL += mongoUser + ':' + mongoPassword + '@';
		}
		// Provide UI label that excludes user id and pw
		mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
		mongoURL += mongoHost + ':' +	mongoPort + '/' + mongoDatabase;

	}
}
var db = null,
		dbDetails = new Object();

var initDb = function(callback) {
	if (mongoURL == null) return;

	var mongodb = require('mongodb');
	if (mongodb == null) return;

	mongodb.connect(mongoURL, function(err, conn) {
		if (err) {
			callback(err);
			return;
		}

		db = conn;
		dbDetails.databaseName = db.databaseName;
		dbDetails.url = mongoURLLabel;
		dbDetails.type = 'MongoDB';

		console.log('Connected to MongoDB at: %s', mongoURL);
	});
};

var getPixels = require('get-pixels')

app.get('/', function (req, res) {
		res.render('index.html');
});

app.get('/ping', function (req, res) {
		res.send('pong');
});


app.get('/pixelTransfer/', function (req, res) {
	if (!req.params.data) {
		res.send('Query = {"data" = {"url"}}')
	};
});

app.get('/pixelTransfer/data?', function(req, res){
	var url = req.query.url
	if (url) {
		if (url.match(/^(http\:|https\:).+[.](gif|png|jpg|jpeg)$/)) {
			console.log('url is real')
			console.log(url)
			getPixels(url, function(err, pixels) {
				if (err) {
					console.log(err)
					return
				} else {
					var array = [];
					if(pixels.shape.length === 3){
						var width = pixels.shape[0];
						var height = pixels.shape[1];
						for(var y = 0;y < height;y++){
							var row = [];
							for(var x = 0;x < width;x++){
								var r = pixels.get(x,y,0);
								var g = pixels.get(x,y,1);
								var b = pixels.get(x,y,2);
								var a = 127 - (pixels.get(x,y,3)*(127/255));
								var pixel = [r,g,b,a];
								row.push(pixel);
							}
							array.push(row);
						}
					}else{
						var frames = pixels.shape[0];
						var width = pixels.shape[1];
						var height = pixels.shape[2];
						for(var z = 0;z < frames;z++){
							var frame = [];
							for(var y = 0;y < height;y++){
								var row = [];
								for(var x = 0;x < width;x++){
									var r = pixels.get(z,x,y,0);
									var g = pixels.get(z,x,y,1);
									var b = pixels.get(z,x,y,2);
									var a = 127 - (pixels.get(z,x,y,3)*(127/255));
									var pixel = [r,g,b,a];
									row.push(pixel);
								}
								frame.push(row);
							}
							array.push(frame);
						}
					}
					var json = JSON.stringify(array);
					res.send(json);
				}
			});
		} else {
			console.log('url is fake');
			console.log(url);
			res.send('Url is considered to be fake.');
		}
	} else {
		res.send('No url received.')
	};
});

// error handling
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send('Something bad happened!');
});

initDb(function(err){
	console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
