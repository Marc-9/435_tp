const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db.js')

const app = express()
app.use(bodyParser.json()) 
app.use(cors())
const port = 3030

app.get('/', (req, res) => {
    res.send('hi from root path!');
})

async function getLength(speech){
    if(speech.length == 0){
        return 0;
    }
    let speechWords = speech.match(/\w+/g);
    let speechLength = speechWords.length;
    let query = `SELECT * FROM words WHERE word=${db.pool.escape(speechWords[0])}`
    for(word of speechWords){
        query += ` OR word = "${db.pool.escape(word)}"`;
    }
    result = await db.execute_query(query);
    
    let totalTime = 0;
    for(row of result){
        let time = row.avg_length;
        totalTime += time;
    }
    return time;
}
app.post('/speech_time', async (req, res) => {
    let speech = req.body.speech;
    let speechLength = await getLength(speech);
    let response = {
        'timeInSeconds': speechLength,
    };
    res.json(response);
})

app.post('/search_word', async (req, res) => {
    let word = req.body.word;
    let words = await db.execute_query(`SELECT id, word FROM words WHERE word LIKE "${db.pool.escape(word)}%"`);
    let response = {
        'words': words,
    };
    res.json(response);
})

app.post('/word_info', async (req, res) => {
    let id = req.body.id;

    let word_row = await db.execute_query(`select * from words where id = ${db.pool.escape(id)}`)
    if(word_row.length){
        word_row = word_row[0];
    }else{
        word_row = {
            'num_occurences_tot': 0,
            'variance': 0
        }
    }

    let date_occ = await db.execute_query(`select date, num_of_occurences FROM word_date WHERE word_id = ${db.pool.escape(id)}`)
    
    let perc_occ = await db.execute_query(`select percent, num_of_occurences FROM word_percent WHERE word_id = ${db.pool.escape(id)}`)

    let response = {
        'total_occurences': word_row.num_occurences_tot,
        'occurences_over_time': date_occ,
        'occurences_by_percentage': perc_occ,
        'variance': word_row.variance
    };
    res.json(response);
})


process = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server');
    pool.end();
})