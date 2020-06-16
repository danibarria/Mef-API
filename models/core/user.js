'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) =>{
	const UsersRoles = sequelize.define('UsersRoles', {}, { paranoid: true })
	const User = sequelize.define('User',{
		email:{
			type: DataTypes.STRING,
			allowNull : false,
			unique: true
		},
		password: DataTypes.STRING,
		PersonaId:{
			type: DataTypes.INTEGER,
			references: {
				model:'Personas',
				key:'id'
			}
		}
	},{
		paranoid:true,
		hooks:{
			afterValidate: (user) => {
				user.password = bcrypt.hashSync(user.password,10);
			}

		}
	});

	User.associate = function(models){
		models.User.belongsTo(models.Persona);
		models.User.belongsToMany(models.Rol, { through: UsersRoles });
		models.Rol.belongsToMany(models.User, { through: UsersRoles });
	};
	return User;
};

//logear 
//agregarPermiso, puede agregar mas de un permiso
//sector es uno solo, es un enumerado
