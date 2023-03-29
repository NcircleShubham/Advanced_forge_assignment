const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { PORT } = require('./config.js');

let app = express();
app.use(cors())
app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'))
app.listen(PORT,async()=>{
try {
    const port = await PORT;
    console.log('listening on port '+port);
} catch (error) {
    console.log(error)
}
})