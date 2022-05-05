// Place your server entry point code here


//--------------------------------------------------------------
const fs = require ('fs')
const db = require("./src/services/database.js")

const express = require('express')
const app = express()

const morgan = require('morgan')

const args = require('minimist')(process.argv.slice(2))

// Add cors dependency
const cors = require('cors')

args["port"]
var port = args.port || 5000

//help
if (args.help || args.h) {
    console.log(`
    server.js [options]

    --port, -p	Set the port number for the server to listen on. Must be an integer between 1 and 65535.

    --debug, -d If set to true, creates endlpoints /app/log/access/ which returns a JSON access log from 
                the database and /app/error which throws  an error with the message "Error test successful." 
                Defaults to false.

    --log       If set to false, no log files are written. Defaults to true.
                Logs are always written to database.

    --help, -h	Return this message and exit.
    `)
    process.exit(0)
}

const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%',port))
})

//flip functions

function coinFlip() {
    let flip = Math.random();
    if (flip < 0.5)
      return "tails"
    return "heads"
}

function coinFlips(flips) {
    var results = [];
    var i = 0;
    while (i<flips) {
      results[i] = coinFlip();
      i++;
    }
    return results
}

function countFlips(array) {
    var headsNum = 0;
    var tailsNum = 0;
    array.forEach(element => {
      if (element == "heads")
        headsNum++;
      else
        tailsNum++;
    });
    let dict = new Object()
    dict["heads"] = headsNum
    dict["tails"] = tailsNum
    return dict
}

function flipACoin(call) {
    let dict = new Object()
    dict["call"] = call
    let flip = coinFlip()
    dict["flip"] = flip
    if (flip == call)
      dict["result"] = "win"
    else 
      dict["result"] = "lose"
    return dict
}

if (args.log == true) {
    const accessLog = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: accessLog }))
}

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Serve static HTML files
app.use(express.static('./public'));

// Make Express use its own built-in body parser to handle JSON
app.use(express.json());

// Set up cors middleware on all endpoints
app.use(cors())


app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?,?,?,?,?,?,?,?,?,?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
    next()
})

if (args.debug || args.d) {

    app.get('/app/log/access', (req, res) => {
        const stmt = db.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
    })

    app.get('/app/error', (app, res) => {
        throw new Error('BROKEN')
    })
}

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
    });

app.get('/app/flip', (req, res) => {
    var flip = coinFlip()
    res.status(200).json({ 'flip' : flip})
})

app.get('/app/flips/:number', (req, res) => {
    
    var results = coinFlips(req.params.number)
    var count = countFlips(results)
    res.status(200).json({ 'raw' : results, "summary": count})
})


//a05 api for fliping multiple coins
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

//ao5 api for guessing the flip
app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})


app.get('/app/flip/call/heads', (req, res) => {
    res.status(200).json(flipACoin("heads"))
    });

app.get('/app/flip/call/tails', (req, res) => {
    res.status(200).json(flipACoin("tails"))
    });

app.use(function(req, res) {
    res.status(404).send("404 NOT FOUND")
    res.type("text/plain")
})