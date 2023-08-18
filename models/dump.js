const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Dump extends Model {
    }
    Dump.init({
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        payload: {
            type: DataTypes.JSON
        },
        barcode: {
            type: DataTypes.STRING(15)
        },
        lastUpdateDate: {
            type: DataTypes.DATE
        },
        batchNo: {
            type: DataTypes.INTEGER
        }

    }, {sequelize, modelName: 'Dump', tableName: 'dump', createdAt: false, updatedAt: false});
    return Dump;
}
