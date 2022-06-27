//MayanWolfe VOD at 3:00 pm on 6/19/2022: Let's Make an Auto-Completing Movie Finder App #100Devs (query a database)

const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()


//DECLARED DB VARIABLES(Hide credentials)
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection


// CONNECT TO MONGO DB    
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to the MongoDB ${dbName} database.`)
        db = client.db(dbName)
        collection = db.collection('movies')
    })


//SET MIDDLEWARE - 1:19:00
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())



//CRUD  METHODS - 1:22:00
app.get('/search', async (request, response) => {
    try{
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete" : {
                        "query": `${request.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits":2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray()
            response.send(result)
    } catch (error) {
        response.status(500).send({message: error.message})
    }
})


app.get('/get/:id', async (request, response) => {
    try {
        let result = await collection.findOne({
            "_id" : ObjectId(request.params.id)
        })
        response.send(result)
    } catch (error) {
        response.status(500).send({message: error.message})
    }
})

//SET UP LOCALHOST ON PORT
app.listen(process.env.port || port, () => {
    console.log('The server is active!!!')
})

