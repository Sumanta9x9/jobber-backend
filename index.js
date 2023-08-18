const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()
app.use(bodyParser.json())
app.use(cors())
const PORT = process.env.PORT || 3000;
 
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/app', require('./controllers/app'));
 
app.listen(PORT, () => {
    console.log("App started")
})