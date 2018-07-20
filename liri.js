require("dotenv").config();
var request = require('request');
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var value = process.argv;
var values = "";
//attaches multiple word arguments
for (var i = 3; i < value.length; i++)
    {
    if(i > 3 && i < value.length)
    {
    values = values + "+" + value[i];
    }
    else
    {
    values = values + value[i];
    }}

    
// search: function({ type: 'artist OR album OR track', query: 'My search query', limit: 20 }, callback);
function SpotifyThis(values) {

    fs.appendFile('./log.txt', 'Action: node liri.js spotify-this-song ' + values + '\n\n', (err) => {
        if (err) throw err;
    });
    var song;
    if (values === '') {
        song = 'The Sign';
    } else {
        song = values;
    };
    spotify.search({ type: 'track', query: song}, function(err, data) {   
    if (err) {
        return console.log('Error occurred: ' + err);
    } 
    var songInfo=(data.tracks.items[0]);
    var Infos = '------------------------\n' + 
                                    
                    'Song Information:\n' + 
                    '------------------------\n\n' + 
                    'Song Name: ' + songInfo.name + '\n'+ 
                    'Artist: ' + songInfo.artists[0].name + '\n' + 
                    'Album: ' + songInfo.album.name + '\n' + 
                    'Preview Here: ' + songInfo.preview_url + '\n';

            console.log(Infos);
    });
}


function ReadTweets () {
    fs.appendFile('./log.txt', 'Action: node liri.js my-tweets\n\n', (err) => {
        if (err) throw err;
    });
    var client = new Twitter(keys.twitter);

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (error) {
        return console.log('Error occurred: ' + error);
    }
        for (var i = 0; i < 20; i++){
            var tweetInfo=(tweets[i]);
            var Info = '---------------------\n' +
                        'My Tweets:\n' +
                    '---------------------\n\n'+
                    'Date: '+ tweetInfo.created_at + '\n'+
                    'Tweet: ' + tweetInfo.text + '\n';
            console.log(Info);
        }

    });
}
    

function MovieMe (values) {
    fs.appendFile('./log.txt', 'Action: node liri.js movie-this ' + values + '\n\n', (err) => {
        if (err) throw err;
    });
  
    var movie;
    if (values === '') {
        movie = 'Mr. Nobody';
    } else {
        movie = values;
    };

    request("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

    
        if (!error && response.statusCode === 200) {

            var info = '---------------------\n' +
            'Movie Info:\n' +
            '---------------------\n\n' +
            'Title: ' + JSON.parse(body).Title + '\n'+
            'Year: ' + JSON.parse(body).Released + '\n'+
            'IMDB Rating: ' + JSON.parse(body).imdbRating + '\n'+
            'Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value + '\n'+
            'Country: ' + JSON.parse(body).Country + '\n'+
            'Language: ' + JSON.parse(body).Language + '\n'+
            'Plot: ' + JSON.parse(body).Plot + '\n'+
            'Actors: ' + JSON.parse(body).Actors + '\n';
            
            console.log(info);

        }
        else {

        return console.log('Error occurred: ' + error);
        }

    });
}



function JustDOIT () {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'Action: node liri.js do-what-it-says\n\n', (err) => {
		if (err) throw err;
	});

	// Read in the file containing the command
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('Err: ' + error);
			return;
        } 
        else 
        {
			// Split out the command name and the parameter name
			var Sparse = data.split(',');
			var command = Sparse[0].trim();
			var param = Sparse[1].trim();

			switch(command) {
				case 'my-tweets':
					ReadTweets(); 
					break;

				case 'spotify-this-song':
					SpotifyThis(param);
					break;

				case 'movie-this':
					MovieMe(param);
					break;
			}
		}
    });
}

if (action === "spotify-this-song") 
{
    SpotifyThis(values);
}
else if (action === "my-tweets")
{  
    ReadTweets ();
}
else if (action === "movie-this")
{
    MovieMe(values);
}
else if (action === "do-what-it-says") 
{
    JustDOIT ();
}
else 
{
    console.log ("Please put in a proper command. (movie-this + movie name ,spotify-this-song + song name, my-tweets, do-what-it-says)")
}
