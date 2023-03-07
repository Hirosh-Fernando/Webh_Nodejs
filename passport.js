const GoogleStrategy = require('passport-google-oauth2').Strategy
const passport = require('passport')
require('dotenv').config()
const User = require('./models/User')

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID ,
			clientSecret: process.env.CLIENT_SECRET ,
			callbackURL: '/user/google/callback' ,
			scope: ['profile', 'email'],
			passReqToCallback:true
		},
		function (accessToken, refreshToken,profile,callback) {
			// User.findOrCreate({ googleId: profile.id }, function (err, user) {
			// 	return done(err, user);
			//   });

			callback(null,profile)
		}
	)
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})


