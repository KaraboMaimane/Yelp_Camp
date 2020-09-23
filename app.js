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
            response.render('campgrounds/campgrounds', {campgrounds: campgrounds});
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
    response.render('campgrounds/new');
})

app.get('/campgrounds/:id', (request, response) => {
    Campground.findById(request.params.id).populate("comments").exec((error, foundCampground) => {
        if(!error){
            response.render('campgrounds/view-campground',  {campground: foundCampground});
        } else {
            response.response.redirect('/campgrounds');
        }
    })
})

// =======================================================================================================================================
// Comments Routes
// =======================================================================================================================================
app.get('/campgrounds/:id/comments/new', (request, response) => {
    // find campground by id
    Campground.findById(request.params.id, (error, campground) => {
        if(!error){
            response.render('comments/new', {campground: campground})
        } else {
            console.log(error);
        }
    })
})

app.post('/campgrounds/:id/comments', (request, response) => {
    //lookup campground using id
    Campground.findById(request.params.id, (error, campground) => {
        if(!error){
            //create comment
            Comment.create(request.body.comment, (error, comment) => {
                if(!error){
                    // save the comment to the campgrounds object
                    campground.comments.push(comment);
                    campground.save();
                    response.redirect(`/campgrounds/${campground._id}`);
                } else {
                    console.log(error);
                }
            });
        } else {
            console.log(error);
            response.redirect('/campgrounds')
        }
    })
})

app.listen('2000', () => {
    console.log('YelpCamp is live on port:2000');
});
