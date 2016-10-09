# Twitter Harassment Labeling Tool

This is the repository for the tool hosted at http://twitterharassmenttool.tk

To help label tweets as harassing, or not harassing, please visit http://twitterharassmenttool.tk

# Contributing

To get started running the project, clone the repo, `npm install` then run `node server.js`.

The repository includes around 8000 starter tweets in `tweet_data/0.tweets.dat`. These tweets were gathered from Twitters random tweet sample feed over a period of around 8 hours. The format for tweet data files is newline delimited JSON objects for each tweet. Each tweet has a string tweet id, the number of ratings that it has been given, and the average rating. The starter tweets are unlabeled.

Please open a PR if you would like to improve this tool. I'm pretty flexible on contribution guidelines, but as a general rule, if in doubt, keep it short, and make it count.

Everything is GPL3+, so feel free to host your own version elsewhere if you want to gather data for a different set of tweets. 

# Lawyers
This isn't asscociated with Twitter in any way, and complies with all aspects of the Twitter developer agreement. Thank you for your time.