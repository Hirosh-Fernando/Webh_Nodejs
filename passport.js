const GoogleStrategy = require('passport-google-oauth2').Strategy
const passport = require('passport')
// 395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com
// 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
passport.use(
	new GoogleStrategy(
		{
			clientID:
				'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: 'https://18.205.10.114:3000/auth/google/callback',
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
