exports.index = function(req, res){
	var data = {
		title: 'Index',
		layoutFile: 'layout.ejs',
		error: '',
		userName: ''
	};

	if(req.session.usr != null && req.session.usr.roleName === 'Admin') {
		data.userName = req.session.usr.userName;
		data.layoutFile = '\\BO\\layoutBo.ejs';
		res.render('\\BO\\indexBo.ejs', data);
	}
	else if(req.session.usr != null && req.session.usr.roleName === 'Member'){
		data.userName = req.session.usr.userName;
		data.layoutFile = '\\FO\\layoutFo.ejs';
		res.render('\\FO\\indexFo.ejs', data);
	}
	else
		res.render('login.ejs', data);
};
