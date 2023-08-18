const { Dbf } = require('dbf-reader/dbf');
const { Op } = require('sequelize');
const db = require('../models');
const upload = require('multer')();
const router = require('express').Router();
var XLSX = require('xlsx')

router.post('/login', async (req, res) => {
    try{
        let phone = req.body.phone;
        let password = req.body.password;
        let user = await db.User.findOne({
            where: {
                phone,
                password
            }
        })
        res.json(user)
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.get('/users/:id', async (req, res) => {
    try{
        let users = await db.User.findAll({
            where: {
                id: {
                    [Op.ne]: req.params.id
                }
            }
        })
        res.json(users)
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.post('/user/:id', async (req, res) => {
    try{
        let user = await db.User.create(req.body)
        let users = await db.User.findAll({
            where: {
                id: {
                    [Op.ne]: req.params.id
                }
            }
        })
        res.json(users)
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.delete('/user/:id/:myId', async (req, res) => {
    try{
        await db.User.destroy({
            where: {
                id: req.params.id
            }
        })
        let users = await db.User.findAll({
            where: {
                id: {
                    [Op.ne]: req.params.myId
                }
            }
        })
        res.json(users)
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.put('/user/:id/:myId', async (req, res) => {
    try{
        await db.User.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        let users = await db.User.findAll({
            where: {
                id: {
                    [Op.ne]: req.params.myId
                }
            }
        })
        res.json(users)
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.get('/stats/:batch', async (req, res) => {
    try{
        let record = await db.Dump.findOne()
        let price = await db.Price.findOne({
            where: {
                code: 'SILVER'
            },
            order: [['createdAt', 'DESC']]
        })
        let hasUpdate = await db.Dump.count({
            where: {
                batchNo: {
                    [Op.gt]: req.params.batch
                }
            }
        })
        res.json({
            record,
            price,
            hasUpdate: hasUpdate > 0
        })
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.post('/price', async (req, res) => {
    try{
        let price = await db.Price.create({
            code: 'SILVER',
            price: req.body.price
        })
        res.json({
            price
        })
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.get('/search/:barcode', async (req, res) => {
    try{
        let record = await db.Dump.findOne({
            where: {
                barcode: req.params.barcode
            }
        })
        let price = await db.Price.findOne({
            where: {
                code: 'SILVER'
            },
            order: [['createdAt', 'DESC']]
        })
        res.json({
            record,
            price
        })
    }catch(e){
        console.log(e);
        res.json({
            error: 400
        })
    }
})

router.post('/dump', upload.single('file'), async (req, res) => {
    console.log(req.file)
    let workbook = XLSX.read(req.file.buffer, {type: 'buffer'})
    let sheet = Object.keys(workbook.Sheets)[0]
    let data = workbook.Sheets[sheet]
    let dump = XLSX.utils.sheet_to_json(data)
    let timestamp = new Date();
    let payload = [];
    let _batchNo = await db.Dump.findOne({
        attributes: [['max(batchNo)', 'batch']]
    })
    let __batchNo = _batchNo.toJSON();
    let batchNo = (__batchNo.batch?__batchNo.batch:0) + 1;
    dump.forEach(e => {
        payload.push({
            payload: e,
            barcode: e['BAR_KEY'],
            lastUpdateDate: timestamp,
            batchNo
        })
    })
    var i,j,temparray,chunk = 8000;
    for (i=0,j=payload.length; i<j; i+=chunk) {
        temparray = payload.slice(i,i+chunk);
        await db.Dump.bulkCreate(temparray)
    }
    await db.Dump.destroy({
        where: {
            batchNo: batchNo - 1
        }
    })
    res.json({
        updated: 200,
        batchNo,
        timestamp
    })
})

module.exports = router;