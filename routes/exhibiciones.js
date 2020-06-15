const express = require("express")
const router = express.Router()
const permisos = require("../middlewares/permisos")
const exhibicionService = require("../services/exhibicion")
const fosilService = require("../services/fosil")
const pedidoService = require("../services/pedidos")
/**@TODO cambiar esto moverlo al service */
const models = require('../models')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get("/", paginate, async (req, res) => {
  const { page, limit } = req.query
  try {
    const { rows, count } = await exhibicionService.getExhibiciones(page, limit)
    const pagination = {
      ...generatePagination('exhibiciones', count, page, limit)
  }
    res.status(200).send({ count, rows, pagination })
  } catch (error) {
    res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de exhibiciones'}, null, 4))
  }
})

router.get("/detalle/:id", async (req,res)=>{
  const {id} = req.params
  try {
    const exhibicion =  await exhibicionService.getExhibicion(id)
    const fosiles = await exhibicion.getFosils()
    const replicas = await exhibicion.getReplicas({include:[models.Hueso, models.Pedido]})
    /**@TODO esto tambien moverlo al service, aplica para otras cosas donde sea similar, usar mas objetos */
    res.render("exhibiciones/detalle", {exhibicion, fosiles, replicas})
  } catch (error) {
    console.log(error)   
  }
})

router.get("/agregar", async (req, res) => {
  try {
    const replicas = await pedidoService.getReplicas({ disponible: true })
    const fosiles = await fosilService.getFosiles(null,null,{ disponible: true })
    res.render("exhibiciones/agregar", { replicas, fosiles:fosiles.rows,req })
  } catch (error) {
    console.log(error)
  }
})

router.get("/editar/:id", async (req, res) => {
  const { id } = req.params
  const replicas = await pedidoService.getReplicas({ disponible: true })
  const replicas_propias = await exhibicionService.getReplicas(id)
  const fosiles= await fosilService.getFosiles({ disponible: true })
  const fosiles_propios = await exhibicionService.getFosiles(id)
  
  exhibicionService.getExhibicion(id).then(exh => {
    /** @TODO poner los fosiles/replicas ya usados tildados */
    res.render("exhibiciones/editar", { exh,req, fosiles, replicas, fosiles_propios, replicas_propias })
  })
})

router.get("/eliminar/:id", (req, res) => {
  const { id } = req.params
  exhibicionService.getExhibicion(id).then(exh => {
    res.render("exhibiciones/eliminar", { exh, id,req })
  })
})

router.post("/", (req, res) => {
  const {nombre, tematica, duracion, fosiles, replicas} = req.body
  exhibicionService.createExhibicion(nombre,tematica,duracion,fosiles,replicas)
  .then(exhibicion=>{
    res.redirect('/exhibiciones')
  })
  .catch(exhibicion=>{
    res.render('exhibiciones/agregar', {errores:exhibicion, nombre, tematica, duracion,req})
  })
})

router.put("/", async (req,res)=>{
  const {id, nombre, tematica, duracion, fosiles, replicas} = req.body
  try {
    await exhibicionService.updateExhibicion(id, nombre, tematica, duracion, fosiles, replicas)    
    res.redirect('/exhibiciones')
  } catch (error) {
    res.render('exhibiciones/editar')
  }
})

router.delete("/", async (req,res)=>{
  const { id } = req.body 
  try {
    await exhibicionService.deleteExhibicion(id)
    /* @TODO poner en disponibles todas las exhibiciones */
    res.redirect('/exhibiciones')
  } catch (errores) {
    res.render('exhibiciones/eliminar', errores)
  }
})

module.exports = router
