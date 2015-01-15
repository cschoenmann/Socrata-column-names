var lineReader = require('line-reader');
var fs = require('fs');
var args = process.argv.slice(2); 
var request = require('request');
var output = fs.createWriteStream('columns.csv', {'flags': 'a'});   // Edit to rename output file of results if needed.
var urllist = 'urllist.txt';		// Text file that lists Socrata URLS to pull from.

var options = {						// This section allows you to pass login creds to private Socrata datasets
    headers: {
        'X-App-Token': 'changeme'    // Enter your Socrata app token
    },
    auth: {
        user: 'changeme',			// Enter your Socrata username
        pass: 'changeme'			// Enter your Socrata password
    }
};

fs.readFile(urllist, function(err, list) {
	if (err) throw err;
	var array = list.toString().split("\n");
	for (i in array) {
		url = array[i]

		options.url = url;
		request(options, function (error,response,body){
			if (!error && response.statusCode == 200) {
				var columns = JSON.parse(body);
				var x = columns[0];
				output.write(response.request.href + "\r\n");
				console.log(response.request.href + "\r\n");
				for (var y in x) {output.write(y + ",")}
					output.write("\r\n" + "\r\n")
			}
		});


	}
});