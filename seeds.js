let mongoose = require('mongoose');
let Campground = require('./models/campground');
const Comment = require('./models/comment');

var data = [
    {name: 'Crystal Lake', image: 'https://www.photosforclass.com/download/px_699558', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam animi asperiores consectetur, dignissimos, dolorem expedita hic id illum iure magni maiores mollitia quae quibusdam repellat repudiandae saepe veniam voluptatem.\n'},
    {name: 'Camp Voorhees ', image: 'https://www.photosforclass.com/download/px_2662816', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam animi asperiores consectetur, dignissimos, dolorem expedita hic id illum iure magni maiores mollitia quae quibusdam repellat repudiandae saepe veniam voluptatem.\n'},
    {name: 'Elm Street ', image: 'https://www.photosforclass.com/download/pb_1845719', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquam animi asperiores consectetur, dignissimos, dolorem expedita hic id illum iure magni maiores mollitia quae quibusdam repellat repudiandae saepe veniam voluptatem.\n'},
]

let seedDB = () => {
    //Remove all campgrounds
    Campground.remove({}, (error) => {
        if(error){
            console.log(error)
        } else {
            console.log('Removed campgrounds');

            data.forEach((seed) => {
                //add a few campgrounds
                Campground.create(seed, (error, campground) => {
                    if(!error){
                        console.log('campground added', campground);
                        Comment.create({
                            text: "This is an awesome place to die for",
                            author: "Thabo"
                        }, (error, comment) => {
                            if(!error){
                                campground.comments.push(comment);
                                campground.save();
                                console.log('Comment created', comment);
                            } else {
                                console.log(error);
                            }
                        });

                    } else {
                        console.error(error);
                    }
                });
            })
        }
    })



}

module.exports = seedDB;


