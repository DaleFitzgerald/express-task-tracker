const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// Set templating engine as ejs
app.set('view engine', 'ejs');

//  Serving static files
app.use(express.static('public'));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride('_method'));

// database URL
const url = `mongodb+srv://${process.env.SECRETS}.mongodb.net/Diary?retryWrites=true&w=majority`

// Connecting app with database heroku
mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(console.log('Connected to DB')).catch(err => console.log(err));

// Import diary model
const Diary = require('./models/diary');

//  ROUTING

// Route for forwardslash /
app.get('/', (req, res) => {
    res.render('Home');

});

//  route for about page
app.get('/about', (req, res) => {
    res.render('About');

});

// Route for forwardslash /
app.get('/diary', (req, res) => {
    Diary.find().then(data => {
        // console.log(data)
        res.render('Diary', {data: data});
    }).catch(err => console.log(err));

});

// Route for add to diary 
app.get('/add', (req, res) => {
    res.render('Add');

});

// Route for specific pages
app.get('/diary/:id', (req, res) => {
    Diary.findOne({_id: req.params.id}).then((data) => {
        res.render('Page', {data: data});
    }).catch(err => console.log(err));

})

// Route for deleting POST
app.delete('/:id/', (req, res) => {
    const { id } = req.params;
    Diary.find().then(data => {
        // console.log(data)
        data = data.filter(post => post.id !== id);
        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

});

// Add to database
app.put('/diary/edit/:id', (req, res) => {
    Diary.findOne({_id: req.params.id}).then((data) => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date

        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

});

// Route for editing post
app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then((data) => {
        res.render('Edit', {data: data});
    }).catch(err => console.log(err));

});

// Route for saving data
app.post('/add-to-diary', (req, res) => {
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    })
    
    // Save data to the db
    Data.save().then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));

});

app.use(express.json());

app.listen(port, console.log('Running on http://localhost:3000/'));