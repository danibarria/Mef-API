
const models = require('../models');
let persona = models.Persona;

module.exports = {
    getPersonas(args){//{ tags }//aca se pide datos a la BD        //Cambia ya que no existe rol solo cliente
        return persona.findAll({
            where:{
                ...args
            }
        });
    },
    getPersona( id ){
        return persona.findByPk(id);
    },
   createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono){
        return persona.create({
            identificacion,
            nombre,
            apellido, 
            direccion, 
            localidad, 
            email, 
            fecha_nacimiento, 
            telefono 
        })
    },
    updatePersona(personaReq){
        return persona.upsert(personaReq)
    },
    deletePersona(id){
        return persona.findByPk(id)
            .then( (personaEncontrado) => {
                personaEncontrado.destroy(personaEncontrado);
            })
            
    }
}