const models = require("../models");
let dino = models.Dinosaurio;
let pedido = models.Pedido;
let Detalle = models.Detalle;
let Confirmado = models.Confirmado;
let Presupuesto = models.Presupuestado;
let persona = models.Persona;
const Pedido = require('../models/replicacion/pedido');
const huesoService = require('./hueso');

module.exports = {
  getPedidos(args) {
    return pedido.findAll({
      include: [persona],
      where: {
        ...args
      }
    });
  },
  getPedido(args) {
    return pedido.findOne({
      where : {
        ...args
      },
      include: [persona]
    })
  },
  solicitar(huesos){
    return pedido.create({
      autorizacion:true,
      tipo: 'Interno',
      estadoInstance: 'Confirmado'
    }).then(pedido=>{
      return Confirmado.create({
        PedidoId:pedido.id,
        fecha: new Date()
      })
    }).then(pedido=>{
      this.crearDetalles(huesos,pedido.id)
    })
  },
  presupuestar(
    huesos,
    cliente,
    descripcion,
    monto,
    fecha_fin_oferta
  ) {
    //crea el pedido y sus detalles
    return pedido
      .create({
        tipo:'Externo',
        estadoInstance: 'Presupuestado', 
        PersonaId:null, //@TODO aca va cliente
      })
      .then(pedido => {
        //cuando hayas creado el pedido
        //si sos externo
        //crear presupuesto
        Presupuesto.create({
          PedidoId: pedido.id,
          fecha: new Date(),
          fecha_fin_oferta,
          monto,
          cantidad_huesos: huesos.length,

        });
      })
      .then(pedido=>{
        //una vez que hayas creado el presupuesto
        //agregarle todos sus ddetalles
        this.crearDetalles(huesos,pedido.id);
      });
  },
  crearDetalles(huesos, PedidoId){
    for (let index = 0; index < huesos.length; index++) {
      huesoService.getHueso(huesos[index])
      .then(hueso=>{
        Detalle.create({
          PedidoId,
          cantidad:1,
          HuesoId: hueso.id,
          renglon: hueso.numero,
        })
      })
    }
  },
  updatePedido() {},
  deletePedido() {}
};
