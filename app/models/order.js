// app/models/order.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OrderSchema   = new Schema({
  user_id : [{ type: Schema.Types.ObjectId, ref: 'User' }],
  drink:    String,
  method:   String
});

module.exports = mongoose.model('Order', OrderSchema);

