const express = require('express') ;
const boddParser = require('body-parser');
const cors = require('cors')
const passport = require('passport')
const expressSession = require('express-session')
const cookieParse = require('cookie-parser')
const bcrypt = require('bcrypt')

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = 3001
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})