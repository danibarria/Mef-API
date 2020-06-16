var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cors = require('cors')
var bodyParser = require('body-parser')
var session = require('express-session')
var database = require('./models')

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(bodyParser.json())

var SequelizeStore = require('connect-session-sequelize')(session.Store)

app.use(session({
  store: new SequelizeStore({
    db: database.sequelize
  }),
  name: 'sid',
  saveUninitialized:false,
  resave:false,
  secret: 'ssh!qiert,it\'asecret!',
  cookie: {
    maxAge:1000*60*60*3, //3 horas
    sameSite: true,
    secure: process.env.NODE_ENV === 'production'
  }
  })
)

//rutas
app.use('/dinosaurios', require('./routes/dinosaurios'))
app.use('/fosiles', require('./routes/fosiles'))
app.use('/subclases', require('./routes/subclases'))
app.use('/clientes', require('./routes/clientes'))
app.use('/empleados', require('./routes/empleados'))
app.use('/pedidos', require('./routes/pedidos'))
app.use('/guias', require('./routes/guias'))
app.use('/visitas', require('./routes/visitas'))
app.use('/exhibiciones', require('./routes/exhibiciones'))
app.use('/replicas', require('./routes/replicas'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error',{req})
})

app.sequelizeSessionStore = SequelizeStore
module.exports = app
