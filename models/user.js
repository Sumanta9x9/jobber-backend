const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
    }
    User.init({
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING(80)
        },
        phone: {
            type: DataTypes.STRING(12)
        },
        password: {
            type: DataTypes.STRING(25)
        },
        is_admin: {
            type: DataTypes.INTEGER(1)
        }

    }, {sequelize, modelName: 'User', tableName: 'user', createdAt: false, updatedAt: false});
    return User;
}
