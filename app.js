var express = require('express');
var engine = require('ejs-locals');
var path = require('path');

var app = express();

// Configure express
app.set('views', __dirname + '/views');
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.cookieParser('feoifjoizjfoi'));
app.use(express.session());

// Restriction middleware 
function restrict(req, res, next) {
	if(!req.session.auth)
	{	
		var data = {
			title: 'Sign in',
			layoutFile: 'layout.ejs',
			error: '',
			userName: ''
		};
		
		res.render('login.ejs', data);
	}
	else next();
}

// Routes
var index = require('./controllers/index.js');
var login = require('./controllers/login.js');
var certificate = require('./controllers/certificateBo.js');

var key = require('./controllers/keyFO.js');

// index
app.get('/', index.index);
app.get('/index', index.index);
app.post('/login', login.login);
app.get('/signUpForm', login.signUpForm);
app.post('/signUp', login.signUp);
app.get('/logout', login.logout);

// BO
app.get('/certificationAuthority', restrict, certificate.certificationAuthority);
app.post('/createCA', restrict, certificate.createCA);
app.get('/certificate', restrict, certificate.certificate);
app.get('/revocation', restrict, certificate.revocation);
app.post('/SignCertificate', restrict, certificate.signCertificate)

//FO
app.get('/getkey', restrict, key.generateKey);
app.get('/getcertificate', restrict, key.generateCertificate);
app.post('/createCertificateRequest', restrict, key.createCertificateRequest);
app.post('/createKey',restrict, key.createKey);

// Start serveur
app.listen(8989);
console.log("Server listent on port : 8989");