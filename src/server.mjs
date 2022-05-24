import app from '#src/app.mjs'
import process from 'process';
import redisClient from '#src/clients/redisClient.mjs'
import monogooseClient from '#src/clients/mongooseClient.mjs'
import winston from 'winston'
import config from 'config';

winston.level = config.get('log.level');
const consoleTransport = new winston.transports.Console();
winston.add(consoleTransport);

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
monogooseClient.cacheWithRedis(redisClient.getClient())
monogooseClient.connect()

const port = 8080
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))