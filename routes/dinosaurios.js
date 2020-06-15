const express = require('express');
const router = express.Router();
const permisos = require('../middlewares/permisos');
const dinoService = require('../services/dinosaurio');
const huesoService = require('../services/hueso');
const subclaseService = require('../services/subclase');

const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', 
  paginate,
  async (req, res) => {
    const { page, limit } = req.query
    try {
      const { rows, count } = await dinoService.getDinosaurios(page, limit)
      const pagination = {
        ...generatePagination('dinosaurios', count, page, limit)
      }
      
      res.status(200).send({ count, rows, pagination })
    } catch (error) {
      res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de dinosaurios'}))
    }
  })
  
/** HUESOS  */


router.patch('/moldes/toggle', async (req, res)=>{ /// esto NO PUEDE SER ACCEDIDO por bones
    try {
      const { id } = req.query
      huesoService.toggleDisponibilidadHueso(id);
      res.send(200);
    } catch (error) {
      console.log(error)
    }
});

router.post('/', async (req, res) =>{ // esto llama a dino service
    const {nombre, alimentacion, periodo, descubrimiento, idsubclase} = req.body;
    const {cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata} = req.body;
    
    try {
      const dinosaurio = await dinoService.createDinosaurio(nombre, alimentacion, periodo, descubrimiento, idsubclase) // es una promesa
      await huesoService.createHuesos(dinosaurio.id, [cant_cervicales,cant_dorsales,cant_sacras,cant_caudales,cant_cos_cervicales,cant_cos_dorsales,cant_hemales,cant_metacarpianos,cant_metatarsos,cant_dedos_mano,cant_dedos_pata]);
      res.redirect('/dinosaurios')
    } catch (error) {
      const dino = req.body;
      const subclases = await subclaseService.getSubclases()
      // res.render("dinosaurios/agregar",{errores:error,dino,subclases,req})
    }

});

router.put('/', async (req, res)=>{
    try {
      await dinoService.updateDinosaurio(req.body)
      res.redirect('/dinosaurios')     
    } catch (error) {
      const dino = req.body;
      const subclases = await subclaseService.getSubclases()
      // res.render("dinosaurios/editar",{errores,dino,subclases,req})
    }
});

router.delete('/', async (req, res) =>{
    const { id } = req.body;
    try {
      await dinoService.deleteDinosaurio(id)           
    } catch (errores) {
      const dino = await dinoService.getDinosaurio(id);
      // return res.render('dinosaurios/eliminar', {errores, dino, req})          
    } 
    return res.redirect('/dinosaurios')
});

module.exports = router;
