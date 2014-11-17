var mysql = require('mysql');

// Pool of connection of mysql database
var connectionpool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : 'ROOT',
	database : 'userPolicy'
});

exports.login = function(req, res){
	var user = req.param("username");
	var pass = req.param("password");

	// Verify if the user exist in database
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ',err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		} 
		else {
			var query = "SELECT u.userName as userName, u.password as password, r.name as roleName FROM User as u, Role as r WHERE u.roleId = r.roleId AND userName = '"+ user +"' AND password = '" + pass + "' LIMIT 1";
		
			connection.query(query, req.params.id, function(err, rows, fields) {
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
								
				connection.release();
				
				if(rows.length > 0)
				{
					req.session.auth = true;
					req.session.usr = rows[0];
					
					var data = {
						title: 'Index',
						layoutFile: 'layout.ejs',
						error: '',
						userName: req.session.usr.userName
					};

					if(req.session.usr.roleName == 'Admin'){
						data.layoutFile = '\\BO\\layoutBo.ejs';
						res.render('\\BO\\indexBo.ejs', data);
					}
					else{
						data.layoutFile = '\\FO\\layoutFo.ejs';
						res.render('\\FO\\indexFo.ejs', data);
					}
				}
				else
				{
					var data = {
						title: 'Sign in',
						layoutFile: 'layout.ejs',
						error: 'bad login or bad password !',
						userName: ''
					};
					
					res.render('login.ejs', data);
				}
			});
		}
	});
};


exports.signUpForm = function(req, res){
	var data = {
		title: 'Sign up',
		layoutFile: 'layout.ejs',
		error: '',
		userName: ''
	};
	
	res.render('signUp.ejs', data);
};

exports.signUp = function(req, res){
	var data = {
		title: 'Sign up',
		layoutFile: 'layout.ejs',
		error: '',
		userName: ''
	};

	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var username = req.param("username");
	var email = req.param("email");
	var password = req.param("password");

	if(firstName == '' || lastName == '' || username == ''
		|| email == '' || password == '')
	{
		data.error = 'All fields are mandatory !';
		res.render('signUp.ejs', data);
	}
	else
	{
		// Verify if the user exist in database
		connectionpool.getConnection(function(err, connection) {
			if (err) {
				console.error('CONNECTION error: ',err);
				res.statusCode = 503;
				res.send({
					result: 'error',
					err: err.code
				});
			} 

			connection.release();
						
			var newUsr  = {firstName: firstName, lastName: lastName, username: username, 
			email : email, password : password, createDate: new Date(), roleId: 2};
		
			connection.query('INSERT INTO user SET ?', newUsr, function(err, result) {
			  	if (err) throw err;
	  			console.log(result.insertId);
			});

			req.session.auth = true;
			req.session.usr = newUsr;
			
			data.title = 'Index';
			data.userName = req.session.usr.userName;

			if(req.session.usr.roleName === 'Admin'){
				data.layoutFile = '\\BO\\layoutBo.ejs';
				res.render('\\BO\\indexBo.ejs', data);
			}
			else
				data.layoutFile = '\\FO\\layoutFo.ejs';
				res.render('\\FO\\indexFo.ejs', data);
			
		});
	}
};

exports.logout = function(req, res){
	req.session.auth = null;
	req.session.usr = null;

	var data = {
		title: 'Index',
		layoutFile: 'layout.ejs',
		error: '',
		userName: ''
	};

	res.render('login.ejs', data);
}