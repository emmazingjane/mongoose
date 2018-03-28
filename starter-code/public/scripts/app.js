// wait for DOM to load before running JS
$(document).ready(function() {

  // base API route
  var baseUrl = '/api/todos';

  // array to hold todo data from API
  var allTodos = [];

  // element to display list of todos
  var $todosList = $('#todos-list');

  // helper function to render all todos to view
  // note: we empty and re-render the collection each time our todo data changes
  function render() {
    // empty existing todos from view
    $todosList.empty();

    // pass `allTodos` into the template function
    var todosHtml = template(allTodos);

    // append html to the view
    $todosList.append(todosHtml);
  };

  // GET all todos on page load
  $.ajax({
    method: "GET",
    url: baseUrl,
    success: function onIndexSuccess(data) {
      console.log('GET /api/todos response:', data);

      // set `allTodos` to todo data from API
      allTodos = data.todos;

      // render all todos to view
      render();
    }
  });


  // form to create new todo
  var $createTodo = $('#create-todo');
  // listen for submit even on form
  $createTodo.on('submit', function (event) {
    event.preventDefault();

    // serialze form data
    var newTodo = $(this).serialize();

    // POST request to create new todo
    $.ajax({
      method: "POST",
      url: baseUrl,
      data: newTodo,
      success: function onCreateSuccess(response) {
        console.log(response);

        // add new todo to `allTodos`
        allTodos.push(response);

        // render all todos to view
        render();
      }
    });

    // reset the form
    $createTodo[0].reset();
    $createTodo.find('input').first().focus();
  });

  // add event-handlers to todos for updating/deleting

  // for update pencil icon: when any  `.edit-icon` link
  // is clicked, toggle showing/hiding the associated edit form
  $todosList.on('click', '.edit-icon', function (event) {
    event.preventDefault();

    // grab the target DOM id from the extra data stored on this element
    var editFormDivId = $(this).data('target');
    // toggle the target element's visibility
    $(editFormDivId).toggle()
  })


  // for update: submit event on any `.update-todo` form
  // ... inside the todosList element
  $todosList.on('submit', '.update-todo', function (event) {
    event.preventDefault();

    // find the todo's id (stored in HTML as `data-id`)
    var todoId = $(this).closest('.todo').attr('data-id');

    // find the todo to update by its id
    var todoToUpdate = allTodos.filter(function (todo) {
      return todo._id == todoId;
    })[0];

    // serialze form data
    var updatedTodo = $(this).serialize();

    // PUT request to update todo
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/' + todoId,
      data: updatedTodo,
      success: function onUpdateSuccess(data) {
        // replace todo to update with newly updated version (data)
        allTodos.splice(allTodos.indexOf(todoToUpdate), 1, data);

        // render all todos to view
        render();
      }, 
      error: function onError(err) {
        console.log(err)
      }
    });
  })

  // for delete: click event on any `.delete-todo` button
  // ... inside the todosList element
  $todosList.on('click', '.delete-todo', function (event) {
    event.preventDefault();

    // find the todo's id (stored in HTML as `data-id`)
    var todoId = $(this).closest('.todo').attr('data-id');

    // find the todo to delete by its id
    var todoToDelete = allTodos.filter(function (todo) {
      return todo._id == todoId;
    })[0];

    // DELETE request to delete todo
    $.ajax({
      type: 'DELETE',
      url: baseUrl + '/' + todoId,
      success: function onDeleteSuccess(data) {
        // remove deleted todo from all todos
        allTodos.splice(allTodos.indexOf(todoToDelete), 1);

        // render all todos to view
        render();
      }
    });
  });

});

function template(todosList){
  // create array of individual todo html strings
  var todoItemArr = todosList.map(templateSingle);
  // join (combine) array into one string of html and return
  return todoItemArr.join('');
}

function templateSingle(todo){
  return `<li class="card todo" data-id="${todo._id}">

        <!-- todo label (task) -->
        <div class="card-title center">${todo.task}</div>

        <div class="card-content">
          <!-- todo description -->
          ${todo.description}
          </div>

        <div class="card-action">
          <!-- pencil icon to toggle update form -->
          <a href="javascript:void(0)" class="edit-icon" data-target="#update-${todo._id}">
            <i class="small material-icons">mode_edit</i>
          </a>

          <!-- trash can icon to delete todo -->
           <a href="javascript:void(0)" class="delete-todo">
            <i class="small material-icons">delete</i>
          </a>

          <!-- form to update todo -->
          <div id="update-${todo._id}" style="display: none;">
            <br>
            <form class="update-todo">
              <input type="text" name="task" class="form-control" placeholder="Task" value="${todo.task}">
              <input type="text" name="description" class="form-control" placeholder="Description" value="${todo.description}">
              <input type="submit" class="btn orange" value="Update">
            </form>
          </div>
        </div>
      </li>`;
}
