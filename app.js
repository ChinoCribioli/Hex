//const { next } = require('cheerio/lib/api/traversing');
var express = require('express');
var app = express();
var path = require('path');
const { execSync } = require('child_process');

//const cher = require('cheerio').load(views/Hex.html); 
var turn = true;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.engine('.html', require('ejs').renderFile);

app.get('/', function(req, res) {
  res.render('Hex.html');
 
});

app.get('/algo/:movs', function(req, res) {
  var stdout = execSync("pypy3 Hex.py", {input: req.params['movs']});
  res.set("text/plain").send(stdout);
  // res.set("text/plain").send(stdout);//esto es el output de python
});

app.listen(3000, function(){
    console.log("listening to 3000");
})
