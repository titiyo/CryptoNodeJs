var pem = require('pem');
var fs = require('fs');
var path = require('path');
var nodemailer = require("nodemailer");

exports.certificationAuthority = function(req, res){
	var data = {
		title: 'Certification authority',
		layoutFile: '\\BO\\layoutBo.ejs',
		userName: req.session.usr.userName,
		success: '',
		error: ''
	};

	res.render('\\BO\\certificationAuthority.ejs', data);
};

exports.createCA = function(req, res){

	var data = {
		title: 'Certification authority',
		layoutFile: '\\BO\\layoutBo.ejs',
		userName: req.session.usr.userName,
		success: '',
		error: ''
	};

	var encrypt = req.param("encrypt");
	var keyFileName = req.param("keyFileName");
	var bitSize = req.param("bitSize");
	var password = req.param("password");

	var selfSigned = req.param("selfSigned"); 
	var keyFile = req.param("keyFile");
	var lifeDays = req.param("lifeDays");
	var caFileName = req.param("caFileName");

	pem.createPrivateKey(encrypt, "./myCa/" + keyFileName, password, bitSize, function(err, key){
		if(err != null){
			console.log("Create private key EROOR");
			console.log(err);
			data.error = err;
		}
		else {
			if(selfSigned == "on"){
				if(password != '')
					password = "pass:" + password;

				var options = {
					clientKey: "./myCa/" + keyFileName + ".key",
					days: lifeDays,
					serviceKey: "./myCa/" +keyFileName + ".key",
					passin: password,
					out: "./myCa/" + caFileName
				};

				// self signed certificat
				pem.createCertificate(options, function(err,certificate, csr, clientKey, serviceKey){

					if(err){
						console.log(err);
						data.error = err;
					}
					else{
						data.success = "Generating certificat authority with success !";						
					}
					
					res.send(data);
				});
			}			
			else{
				// certificat
				var options = {
					clientKey: "./myCa/" +keyFileName+ ".key",
					days: lifeDays,
					serviceKey: "./myCa/" +keyFile + ".key",
					out: "./myCa/" + caFileName
				};

				// self signed certificat
				pem.createCertificate(options, function(err,certificate, csr, clientKey, serviceKey){

					if(err){
						console.log(err);
						data.error = err;
					}
					else{
						data.success = "Generating certificat authority with success !";						
					}

					res.send(data);
				});
			}
		}
	});
};


exports.certificate = function(req, res){
	var data = {
		title: 'Certificate',
		layoutFile: '\\BO\\layoutBo.ejs',
		userName: req.session.usr.userName
	};

	data.fileNames = fs.readdirSync("./MyCsr");

	res.render('\\BO\\certificate.ejs', data);
};


exports.signCertificate = function(req, res){
	var days = req.param("days");
	var Csr = "./MyCsr/" + req.param("Csr");
	var CName = req.param("CName");
	var password = "pass:" + req.param("password");

	var CA = req.files.CA.path;
	var CAKey = req.files.CAKey.path;

    var options = {
    	days: days,
		passin: password,
		csr: Csr,
		ca: CA,
		caKey: CAKey,
		out: CName
	};

	console.log(CA);
	console.log(CAKey);

	pem.createCertificateByCA(options, function(err,certificate){
		var data = {
			title: 'Index',
			layoutFile: '\\BO\\layoutBo.ejs',
			userName: req.session.usr.userName
		};

		if(err){
			console.log(err);
			data.error = err;
		}
		else{
			data.success = "Sign certificate with success !";	


			var csrFile = fs.readFileSync(Csr);

			pem.readCertificateInfo(csrFile, function(error, data){

                var smtpTransport = nodemailer.createTransport("SMTP",{
				    service: "Gmail",
				    auth: {
				        user: "tiyosyno@gmail.com",
				        pass: "titiyo159753"
				    }
				});			

				var mailOptions = {
				    from: "Tiyo <tiyosyno@gmail.com>", // sender address
				    to: data.emailAddress, // list of receivers
				    subject: "My PKI - Certificate ✔", // Subject line
				    text: "Please check attached file to download your certificate ✔", // plaintext body
				    html: "<b>Please check attached file to download your certificate ✔</b>", // html body
				    attachments: { 
			            fileName: CName + ".crt",
			            streamSource: fs.createReadStream("./MyCertificate/" + CName + ".crt")
			        }
				}	

				smtpTransport.sendMail(mailOptions, function(error, response){
				    if(error){
				        console.log(error);
				    }else{
				        console.log("Message sent: " + response.message);
				    }

				    // if you don't want to use this transport object anymore, uncomment following line
				    smtpTransport.close(); // shut down the connection pool, no more messages
				});

            });
		}
		
		res.render('\\BO\\indexBo.ejs', data);
	});
}

exports.revocation = function(req, res){
	var data = {
		title: 'Revocation',
		layoutFile: '\\BO\\layoutBo.ejs',
		userName: req.session.usr.userName
	};

	res.render('\\BO\\revocation.ejs', data);
};