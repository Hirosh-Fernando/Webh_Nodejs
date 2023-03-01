const GoogleStrategy = require('passport-google-oauth2').Strategy
const passport = require('passport')

passport.use(
	new GoogleStrategy(
		{
			clientID:
				'266665356257-hegodqq6j6ivro28ml8bta1tgmlbqnq8.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'https://18.205.10.114',
			scope: ['profile', 'email']
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile)
		}
	)
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser((user, done) => {
	done(null, user)
})
