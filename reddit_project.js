var inquirer = require('inquirer');
var prompt = require('prompt');
var request = require('request');
var colors = require('colors');
var redditFunctions = require('./reddit.js');
var requestJson = redditFunctions.requestJson;
var getHomepage = redditFunctions.getHomepage;
var getSortedHomepage = redditFunctions.getSortedHomepage;
var getSubreddit = redditFunctions.getSubreddit;
var getSortedSubreddit = redditFunctions.getSortedSubreddit;
var getSubreddits = redditFunctions.getSubreddits;
var imageToAscii = require("image-to-ascii");  // it is not like this in the documentation because it is the newer version in the documentation. but we are using old version here

// imageToAscii("https://octodex.github.com/images/octofez.png", function(err, converted) {
//     console.log(err || converted);
// });

var menuChoices = [
  {name: 'Show homepage', value: 'HOMEPAGE'},
  {name: 'Show subreddit', value: 'SUBREDDIT'},
  {name: 'List subreddits', value: 'SUBREDDITS'}
];


function mainMenu(choice) {
    console.log(1);
    inquirer.prompt({
        type: 'list',
        name: 'menu',
        message: 'What do you want to do?',
        choices: menuChoices
    }).then(
        function(answers) {
            console.log(2);
            var choice = answers.menu; // if you try to run this inquirer function, you will get an object like {menu: Subreddit}. That is why we put 'answers.menu' here. 
            if (choice === 'HOMEPAGE') {
                getHomepage(function(err, response) {// actually we should use 'homepagePosts' instead of 'response' to make it more real!
                    if (err) {                      //according to file reddit.js, we need to pass callback function as parameter to function getHomepage. that is why we use function(err, response) here in the previous line.
                        console.log('err'); // as a developer, it is good to console.log('err') so that you know what the error is (instead of using console.log('there is an error'). Or console.log('err.stack') is even better because it show the stack of error where the error came from. 
                    }
                    else {
                        console.log(3);
                        response.forEach(function(element) {
                                console.log('\n');
                                console.log(('Title: ').green.bold + (element.data.title).red.bold);
                                console.log(('URL: ').blue.bold + (element.data.url).blue.underline);
                                console.log(('User: ').rainbow.bold + (element.data.author).rainbow);
                                console.log(('Upvotes: ' + element.data.ups).yellow);
                            })
                            mainMenu();
                        }
                    })
                }
            else if (choice === 'SUBREDDIT') {
                console.log(4);
                prompt.get('enter_a_subreddit', function(err, result) { // try to do this with 'inquirer' as well
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(5, result);
                        getSubreddit(result.enter_a_subreddit, function(err, response) {
                            if (err) {
                                console.log('err', err);
                            }
                            else {
                                response.forEach(function(element) {
                                console.log('\n');
                                console.log(('Title: ').green.bold + (element.data.title).red.bold);
                                console.log(('URL: ').blue.bold + (element.data.url).blue.underline);
                                console.log(('Username: ').rainbow.bold + (element.data.author).rainbow);
                                console.log(('Upvotes: ' + element.data.ups).yellow);
                                })
                                mainMenu();
                            }
                        })
                    }
                })
            }
            else if (choice === 'SUBREDDITS') {
                console.log(6);
                getSubreddits(function(err, response) { //according to file reddit.js, we need to pass callback function as parameter to function getSubreddits. that is why we use function(err, response) here. 
                 //   var SubredditsChoice = response.choice;
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(7);
                        var listOfSubreddits = response.map(function(element) {
                            return {   // because here we will use 'Inquirer' to ask question later. That is why we use 'map' here because it will create a new array. This array will have 'name' and 'value' just like the menuChoice array at the beginning when we first used Inquirer where we also provided an array of names and values as 'choices'
                                name: element.data.title,
                                value: element.data.display_name, // maybe we put 'title' as name and 'display_name' as value because they appear to be the same on https://www.reddit.com/subreddits.json
                            }
                        })
                        inquirer.prompt({
                            type: 'list',
                            name: 'subreddits',
                            message: 'Please choose a subreddit',
                            choices: listOfSubreddits.concat(new inquirer.Separator(),{name: 'go back to main menu', value: 'MAIN'}) // this 'listOfSubreddits' refers to the array that we just mapped just now. but according to the instruction, we need to add 'go back to the main menu' to the list. but the list is in an array. so we 'concat' it (because concat will create a new array) and then use 'inquirer separator' to add a line into the list to make the list more distictive and easier to find where to go back to main menu. (we dont need to add the line if we dont want to.)
                            // and because we want to add one more option into the list. that means we need to add one more more item ('name and value'), which in this case is an object, into the list in the array. that is why we also need to include {name: 'go back to main menu', value: 'MAIN'} in here as well
                        }).then(function(answers) {
                            console.log(answers);
                            if (answers.subreddits === 'MAIN') {
                                mainMenu();
                            }
                            else {
                            getSubreddit(answers.subreddits, function(err, response) { //according to file reddit.js, we need to pass callback function as parameter to function getSubreddits. that is why we use function(err, response) here. 
                                if (err) {
                                    console.log(err.stack);
                                }
                                else {
                                    response.map(function(element) {
                                        return {
                                            'Title' : element.data.title,
                                            'URL' : element.data.url,
                                            'Username' : element.data.author,
                                            'Upvotes' : element.data.ups
                                        }
                                    })
                                    .forEach(function(element) {
                                        console.log('\n');
                                        console.log(('Title: ').green.bold + (element.Title).red.bold);
                                        console.log(('URL: ').blue.bold + (element.URL).blue.underline);
                                        console.log(('Username: ').rainbow.bold + (element.Username).rainbow);
                                        console.log(('Upvotes: ' + element.Upvotes).yellow);
                                    })
                                    // check if there is an image in the post (if statement)
                                    // need 2 properties - post_hint (permalink )and url
                                    // run ascii function and put in the url
                                    mainMenu();
                                }
                            });
                            
                    }})
                    
                }
            })
        }
    })
}

mainMenu();