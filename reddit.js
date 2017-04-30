var request = require('request');


function requestJson (url, callback) {
    request(url, function(err, response) {
        if (err) {
            callback(err);
        }
        else {
            try {
                var parsed = JSON.parse(response.body);
                callback(null, parsed);
            }
            catch(err) {
                callback(err);
            }
        }
    })
}




/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
    requestJson('https://www.reddit.com/.json', function(err, response) {
        if (err) {
            callback(err);  // we dont do console.log('there is an error') because we need to pass 'callback' to the getHomepage function. It is basically a 'contract' meaning if the function needs 'callback' as parameter, we need to callback(err) here. That is why we callback(err) here instead of using console.log('there is an error'). It is the contract! So you have to do it.  Another reason is this function will be used later. We can console.log('there is an error') inside the function that we will use later.
        }
        else {
            callback(null, response.data.children);  // call back with a null becuase there is no error at this point.
        }
    })
  // Load reddit.com/.json and call back with the array of posts
}

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
    requestJson('https://www.reddit.com/' + sortingMethod + '.json', function(err, response) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, response.data.children);
        }
    })
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
    requestJson('https://www.reddit.com/r/' + subreddit + '/.json', function(err, response) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, response.data.children);
        }
    })
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
    requestJson('reddit.com/r/' + subreddit + '/' + sortingMethod + '.json', function(err, response) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, response.data.children);
        }
    })
    
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
}

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
    requestJson('https://www.reddit.com/subreddits.json', function(err, response) {
        if (err) {
            callback(err);
        }
        else {
           // console.log('response.children', response.data);
            callback(null, response.data.children);
        }
    })
  // Load reddit.com/subreddits.json and call back with an array of subreddits
}


// export the API
module.exports = {
    requestJson: requestJson,
    getHomepage: getHomepage,
    getSortedHomepage: getSortedHomepage,
    getSubreddit: getSubreddit,
    getSortedSubreddit: getSortedSubreddit,
    getSubreddits: getSubreddits
};