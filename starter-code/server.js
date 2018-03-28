// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    // package in npm lets you do req.body
   
    db = require('./models');
    // creating db and setting it to require everything from the models folder
    // then we can use new db.Todo or db.Persons

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

// get all todos
app.get('/api/todos', function index(req, res) {
  db.Todo.find({}, function(errrrrr, data) {
    res.json({todos: data});
  })
});

// create new todo
app.post('/api/todos', function create(req, res) {
  //console.log(req.body);
  // create todo in database using req.body

  db.Todo.create(req.body, function(err, data) {
    res.json(data);
  })

  // send todo back as the response

});

// get one todo
app.get('/api/todos/:id', function show(req, res) {
    // get todo id from url params (`req.params`)
    var todoId = req.params.id;

    // find todo in db by id
    db.Todo.findOne({ _id: todoId }, function(err, foundTodo) {
      // passing in the id in the form of object  while passing in the url id
        res.json(foundTodo);
    });
});

// update todo

app.put('/api/todos/:id', function update(req, res) {
  // get todo id from url params (`req.params`)
  var todoId = req.params.id;

  // find todo in db by id
  db.Todo.findOne({ _id: todoId }, function(err, foundTodo) {

      // update the todos's attributes
      foundTodo.task = req.body.task;
      foundTodo.description = req.body.description;

      // save updated todo in db
      foundTodo.save(function(err, savedTodo) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(savedTodo);
        }
      });
    
  });
});
// app.put('/api/todos/:id', function update(req, res) {

//     var todoId = req.params.id;
//     // getting id from the params


//     db.Todo.findOne({
//       _id: todoId
//     }, function(err, foundTodo){
//       // finding one entry
//       // console.log(foundTodo);
//       console.log(err);
//       foundTodo.task = req.body.task;
//       // get it from the form
//       foundTodo.description = req.body.description;
//       // res.json(foundTodo);
//     });

//     foundTodo.save(function (err, updatedTodo) {
//     res.send(updatedTodo);
//   });
//   // todo.size = 'large';
// });


// delete todo
  app.delete('/api/todos/:id', function destroy(req, res) {
  var todoId = req.params.id;
  db.Todo.findOneAndRemove({ _id: todoId }, function (err, deletedTodo) {
    res.json(deletedTodo);
  });
});



// });



/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
