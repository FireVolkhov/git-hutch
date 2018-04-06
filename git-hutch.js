const http = require('./http');
const _ = require('lodash');

const argv = {
	command: '',
	task: ''
};

process.argv.forEach(function (val, index, array) {
	if (val === '--start') {
		argv.command = 'start';
		argv.task = array[index + 1];
	}
});

switch (argv.command) {
	case 'start':
		if (argv.task) {
			start(argv.task);
		} else {
			throw new Error('Task name not found');
		}
		break;

	default:
		throw new Error('Not valid command');
}

async function start(taskName) {
	const options = {
		auth: {
			user: 's.gavrilov',
			pass: 'JzFvz9ykrP'
		}
	};
	const task = await http.json('https://jira.parcsis.org/rest/api/2/issue/' + taskName, options);

	if (task.fields.assignee.name !== options.auth.user) {
		throw new Error(`Task ${taskName} assignee with ${task.fields.assignee.name}, but not with ${options.auth.user}`);
	}

	// const response = await http.get(`https://jira.parcsis.org/secure/WorkflowUIDispatcher.jspa?id=${task.id}&action=4`);
	const response = await http.json(`https://jira.parcsis.org/rest/api/2/issue/${taskName}/transitions`, options);
	// const response = await http('https://jira.parcsis.org/browse/' + task, options);
	_.each(task, (v,k) => console.log(k,v));

	console.log(response);

	const res = await http.post(`https://jira.parcsis.org/rest/api/2/issue/${taskName}/transitions`, _.extend(options, {json: {"transition": {"id": "4"}}}));
	// const res = await http.post(`https://jira.parcsis.org/rest/api/2/issue/${taskName}/transitions`, _.extend(options, {json: {"transition": {"id": "1291"}}}));
	console.log(res);
}
