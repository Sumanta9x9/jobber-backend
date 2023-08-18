const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Price extends Model {
    }
    Price.init({
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        code: {
            type: DataTypes.STRING(20)
        },
        price: {
            type: DataTypes.DOUBLE(10,4)
        }
    }, {sequelize, modelName: 'Price', tableName: 'prices', createdAt: true, updatedAt: false});
    return Price;
}
