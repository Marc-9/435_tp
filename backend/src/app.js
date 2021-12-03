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

app.post('/search_word', async (req, res) => {
    var word = req.body.word;
    var words = await db.execute_query(`SELECT id, word FROM words WHERE word LIKE "%${word}%"`);
    var response = {
        'words': words,
    };
    res.json(response);
})

app.post('/word_info', async (req, res) => {
    var id = req.body.id;

    var word_row = await db.execute_query(`select * from words where id = ${id}`)
    word_row = word_row[0];
    var date_occ = await db.execute_query(`select date, num_of_occurences FROM word_date WHERE word_id = ${id}`)
    
    var perc_occ = await db.execute_query(`select percent, num_of_occurences FROM word_percent WHERE word_id = ${id}`)

    var response = {
        'total_occurences': word_row.num_occurences_tot,
        'occurences_over_time': date_occ,
        'occurences_by_percentage': perc_occ,
        'variance': word_row.variance
    };
    res.json(response);
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})