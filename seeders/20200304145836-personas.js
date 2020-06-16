'use strict';
const MAX = 300; //cantidad de personas
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let peopleArr = [];
    let guiaArr = [];
    let idiomaArr = [];
    let clientesArr = [];
    let empleadosArr = [];

    //generar personas
    for (let index = 0; index < MAX; index++) {
      let fakeId = Math.round(Math.random() * 1000000 * 99) + 1000000; //entre 1 y 100 millones

      let peopleObj = {
        identificacion: fakeId,
        activo: true,
        nombre: faker.name.firstName(),
        apellido: faker.name.lastName(),
        direccion: faker.address.streetAddress(),
        localidad: faker.address.city(),
        email: faker.internet.email(),
        fecha_nacimiento: new Date(),
        telefono: faker.phone.phoneNumber(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      peopleArr.push(peopleObj)
    }
    
    //generar guias
    for (let index = 1; index < 100; index++) {
      let guiaObj = {
        fecha_alta: new Date(),
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      //generar idiomas que habla
      let cantidadIdiomas = Math.round(Math.random() * 5) + 1; //entre 1 y 6
      for (let index2 = 1; index2 <= cantidadIdiomas; index2++) {
        const idiomaObj = {
          createdAt: new Date(),
          updatedAt: new Date(),
          IdiomaId: index2,
          GuiumId: index,
        };
        idiomaArr.push(idiomaObj);
      }
      guiaArr.push(guiaObj);
    }
    //generar clientes
    for (let index = 100; index < 200; index++) {
      let random = Math.round(Math.random());
      let tipoCliente = random ? "Particular" : "Institucional";
      let clienteObj = {
        tipo: tipoCliente,
        fecha_fin: new Date(),
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      clientesArr.push(clienteObj);
    }
    for (let index = 200; index <= 300; index++) {
      const empleadoObj = {
        PersonaId: index,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      empleadosArr.push(empleadoObj);
    }
    return queryInterface.bulkInsert('Personas', peopleArr, {})
    .then(e =>{
        return queryInterface.bulkInsert('Guia', guiaArr, {})
        .then(f =>{
            return queryInterface.bulkInsert('IdiomaGuia', idiomaArr, {})
        .then(g =>{
          return queryInterface.bulkInsert('Clientes', clientesArr, {})
          .then(h =>{
            return queryInterface.bulkInsert('Empleados', empleadosArr, {})
          })
        })
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Personas', null, {});
  }
};
