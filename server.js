const _ = require('lodash/fp')
const koa = require('koa')
const router = require('koa-route')
const bodyParser = require('koa-bodyparser')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const dataFileNames = fs.readdirSync(__dirname+'/tweet_data').sort()
var tweetData; fs.readFileAsync(__dirname+'/tweet_data/'+dataFileNames[dataFileNames.length-1])
.then(contents=>(console.log('Last tweet data file read'), contents))
.then(contents=> contents.toString().split('\n').slice(0,-1))
.then(_.map(JSON.parse))
.then(_.map(_.defaults({totalRatings:0, averageRating: 0})))
.then(_.sortBy('totalRatings'))
.then(val=>tweetData=val) //hacky



const app = koa()

app.use(bodyParser())
app.use(require('koa-static')(__dirname+'/public'))
app.use(router.get('/api/lol', function *(){
	this.body = "it works."
}))

app.use(router.get('/api/tweets', function *(){
	//actually just returns a single tweet
	this.body = JSON.stringify([tweetData[0]])
}))

var submission_count = 0
app.use(router.put('/api/tweets/:tweetId/ratings', function *(id_str){
	if(this.request.body.skip){
		tweetData = _.reject({id_str}, tweetData)
	} else {
		if ( typeof this.request.body.rating != 'number'
		        || this.request.body.rating > 5
		        || this.request.body.rating < 1 ) {
			this.status = 400
			this.body = JSON.stringify({error:true, message: "rating must be a number between 1 and 5"})
			return
		}
		const tweet = _.find({id_str}, tweetData)
		tweet.totalRatings++
		tweet.averageRating = tweet.averageRating * ((tweet.totalRatings-1)/tweet.totalRatings) + this.request.body.rating * (1/tweet.totalRatings)
		tweetData = _.sortBy('totalRatings', tweetData)
	}
	if(submission_count++%100 == 0 ){
		//dump a new data file every 100 ratings we get.
		fs.writeFile(__dirname+'/tweet_data/'+Date.now()+'.tweets.dat', _.map(JSON.stringify,tweetData).join('\n'))
	}
	this.body = '{"success":true}'
}))

app.listen(8080)
