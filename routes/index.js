var express = require('express');
var router = express.Router();
var accountService = require("../services/account");
var userService = require("../services/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home',{layout:'second'});
});

router.get('/login', (req, res) => {
  res.render('login',{layout:'second'});
});

router.get('/register', (req, res) => {
  res.render('register',{layout:'second'});
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  accountService.auth(email, password)
    .then(user => {
      if( !user) {
        res.render('login', {layout:'second', error: "email y/o contrasena incorrectos!", email});
      }
      if (user) {
        req.session.userId = user.id;
        req.session.rol = ['jefe-exhibicion']; //viene de la DB @profe
        res.redirect('/');
        //decidir como asignar roles, @profe
      }
    });
});

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  userService.createUser(email, password )
  .then(() => {
    res.render("info", {layout:'second',exito:true, mensaje:"Usuario creado exitosamente!"});
  })
  .catch( (e) => {
    res.render("info", {layout:'second',exito:false, mensaje: `Usuario no pudo ser creado: ${e}`})
  });
  //@TODO redireccionar a una pagina de no pudo ser creado o algo asi
});

module.exports = router;
