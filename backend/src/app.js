const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var converter = require('number-to-words');

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

    let query = `SELECT * FROM words WHERE word=${db.pool.escape(speechWords[0].toLowerCase())}`
    for(word of speechWords){
        query += ` OR word = ${db.pool.escape(word.toLowerCase())}`;
    }
    result = await db.execute_query(query);
    
    word_time = {}
    for(row of result){
        let time = Number(row.avg_length);
        word_time[row.word] = time
    }
    //console.log(word_time);
    let periodCount = speech.match(/\./g) ? speech.match(/\./g).length : 0;
    let periodTime = periodCount*0.5; //TODO - replace with actual measurements
    let commaCount = speech.match(/,/g) ? speech.match(/,/g).length : 0;
    let commaTime = commaCount*0.5; //TODO - replace with actual measurements

    let totalTime = periodTime + commaTime;
    let unknown_words = 0;
    for(word of speechWords){
        let curTime = word_time[word.toLowerCase()];
        if(!isNaN(curTime)){
            totalTime += curTime;
        }else{
            //TODO add time based on length of the word.
            //console.log(word)
            let numWord = false;
            if(!isNaN(word)){ //check if current word is a number
                let newWords = converter.toWords(word).replace(/,/g, '').replace(/-/, ' ').split(/ /g);
                //console.log('converted: ' + newWords);
                
                for(num of newWords){
                    let curTime = word_time[word.toLowerCase()];
                    if(!isNaN(curTime)){
                        totalTime += curTime;
                    }else{
                        console.log(num);
                        unknown_words += 1;
                        totalTime += 0.05*word.length;
                    }
                }
            }else{
                unknown_words += 1;
                totalTime += 0.05*word.length;
            }
        }
    }
    console.log(`unknown words: ${unknown_words}`);
    return totalTime;
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
    let words = await db.execute_query(`SELECT id, word FROM words WHERE word LIKE ${db.pool.escape(word + '%')}`);
    let response = {
        'words': words,
    };
    res.json(response);
})

app.post('/get_id', async (req, res) => {
    let word = req.body.word;
    let words = await db.execute_query(`SELECT id, word FROM words WHERE word = ${db.pool.escape(word)}`);
    let id = word.length > 0 ? words[0].id : -1;
    let response = {
        'word': word,
        'id': id,
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
            'word': '',
            'avg_time': 0,
            'num_occurences_tot': 0,
            'variance': 0
        }
    }

    let date_occ = await db.execute_query(`select date, num_of_occurences FROM word_date WHERE word_id = ${db.pool.escape(id)}`)
    
    let perc_occ = await db.execute_query(`select percent, num_of_occurences FROM word_percent WHERE word_id = ${db.pool.escape(id)}`)

    let response = {
        'word': word_row.word,
        'avg_time': word_row.avg_length,
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
    db.pool.end();
})