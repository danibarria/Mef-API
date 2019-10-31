'use strict'
const Sequelize = require('sequelize');
const Detalle = require('./detalle');
const Persona = require('../core/persona');
const Cancelado = require('../estado/cancelado');
const Confirmado = require('../estado/confirmado');
const Demorado = require('../estado/demorado');
const Entregado = require('../estado/entregado');
const Fabricando = require('../estado/fabricando');
const Facturado = require('../estado/facturado');
const Finalizado = require('../estado/finalizado');
const Pagado = require('../estado/pago');
const Presupuestado = require('../estado/presupuestado');

module.exports = (sequelize,DataTypes) => {
    class Pedido extends Sequelize.Model {
        static solicitar() {
            return Pedido.create({
                autorizacion:true,
                type:'Interno'
            }) //
        }
        static presupuestar() {
            // solicitar y presupuestar son estaticos porque son los puntos de entrada
            return Pedido.create().then(p =>{
                return Presupuestado.create({PedidoId : p.id}).then(()=>p) //devuelve el pedido
            })
        }
        cancelar(...args){
            return this.estado.cancelar(this, ...args);
        }
        facturar(...args){
            return this.estado.facturar(this, ...args);
        }
        pagar(...args){
            return this.estado.pagar(this, ...args);
        }
        asignar(...args){
            return this.estado.asignar(this, ...args);
        }
        parar(...args){
            return this.estado.parar(this, ...args);
        }
        reanudar(...args){
            return this.estado.reanudar(this, ...args);
        }
        terminar(...args){
            return this.estado.terminar(this, ...args);
        }
        entregar(...args){
            return this.estado.entregar(this, ...args);
        }


        async hacer(func, ...args) {
            let estado = await this.estado;
            if (func in estado) {
                estado[func](this, ...args);
            }
        }
        // get estadosTodos        
        get estados() {
            return Promise.all([
                this.getCancelado(),
                this.getConfirmado(),
                this.getDemorados(),
                this.getEntregado(),
                this.getFabricando(),
                this.getFacturado(),
                this.getFinalizado(),
                this.getPresupuestado(), 
            ]).then(estados => {
                return estados.filter(e => e != null).sort((e1,e2) => e1.fecha - e2.fecha);
            });
        }
        // get estadosUltimo
        get estado() {
            return this.estados.then(estados => estados.pop(0));
        }
    }
    //@TODO agregar metodos que faltan

    Pedido.init({
        autorizacion : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull:false,
        },
        motivo : DataTypes.STRING,
        tipo: {
            type: DataTypes.ENUM,
            values : ['Interno','Externo']
        },
        PersonaId:{
            type: DataTypes.INTEGER,
            references:{
                model:'Personas',
                key:'id'
            }
        }
    }, {sequelize});

    Pedido.hasMany(Detalle(sequelize, DataTypes));
    Pedido.hasOne(Cancelado(sequelize, DataTypes));
    Pedido.hasOne(Confirmado(sequelize, DataTypes));
    Pedido.hasMany(Demorado(sequelize, DataTypes));
    Pedido.hasOne(Entregado(sequelize, DataTypes));
    Pedido.hasOne(Fabricando(sequelize, DataTypes));
    Pedido.hasOne(Facturado(sequelize, DataTypes));
    Pedido.hasOne(Finalizado(sequelize, DataTypes));
    Pedido.hasOne(Pagado(sequelize, DataTypes));
    Pedido.hasOne(Presupuestado(sequelize, DataTypes));
    
    Pedido.belongsTo(Persona(sequelize, DataTypes));
    return Pedido;
}

// getEstadoPedidos()
// asignarEmpleados(colEmpleados)
// asignarDinosaurio(unDino)
// asignarHuesos(colHuesos)  una coleccion de huesos  
// confirmar()
// cancelar()
// fabricar() inicia la fabricacion
// demorar(unMotivo)
// facturar(unPago) ///poneleeeee
// finalizar()  genera una replica
// entregar(unaFechaEnvio,unaFechaEntrega)
// presupuestar(unDineroAprox)