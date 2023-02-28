const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const path = require('path')
const https = require('https')
const fs = require('fs')

//google
const passportSetup = require('./passport')
const dotenv = require('dotenv').config()
const passport = require('passport')
const cookieSession = require('cookie-session')

app.use(
	cookieSession({
		name: 'session',
		keys: ['cyberwolve'],
		maxAge: 24 * 60 * 60 * 100
	})
)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
//limiting image size to 50mb
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

const FAQRoute = require('./routes/FAQRouter')
const UserRouter = require('./routes/userrouter')
const PostRouter = require('./routes/postrouter')
const UploadRoute = require('./routes/UploadRoute')
const PostManagementRoute = require('./routes/postManagementRoute')
const BlogManagementRoute = require('./routes/blogRoute')
const TopicManagementRoute = require('./routes/topicRoute')
const TopicPostRoute = require('./routes/topicPostRoute')
const ChatRoute = require('./routes/ChatRoute')
const MessageRoute = require('./routes/MessageRoute')
const FeedbackRoute = require('./routes/feedbackRoute')
const AdvertisementRoute = require('./routes/AdvertisementRoute')
const CommunityRoute = require('./routes/communityRoute')
const CommunityPostRoute = require('./routes/CommunityPostRoute')
const CommunityMessageRoute = require('./routes/CommunityMessageRoute')
const SkillRoute = require('./routes/SkillRoute')
const TrendRoute = require('./routes/TrendRoute')
const AnalyticsRoute = require('./routes/AnalyticsRoute')
const ArticleRoute = require('./routes/ArticleRoute')
const NewsRoute = require('./routes/NewsRoute')
const RecentSearchFeedRoute = require('./routes/RecentSearchFeedRoute')
const ScoreBoxRoute = require('./routes/ScoreBoxRoute')
const QuestionRoute = require('./routes/QuestionRoute')
const DonateRoute = require('./routes/DonateRoute')
const ContactRoute = require('./routes/ContactRoute')

//to images for public
app.use(express.static('public'))
app.use('/images', express.static('images'))

//getting the database url
const URL = process.env.MONGODB_URL

//connect to database url with the given options
mongoose.connect(URL, {
	// useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
	// useFindAndModify: false,
})

//database connection
const connection = mongoose.connection
connection.once('open', function () {
	console.log('db connection success')
})

// var privateKey = fs.readFileSync('./Cert/abc.key', 'utf8').toString()
// var certificate = fs.readFileSync('./Cert/mywebh.com.crt', 'utf8').toString()
// var ca = fs.readFileSync('./Cert/intermediate.crt', 'utf8').toString()
// var credentials = { key: privateKey, cert: certificate, ca: ca }

// const sslServer = https.createServer(credentials, app)

app.get('/', (req, res) => {
	res.json('server started')
})

// sslServer.listen(8070, () => console.log('secure server'))

//when https://18.205.10.114:8070/request ran it will execute FAQRoute.js file
app.use('/faq', FAQRoute)

//when https://18.205.10.114:8070/user ran it will execute userrouter.js file
app.use('/user', UserRouter)

//when https://18.205.10.114:8070/request ran it will execute postrouter.js file
app.use('/post', PostRouter)

//when https://18.205.10.114:8070/request ran it will execute UploadRoute.js file
app.use('/upload', UploadRoute)

//when https://18.205.10.114:8070/request ran it will execute PostManagementRoute.js file
app.use('/postManagement', PostManagementRoute)

//when https://18.205.10.114:8070/request ran it will execute AdvertisementRoute.js file
app.use('/blog', BlogManagementRoute)

//when https://18.205.10.114:8070/request ran it will execute TopicManagementRoute.js file
app.use('/topic', TopicManagementRoute)

//when https://18.205.10.114:8070/request ran it will execute TopicManagementRoute.js file
app.use('/topic_post', TopicPostRoute)

//when https://18.205.10.114:8070/request ran it will execute ChatRoute.js file
app.use('/chat', ChatRoute)

//when https://18.205.10.114:8070/request ran it will execute MessageRoute.js file
app.use('/message', MessageRoute)

//when https://18.205.10.114:8070/request ran it will execute FeedbackRoute.js file
app.use('/feedback', FeedbackRoute)

//when https://18.205.10.114:8070/request ran it will execute AdvertisementRoute.js file
app.use('/advertisement', AdvertisementRoute)

//when https://18.205.10.114:8070/request ran it will execute CommunityRoute.js file
app.use('/community', CommunityRoute)

//when https://18.205.10.114:8070/request ran it will execute CommunityRoute.js file
app.use('/community_post', CommunityPostRoute)

//when https://18.205.10.114:8070/request ran it will execute CommunityMessageRoute.js file
app.use('/com_message', CommunityMessageRoute)

//when https://18.205.10.114:8070/request ran it will execute TrendRoute.js file
app.use('/trend', TrendRoute)

//when https://18.205.10.114:8070/request ran it will execute AnalyticsRoute.js file
app.use('/analytics', AnalyticsRoute)

//when https://18.205.10.114:8070/request ran it will execute ArticleRoute.js file
app.use('/article', ArticleRoute)

//when https://18.205.10.114:8070/request ran it will execute ScoreBoxRoute.js file
app.use('/scoreBox', ScoreBoxRoute)

//when https://18.205.10.114:8070/request ran it will execute SkillRoute.js file
app.use('/skill', SkillRoute)

//when https://18.205.10.114:8070/request ran it will execute NewsRoute.js file
app.use('/news', NewsRoute)

//when https://18.205.10.114:8070/request ran it will execute RecentSearchFeedRoute.js file
app.use('/recentSearchFeed', RecentSearchFeedRoute)

//when https://18.205.10.114:8070/request ran it will execute QuestionRoute.js file
app.use('/question', QuestionRoute)

//when https://18.205.10.114:8070/request ran it will execute TopicPostRoute.js file
app.use('/topicPost', TopicPostRoute)

//when https://18.205.10.114:8070/request ran it will execute DonateRoute.js file
app.use('/donation', DonateRoute)

//when https://18.205.10.114:8070/request ran it will execute contact.js file
app.use('/contact', ContactRoute)

//defining a port to run the application
//use port 8070 or use any other port if the 8070 is unavailable
const PORT = process.env.PORT || 8080

//running the app in previously defined port
const server = app.listen(PORT, () => {
	console.log(`Server is up and running on: ${PORT}`)
})

//if the server crashed show it simply and stop the server
process.on('unhandledRejection', (error, promise) => {
	console.log(`Logged error: ${error}`)
	server.close(() => process.exit(1))
})
