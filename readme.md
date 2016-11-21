#MEAN Session 10

##Homework
- add bootstrap styles to the edit pirate ofrm
- add validation to the edit pirate form

##Update Pirate

Use edit in place in `pirate-detail.html`:

```
<h1>Pirate Detail View</h1>
<div ng-hide="$ctrl.editorEnabled">
    <dl>
        <dt>Name</dt>
        <dd>{{ $ctrl.pirate.name }}</dd>
        <dt>Vessel</dt>
        <dd>{{ $ctrl.pirate.vessel }}</dd>
        <dt>Weapon</dt>
        <dd>{{ $ctrl.pirate.weapon }}</dd>
        <dt>ID</dt>
        <dd>{{ $ctrl.pirate._id }}</dd>
    </dl>
    <button ng-click="$ctrl.enableEditor($ctrl.pirate)">Edit</button>
</div>
<div ng-show="$ctrl.editorEnabled">
    <form ng-submit="$ctrl.savePirate($ctrl.pirate, $ctrl.pirate._id)" name="updatePirate">
        <label>Name</label>
        <input ng-model="$ctrl.pirate.name">
        <label>Vessel</label>
        <input ng-model="$ctrl.pirate.vessel">
        <label>Weapon</label>
        <input ng-model="$ctrl.pirate.weapon">
        <label>ID</label>
        <input ng-model="$ctrl.pirate._id">
        <input type="submit" value="Save">
    </form>
</div>

<button type="submit" ng-click="$ctrl.back()">Back</button>
```

Add the feature to `pirate-detail.component.js`:

```js
angular.module('pirateDetail', []).component('pirateDetail', {
    templateUrl: '/templates/pirate-detail.html',

    controller: ['$scope', '$http', '$routeParams', '$location',
        function PirateDetailController($scope, $http, $routeParams, $location) {
            var self = this;
            $http.get('/api/pirates/' + $routeParams.pirateId)
                .then(function (res) {
                    self.pirate = res.data;
                });

            self.back = function () {
                $location.path('/');
            }

            self.editorEnabled = false;

            self.enableEditor = function () {
                self.editorEnabled = true;
            };

            self.disableEditor = function () {
                self.editorEnabled = false;
            };

            self.savePirate = function (pirate, pid) {
                console.log(pirate.name)
                $http.put('/api/pirates/' + pid, pirate)
                    .success(function (res) {
                        self.editorEnabled = false;
                    })
            }
        }
    ]
});
```

Test buttons. Test editing pirate.

##GULP

Package.json from Image Gallery exercise:

```js
  "devDependencies": {
    "browser-sync": "^2.16.0",
    "gulp": "^3.9.1",
    "gulp-sass": "^2.3.2",
    "gulp-sourcemaps": "^1.6.0"
  }
```

Server.js from Image Gallery exercise:

```
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync')
var express = require('express');

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

var sassSources = './app/public/sass/**/*.scss';
var sassOutput = './app/public/css';
var htmlSource = './app/public/**/*.html';

var app = express();
var port = process.env.PORT || 3000;

gulp.task('sass', function(){
	return gulp.src(sassSources)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(sassOutput))
	.pipe(browserSync.stream())
});

function listening () {
	browserSync({
		proxy: 'localhost:' + port,
		browser: "google chrome"
	});
	gulp.watch(sassSources, ['sass']);
	gulp.watch(htmlSource).on('change', browserSync.reload);
}

app.use(express.static('./app/public'));

app.listen(port, listening);
```

Integrate into our `server.js`:

```
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongoUri = 'mongodb://localhost/rest-apis';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync')

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var sassSources = './assets/scss/**/*.scss';
var sassOutput = './assets/css';
var htmlSource = './assets/**/*.html';

var port = process.env.PORT || 3004;

gulp.task('sass', function() {
    return gulp.src(sassSources)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassOutput))
        .pipe(browserSync.stream())
});

function listening() {
    browserSync({
        proxy: 'localhost:' + port,
        browser: "google chrome"
    });
    gulp.watch(sassSources, ['sass']);
    gulp.watch(htmlSource).on('change', browserSync.reload);
}

var db = mongoose.connection;
mongoose.connect(mongoUri);

app.use(express.static('assets'))

app.use(bodyParser.json());

db.on('error', function() {
    throw new Error('unable to connect at' + mongoUri);
})

require('./models/pirate');
require('./routes')(app);

app.listen(port, listening);
console.log('port 3004');
```

##Bootstrap

