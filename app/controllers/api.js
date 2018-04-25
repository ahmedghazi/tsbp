var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    _app,
    //urlSlug = require('url-slug'),
    async = require('async'),
    oembed = require('oembed'),
    Options = mongoose.model('Options'),
    Attachments = mongoose.model('Attachments'),
    Posts = mongoose.model('Posts'),
    Users = mongoose.model('Users');
    

module.exports = function (app) {
    _app = app;
    app.use('/api', router);
};

router.get('/update-admin', function (req, res, next) {
    var body = {
        email:"admin76",
        password:"a27Le5GB",
        type:"admin"
    }

    Users.findOneAndUpdate({type: "admin"}, body, {}, function (err, user, raw) {
        res.redirect('/');
    });
});

router.get('/setup', function (req, res, next) {
    async.parallel([
        function(callback) {
            var user = new Users({
                email:"admin",
                password:"passssap",
                type:"admin"
            });
            user.save(function(err) {
                if (err) {
                    return res.send(err);
                }

                callback();
            });
        },
        function(callback) {
            var site_name = "Site name"
            var option = new Options({
                meta:{
                    key: "site_name",
                    value: site_name
                }
            });
            option.save(function(err) {
                if (err) {
                    return res.send(err);
                }
                _app.locals.site_name = option.meta.value;
                callback();
            });
        }
    ], function(err, results) {
        res.redirect('/admin');
    });

    //_app.locals.site_name
    
});

router.post('/new', function (req, res, next) {
    console.log(req.body)
    var user = new Users(req.body);
    user.save(function(err) {
        if (err) {
            return res.send(err);
        }

        res.redirect('/admin/users/');
        
    });
});

router.get('/drop', function(req, res, next) {
    req.resetDb();
    res.redirect("/");
    //res.send("done")
});

router.get('/c', function (req, res, next) {
    console.log("/c")
    return res.render('create', {
        title: "title",
        description: "Create"
    });
})

router.post('/c', function(req, res, next){
    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
    var query = {email:req.body.email}
    var update = {
        name:req.body.name, 
        email:req.body.email,
        ip: ip
    }
    Users.findOneAndUpdate(query, update, {
        upsert: true,
        'new': true
    }, function(err, user, raw) {
        if(req.body.media.indexOf("gif") != -1){
            var content = '<img src="'+req.body.media+'" width="100%" height="">'
            var media = new Attachments({
                thumbnail: req.body.media
            });

            media.save(function (err) {
                var post = new Posts({
                    type: req.body.type,
                    title: req.body.title,
                    content:req.body.content,
                    media:media._id,
                    date: new Date(),
                    author: user._id
                });
                post.save(function (err) {
                    if (err)
                        return console.log(err);

                    res.redirect('/post/'+post._id);
                });
            });

        }else{
            oembed.fetch(req.body.media, { maxwidth: 1920 }, function(error, result) {
                if (error){
                    console.error(error);
                }else{
                    console.log(result)
                    var media = new Attachments({
                        thumbnail: result.thumbnail_url
                    });

                    media.save(function (err) {
                        var post = new Posts({
                            title:req.body.title,
                            content:result.html,
                            media:media._id,
                            date: new Date(),
                            author: user._id
                        });
                        post.save(function (err) {
                            if (err)
                                return console.log(err);

                            res.redirect('/post/'+post._id);
                        });
                    });

                }     
            });
        } 
    });
})

