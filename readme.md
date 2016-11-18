#MEAN Session 10

##Homework

##Bower

`$ npm install -g bower`

`$ bower lookup bootstrap-sass`

`$ bower install bootstrap-sass`


##Form Validation


The fieldset element functions as a structural container for different sections within a form element. 

The label element attaches descriptive information to form elements like input fields, radiobuttons, textareas.

Other data types

```html
<label for="email">Email:</label> 
<input type="email" name="email" required placeholder="email@example.com" />

<label for="website">Website:</label> 
<input type="url" name="website" required placeholder="http://www.example.com" />

<label for="number">Number:</label> 
<input type="number" name="number" min="0" max="10" step="2" required placeholder="Even num < 10">

<label for="range">Range:</label> 
<input type="range" name="range" min="0" max="10" step="2" />

<label for="date">Date</label> 
<input type="date" name="date" />

<label for="message">Message:</label> 
<textarea name="message" required></textarea>

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

Add 

- placeholder text
- novalidate - use html5 form elements but not for validation

```html
<form ng-submit="addPirate(pirate)" novalidate>
    <input type="text" placeholder="Name" ng-model="pirate.name" />
    <input type="text" placeholder="Vessel Name" ng-model="pirate.vessel" />
    <input type="text" placeholder="Favorite weapon" ng-model="pirate.weapon" />
    <input type="submit" value="Add Pirate">
</form>
```


##Angular Validation

- Add name attribute to form
- Add required to form fields
- Add name attributes for fields

```html
<form name="addPirateForm" ng-submit="addPirate(pirate)" novalidate>
    <input name="name" type="text" required placeholder="Name" ng-model="pirate.name" />
    <p ng-show="addPirateForm.name.$invalid" class="help-block">required</p>
    <input name="vessel" type="text" required placeholder="Vessel Name" ng-model="pirate.vessel" />
    <p ng-show="addPirateForm.vessel.$invalid" class="help-block">required</p>
    <input name="weapon" type="text" required placeholder="Favorite weapon" ng-model="pirate.weapon" />
    <p ng-show="addPirateForm.weapon.$invalid" class="help-block">required</p>
    <input type="submit" value="Add Pirate">
</form>
```

- Add ng-disabled

```html
<form name="addPirateForm" ng-submit="addPirate(pirate)" novalidate>
    <input name="name" type="text" required placeholder="Name" ng-model="pirate.name" />
    <p ng-show="addPirateForm.name.$invalid" class="help-block">required</p>
    <input name="vessel" type="text" required placeholder="Vessel Name" ng-model="pirate.vessel" />
    <p ng-show="addPirateForm.vessel.$invalid" class="help-block">required</p>
    <input name="weapon" type="text" required placeholder="Favorite weapon" ng-model="pirate.weapon" />
    <p ng-show="addPirateForm.weapon.$invalid" class="help-block">required</p>
    <input ng-disabled="addPirateForm.$invalid" type="submit" value="Add Pirate">
</form>
```
Try adding `ng-minlength="3" ng-maxlength="10"` to the name field.

`<p ng-show="addPirateForm.name.$error.maxlength" class="help-block">Name is too long</p>`

`<p ng-show="addPirateForm.name.$invalid && !addPirateForm.name.$error.maxlength" class="help-block">required</p>`

Some CSS selectors available to us:

```css
.ng-valid       {  }
.ng-invalid     {  }
.ng-pristine    {  }
.ng-dirty       {  }
.ng-touched     {  }

/* really specific css rules applied by angular */
.ng-invalid-required        {  }
.ng-invalid-minlength       {  }
.ng-valid-max-length        {  }
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




























