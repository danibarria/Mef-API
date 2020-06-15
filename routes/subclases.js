const express = require('express')
const router = express.Router()
const subclaseService = require('../services/subclase.js')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get('/', paginate, async (req, res) => {
  const { page, limit } = req.query
  try {
    const { rows, count } = await subclaseService.getSubclases(page, limit)
    const pagination = {
      ...generatePagination('subclases', subclases.count, page, limit)
    }
    res.status(200).send({ count, rows, pagination })
  } catch (error) {
    res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de clientes'}, null, 4))
  }
})

router.get('/api', async (req, res) => {
  const subclases = await subclaseService.getSubclases()
  const json = JSON.stringify(result = subclases, null, 4)
  res.send(json)
})

router.get('/agregar', async (req, res) => { // esto llama solo a la vista
  res.render('subclases/agregar', { req })
})

router.get('/editar/:id', async (req, res) => {
  const { id } = req.params
  const subclase = await subclaseService.getSubclase(id)
  res.render('subclases/editar', { subclase, req })
})

router.get('/eliminar/:id', async (req, res) => {
  const { id } = req.params
  const subclase = await subclaseService.getSubclase(id)
  res.render('subclases/eliminar', { subclase, req })
})

router.post('/', async (req, res) => {
  try {
    const { descripcion, clase } = req.body
    const subclase = await subclaseService.createSubclase(descripcion, clase)
    res.redirect('/subclases')
  } catch (error) {
    const subclase = req.body
    res.render('subclases/agregar', { errores, subclase, req })  
  }
})

router.put('/', async (req, res) => {
  const subclase = req.body
  try {
    await subclaseService.updateSubclase(subclase)
    res.redirect('/subclases')
  } catch (error) {
    res.render('subclases/editar', { errores, subclase, req })
  }
})

router.delete('/', async (req, res) => {
  const { id } = req.body
  try {
    await subclaseService.deleteSubclase(id)
  } catch (errores) {
    const subclase = await subclaseService.getSubclase(id)
    return res.render('subclases/eliminar', { errores, subclase, req })
  }
  return res.redirect('/subclases')
})


module.exports = router