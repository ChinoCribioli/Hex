var express = require('express');
var app = express();
var path = require('path');
const { execSync } = require('child_process');

var turn = true;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.engine('.html', require('ejs').renderFile);

app.get('/', function(req, res) {
  res.render('Hex.html');
 
});

app.get('/algo/:movs', function(req, res) {
  //comment these lines depending on if you want to run python code or c++ code:
  var stdout = execSync("./a.out web", {input: req.params['movs']});
  // var stdout = execSync("pypy3 Hex.py", {input: req.params['movs']});
  res.set("text/plain").send(stdout);
});

app.listen(3000, function(){
    console.log("listening to 3000");
})
