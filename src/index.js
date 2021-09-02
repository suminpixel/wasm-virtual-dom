var data = {
	heading: 'My Todos',
	todos: ['Swim', 'Climb', 'Jump', 'Play']
};

var template = function (props) {
	return `
		<h1>${props.heading}</h1>
		<ul>
			${props.todos.map(function (todo) {
				return `<li>${todo}</li>`;
			}).join('')}
		</ul>`;
};

var app = document.querySelector('#app');
app.innerHTML = template(data);


//https://gomakethings.com/dom-diffing-with-vanilla-js/