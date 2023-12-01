const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
//Port 
const port = process.env.PORT || 7000

//MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello world")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzn18f.mongodb.net/?retryWrites=true&w=majority`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const productCollection = client.db("productsDB").collection("products")
        const myCartCollection = client.db("myCartDB").collection("mycart")

        //products find all
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //products find one
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })
        //product insert one
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result)

        })

        //product update one
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    image: updatedProduct.image,
                    details: updatedProduct.details
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result);

        })
        // my card find all
        app.get('/mycart', async (req, res) => {
            const cursor = myCartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // my card find one
        app.get('/mycart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myCartCollection.findOne(query);
            res.send(result);
        })

        // my card insert one
        app.post('/mycart', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await myCartCollection.insertOne(newCart);
            res.send(result)
        })

        //my cart delete one
        app.delete('/mycart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId (id) };
            const result = await myCartCollection.deleteOne(query);
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`The server running port on ${port}`)
})