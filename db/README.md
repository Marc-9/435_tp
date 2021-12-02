# Running the Database
run `source ./run_db.sh`

Using this library in nodeJS: node-mysql2

login with ` mysql -u root -p` with password 12345

RUN `CREATE DATABASE SpeechTimer`

run `mysql -u root -p SpeechTimer < speech_timer.sql`

add these to your .bashrc
```
export SQL_USER=root
export SQL_PASSWORD=12345
export SQL_HOST=localhost
export SQL_DB=SpeechTimer
```

