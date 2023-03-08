const GoogleStrategy = require('passport-google-oauth2').Strategy
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

const passport = require('passport')
require('dotenv').config()
const User = require('./models/User')

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: '/user/google/callback',
			scope: ['profile', 'email'],
			passReqToCallback: true
		},
		function (accessToken, refreshToken, profile, callback) {
			// User.findOrCreate({ googleId: profile.id }, function (err, user) {
			// 	return done(err, user);
			//   });

			callback(null, profile)
		}
	)
)

passport.use(
	new LinkedInStrategy(
		{
			clientID: process.env.LINKEDIN_CLIENTID,
			clientSecret: process.env.LINKEDIN_CLIENSECRET,
			callbackURL: 'https://mywebh.com:3000/user/linkedin/callback',
			scope: ['email', 'profile'],
			state: true
		},
		function (accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {
				// To keep the example simple, the user's LinkedIn profile is returned to
				// represent the logged-in user. In a typical application, you would want
				// to associate the LinkedIn account with a user record in your database,
				// and return that user instead.
				return done(null, profile)
			})
		}
	)
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
