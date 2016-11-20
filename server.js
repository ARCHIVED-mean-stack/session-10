var express = require('express')
var app = express()
var mongoose = require('mongoose')
var jwt = require('jwt-simple')
var _ = require('lodash')
var bodyParser = require('body-parser')
var mongoUri = 'mongodb://localhost/rest-apis'
var db = mongoose.connection


// var users = [{ username: 'dickeyxxx', password: 'pass' }]

var users = [{ username: 'dickeyxxx', password: '$2a$10$Jmo/n32ofSM9JvzfH0z6Me6TMyn6C/U9JhzDG8xhQC4ExHMG1jXz2' }]

var secretKey = 'supersecretkey'

function findUserByUsername(username) {
    return _.find(users, { username: username })
}

function validateUser(user, password) {
    return user.password === password
}


mongoose.connect(mongoUri)

app.use(bodyParser.json());
app.use(express.static('assets'))

db.on('error', function () {
    throw new Error('unable to connect at' + mongoUri);
})

require('./models/pirate');
require('./routes')(app);


// app.post('/session', function (req, res) {
//     var user = findUserByUsername(req.body.username)
//     if (!validateUser(user, req.body.password)) {
//         return res.send(401) // Unauthorized
//     }
//     var token = jwt.encode({ username: user.username }, secretKey)
//     res.json(token)
// })

// app.get('/user', function (req, res) {
//     var token = req.headers['x-auth']
//     var user = jwt.decode(token, secretKey)
//     // TODO: pull user info from database
//     res.json(user)
// })

app.post('/session', function (req, res) {
    var user = findUserByUsername(req.body.username)
    validateUser(user, req.body.password, function (err, valid) {
        if (err || !valid) { return res.send(401) }
        var token = jwt.encode({ username: user.username }, secretKey)
        res.json(token)
    })
})

app.get('/user', function (req, res) {
    var token = req.headers['x-auth']
    var user = jwt.decode(token, secretKey)
    // TODO: pull user info from database
    res.json(user)
})

app.listen(3004);
console.log('port 3004');

// curl - H "X-Auth: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImRpY2tleXh4eCJ9.0w1RshE-2k7r94VmFZeSH_JBOTAg90EecznduMwaEGc" localhost: 3004 / user


// require('bcrypt').hashSync('pass', 10) 
// '$2a$10$Jmo/n32ofSM9JvzfH0z6Me6TMyn6C/U9JhzDG8xhQC4ExHMG1jXz2'

// require('bcrypt').compareSync('pass', '$2a$10$Jmo/n32ofSM9JvzfH0z6Me6TMyn6C/U9JhzDG8xhQC4ExHMG1jXz2')