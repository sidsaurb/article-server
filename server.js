
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require("mysql");
var gcm = require('android-gcm');
var gcmObject = new gcm.AndroidGcm('AIzaSyBanjYS6YkBTy066-dLFmhk98dDZ_jwVPQ');
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
	//console.log("Connection established");
});


app.post('/publisher/do_login', function (req, res) {
	queryArgs = [req.body.email, req.body.password];
	query = 'SELECT id, name from publishers where email = ? and password = MD5(?)'
	con.query(query, queryArgs, function (err, rows) {
		if (err || rows.length == 0) {
			res.end(JSON.stringify(errorResponse));
		} else {
			response = {
				success : true,
				id : rows[0].id,
				name : rows[0].name
			}
			res.end(JSON.stringify(response));
		}
	})
})

app.post('/subscriber/do_login', function (req, res) {
	queryArgs = [req.body.email, req.body.password];
	query = 'SELECT id, name from subscribers where email = ? and password = MD5(?)'
	con.query(query, queryArgs, function (err, rows) {
		if (err || rows.length == 0) {
			res.end(JSON.stringify(errorResponse));
		} else {
			response = {
				success : true,
				id : rows[0].id,
				name : rows[0].name
			}
			res.end(JSON.stringify(response));
		}
	})
})

app.get('/get_categories', function (req, res) {
	con.query('SELECT * from categories', function (err, rows) {
		if (err) {
			console.log(err);
			res.end(JSON.stringify(errorResponse));
		}
		response = {
			success : true,
			data : rows
		}
		res.end(JSON.stringify(response));
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
				success : true,
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
				success : true,
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
				success : true,
				id : result.insertId
			}
			res.end(JSON.stringify(response));
			sendPushNotifications(result.insertId, req.body.publisher, req.body.title, req.body.category, req.body.timestamp);
		}
	})
})

function sendPushNotifications(articleId, publisherId, title, category, timestamp){
	data = {
		id : articleId,
		title : title,
		category : category,
		timestamp : timestamp
	}
	query = 'SELECT name, email from publishers where id = ' + publisherId;
	con.query(query, function(e1, r1) { 
		if (!e1) {
			data['name'] = r1[0].name;
			data['email'] = r1[0].email;
			query1 = 'SELECT subscriber from subscriptions where category = ' + category;
			con.query(query1, function (e2, r2) {
				if (!e2) {
					console.log(r2);
					var set = "(";
					var arrayLength = r2.length;
					for (var i = 0; i < arrayLength; i++) {
						if (i == arrayLength - 1){
							set = set + r2[i].subscriber;
						}
						else {
							set = set + r[i].subscriber + ",";
						}
					}
					set = set + ")";
					query2 = 'SELECT regid from subscribers where id IN ' + set;
					con.query(query2, function (e3, r3) {
						if(!e3) {
							regids = [];
							for (var j = 0; j < r3.length; j++) {
								regids[j] = r3[j].regid;
							}
							var message = new gcm.Message({
								registration_ids : regids,
								data : data
							})
							//gcmObject.send(message, function (e4, r4) {
							//	if (e4) {
							//		console.log(e4)
							//	}
							//})
							console.log(message);
						}
					})
				}
			})
		}
	})	
}

app.post('/subscriber/get_articles', function (req, res) {
	queryArgs = [req.body.id];
	con.query('SELECT category from subscriptions where subscriber = ?', queryArgs, function (e, r) {
		if (e) {
			res.end(JSON.stringify(errorResponse));
		}
		else {
			//result = JSON.stringify(r);
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
			query = 'SELECT id, category, publisher, title, timestamp from articles where category IN' + set;
			con.query(query, function (e1, r1) {
				if (e1) {
					//console.log(e1);
					res.end(JSON.stringify(errorResponse));
				}
				else {
					var size = r1.length;
					var size1 = r1.length;
					for (var i = 0; i < size; i++) {
						(function (idx){
							query1 = 'SELECT name, email from publishers where id = ' + r1[idx].publisher;
							con.query(query1, function (e2, r2) {
								if (e2) {
									r1[idx]['name'] = 'Not Available';
									r1[idx]['email'] = 'Not Available';
								} else {
									r1[idx]['name'] = r2[0].name;
									r1[idx]['email'] = r2[0].email;
								}
								size1 = size1 - 1;
								if (size1 <= 0){
									response = {
										success : true,
										data : r1
									}
									res.end(JSON.stringify(response));
								}
							})

						})(i)
					}
				}
			})
		}
	})
	
})

app.post('/publisher/get_articles', function (req, res) {
	queryArgs = [req.body.id];
	query = 'SELECT id, category, title, timestamp from articles where publisher = ?';
	con.query(query, queryArgs, function (err, rows) {
		if (err) {
			res.end(JSON.stringify(errorResponse));
		}
		else {
			response = {
				success : true,
				data : rows
			}
			res.end(JSON.stringify(response));
		}
	})

})

app.post('/subscriber/get_subscriptions', function (req, res) {
	queryArgs = [req.body.id];
	query = 'SELECT category from subscriptions where subscriber = ?';
	con.query(query, queryArgs, function (err, rows) {
		if (err) {
			res.end(JSON.stringify(errorResponse));
		}
		else {	
			var subs = [];
			for (var i = 0; i < rows.length; i++) {
				subs[i] = rows[i].category;
			}
			result = {
				success : true,
				data : subs
			}
			res.end(JSON.stringify(result));
		}
	})
})

app.post('/get_article_content', function (req, res) {
	queryArgs = [req.body.id];
	query = 'SELECT content from articles where id = ?';
	con.query(query, queryArgs, function (err, rows){
		if (err || rows.length == 0) {
			res.end(JSON.stringify(errorResponse));
		}
		else {
			response = {
				success : true,
				data : rows[0].content
			}
			res.end(JSON.stringify(response));
		}
	})
})

var server = app.listen(8081, function () {
  	var host = server.address().address
  	var port = server.address().port
  	console.log("App listening at http://%s:%s", host, port)
})



