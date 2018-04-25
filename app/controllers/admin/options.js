var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Options = mongoose.model('Options'),
    Posts = mongoose.model('Posts'),
    mailer = require('../../lib/mailer'),
    _app;

module.exports = function (app) {
    _app = app;
    app.use('/admin/options', isAuthenticated, router);
};

var isAuthenticated = function (req, res, next) {
    //return next();
    if (req.isAuthenticated())
        return next();
        res.redirect('/security/login');
    
    return next();
}

router.get('/all', function (req, res, next) {
    Options
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, options) {
        //.find(function (err, posts) {
            if (err) return next(err);
            return res.send(options);
            
    });
});

router.get('/', function (req, res, next) {
    Options
        .find()
        .sort({date_created: 'desc'})
        //.populate({path: 'parent jours'})
        .exec(function(err, options) {
        //.find(function (err, posts) {
            if (err) return next(err);
         
            res.render('admin/options/options', {
                title: 'Options',
                options: options,
                admin: req.user
            });
    });
});


router.get('/new', function (req, res, next) {
    return res.render('admin/options/options-new', {
        title: 'Ajouter un utilisateur',
        admin: req.user
    });
});



router.post('/new', function (req, res, next) {
    console.log(req.body)
    var options = new Options(req.body);
    options.save(function(err) {
        if (err) {
            return res.send(err);
        }
   
        res.redirect('/admin/options/');
        
    });
});

router.get('/edit/:id', function (req, res, next) {
    Options
        .findOne({_id: req.params.id})
        //.populate({path: 'image enfants options_in'})
        .exec(function(err, user) {
        //.find(function (err, posts) {
            if (err) return next(err);

            res.render('admin/options/options-edit', {
                title: 'Options',
                user: user,
                admin: req.user
            });
        });
});

router.post('/edit/:id', function (req, res, next) {
    Options.findOne({ _id: req.params.id }, function(err, user) {
        if (err) {
            return res.send(err);
        }

        for (prop in req.body) {
            user[prop] = req.body[prop];
        }

        user.save(function(_err) {
            if (_err) {
                return res.send(_err);
            }

            res.redirect('/admin/options/edit/'+req.params.id)
        });
    });
});

router.get('/delete/:id', function (req, res, next) {
    Options.remove({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
          return res.send(err);
        }

        res.redirect('/admin/options/');
    });
});



