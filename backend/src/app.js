const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json()) 
const port = 3000

app.get('/', (req, res) => {
    res.send('hi from root path!');
})

app.post('/time', (req, res) => {
    var speech = req.body.speech;
    var speechWords = speech.match(/\w+/g);
    var speechLength = speechWords.length;
    var response = {
        'timeInSeconds': speechLength,
        'speechTokens': speechWords
    };
    res.json(response);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})