Add [bootstrap sass](http://getbootstrap.com/getting-started/#download)

`http://getbootstrap.com/css/`

`http://getbootstrap.com/components/`

Clean the repo and put assets folder in scss.

Edit the main sass file: `@import 'assets/stylesheets/bootstrap';`

Edit index.html:

```
<body>
    <div class="container" ng-view></div>
</body>
```

Apply to pirates-view.html:

```
<h3>Pirates</h3>

<div class="panel panel-primary">
    <div class="panel-heading">
        <h2 class="panel-title">Pirates View</h2>
    </div>
    <div class="list-group">
        <li class="list-group-item" ng-repeat="pirate in pirates">
            <a href="#/pirates/{{ pirate._id }}">{{ pirate.name }}</a>
            <button ng-click="deletePirate($index, pirate._id)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </li>
        </ul>
    </div>
</div>

<h3>Add a Pirate</h3>

<form ng-submit="addPirate(pirate)" name="addform" novalidate>
    <fieldset>
        <div class="form-group">
            <label for="pirate-name">Name</label>
            <input type="text" ng-model="pirate.name" class="form-control" id="pirate-name" placeholder="Name" ng-required="true" />
            <p ng-show="addform.name.$invalid">You must enter a name.</p>
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Vessel</label>
            <input type="text" ng-model="pirate.vessel" class="form-control" id="pirate-vessel" placeholder="Vessel" ng-required="true" />
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Weapon</label>
            <input type="text" ng-model="pirate.weapon" class="form-control" id="pirate-weapon" placeholder="Weapon" ng-required="true" />
        </div>
        <button type="submit" value="Add Pirate" class="btn btn-primary">Add Pirate</button>
    </fieldset>
</form>
</div>
```

Test all functions.


##Form Validation - HTML5

The fieldset element functions as a structural container for different sections within a form element.

The label element attaches descriptive information to form elements like input fields, radiobuttons, textareas. The for attribute: the value of the attribute is the ID of a `<form>` element in the same document. Clicking on it places the focus on the input element.

Other data types

```html
<label for="email">Email:</label> 
<input id="email" type="email" name="email" required placeholder="email@example.com" />

<label for="website">Website:</label> 
<input id="website" type="url" name="website" required placeholder="http://www.example.com" />

<label for="number">Number:</label> 
<input id="number" type="number" name="number" min="0" max="10" step="2" required placeholder="Even num < 10">

<label for="range">Range:</label> 
<input id="range" type="range" name="range" min="0" max="10" step="2" />

<label for="date">Date</label> 
<input id="date" type="date" name="date" />

<label for="message">Message:</label> 
<textarea id="message" name="message" required></textarea>

<input type="submit" value="Send Message" />
```


Note: [styling placeholder text](http://css-tricks.com/snippets/css/style-placeholder-text/)

```css
::-webkit-input-placeholder {
   color: red;
}
:-moz-placeholder { /* Firefox 18- */
   color: red;  
}
::-moz-placeholder {  /* Firefox 19+ */
   color: red;  
}
```

Autofocus

```html
<input type="text" name="name" required placeholder="Name" autofocus />
```

Auto caps and correct

```html
<input type="text" name="test1" autocapitalize="off" />
<input type="text" name="test2" autocorrect="off" />
```

Email vs. type="text"

```html
<label for="email">E-mail</label>
<input name="email" id="email" type="email" required />
```

Input type = URL

```html
<label for="website">Website</label>
<input name="website" id="website" type="url" />
```

novalidation

```html
<form name=”” action=”” novalidate >
```


##Form Validation - Angular

Some CSS selectors available to us:

```css
.ng-valid       {  }
.ng-invalid     {  }
.ng-pristine    {  }
.ng-dirty       {  }
.ng-touched     {  }
```

See the [Angular Forms Guide](https://docs.angularjs.org/guide/forms) for complete documentation.

Add validation to our add pirate form.

- Add name attribute to form
- Add required to form fields
- Add name attributes for fields
- novalidate - is used to disable browser's native form validation

```
<h3>Pirates</h3>

<div class="panel panel-primary">
    <div class="panel-heading">
        <h2 class="panel-title">Pirates View</h2>
    </div>
    <div class="list-group">
        <li class="list-group-item" ng-repeat="pirate in pirates">
            <a href="#/pirates/{{ pirate._id }}">{{ pirate.name }}</a>
            <button ng-click="deletePirate($index, pirate._id)" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </li>
        </ul>
    </div>
</div>

<h3>Add a Pirate</h3>

<form ng-submit="addPirate(pirate)" name="addform" novalidate="">
    <fieldset>
        <div class="form-group">
            <label for="pirate-name">Name</label>
            <input type="text" name="pname" ng-model="name" class="form-control" id="pirate-name" placeholder="Name" ng-minlength="4"
                ng-required="true">
            <p ng-show="addform.pname.$invalid">You must enter a name.</p>
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Vessel</label>
            <input type="text" name="pvessel" ng-model="pirate.vessel" class="form-control" id="pirate-vessel" placeholder="Vessel" ng-required="true">
            <p ng-show="addform.pvessel.$invalid">You must enter a vessel.</p>
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Weapon</label>
            <input type="text" name="pweapon" ng-model="pirate.weapon" class="form-control" id="pirate-weapon" placeholder="Weapon" ng-required="true">
            <p ng-show="addform.pweapon.$invalid">You must enter a weapon.</p>
        </div>
        <button type="submit" value="Add Pirate" class="btn btn-primary">Add Pirate</button>
    </fieldset>
</form>
```

The paras appear on focus. Use `&& addform.pname.$touched` to make them appear afterwards.

Add `ng-disabled` to the submit button.

```
<form ng-submit="addPirate(pirate)" name="addform" novalidate="">
    <fieldset>
        <div class="form-group">
            <label for="pirate-name">Name</label>
            <input type="text" name="pname" ng-model="pirate.name" class="form-control" id="pirate-name" placeholder="Name" ng-required="true">
            <p ng-show="addform.pname.$invalid && addform.pname.$touched">You must enter a name.</p>
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Vessel</label>
            <input type="text" name="pvessel" ng-model="pirate.vessel" class="form-control" id="pirate-vessel" placeholder="Vessel" ng-required="true">
            <p ng-show="addform.pvessel.$invalid && addform.pvessel.$touched">You must enter a vessel.</p>
        </div>
        <div class="form-group">
            <label for="pirate-vessel">Weapon</label>
            <input type="text" name="pweapon" ng-model="pirate.weapon" class="form-control" id="pirate-weapon" placeholder="Weapon" ng-required="true">
            <p ng-show="addform.pweapon.$invalid && addform.pweapon.$touched">You must enter a weapon.</p>
        </div>
        <button type="submit" class="btn btn-primary" ng-disabled="addform.$invalid">Add Pirate</button>
    </fieldset>
</form>
```

Add error class to paragraphs:

```
<p class="error" ng-show="addform.pname.$invalid && addform.pname.$touched">You must enter a name.</p>
...
<p class="error" ng-show="addform.pvessel.$invalid && addform.pvessel.$touched">You must enter a vessel.</p>
...
<p class="error" ng-show="addform.pweapon.$invalid && addform.pweapon.$touched">You must enter a weapon.</p>
```

```css
input.ng-invalid.ng-touched {
    border: 1px solid red;
}

input.ng-valid.ng-touched {
    border: 1px solid green;
}

button[disabled] {
background: gray;
}

.error {
    color: red;
} 
```

Upon submission the form still registers input fields as dirty and we see the error paras. 

Examine the [FormController method](https://docs.angularjs.org/api/ng/type/form.FormController)

```
$scope.addPirate = function (data) {
    $http.post('/api/pirates/', data)
        .success(function () {
            $scope.pirates.push(data);
            $scope.pirate = {}
            $scope.addform.$setPristine();
            $scope.addform.$setUntouched();
        })
};
```

add message to top of form:

`<p ng-show="message">A pirate named {{message}} was added.</p>`

```
$scope.addPirate = function (pirate) {
    $http.post('/api/pirates/', pirate)
        .success(function () {
            $scope.message = pirate.name;
            $scope.pirates.push(pirate);
            $scope.pirate = {}
            $scope.addform.$setPristine();
            $scope.addform.$setUntouched();

        })
};
```

Use ng-class and add bootstrap text-success / text-warning

`<div class="form-group" ng-class="{ 'has-error': addform.name.$touched && addform.name.$invalid }">`

```
<h3>Add a Pirate</h3>
<p class="text-success" ng-show="message">A pirate named {{message}} was added.</p>

<h3>Add a Pirate</h3>
<p ng-show="message">A pirate named {{message}} was added.</p>
<form ng-submit="addPirate(pirate)" name="addform" novalidate="">
    <fieldset>
        <div class="form-group" ng-class="{ 'has-error': addform.pname.$touched && addform.pname.$invalid }">
            <label for="pirate-name">Name</label>
            <input type="text" name="pname" ng-model="pirate.name" class="form-control" id="pirate-name" placeholder="Name" ng-required="true">
            <p class="text-warning" ng-show="addform.pname.$invalid && addform.pname.$touched">You must enter a name.</p>
        </div>
        <div class="form-group" ng-class="{ 'has-error': addform.pvessel.$touched && addform.pvessel.$invalid }">
            <label for="pirate-vessel">Vessel</label>
            <input type="text" name="pvessel" ng-model="pirate.vessel" class="form-control" id="pirate-vessel" placeholder="Vessel" ng-required="true">
            <p class="text-warning" ng-show="addform.pvessel.$invalid && addform.pvessel.$touched">You must enter a vessel.</p>
        </div>
        <div class="form-group" ng-class="{ 'has-error': addform.pweapon.$touched && addform.pweapon.$invalid }">
            <label for="pirate-vessel">Weapon</label>
            <input type="text" name="pweapon" ng-model="pirate.weapon" class="form-control" id="pirate-weapon" placeholder="Weapon" ng-required="true">
            <p class="text-warning" ng-show="addform.pweapon.$invalid && addform.pweapon.$touched">You must enter a weapon.</p>
        </div>
        <button type="submit" class="btn btn-primary" ng-disabled="addform.$invalid">Add Pirate</button>
    </fieldset>
</form>
```



##Showing Errors After Submission


empty string for the error in the scope

```js
$scope.adding_portfolio = {};
			$scope.add_portfolio_error = "";
			$scope.portfolios = [
			{name: 'vessel1309', title: 'Call of Booty', 

in the addPortfolio function

$scope.addPortfolio = function (new_portfolio) {
	// validation goes here before the push
	$scope.portfolios.push(new_portfolio);
	$scope.adding_portfolio = {};
};
```

validation ver 1

```js
$scope.addPortfolio = function (new_portfolio) {

// if new_portfolio is not defined
if (typeof(new_portfolio) === 'undefined') {
    // then add an error message to $scope and exit
    $scope.add_portfolio_error = "The form is not properly filled out";
    return false;
}

	if (!new_portfolio.date || new_portfolio.date.length < 10){
		$scope.add_portfolio_error = "You must provide a date in format yyyy/mm/dd";
	} 
	else 
	{
		$scope.portfolios.push(new_portfolio);
		$scope.adding_portfolio = {};
	};
};
```

validation ver 2

```js
	$scope.addPortfolio = function( new_portfolio ){
		$scope.add_portfolio_error = "";
		// add validation below before the push
		if (!new_portfolio.title) {
			$scope.add_portfolio_error = "Missing title"
		}
		else if (!new_portfolio.date || new_portfolio.date.length < 10){
			$scope.add_portfolio_error = "You must provide a date in format yyyy/mm/dd";
		} else {
			$scope.portfolios.push( new_portfolio );
			$scope.adding_portfolio = {};
		};
	};
};
```

validation ver 3

```js
	$scope.addPortfolio = function( new_portfolio ){
		$scope.add_portfolio_error = "";
		// add validation below before the push
		if (!new_portfolio.title) {
			$scope.add_portfolio_error = "Missing title"
		}
		else if (!new_portfolio.date || new_portfolio.date.length < 10){
			$scope.add_portfolio_error = "You must provide a date in format yyyy/mm/dd";
		} else if (!new_portfolio.description){
			$scope.add_portfolio_error = "Missing description";
		} else if (!new_portfolio.name) {
			$scope.add_portfolio_error = "Missing name - six characters";
		} else {
			$scope.portfolios.push( new_portfolio );
			$scope.adding_portfolio = {};
		};
	};
};
```

Syntax Note - version w/o curly braces also works

```js
	$scope.addPortfolio = function( new_portfolio ){
		$scope.add_portfolio_error = "";
		// add validation below before the push
		if (!new_portfolio.title)
			$scope.add_portfolio_error = "Missing title"
		else if (!new_portfolio.date || new_portfolio.date.length < 10)
			$scope.add_portfolio_error = "You must provide a date in format yyyy/mm/dd";
		else if (!new_portfolio.description)
			$scope.add_portfolio_error = "Missing description";
		else if (!new_portfolio.name)
			$scope.add_portfolio_error = "Missing name - six characters";
		else {
			$scope.portfolios.push( new_portfolio );
			$scope.adding_portfolio = {};
		};
	};
};
```

validation ver 4 - remove the error message after submit

```js
else {
	$scope.portfolios.push(new_portfolio);
	$scope.adding_portfolio = {};
	$scope.add_portfolio_error = "";
}
```




























