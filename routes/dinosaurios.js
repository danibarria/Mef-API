/**
 * hacer el all()
 * 
 */

const express = require('express');
const router = express.Router();
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

router.get('/', (req, res, next) => {
  dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurios/dinosaurio', {
        results
      });
    });
});

router.get('/agregar', (req,res,next) => {
  subclaseService.getSubclases()
  .then((subclases)=>{
    res.render('dinosaurios/agregar',{
      subclases
    })
  });


});

router.get('/editar', async (req,res,next) => {
  //ver cuando id no existe
  const dino = await dinoService.getDinosaurio(req.query.id);
  subclaseService.getSubclases()
  .then((subclases)=>{
    res.render('dinosaurios/editar', { dino, subclases });    
  }).catch((err)=>{  console.log(err)}); //@TODO mostrar dino sin editar o algo
});

router.get('/eliminar', (req,res,next)=>{
  dinoService.getDinosaurio(req.query.id)
  .then((dino)=> res.render('dinosaurios/eliminar', { dino }))
  .catch((err)=>{console.log(err)}) //@TODO hacer pagina de volver o algo
});

// HUESOS
router.get('/moldes', (req, res) => {
  const { id } = req.query;
  huesoService.getHuesosDino(id)
    .then((huesos)=>{
      res.render("huesos/hueso",{huesos, jefeexhibicion:true});
    });
});

router.patch('/moldes/toggle', (req,res)=>{
  const { id } = req.query
  huesoService.toggleDisponibilidadHueso(id);
  res.send(200);
});

router.all('/', (req, res, next) => {
  const render = (context) => dinoService.getDinosaurios()
    .then((results) => {
      res.render('dinosaurios/dinosaurio', Object.assign(context || {}, {
        results,
        jefeexhibicion:true
      }))
    });
  
  if (req.method == 'POST') {
    const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
    const {cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata} = req.body;
    dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      .then((dinosaurio) => {
        // createHueso(nombre, numero, DinosaurioId){
        huesoService.createHuesos(dinosaurio.id, [cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata]);
        res.redirect('/dinosaurios'); //@TODO agregar mas experiencia
      })
      .catch((errores)=>{
        res.render("dinosaurios/agregar",{errores})
      });
});

router.put('/', (req,res,next)=>{
    dinoService.updateDinosaurio(req.body)
      .then(() => res.redirect('/dinosaurios'));
});

router.delete('/' , (req,res,next) =>{
  dinoService.deleteDinosaurio(req.body.id)
    .then(() => res.redirect('/dinosaurios'));
});



module.exports = router;
