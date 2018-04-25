const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Posts = mongoose.model('Posts');
const postsPerPage = 200;

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
	return Posts
		.find({type:"story"})
		.sort({date: 'desc'})
		.limit(postsPerPage)
		.exec(function(err, posts) {
		    if (err) {
		        console.log(err);
		        return next(err);
		    }
		    //console.log(app.get('title'));
		    return res.render('liste', {
		        title: "title",
		        posts: posts
		    });
		});
});

router.get('/post/:id', (req, res, next) => {
	var populateQuery = [
		{path:'media'}, 
		{path:'author'}, 
		{
			path:'replies',
			populate: {
				path:'media author'
			}
		}
	];

	return Posts
	    .findById(req.params.id)
	    .populate(populateQuery)
	    .exec(function(err, story) {
	        if (err) {
	            return next(err);
	        }
	        return res.render('story', {
                story: story
            });
	});
});

router.get('/p/:page', (req, res, next) => {
	return Posts
	        .find()
	        .sort({date: 'desc'})
	        .limit(postsPerPage)
	        .skip(req.params.page)
	        .exec(function(err, stories) {
	    if (err) {
	        console.log(err);
	        return next(err);
	    }
	    
	    return res.render('liste', {
	        title: app.get('title'),
	        stories: stories
	    });
	});
});

router.get('/up', (req, res, next) => {
	return Posts.find().sort({vote_up: 'desc'}).exec(function(err, stories) {
	    if (err) {
	        console.log(err);
	        return next(err);
	    }
	    
	    return res.render('liste', {
	        title: app.get('title'),
	        stories: stories
	    });
	});
});

router.get('/down', (req, res, next) => {
	return Posts.find().sort({vote_down: 'desc'}).exec(function(err, stories) {
	    if (err) {
	        //console.log(err);
	        return next(err);
	    }
	    
	    return res.render('liste', {
	        title: app.get('title'),
	        stories: stories
	    });
	});
});

router.get('/contact', (req, res, next) => {
	return res.render('contact', {
	    title: app.get('title')
	});
});

router.get('/legal', (req, res, next) => {
	return res.render('legal', {
	    title: app.get('title')
	});
});

