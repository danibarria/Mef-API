const express = require("express");
const router = express.Router();
const permisos = require("../middlewares/permisos");
const guiaService = require("../services/guia");
const personaService = require("../services/persona");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const paginate = require('../middlewares/paginate')
const { generatePagination} = require("../services/utils");

router.get('/', paginate, async (req, res, ) => {
    const { page, limit } = req.query
    try {
      const count = await guiaService.countGuias()
      const { rows } = await guiaService.getGuias(page, limit)
      const pagination = {
        ...generatePagination('guias', count, page, limit)
      }
      res.status(200).send({ count, rows, pagination })
    } catch (error) {
      res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de guias'}, null, 4))
    }
  }
);

router.get(
  "/agregar",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    var idiomas = await guiaService.getIdiomas();
    res.render("guias/agregar", { req, idiomas });
  }
);

router.get(
  "/editar/:id",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const guia = await guiaService.getGuia(req.params.id);
    const idiomasGuia = await guia.getIdiomas();
    const IDidiomasGuia = idiomasGuia.map(item => {
      return item.dataValues.id;
    });
    const idioma = await guiaService.getIdiomas({
      id: { [Op.notIn]: [...IDidiomasGuia] }
    });
    res.render("guias/editar", { guia, req, idioma, idiomasGuia });
  }
);

router.get(
  "/eliminar/:id",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  (req, res, next) => {
    guiaService.getGuia(req.params.id).then(guia => {
      res.render("guias/eliminar", { guia, req });
    });
  }
);

/*
  Script en CLIENTE
    view Agregar
      click en nuevo o existente
*/
router.post(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const {
      // tipo: exitente o nuevo
      dias_trabaja,
      horario_trabaja,
      idiomas,
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono
    } = req.body;
    // IF NUEVO O EXITESTE
    var persona = null;
    try {
      persona = await personaService.getPersonaArgs({
        where: { identificacion }
      });
    } catch (error) {
      persona = await personaService.createPersona(
        identificacion,
        nombre,
        apellido,
        direccion,
        localidad,
        email,
        fecha_nacimiento,
        telefono
      );
    }
    await guiaService.createGuia(
      dias_trabaja,
      new Date(),
      horario_trabaja,
      idiomas,
      persona.id
    );
    res.redirect("/guias");
  }
);

//actualizar la lista de idiomas por separado
router.put(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const {
      // tipo: exitente o nuevo
      idGuia,
      idPersona,
      dias_trabaja,
      horario_trabaja,
      idiomas,
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono
    } = req.body;

    await guiaService.updateGuia({
      id: idGuia,
      dias_trabaja,
      horario_trabaja
    });

    const guia = await guiaService.getGuia(idGuia);

    await guia.setIdiomas([  ...idiomas]);
    await personaService.updatePersona({
      id: idPersona,
      identificacion,
      nombre,
      apellido,
      direccion,
      localidad,
      email,
      fecha_nacimiento,
      telefono
    });
    res.redirect("/guias");
  }
);

router.delete(
  "/",
  permisos.permisoPara([permisos.ROLES.RRHH]),
  async (req, res, next) => {
    const { id } = req.body;
    try {
      await guiaService.deleteGuia(id);
      return res.redirect("/guias");
    } catch (error) {
      guiaService.getGuia(id).then(guia => {
        res.render("guias/eliminar", { error, guia, req });
      });
    }
  }
);

module.exports = router;
