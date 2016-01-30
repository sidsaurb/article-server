var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "wdinlm",
	database: "article"
});

errorResponse = {
	success : false
};

successResponse = {
	success : true
};

con.connect( function (err) {
	if (err) {
		console.log("Error connecting to db");
		return;
	}
	console.log("Connection established");
});


app.get('/get_categories', function (req, res) {
	con.query('SELECT * from categories', function (err, rows) {
		if (err) {
			console.log(err);
			res.end(JSON.stringify(errorResponse));
		}
		console.log(rows);
		res.end(JSON.stringify(rows));
	})
})

app.post('/publisher/add_publisher', function (req, res) {
	publisher = {
		name : req.body.name,
		email : req.body.email,
		password : req.body.password
	}
	con.query('INSERT INTO publishers SET ?', publisher, function (err, result) {
		if (err) {
			res.end(JSON.stringify(errorResponse));
		} 
		else {
			response = {
				id : result.insertId
			}
			res.end(JSON.stringify(response));
		}
	})
})

app.post('/subscriber/add_subscriber', function (req, res) {
	subscriber = {
		name : req.body.name,
		email : req.body.email,
		password : req.body.password,
		regid: req.body.regid
	}
	con.query('INSERT INTO subscribers SET ?', subscriber, function (err, result) {
		if (err) {
			res.end(JSON.stringify(errorResponse));
		}
		else { 
			response = {
				id : result.insertId
			}
			res.end(JSON.stringify(response));
		}
	})
})

app.post('/subscriber/add_subscription', function (req, res){
	var arrayLength = req.body.categories.length;
	for (var i = 0; i < arrayLength; i++) {
		subscription = {
			subscriber : req.body.id,
			category : req.body.categories[i]
		}
		con.query('INSERT IGNORE INTO subscriptions SET ?', subscription, function (s,e) {});
	}
	res.end(JSON.stringify(successResponse));
})

app.post('/publisher/post_article', function (req, res) {
	article = {
		publisher : req.body.publisher,
		category : req.body.category,
		title : req.body.title,
		content : req.body.content,
		timestamp : req.body.timestamp
	}	
	con.query('INSERT INTO articles SET ?', article, function (err, result) {
		if (err) {
			res.end(JSON.stringify(errorResponse));
		}
		else { 
			response = {
				id : result.insertId
			}
			res.end(JSON.stringify(response));
		}
	})
})

app.post('/subscriber/get_articles', function (req, res) {
	queryArgs = [req.body.id];
	con.query('SELECT category from subscriptions where subscriber = ?', queryArgs, function (e, r) {
		if (e) {
			//console.log(e);
			res.end(JSON.stringify(errorResponse));
		}
		else {
			//console.log(r);
			result = JSON.stringify(r);
			var set = "(";
			var arrayLength = r.length;
			for (var i = 0; i < arrayLength; i++) {
				if (i == arrayLength - 1){
					set = set + r[i].category;
				}
				else {
					set = set + r[i].category + ",";
				}
			}
			set = set + ")";
			//console.log(set);
			con.query('SELECT * from articles where category IN ' + set, function (e1, r1) {
				if (e1) {
					//console.log(e1);
					res.end(JSON.stringify(errorResponse));
				}
				else {
					res.end(JSON.stringify(r1));
				}
			})
		}
	})
	
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})





