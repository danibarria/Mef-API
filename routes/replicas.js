const express = require("express")
const permisos = require('../middlewares/permisos')
const router = express.Router()
const replicaService = require('../services/replicas')
const { generatePagination } = require('../services/utils')
const paginate = require('../middlewares/paginate')

router.get("/", paginate, async (req, res) => {
  const { page, limit } = req.query
  try {
    const count = await replicaService.countReplicas()
    const { rows } = await replicaService.getReplicas()
    const pagination = {
      ...generatePagination('replicas', count, page, limit)
    }
    res.status(200).send({ count, rows, pagination })
  } catch (error) {
    res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de clientes'}, null, 4))
  }
})

router.get("/editar/:id",
  permisos.permisoPara([permisos.ROLES.EXHIBICION]),
  async (req, res, next) => {
    const { id } = req.params
    const replica = await replicaService.getReplica(id)
    //PUEDE QUE FALTE DINOSAURIO,HUESO,PEDIDO
    res.render("fosiles/editar", { replica })
  })

router.get("/eliminar/:id",
  permisos.permisoPara([permisos.ROLES.EXHIBICION]),
  (req, res, next) => {
    const { id } = req.params

    replicaService
      .getReplica(id)
      .then(replica => {
        console.log(replica)
        res.render("replicas/baja", { replica })
      })
      .catch(err => {
        console.log("error de baja")
      })
  })
router.patch("/disponibilidad/:id",
  permisos.permisoPara([permisos.ROLES.EXHIBICION]),
  (req, res, next) => {
    const { id } = req.params
    replicaService.toggleDisponible(id)
    res.send(200)
  }
),
  router.delete("/",
    permisos.permisoPara([permisos.ROLES.EXHIBICION]),
    (req, res, next) => {
      replicaService.deleteReplica(req.body.id).then(() => res.redirect("/pedidos/replicas"))
    })

router.post("/",
  permisos.permisoPara([permisos.ROLES.EXHIBICION]),
  (req, res, next) => {
    const {
      codigo,
      disponible,
      fecha_inicio,
      fecha_fin,
      fecha_baja,
      obs,
      PedidoId,
      HuesoId,
      DinosaurioId
    } = req.body

  })

module.exports = router