const models = require('../models');
const { paginateModel } = require('./utils')

module.exports = {
  countReplicas() {
    return models.Replica.count()
  },
  getReplicas(page = 0, pageSize = 10, args) {
    return models.Replica.findAndCountAll({
      include: [models.Pedido, models.Hueso, models.Dinosaurio],
      where: {
        ...args
      },
      ...paginateModel({ page, pageSize })
    });
  },
  getReplica(id) {
    return models.Replica.findOne({
      where: {
        id
      },
      include: [models.Pedido, models.Hueso, models.Dinosaurio]
      // PUEDE QUE VAYA UN INCLUDE, SINO, BORRAR ESTE COMENTARIO
    });
  },
  createReplica(codigo, disponible, fecha_inicio, fecha_fin, fecha_baja, obs, PedidoId, HuesoId, DinosaurioId) {
    return models.Replica.create({
      codigo,
      disponible,
      fecha_inicio,
      fecha_fin,
      fecha_baja,
      obs,
      PedidoId,
      HuesoId,
      DinosaurioId
    });
  },
  updateReplica(replicaReq) {
    return models.Replica.upsert(replicaReq)
  },
  toggleDisponible(id) {
    return models.Replica.findByPk(id)
      .then((replicaEncontrada) => {
        return replicaEncontrada.update({
          disponible: !disponible
        });
      })
  },
  deleteReplica(id) {
    return models.Replica.findByPk(id)
      .then((replicaEncontrada) => {
        return replicaEncontrada.update({
          fecha_baja: new Date(),
          disponible: false
        });
      })
  }
}