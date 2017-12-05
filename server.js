// sits in route, configure various routes
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// heroku sets an env variable named PORT. 
// our port should be PORT if it exists, otherwise 3000.
const port = process.env.PORT || 3000;
// make new express app
var app = express();

// set up directory to link partials
hbs.registerPartials(__dirname + '/views/partials');

//app.set(key, value); allows to set express related configs
// pair. key is the thing to set, value is the value to use
app.set('view engine', 'hbs');
// takes middleware you want to use

// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
	var now = new Date().toString();
	var log =(`${now}: ${req.method} ${req.url}`);
	
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to process server.log.');
		}
	});

	next();
});




hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
})

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
})

// create a handler for an http get request
app.get('/', (req, res) => {
	// res.send('<h1>Hello Express</h1>');
	// res.send({
	// 	name: 'Skyler',
	// 	likes: [
	// 	'Cities',
	// 	'Climbing']
	// });

	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my home page! Rendered using express and handlebars.'
	});
});

// HTTP route handlers: when someone visits root of website, we'll want to send something back
// i.e. json data or html page
// get request, first argument is URL, second is function to run/send back to the requestor
app.get('/about', (req, res) => {
	// res.send responds to request sending some data back
	// res.send('About Page');
	// res.render(template, object w/ inject values) allows to render templates with view engine, the template is the parameter
	// express will look for a views folder in order to find templates

	res.render('about.hbs', {
		pageTitle: 'About Page',
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to fulfill this request'
	});
})


// app.listen binds the application to a port on the machine
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});