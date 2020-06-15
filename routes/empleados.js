const express = require("express")
const router = express.Router()
const empleadoService = require("../services/empleado.js")
const personaService = require("../services/persona.js")
const paginate = require('../middlewares/paginate')
const { generatePagination } = require("../services/utils");


//lista todos los empleados
router.get("/", paginate, async (req, res) => {  
  const { page, limit } = req.query
  try {
    const empleados = await empleadoService.getEmpleados(page, limit)
    const { rows, count } = empleados
    const pagination = {
      ...generatePagination('empleados', count, page, limit)
    }

    res.status(200).send({ count, rows, pagination })
  } catch (error) {
    res.status(500).send(JSON.stringify({ error, message:'No se pudo obtener la lista de empleados'}, null, 4)) 
  }
})
  
router.post('/', async (req, res) =>{
    const {identificacion, nombre, apellido,  direccion,  localidad, email,  fecha_nacimiento, telefono} = req.body
    let errores = null
    try {
        const persona = await personaService.createPersona(identificacion, nombre, apellido, direccion, localidad, email, fecha_nacimiento, telefono)        
        const empleado = await empleadoService.createEmpleado(persona.id)
    } catch (error) {
        try {
            const persona = await personaService.getPersonaArgs({identificacion})
            await empleadoService.createEmpleado(persona.id)
        } catch (error) {
            errores = error
        }
    }
    if(errores){
      //res.render('empleados/agregar',{errores,req})   
    }else{
      res.redirect('/empleados')
    }
})

router.put("/", (req, res) => {
  personaService.updatePersona(req.body)
    .then(() => {
        res.redirect("/empleados")
    })
})

router.delete("/", (req, res) => {
  const { id } = req.body
  empleadoService.deleteEmpleado(id).then(() => {
    res.redirect("/empleados")
  })
})

module.exports = router