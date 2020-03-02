const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const express = require('express');
//const socketio = require('socket.io');
//const http = require('http');
const bodyParser = require('body-parser');
const app = express();
//const server = http.createServer(app);
//const io = socketio(server);
const PORT = process.env.PORT || 3000;
var cors = require('cors');

mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(db => console.log('DB esta Conectado'))
  .catch(error => console.log(error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


/************************************************/

var MUsers = mongoose.Schema({
  url: String,
  nombre: String,
  imagen:String,
  sala: [{type: Schema.ObjectId, ref: 'Sala' }],
});
const Users = mongoose.model('Users', MUsers);

var MSala = mongoose.Schema({
  alias:String,
  mensaje:[{type: Schema.ObjectId, ref: 'Mensaje' }]
});
const Sala = mongoose.model('Sala', MSala);

var MMensaje = mongoose.Schema({
  usuario: {type: Schema.ObjectId, ref: 'Users' },
  fecha:{ type: Date, default: Date.now },
  visto:{ type:Boolean, default:false}
});
const Mensaje = mongoose.model('Mensaje', MMensaje);

/************************************************/


app.get('/users', async function (request, response) {
  var lusers = await Users.find().populate("sala");
  response.send(lusers);
});

app.post('/users', async function (request, response) {
  var user = await Users.create({...request.body});
  response.send(user);
});

app.put('/users', async function (request, response) {
  var user = await Users.findByIdAndUpdate(request.body._id,{...request.body});
  response.send(user);
});

/**************************************************/

app.post('/salas', async function (request, response) {
  var sala = await Sala.create({...request.body});
  response.send(sala);
});

app.put('/salas', async function (request, response) {
  var user = await Users.findById(request.body._id);
  user.sala.push(request.body.sala);
  await Users.findByIdAndUpdate(request.body._id,user);
  return response.send(user.sala);
});

app.get('/salas', async function (request, response) {
  var salas = await Sala.findById(request.body._id).populate("mensaje");
  response.send({salas});
});

/*************************************************/



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})