var pem = require('pem');
var fs = require('fs');
var path = require('path');

exports.generateKey = function(req, res){
	var data = {
		title: 'GenerateKey',
		layoutFile: '\\FO\\layoutFo.ejs',
		userName: req.session.usr.userName
	};

	res.render('\\FO\\key.ejs', data);
};

exports.generateCertificate = function(req, res){
	var data = {
		title: 'GenerateCertificate',
		layoutFile: '\\FO\\layoutFo.ejs',
		userName: req.session.usr.userName
	};

	res.render('\\FO\\certificate.ejs', data);
};


exports.createKey = function(req,res){
	var keyFileName = req.param("keyFileName");
	var bitSize = req.param("bitSize");

	pem.createPrivateKey(null, keyFileName, null, bitSize, function(err, key){
		if(err != null){
			console.log("Create private key EROOR");
			console.log(err);
			data.error = err;
		}

		var filePath = keyFileName + ".key";

		if (fs.existsSync(filePath)) {
    		res.download(filePath, filePath, function(err){
    			fs.unlink(filePath, function (err) {
				  if (err) throw err;
				  console.log('successfully deleted ' + filePath);
				});
    		});
		}
		else
		{
			var data = {
				title: 'Index',
				layoutFile: '\\FO\\layoutFo.ejs',
				userName: req.session.usr.userName,
				success: '',
				error: ''
			};
			res.render('\\FO\\indexFo.ejs', data);
		}
	});
};

exports.createCertificateRequest = function(req, res){

	var data = {
		title: 'GenerateCertificate',
		layoutFile: '\\FO\\layoutFo.ejs',
		userName: req.session.usr.userName,
		success: '',
		error: ''
	};
	
	var clientkey = req.files.clientKey.path;//req.param("clientKey");   
	var hashType = req.param("hashType");
	var country = req.param("country");
	var organization = req.param("organization");
	var email = req.param("email");
	var commonname = req.param("commonName");
	var fileName =  "./myCsr/" + req.param("fileName");

	//console.log(fileName);

	var options = {
		clientKey:clientkey,
		hash:hashType,
		country:country,
	    organization:organization,
		emailAddress:email,
		commonName: commonname,
		outCsr: fileName
	};

	pem.createCSR(options, function(err, csr, clientKey){
	
		if(err!=null)
		{
			console.log("ca a foire!");
			console.log(err);
		}
		else
		{
			console.log("Creation de la demande CSR!");
		}
	
		var data = {
			title: 'Index',
			layoutFile: '\\FO\\layoutFo.ejs',
			userName: req.session.usr.userName,
			success: '',
			error: ''
		};
		res.render('\\FO\\indexFo.ejs', data);
	
	});
	
};
	
	
	
	
	
	
	