import config from 'config';
import {createClient}  from 'redis';

let client;

function getClient(){
    if(client === undefined){
        client = createClient({url: config.get('redis.url')});
        client.on("error",(err)=>{
            console.log(err);
        });
    
        client.on("ready",()=>{
            console.log("Redis connection esablished");
        });
    }
    return client 
}

async function connect(){
    getClient()
    await client.connect();
}

function setClient(newClient){
    client = newClient
}

function disconnect(){
    client.quit();
}

export default {
    setClient,
    connect,
    disconnect,
    getClient
};