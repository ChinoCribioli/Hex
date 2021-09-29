var http = require('http');
var fs = require('fs');
var url = require('url');
var turn = true;
var board_size = 8;
var express = require('express');
var app = express();
var path = require('path');
//var formidable = require('formidable');

http.createServer(function (req, res) {
  //console.log(req);
  var direc = url.parse(req.url,true);

  app.use(express.static(path.join(__dirname, 'public')));

  fs.readFile('Hex.html', function (err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
    //return res.end(data);
  });

  let cher = require('cheerio').load("Hex.html"); 

  if(turn){
    cher('#4CAF50').replaceWith('red')
  }
  else{
    cher('#4CAF50').replaceWith('blue')
  }

  

  
//   //esto para los nuevos nodos
//   if(direc.pathname == '/nuevo_nodo'){
//     fs.readFile('nuevo_nodo.html', function (err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       return res.end(data);
//     });
//   }
//   if(direc.pathname == '/nuevoNodo/update'){
//     fs.appendFile('./base de datos/nodos.txt',direc.query.artista.toLowerCase().split(' ') + ' ' + direc.query.pais.toLowerCase().split(' ') + '\n',function (err) {
//       if (err) throw err;
//       console.log('Saved ' + direc.query.artista + '!');
//     });
//     res.writeHead(200,{'Content-Type': 'text/html'});
//     return res.end(direc.query.artista + ' guardado!');;
//   }

//   //esto para las nuevas aristas
//   if(direc.pathname == '/nueva_arista'){
//     fs.readFile('nueva_arista.html', function (err, data) {
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       return res.end(data);
//     });
//   }
//   if(direc.pathname == '/nuevaArista/update'){
//     fs.appendFile('./base de datos/aristas.txt',direc.query.nodo_1.toLowerCase().split(' ') + ' ' + direc.query.nodo_2.toLowerCase().split(' ') + ' ' + direc.query.cancion.toLowerCase().split(' ') + '\n',function (err) {
//       if (err) throw err;
//       console.log('Saved ' + direc.query.cancion + '!');
//     });
//     res.writeHead(200,{'Content-Type': 'text/html'});
//     return res.end(direc.query.cancion + ' guardado!');;
//   }

//   //esto sino
//   fs.readFile('Prueba.html', function (err, data) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     return res.end(data);
//   });



}).listen(8080);
