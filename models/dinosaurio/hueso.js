'use strict';
module.exports = (sequelize, DataTypes) => {
  //tipos
  const axial = ['Torax','Vertebral','Cráneo'];
  const apendicular = ['Pelvis','Brazo','Manos','Piernas','Pies'];
  //subtipos
  const craneo = ['Paladar','Mandíbula','Cráneo'];
  const pelvis = ['Coracoide','Ilion','Pubis','Ischion'];
  const brazo = ['Radio','Unla','Húmero','Escápula',];
  const piernas = ['Fémur','Tibia','Fíbula'];

  const pies = ['Metatarsales','Dedos Pie'];
  const manos = ['Metacarpianos','Dedos Mano'];
  const vertebras = ['Hemales','Vertebras Cervicales','Vertebras Dorsales','Vertebras Sacras','Vertebras Caudales'];
  const torso = ['Costillas Cervicales','Costillas Dorsales'];

  const Hueso = sequelize.define('Hueso', {
    nombre: DataTypes.STRING,
    numero: DataTypes.INTEGER,
    subtipohueso: {
      type: DataTypes.ENUM,
      values: axial.concat(apendicular)
    },
    tipohueso: {
      type: DataTypes.ENUM,
      values: ['Apendicular','Axial']
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    partes: {
      type: DataTypes.ENUM,
      values: ['Piernas', 'Brazos', 'Torso', 'Cadera', 'Cola', 'Cuello', 'Cráneo']
    },
    DinosaurioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Dinosaurios',//nombre en la tabla
        key:'id',        // id de la tabla SubClases
      }
    }
  }, {
    paranoid:true,
    hooks:{
      afterValidate: (hueso) =>{ //@TODO refactorizar
        //defino SubTipo
        switch (hueso.nombre) {
          case 'Paladar':
          case 'Mandíbula':
          case 'Cráneo':
            hueso.subtipohueso = 'Cráneo';
            hueso.tipohueso = 'Axial';
            break;
          case 'Coracoide':
          case 'Ilion':
          case 'Pubis':
          case 'Ischion':
          case 'Pelvis':
            hueso.subtipohueso = 'Pelvis';
            hueso.tipohueso = 'Apendicular';  
            break;
          case 'Radio':
          case 'Unla':
          case 'Húmero':
          case 'Escápula':
          case 'Brazo':
            hueso.subtipohueso = 'Brazo';    
            hueso.tipohueso = 'Apendicular';
            break;
          case 'Fémur': 
          case 'Tibia':
          case 'Fíbula':
          case 'Piernas':
            hueso.subtipohueso = 'Piernas';    
            hueso.tipohueso = 'Apendicular';
            break;
          case 'Metatarsales':
          case 'Dedos Pie':
          case 'Pies':
            hueso.subtipohueso = 'Pies';    
            hueso.tipohueso = 'Apendicular';
            break;
          case 'Metacarpianos':
          case 'Dedos Mano':
          case 'Manos':
            hueso.subtipohueso = 'Manos';                 
            hueso.tipohueso = 'Apendicular'
            break;
          case 'Hemales':
          case 'Vertebras Cervicales':
          case 'Vertebras Dorsales':
          case 'Vertebras Sacras':
          case 'Vertebras Caudales':
          case 'Vertebral':
          case 'Vertebras':
            hueso.subtipohueso = 'Vertebral';                 
            hueso.tipohueso = 'Axial'
            break;
          case'Costillas Cervicales':
          case'Costillas Dorsales':
          case'Torax':
          case'Torso':
            hueso.subtipohueso = 'Torax';                 
            hueso.tipohueso = 'Axial'
            break;
        }
      }
    }
  });
  Hueso.associate = function(models) {
    models.Hueso.belongsTo(models.Dinosaurio);
    models.Hueso.hasMany(models.Detalle,{as:'Detalles',foreignKey:'HuesoId'});
  };
  return Hueso;
};