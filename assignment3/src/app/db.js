// const { resourceChangeTicket } = require('@angular/compiler-cli/src/ngtsc/core');
// const { watch } = require('fs');
const { clippingParents } = require('@popperjs/core');
const { watch } = require('fs');
const {MongoClient} =require('mongodb')

function connect(){
    const uri='mongodb+srv://nidhishsawant135:QMcqhyI5g53sFzjR@homework3.j2ujlwy.mongodb.net/?retryWrites=true&w=majority&appName=Homework3'

    const client = new MongoClient(uri);
    
    try{
        client.connect();
        console.log("Connectd successfully");
        return client
    }
    catch (e){
        console.error(e);
    }
}

async function listDB(client){
    const dbList=await client.db().admin().listDatabases();
    dbList.databases.forEach(db=>console.log(db))

}
async function creatWatchList(client,watchlist){
    const db=client.db('homework_3')
    const collection=db.collection('watchlist');
    console.log(watchlist.name)
    const query={name:watchlist.name}
    const update ={$set:{company:watchlist.company}};

    const result=await collection.findOneAndUpdate(query,update,{upsert:true})
    // const collection = await client.db('homework_3').collection("watchlist").update(watchlist,watchlist,{upsert:true});

    console.log("Created a list with id",result)
}

async function findWatchList(client){
    const cursor = await client.db('homework_3').collection('watchlist').find()
    const result = await cursor.toArray()
    console.log(result)
}

async function deleteWathcList(client,watchlist){
    const result = await client.db('homework_3').collection('watchlist').deleteOne(watchlist)
    console.log("Deleted ",result)
}
const client=connect()
// console.log(client)
findWatchList(client)