router.post('/r', function(req, res, next){
    var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
    var query = {email:req.body.email}
    var update = {
        name:req.body.name, 
        email:req.body.email,
        ip: ip
    }
    Users.findOneAndUpdate(query, update, {
        upsert: true,
        'new': true
    }, function(err, user, raw) {
        if(req.body.media.indexOf("gif") != -1){
            var content = '<img src="'+req.body.media+'" width="100%" height="">'
            var media = new Attachments({
                thumbnail: req.body.media
            });

            media.save(function (err) {
                var reply = new Posts({
                    type:req.body.type,
                    title:req.body.title,
                    content:req.body.content,
                    media:media._id,
                    date: new Date(),
                    author: user._id
                });
                reply.save(function (err) {
                    if (err)
                        return console.log(err);

                    var query = {_id:req.body.reply_to}
                    var update = { $push: {'replies': reply._id} }
                    Posts.findOneAndUpdate(query, update, {
                        upsert: true,
                        'new': true
                    }, function(err, post, raw) {
                        res.redirect('/post/'+post._id);
                    });
                    
                });
            });

        }else{
            oembed.fetch(req.body.media, { maxwidth: 1920 }, function(error, result) {
                if (error){
                    console.error(error);
                }else{
                    console.log(result)
                    media.save(function (err) {
                        var reply = new Posts({
                            type:req.body.type,
                            title:req.body.title,
                            content:req.body.content,
                            media:media._id,
                            date: new Date(),
                            author: user._id
                        });
                        reply.save(function (err) {
                            if (err)
                                return console.log(err);

                            var query = {_id:req.body.reply_to}
                            var update = { $push: {'replies': reply._id} }
                            Posts.findOneAndUpdate(query, update, {
                                upsert: true,
                                'new': true
                            }, function(err, user, raw) {
                                res.redirect('/post/'+post._id);
                            });
                            
                        });
                    });

                }     
            });
        } 
    });
})

router.post('/vr', function(req, res, next){
    if(req.session.user) {
        var query = { _id: req.body.id, voters: { $nin: [ req.session.user._id ] } };
        if(req.body.action == "vote_up")update = {$push: {'voters': req.session.user._id}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': req.session.user._id}, $inc: {vote_down:1}};
    }else{
        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
console.log(ip)
        //var query = { _id: req.body.id, voters: { $nin: [ ip ] } };
        var query = { _id: req.body.id };
        if(req.body.action == "vote_up")update = {$push: {'voters': ip}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': ip}, $inc: {vote_down:1}};
    }

    Posts.findOneAndUpdate(query, update, {
        upsert: true,
        'new': true
        }, function (err, story, raw) {
        if (!err) {
            console.log(story)
            return res.send(story);
        } else {
            return console.log(err);
        }

    });
})
/*
// VOTE STORY
this.router.post('/v', function(req, res){
console.log(req.session);
    if(req.session.user) {
        var query = { _id: req.body.id, user: { $ne: ObjectId(req.session.user._id) }, voters: { $nin: [ req.session.user._id ] } };
        if(req.body.action == "vote_up")update = {$push: {'voters': req.session.user._id}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': req.session.user._id}, $inc: {vote_down:1}};
    }else{
        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;

        var query = { _id: req.body.id, voters: { $nin: [ ip ] } };
        if(req.body.action == "vote_up")update = {$push: {'voters': ip}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': ip}, $inc: {vote_down:1}};
    }

    Story.findOneAndUpdate(query, update, {}, function (err, story, raw) {
        if (!err) {
            return res.send(story);
        } else {
            return console.log(err);
        }

    });

});

// VOTE REPLY
this.router.post('/vr', function(req, res){
    console.log(req.session.user)
    if(req.session.user) {
        var query = { _id: req.body.id, voters: { $nin: [ req.session.user._id ] } };
        if(req.body.action == "vote_up")update = {$push: {'voters': req.session.user._id}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': req.session.user._id}, $inc: {vote_down:1}};
    }else{
        var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
console.log(ip)
        //var query = { _id: req.body.id, voters: { $nin: [ ip ] } };
        var query = { _id: req.body.id };
        if(req.body.action == "vote_up")update = {$push: {'voters': ip}, $inc: {vote_up:1}};
        if(req.body.action == "vote_down")update = {$push: {'voters': ip}, $inc: {vote_down:1}};
    }

    Reply.findOneAndUpdate(query, update, {}, function (err, story, raw) {
        if (!err) {
            return res.send(story);
        } else {
            return console.log(err);
        }

    });

});
*/
