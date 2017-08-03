var urlparser = require('parseurl');



var helper = {};

helper.parse = function(req){
  return urlparser(req);
}

module.exports = helper;
