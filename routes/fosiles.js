const express = require("express")
const permisos = require('../middlewares/permisos')
const router = express.Router()

const dinoService = require("../services/dinosaurio")
const fosilService = require("../services/fosil")
const huesoService = require("../services/hueso")
const bones = [
  "Craneo",
  "Mandibula",
  "Paladar",
  "Vertebras Cervicales",
  "Costillas Cervicales",
  "Vertebras Dorsales",
  "Costillas Dorsales",
  "Escapula",
  "Humero",
  "Radio",
  "Unla",
  "Manos",
  "Pies",
  "Pelvis",
  "Vertebras Sacras",
  "Vertebras Caudales",
  "Hemales"
]
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get("/", paginate, async (req, res) => {
  const { page, limit } = req.query
  try {
    const { rows, count }  = await fosilService.getFosiles(page, limit)
    const pagination = {
      ...generatePagination('fosiles', count, page, limit)
    }
    
    res.status(200).send({ count, rows, pagination })
  } catch (error) {
    res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de fosiles'}, null, 4))
  }
})

router.get("/agregar",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  (req, res) => {
    dinoService.getDinosaurios().then(results => {
      res.render("fosiles/agregar", { results:results.rows, bones ,req })
    })
  })

router.get("/editar/:id",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  async (req, res) => {
    const { id } = req.params
    const fosil = await fosilService.getFosil(id)
    const dinosaurio = fosil.Dinosaurio
    res.render("fosiles/editar", { dinosaurio, bones, fosil,req })
  })

router.get("/eliminar/:id",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  (req, res) => {
    const { id } = req.params
    fosilService
      .getFosil(id)
      .then(fosil => res.render("fosiles/eliminar", { fosil,req }))
      .catch(err => {
      })
  })

router.delete("/",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  (req, res) => {
    fosilService.deleteFosil(req.body.id).then(() => res.redirect("/fosiles"))
  })

router.put("/",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  (req, res) => {
    fosilService.updateFosil(req.body).then(() => res.redirect("/fosiles"))
  })

router.post("/",
  permisos.permisoPara([permisos.ROLES.COLECCION]),
  (req, res) => {
    const {
      DinosaurioId,
      huesos,
      numero_coleccion,
      peso,
      disponible,
      fecha_encontrado,
      observacion
    } = req.body
    dinoService.getDinosaurio(DinosaurioId).then(dino => {
      fosilService
        .createFosil(
          numero_coleccion,
          peso,
          disponible,
          fecha_encontrado,
          observacion,
          DinosaurioId,
          huesos
        )
        .then(() => {
          res.redirect("/fosiles")
        })
    })
  })

module.exports = router
