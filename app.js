//const { next } = require('cheerio/lib/api/traversing');
var express = require('express');
var app = express();
var path = require('path');

//const cher = require('cheerio').load(views/Hex.html); 
var turn = true;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.engine('.html', require('ejs').renderFile);

var updateColor = function(req,res,next){
  var style = ".WhiteButton:hover {" + "\n" + "background-color: ";
  if(turn){
    style += "red;\n}";
  }
  else{
    style += "blue;\n}";
  }
  //document.getElementById("change-color").innetHTML = style;
  turn = !turn;
  next();
};

app.use(updateColor);

app.get('/', function(req, res) {
  //res.render('header.html');
  res.render('Hex.html');
  // c=`<!DOCTYPE html>
  // <html>
  //   <head>
  //     <link rel="stylesheet" type="text/css" href="Hex.css" >
  //     <script type="text/javascript" src="Hex.js"></script>
  //     <script>
        
  //     </script>
  //     <style id="change-color">
  //       .WhiteButton:hover {
  //         background-color: #4CAF50;
  //       }
  //     </style>
  
  //   </head>
  
  //   <body>
  //     Luigi puto
  //     <button class="WhiteButton" onclick="test(132)"></button>
  //       <button class="BlueButton" onclick=""></button>
  //       <button class="RedButton" onclick=""></button>		
      
  //     <p id='pagina'></p>
  //     </body>
  // </html>	`;
  // res.send(c);
  // res.render('footer.html');
});

app.listen(3000, function(){
    console.log("listening to 3000");
})
