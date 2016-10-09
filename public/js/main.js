

// better than 500 lines of polyfill to get the actual fetch that is true to WHATWG spec
var fetchJsonResource = function(options){
	if(typeof options == 'string') 
		options = {url:options}
	options = _.defaults({
		method: 'GET'
	},options)
	console.log(options)
	var request = new XMLHttpRequest()
	var requestPromise = new Promise(function(resolve,reject){
		request.addEventListener("load", function(){
			resolve(this)
		})
	}).then(function(resp){
		return JSON.parse(resp.responseText)
	})
	console.log(request)
	request.open(options.method, options.url)
	if(options.headers)
		_.forEach(_.spread(request.setRequestHeader.bind(request)), options.headers)
	request.send(options.body)
	return requestPromise
}

!function(){
	var disableInput = function(){
		//XXX code me, if you desire
		// If it takes a long time to submit a rating and select a new tweet
		// to display and display it, then we should block the user from 
		// accidentally submitting a rating
	}
	var enableInput = function(){
		//XXX code me, if you desire
	}
	var fetchTweetIdForRating = function(){
		// don't be fooled by fancy url. This returns an array consisting of a single tweet that needs review
		return fetchJsonResource('api/tweets?needs_rating=true&count=1')
		.then(function(tweets){
			return tweets[0].id_str
		})
	}

	var failedToLoadTweet = function(failedTweetId){
		return fetchJsonResource({
			method: "PUT",
			url: '/api/tweets/'+failedTweetId+'/ratings',
			body: JSON.stringify({skip:true}),
			headers: [['Content-Type','application/json']]
		})
		.then(fetchTweetIdForRating)
		.then(populateViewerWithTweet)
	}

	var populateViewerWithTweet = function(tweetId){
		var tweetContainerEl = document.getElementById('tweet-container')
		tweetContainerEl.innerHTML = ''

		return twttr.widgets.createTweet(tweetId, tweetContainerEl)
		.then(function(el){
			if(el){
				//tweet successfully loaded
				tweetContainerEl.dataset.displayedTweetId = tweetId
				window.scrollTo(0,document.body.scrollHeight)
				return el
			}else{
				return failedToLoadTweet(tweetId)
			}
		})
		.catch(_.partial(failedToLoadTweet, tweetId))
	}
	
	document.addEventListener('DOMContentLoaded', function(){
		fetchTweetIdForRating().then(populateViewerWithTweet)

		// I read a blog post once about not using [].forEach.call, which really made me want to use it more.
		![].forEach.call(document.querySelectorAll('#scale-input button'), function(element){
			element.addEventListener('click', function(e){
				e.preventDefault()
				if( !e.target.dataset.rating){
					alert('Unable to determine rating. This is broken. File an issue, then go outside and take a break from the computer.')
					return
				}
				disableInput()
				fetchJsonResource({
					method: "PUT",
					url: '/api/tweets/'+document.getElementById('tweet-container').dataset.displayedTweetId+'/ratings',
					body: JSON.stringify({rating:parseInt(e.target.dataset.rating)}),
					headers: [['Content-Type','application/json']]
				})
				.then(fetchTweetIdForRating)
				.then(populateViewerWithTweet)
				.then(enableInput)
			})
		})
	})

}()
