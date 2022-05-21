import app from '#src/Routes/app.mjs'
import process from 'process';
import redisClient from '#src/clients/redisClient.mjs'
import monogooseClient from '#src/clients/mongooseClient.mjs'

process.on('SIGINT', function onSigint() {
    console.log('sigint process exit');
    monogooseClient.disconnect()
    redisClient.disconnect()
    process.exit();
});

process.on('SIGTERM', function onSigterm() {
    console.log('sigterm process exit');
    monogooseClient.disconnect()
    redisClient.disconnect()
    process.exit();
});

await redisClient.connect()
monogooseClient.connect()

const port = 8080
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))