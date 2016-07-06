var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.edit = function(targetId, editedItem) {
    var i = this.loopItems(targetId);
    if (i) {
        this.items[i].name = editedItem;
    }
};

Storage.prototype.delete = function(targetId) {
    var i = this.loopItems(targetId);
    var deleted = this.items.splice(i, 1);
    return deleted[0];
};

Storage.prototype.loopItems = function(targetId) {
    for (var i = 0; i < this.items.length; i++) {
        var loopId = this.items[i].id;
        if (loopId === targetId) {
            return i;
        }
    }
};

var storage = new Storage();
storage.add('Steve Wozniak');
storage.add('MySpace Tom');
storage.add('Dylan Dunne');
storage.add('Aleksandar Grbic')

var app = express();
app.use(express.static('public'));
console.log('express app now running on port 8080');

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.get('/items/:id', function(req, res) {
    var index = storage.loopItems(parseInt(req.params.id));
    res.json(storage.items[index]);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(404);
    }
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    var item = storage.edit(parseInt(req.params.id), req.body.name);
    res.status(200).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(404);
    }

    var deletedItem = storage.delete(parseInt(req.params.id, 10));
    res.status(200).json(deletedItem);
});

console.log(deletedItem);
app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;
