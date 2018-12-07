const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  console.log(req.query.please);
  const hey = { msg: 'hello!', from: 'fam' };

  // res.send('Hey! It works!');
  res.render('<h1>hello</h1>');
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
