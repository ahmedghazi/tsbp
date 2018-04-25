// Example model

var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var UsersSchema = new Schema({
    type: String,
    email: {
        unique: true,
        index: true,
        type: String
    },
    password: String,
    name: {type: String, default: "Anon"},
},{
    timestamps: true
});

mongoose.model('Users', UsersSchema);

