const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
  items[id] = text;
  fs.writeFile(`${exports.dataDir}/${id}.txt`, items[id], (err) => {
     if(err){
       throw err; 
     }  
     callback(null, { id, text });
  })
   
  });
};

exports.readAll = (callback) => {

  const dir = "./test/testData";

  fs.readdir(dir, (err, files) => {
    if(err){
      callback(null, []);
    }
    var dataResults = []
    files.forEach(file => {
      var data = {};
      data['id'] = file.slice(0, 5); 
      data['text'] = file.slice(0, 5); 
      dataResults.push(data); 
    });
    callback(null, dataResults);
  })

};

exports.readOne = (id, callback) => {
  var text = items[id];
  const dir = `${exports.dataDir}/${id}.txt`;

  fs.readFile(dir, 'utf8', (err, data) => {
    if(err){
      callback(err, null);
    }
   else{
    callback(null,  {'id': id, 'text': data});

  } 
 })
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
