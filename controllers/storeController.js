exports.myMiddleware = (req, res, next) => {
  req.name = 'Den';
  if (true) {
    throw Error('bad');
  }
  next();
};

exports.homePage = (req, res) => {
  console.log(req.name);
  res.cookie('name', 'lanme', { maxAge: 1000000 });

  res.render('index');
};
