const express = require('express')
const app = express()
const port = 3000
const Octokit = require("@octokit/rest");

const octokit = Octokit();

app.get('/', (request, response) => {
  response.send('Hello from Express!')
});

app.get('/topusers', async (request, response) => {
	var location = request.query.location;
	var amount = request.query.amount;
	var result = [];

	if(amount == null || amount == null) {
		response.send('parameters missing or invalid');
		return;
	} else if(amount == 50 || amount == 100) {
		var resultData = await octokit.search.users({q: "location:" + location, sort:"repositories", per_page:amount})
		result = resultData.data.items.map(user => user.login);
	} else if (amount == 150) {
		var resultData1 = await octokit.search.users({q: "location:" + location, sort:"repositories", per_page:100})
		var resultData2 = await octokit.search.users({q: "location:" + location, sort:"repositories", per_page:50, page:2})
		var result1 = resultData1.data.items.map(user => user.login);
		var result2 = resultData2.data.items.map(user => user.login);
		result = result1.concat(result2);
	} else {
		response.send('amount not supported');
		return;
	}

	response.send(result);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});
