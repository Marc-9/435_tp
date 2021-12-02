const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db.js')

const app = express()
app.use(bodyParser.json()) 
const port = 3000

app.get('/', (req, res) => {
    res.send('hi from root path!');
})

async function getLength(speech){
    if(speech.length == 0){
        return 0;
    }
    var speechWords = speech.match(/\w+/g);
    var speechLength = speechWords.length;
    var query = `SELECT id, word, avg_length, variance FROM words WHERE word="${speechWords[0]}"`
    for(word of speechWords){
        query += ` OR word = "${word}"`;
    }
    result = await db.execute_query(query);
    
    var totalTime = 0;
    for(row of result){
        var time = row.avg_length;
        totalTime += time;
    }
    return time;
}
app.post('/speech_time', async (req, res) => {
    var speech = req.body.speech;
    var speechLength = await getLength(speech);
    var response = {
        'timeInSeconds': speechLength,
    };
    res.json(response);
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})