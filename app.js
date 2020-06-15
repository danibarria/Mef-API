var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var bodyParser = require('body-parser')
var session = require('express-session')
var database = require('./models')

//rutas
var dinosauriosRouter = require('./routes/dinosaurios')
var fosilesRouter = require('./routes/fosiles')
var subclaseRouter = require('./routes/subclases')
var pedidosRouter = require('./routes/pedidos')
var clientesRouter = require('./routes/clientes')
var empleadosRouter = require('./routes/empleados')
var guiasRouter = require('./routes/guias')
var visitasRouter = require('./routes/visitas')
var exhibicionesRouter = require('./routes/exhibiciones')
var replicasRouter = require('./routes/replicas')

var app = express()

app.use(logger('dev'))
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

app.use('/dinosaurios', dinosauriosRouter)
app.use('/fosiles', fosilesRouter)
app.use('/subclases', subclaseRouter)
app.use('/clientes', clientesRouter)
app.use('/empleados', empleadosRouter)
app.use('/guias', guiasRouter)
app.use('/pedidos', pedidosRouter)
app.use('/visitas', visitasRouter)
app.use('/exhibiciones', exhibicionesRouter)
app.use('/replicas', replicasRouter)


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
