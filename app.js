// Matthew Barhou, 301193037
//Import the express and mongoose packages
import express from 'express';
import mongoose from 'mongoose';
const port = 3000
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to MongoDB
mongoose.connect('mongodb+srv://Mbarhou:Bedroom123@marketplace.mbf3gdr.mongodb.net/Marketplace?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database Name:', mongoose.connection.name);
    })
    .catch(err => console.error('Could not connect to MongoDB', err));

/* Product Schema */
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    category: String
});

const Product = mongoose.model('Product', productSchema);

/* Category Schema */
const categorySchema = new mongoose.Schema({
    name: String
});

const Category = mongoose.model('Category', categorySchema);

/* Send a message to the browser */
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Dresstore application." })
});



//Routes for /products

//Find Product that contain 'kw' in the name

app.get("/products", (req, res) => {

    Product.find({ name: new RegExp(req.query.name, 'i') }).then(product => {
        res.send(product);
    }).catch(err => {
        res.status(400).send(err.message);
    });
});


app.route("/products")
    //Get all products
    .get((req, res) => {
        Product.find().then(products => {
            res.send(products);
        }).catch(err => {
            res.status(400).send(err.message);
        });
    })
    //Add a new product
    .post((req, res) => {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category
        });

        product.save().then(() => {
            res.send("Successfully added a new product.");
        }).catch(err => {
            res.status(400).send(err.message);
        });
    });

//Route for /products/:id (Get product by id)

app.get("/products/:id", (req, res) => {
    Product.findById(req.params.id).then(product => {
        res.send(product);
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

//Update product by id

app.put("/products/:id", (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category
    }).then(() => {
        res.send("Successfully updated the product.");
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

//Remove product by id

app.delete("/products/:id", (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(() => {
        res.send("Successfully removed the product.");
    }).catch(err => {
        res.status(400).send(err.message);
    });
});

//Remove all products

app.delete("/products", (req, res) => {
    Product.deleteMany().then(() => {
        res.send("Successfully removed all products.");
    }).catch(err => {
        res.status(400).send(err.message);
    });
});




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})