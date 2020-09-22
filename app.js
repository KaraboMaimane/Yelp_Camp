let express       = require('express'),
      app           = express(),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      Campground    = require('./models/campground'),
      Comment       = require('./models/comment'),
      seedDB        = require('./seeds');

seedDB();

mongoose.connect('mongodb://localhost/yelp_camp');

//Retrieving our campgrounds from the database
let campgrounds;

app.use(express.static(__dirname + "/public"));//setting the public file
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));//setting up bodyparser

app.get('/', (request, response) => {
    response.render('landing');
})

app.get('/campgrounds', (request, response) => {
    Campground.find({}, (error, campground) => {
        if (error) {
            campgrounds = [];
            console.error(error);
        } else {
            campgrounds = campground;
            console.log(campground);
            response.render('campgrounds', {campgrounds: campgrounds});
        }
    })
})

app.post('/campgrounds', (request, response) => {

    Campground.create({
        name: request.body.name,
        image: request.body.image
    }, (error, success) => {
        if (error) {
            console.error(error);
        } else {
            console.log('campground successfully added: ', { success: success })
            response.redirect('/campgrounds');
        }
    })
})

app.get('/campgrounds/new', (request, response) => {
    response.render('new');
})

app.get('/campgrounds/:id', (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((error, foundCampground) => {
        if(!error){
            response.render('view-campground',  {campground: foundCampground});
        } else {
            response.response.redirect('/campgrounds');
        }
    })
})

app.listen('2000', () => {
    console.log('YelpCamp is live on port:2000');
})
