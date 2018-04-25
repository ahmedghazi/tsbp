// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'Users'},
  media: {type: Schema.Types.ObjectId, ref: 'Attachments'},
  type: String,
  title: {type: String, default: "Untitled"},
  texte: {type: String},
  content: {type: String},
  date: {type: Date, default: Date.now},
  replies: [{type: Schema.Types.ObjectId, ref: 'Posts'}],
  vote_up: {type: Number, default: 0},
  vote_down: {type: Number, default: 0},
  voters: {type:Array}
},{
    timestamps: true
});

mongoose.model('Posts', PostsSchema);

