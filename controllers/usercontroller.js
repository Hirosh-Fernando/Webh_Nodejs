const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
// for mail
const mailgun = require('mailgun-js')
const DOMAIN = ''
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN })

// loadash
const lodash = require('lodash')
// 395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const uuid = require('uuid')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const client = new OAuth2(
	'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com',
	'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',
	'https://mywebh.com:3000/auth/google/callback'
)
//user sign in controller
exports.usersignin = async (req, res) => {
	const { email, password } = req.body

	// Check if email and password is provided
	if (!email || !password)
		return res
			.status(400)
			.json({ message: 'Please provide an email and password' })

	try {
		//finding user by email
		const user = await User.findOne({ email }).select('+password')

		//if user doesn't exist
		if (!user) return res.status(404).json({ message: "User doesn't exist" })

		//compare the provided password with the password in the database
		const ispasswordCorrect = await bcrypt.compare(password, user.password)

		//if passwords don't match
		if (!ispasswordCorrect)
			return res.status(409).json({ message: 'Invalid credentials' })

		if (user.status === false)
			return res.status(408).json({ message: 'User access denied!' })

		//creating a token
		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		//sending the user object and token as the response
		res.status(200).json({ success: true, result: user, token })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

// user google login
exports.userGoogleSignin = async (req, res) => {
	const { tokenId } = req.body
	console.log(tokenId)
	try {
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com'
		})
		const { email_verified, email, name, picture } = verify.payload
		// password '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'
		const password = email + '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'
		if (!email_verified)
			return res.status(400).json({ msg: 'Email verification failed' })

		if (email_verified) {
			const user = await User.findOne({ email })

			if (user) {
				!user.profilePicture
					? (user.profilePicture = picture)
					: user.profilePicture
				user.googleLoginFirst = false
				await user.save()
				const token = jwt.sign(
					{ email: user.email, id: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: '1h' }
				)

				res.status(200).json({ success: true, result: user, token })
			} else {
				const newUser = new User({
					firstname: name,
					lastname: name,
					password: password,
					email: email,
					profilePicture: picture,
					googleLoginFirst: false
				})

				await newUser.save()

				const token = jwt.sign(
					{ email: newUser.email, id: newUser._id },
					process.env.JWT_SECRET,
					{ expiresIn: '1h' }
				)

				res.status(200).json({ success: true, result: newUser, token })
			}
		}
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
}

exports.adminGoogleSignin = async (req, res) => {
	const { tokenId } = req.body
	try {
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com'
		})

		const { email_verified, email, name, picture } = verify.payload
		// password 'BWdX9c$sTwj)pnN9p8.'
		const password = email + 'BWdX9c$sTwj)pnN9p8.'
		if (!email_verified)
			return res.status(400).json({ msg: 'Email verification failed' })

		if (email_verified) {
			const user = await User.findOne({ email })
			const isAdmin = user.isAdmin
			const googleFirst = user.googleLoginFirst
			if (isAdmin && !googleFirst) {
				console.log('logged in')
				// const isMatch = await bcrypt.compare(password,user.password)
				// if(!isMatch) return res.status(400).json({msg:"Password is Incorrect"})
				//creating a token
				const token = jwt.sign(
					{ email: user.email, id: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: '1h' }
				)
				res
					.status(200)
					.json({ success: true, result: user, token, loggedIn: true })
			} else if (isAdmin && googleFirst) {
				console.log('first')

				// const isMatch = await bcrypt.compare(password,user.password)
				// if(!isMatch) return res.status(400).json({msg:"Password is Incorrect"})
				//creating a token

				res
					.status(200)
					.json({ success: true, result: tokenId, email, loggedIn: false })
			} else if (!isAdmin) {
				return res.status(401).json({ msg: "Your Can't Access this Site" })
			}
			// else {

			// 	const newUser = new User({
			// 		firstname:name,
			// 		lastname:name,
			// 		password:password,
			// 		email:email,
			// 		profilePicture:picture
			// 	})
			// 	console.log(newUser);

			// 	await newUser.save();

			// 	const token = jwt.sign(
			// 		{ email: newUser.email, id: newUser._id },
			// 		process.env.JWT_SECRET,
			// 		{ expiresIn: '1h' }
			// 	);

			// 	res.status(200).json({ success: true, result: newUser, token });

			// }
		}
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
}
exports.adminGoogleSigninValidation = async (req, res) => {
	const { password, tokenId } = req.body
	try {
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com'
		})

		const { email_verified, email, name, picture } = verify.payload
		// password 'BWdX9c$sTwj)pnN9p8.'
		// const password = email + 'BWdX9c$sTwj)pnN9p8.'
		if (!email_verified)
			return res.status(400).json({ msg: 'Email verification failed' })

		if (email_verified) {
			const user = await User.findOne({ email, isAdmin: true })
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch)
				return res.status(400).json({ msg: 'Password is Incorrect' })

			try {
				user.googleLoginFirst = false
				await user.save()
				const token = jwt.sign(
					{ email: user.email, id: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: '1h' }
				)
				res
					.status(200)
					.json({ success: true, result: user, token, loggedIn: true })
			} catch (error) {
				res.status(500).json({ msg: error.message })
			}
		}
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
}
exports.userGoogleSigninValidation = async (req, res) => {
	const { password, tokenId } = req.body
	try {
		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience:
				'395423356530-p3dcv116o61fa80d2rsv8sivettc562k.apps.googleusercontent.com'
		})

		const { email_verified, email, name, picture } = verify.payload
		// password 'BWdX9c$sTwj)pnN9p8.'
		// const password = email + 'BWdX9c$sTwj)pnN9p8.'
		if (!email_verified)
			return res.status(400).json({ msg: 'Email verification failed' })

		if (email_verified) {
			const user = await User.findOne({ email, isAdmin: true })
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch)
				return res.status(400).json({ msg: 'Password is Incorrect' })

			try {
				user.googleLoginFirst = false
				await user.save()
				const token = jwt.sign(
					{ email: user.email, id: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: '1h' }
				)
				res
					.status(200)
					.json({ success: true, result: user, token, loggedIn: true })
			} catch (error) {
				res.status(500).json({ msg: error.message })
			}
		}
	} catch (error) {
		res.status(500).json({ msg: error.message })
	}
}
//user sign in controller
exports.adminSignIn = async (req, res) => {
	const { email, password } = req.body

	// Check if email and password is provided
	if (!email || !password)
		return res
			.status(400)
			.json({ message: 'Please provide an email and password' })

	try {
		//finding user by email
		const user = await User.findOne({ email }).select('+password')

		//if user doesn't exist
		if (!user) return res.status(404).json({ message: "User doesn't exist" })

		//compare the provided password with the password in the database
		const ispasswordCorrect = await bcrypt.compare(password, user.password)

		//if passwords don't match
		if (!ispasswordCorrect)
			return res.status(400).json({ message: 'Invalid credentials' })

		// checking whether he is admin or not
		if (user.isAdmin === true) {
			//creating a token
			const token = jwt.sign(
				{ email: user.email, id: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)

			//sending the user object and token as the response
			res.status(200).json({ success: true, result: user, token })
		} else {
			return res
				.status(400)
				.json({ message: 'You have no admin panel access!' })
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

//user sign up controller
exports.usersignup = async (req, res) => {
	const { firstname, lastname, email, phone, password, imgUrl, gender } =
		req.body

	let users
	try {
		users = await User.find()
	} catch (err) {
		return next(err)
	}

	let webhId = 'WEBH' + users.length

	try {
		//checking email already exists
		const checkEmail = await User.findOne({ email })

		if (checkEmail)
			return res
				.status(409)
				.json({ message: 'User with this email already exists' })

		//creating a new user
		const user = await User.create({
			firstname,
			lastname,
			email,
			phone,
			password,
			imgUrl,
			webhId: webhId,
			gender
		})

		//creating a token
		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		//sending the user object and token as the response
		res.status(200).json({ success: true, result: user, token })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

//update user controller
exports.updateUser = async (req, res) => {
	let userID = req.params.id
	const { _id, currentUserAdminStatus, password } = req.body
	console.log(req.body)
	if (userID === _id) {
		try {
			if (password) {
				const salt = await bcrypt.genSalt(10)
				req.body.password = await bcrypt.hash(password, salt)
			}

			//find user by userID and update the user with provided data
			const user = await User.findByIdAndUpdate(userID, req.body, {
				new: true
			})

			// update token
			const token = jwt.sign(
				{ email: user.email, id: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)

			//sending the status message successful
			res.status(200).json({
				success: true,
				message: 'Profile updated successfully',
				result: user,
				token
			})
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Something went wrong', error: error.message })
		}
	} else {
		res.status(403).json(`Access Denied! You can access to your own profile!`)
	}
}
//update points

exports.changePoints = async (req, res, next) => {
	let userID = req.params.id
	const { points } = req.body

	let user

	try {
		user = await User.findById(userID)
	} catch (err) {
		return next(err)
	}

	user.profilePoints = points

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

// Activation function
exports.Activation = async (req, res, next) => {
	let userID = req.params.id

	let user

	try {
		user = await User.findById(userID)
	} catch (err) {
		return next(err)
	}

	user.status = !user.status

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

//delete user controller
exports.deleteUser = async (req, res) => {
	const userID = req.params.id

	const { currentUserId, currentUserAdminStatus } = req.body

	if (currentUserId === userID || currentUserAdminStatus) {
		try {
			//find user by userID and delete it
			await User.findByIdAndDelete(userID)

			//sending the status message successful
			res.status(200).json({ success: true, message: 'User deleted!' })
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Something went wrong', error: error.message })
		}
	} else {
		res.status(403).json('Access Denied! You can delete own profile!')
	}
}

//fetch users controller
exports.fetchAll = async (req, res) => {
	//calling User model
	User.find()
		.then(user => {
			res.status(200).json(
				user.sort((a, b) => {
					return b.createdAt - a.createdAt
				})
			)
		})
		.catch(error => {
			res
				.status(500)
				.json({ message: 'Error with fetching users', error: error.message })
		})
}

//fetch one user controller
exports.fetchOne = async (req, res) => {
	let userId = req.params.id
	let user = await User.findById(userId)
	try {
		if (user) {
			const { password, ...otherDetails } = user._doc

			res.status(200).json({ success: true, result: otherDetails })
		} else {
			res.status(404).json('No such a user!')
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
			error: error.message
		})
	}
}

// Follow a user
exports.followUser = async (req, res) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const followUser = await User.findById(userId)
			const followingUser = await User.findById(_id)
			const status = 'pending'

			if (!followUser.followers.includes(_id)) {
				await followUser.updateOne({ $push: { following: { _id, status } } })
				await followingUser.updateOne({
					$push: { followers: { userId, status } }
				})
				res.status(200).json({ success: true, message: 'User Followed!' })
			} else {
				res.status(403).json('User is already followed by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// user accept
exports.userAcceptance = async (req, res, next) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const user = await User.findById(userId)
			const followingUser = await User.findById(_id)

			if (!user.followers.includes(_id)) {
				await user.updateOne({ $push: { followers: _id } })
				await followingUser.updateOne({ $push: { following: userId } })
				await user.updateOne({ $pull: { followRequests: _id } })
				await followingUser.updateOne({ $pull: { myRequests: userId } })
				res.status(200).json({ success: true, message: 'User Followed!' })
			} else {
				res.status(403).json('User is already Followed by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// user reject
exports.userRejectRequest = async (req, res, next) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const user = await User.findById(userId)
			const followingUser = await User.findById(_id)

			if (user.followRequests.includes(_id)) {
				await user.updateOne({ $pull: { followRequests: _id } })
				await followingUser.updateOne({ $pull: { myRequests: userId } })
				res.status(200).json({ success: true, message: 'User Rejected!' })
			} else {
				res.status(403).json('User is already Rejected by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// user request
exports.userRequest = async (req, res) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const user = await User.findById(userId)
			const followingUser = await User.findById(_id)

			if (!user.myRequests.includes(_id)) {
				await user.updateOne({ $push: { myRequests: _id } })
				await followingUser.updateOne({ $push: { followRequests: userId } })
				res.status(200).json({ success: true, message: 'User Request!' })
			} else {
				res.status(403).json('User is already Request by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// delete request
exports.userDisableFollower = async (req, res, next) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const user = await User.findById(userId)
			const followingUser = await User.findById(_id)

			if (!user.followers.includes(_id)) {
				await user.updateOne({ $push: { followers: { _id, status: false } } })
				res.status(200).json({ success: true, message: 'User Request!' })
			} else {
				res.status(403).json('User is already Request by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// UnFollow a user
exports.unFollowUser = async (req, res) => {
	const userId = req.params.id

	const { _id } = req.body

	if (_id === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' })
	} else {
		try {
			const followUser = await User.findById(userId)
			const followingUser = await User.findById(_id)

			if (followUser.followers.includes(_id)) {
				await followUser.updateOne({ $pull: { followers: _id } })
				await followingUser.updateOne({ $pull: { following: userId } })
				res.status(200).json({ success: true, message: 'User Unfollowed!' })
			} else {
				res.status(403).json('User is not followed by you!')
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			})
		}
	}
}

// get All users
exports.getUsers = async (req, res) => {
	try {
		let users = await User.find()
		users = users.map(user => {
			const { password, ...otherDetails } = user._doc
			return otherDetails
		})
		res.status(200).json(
			users.sort((a, b) => {
				return b.createdAt - a.createdAt
			})
		)
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
			error: error.message
		})
	}
}

// update password
exports.updatePassword = async (req, res, next) => {
	const userId = req.params.id
	const { newPassword, oldPassword } = req.body

	const user = await User.findById(userId).select('+password')
	const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

	try {
		if (isPasswordCorrect) {
			user.password = newPassword

			// update token
			const token = jwt.sign(
				{ email: user.email, id: user._id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)

			await user.save()
			res.status(200).json({
				message: 'Password updated Successfully',
				UpdatedPassword: user.password,
				oldPassword,
				newPassword
			})
		} else {
			res.status(400).json({ message: 'password is not correct!' })
		}
	} catch (err) {
		return next(err)
	}
}

// forgot password
exports.forgotPassword = async (req, res) => {
	const { email } = req.body
	console.log(email)
	try {
		//finding user by email
		const user = await User.findOne({ email, isAdmin: false })

		//if user doesn't exist
		if (!user)
			return res.status(404).json({ message: 'No user with this email' })

		// Reset Token Gen and add to database hashed (private) version of token
		const resetPasswordToken = user.getResetPasswordToken()

		await user.save()

		// Create reset url to email to provided email
		const resetPasswordUrl = `https://mywebh.com:3000/password-reset/${resetPasswordToken}`

		// HTML Message
		const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click on this link to update your password!</p>
            <a href=${resetPasswordUrl} clicktracking=off>${resetPasswordUrl}</a>
        `

		try {
			//sending the the email
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message
			})
			res.status(200).json({ success: true, data: 'Email Sent' })
		} catch (error) {
			//if the email sending failed remove reset token
			user.resetPasswordToken = undefined
			user.resetPasswordExpire = undefined

			await user.save()

			res
				.status(500)
				.json({ message: 'Email could not be sent', error: error.message })
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

//admin forgot password
exports.adminForgotPassword = async (req, res) => {
	const email = req.body.forgot.email
	try {
		//finding user by email
		const user = await User.findOne({ email, isAdmin: true })

		//if user doesn't exist
		if (!user)
			return res.status(404).json({ message: 'No user with this email' })

		// Reset Token Gen and add to database hashed (private) version of token
		const resetPasswordToken = user.getResetPasswordToken()

		await user.save()

		// Create reset url to email to provided email
		const resetPasswordUrl = `https://mywebh.com:3001/password-reset/${resetPasswordToken}`

		// HTML Message
		const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click on this link to update your password!</p>
            <a href=${resetPasswordUrl} clicktracking=off>${resetPasswordUrl}</a>
        `

		try {
			//sending the the email
			await sendEmail({
				to: user.email,
				subject: 'Password Reset Request',
				text: message
			})
			res.status(200).json({ success: true, data: 'Email Sent' })
		} catch (error) {
			//if the email sending failed remove reset token
			user.resetPasswordToken = undefined
			user.resetPasswordExpire = undefined

			await user.save()

			res
				.status(500)
				.json({ message: 'Email could not be sent', error: error.message })
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

exports.check = (req, res) => {
	console.log('working', req.body)
}

//Reset Password
exports.resetPassword = async (req, res) => {
	// Compare token in URL params to hashed token
	console.log(req.params.resetPasswordToken)
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resetPasswordToken)
		.digest('hex')

	try {
		//check whether a user exists with same reset password token and expiration time greater than current time
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() }
		})

		if (!user) {
			return res
				.status(400)
				.json({ message: 'Invalid Token', error: error.message })
		}

		//saving the new password
		user.password = req.body.password

		//remove the reset password token
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save()

		//creating a token
		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' }
		)

		res.status(201).json({ success: true, result: user, token })
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}

// get requests
exports.getRequests = async (req, res) => {
	let userId = req.params.id
	let user = await User.findById(userId)
	try {
		if (user) {
			const { password, ...otherDetails } = user._doc

			res.status(200).json({ success: true, list: otherDetails.followRequests })
		} else {
			res.status(404).json('No such a user!')
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Something went wrong',
			error: error.message
		})
	}
}

//education

exports.createEducation = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newEducation = {
		id: uuid.v1(),
		name: req.body.name,
		desc: req.body.desc,
		image: req.body.image,
		year: req.body.year
	}

	user.education.push(newEducation)

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}
	res.json(user)
}

exports.getEducations = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	res.status(200).json(user.education)
}

exports.getEducation = async (req, res, next) => {
	const { id, eid } = req.params

	let user
	let education

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	education = user.education.find(e => e.id === eid)

	res.status(200).json(education)
}

exports.updateEducation = async (req, res, next) => {
	const { id, eid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newEducation = {
		id: eid,
		name: req.body.name,
		desc: req.body.desc,
		image: req.body.image,
		year: req.body.year
	}

	try {
		await user.updateOne({ $pull: { education: { id: eid } } })
		await user.updateOne({ $push: { education: newEducation } })
		res.status(200).json({ success: true, message: 'updated' })
	} catch (err) {
		return next(err)
	}
}

exports.deleteEducation = async (req, res, next) => {
	const { id, eid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	try {
		await user.updateOne({ $pull: { education: { id: eid } } })
		res.status(200).json({ success: true, message: 'deleted' })
	} catch (err) {
		return next(err)
	}
}

// contacts

exports.createContacts = async (req, res, next) => {
	const { id } = req.params
	const { link } = req.body

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newLink = {
		id: uuid.v1(),
		link: link
	}

	user.contacts.push(newLink)

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}
	res.json(user)
}

exports.getContacts = async (req, res, next) => {
	const { id } = req.params

	let user
	try {
		user = User.findById(id)
	} catch (err) {
		return next(err)
	}

	let contacts = user.contacts

	res.json(contacts)
}

exports.getContact = async (req, res, next) => {
	const { id, cid } = req.params

	let user
	let contact

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	contact = user.contacts.find(e => e.id === cid)

	res.status(200).json(contact)
}

exports.updateContact = async (req, res, next) => {
	const { id, cid } = req.params

	const { link } = req.body

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newLink = {
		id: cid,
		link: link
	}

	try {
		await user.updateOne({ $pull: { contacts: { id: cid } } })
		await user.updateOne({ $push: { contacts: newLink } })
		res.status(200).json({ success: true, message: 'updated' })
	} catch (err) {
		return next(err)
	}
}

exports.deleteContact = async (req, res, next) => {
	const { id, cid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	try {
		await user.updateOne({ $pull: { contacts: { id: cid } } })
		res.status(200).json({ success: true, message: 'deleted' })
	} catch (err) {
		return next(err)
	}
}

exports.adminImageUpload = async (req, res, next) => {
	let user
	try {
		user = await User.findById(req.params.id)
	} catch (err) {
		return next(err)
	}

	user.profilePicture = req.body.image

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

exports.updateAdmin = async (req, res, next) => {
	let user
	console.log(req.body)
	try {
		user = await User.findById(req.params.id)
	} catch (err) {
		return next(err)
	}
	console.log(user)

	user.firstname = req.body.firstname
	user.lastname = req.body.lastname

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

exports.updateAdminCredential = async (req, res, next) => {
	let user
	console.log(req.body)
	try {
		user = await User.findById(req.params.id)
	} catch (err) {
		return next(err)
	}
	console.log(user)

	user.email = req.body.email
	user.password = req.body.password

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

exports.getAdmin = async (req, res, next) => {
	let user

	try {
		user = await User.findById(req.params.id)
	} catch (err) {
		return next(err)
	}

	res.json(user)
}

//skills

exports.createSkill = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newSkill = {
		id: uuid.v1(),
		name: req.body.name
	}

	user.skills.push(newSkill)

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}
	res.json(user)
}

exports.getSkills = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	res.status(200).json(user.skills)
}

exports.getSkill = async (req, res, next) => {
	const { id, sid } = req.params

	let user
	let skill

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	skill = user.skills.find(e => e.id === sid)

	res.status(200).json(skill)
}

exports.updateSkill = async (req, res, next) => {
	const { id, sid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newSkill = {
		id: sid,
		name: req.body.name
	}

	try {
		await user.updateOne({ $pull: { skills: { id: sid } } })
		await user.updateOne({ $push: { skills: newSkill } })
		res.status(200).json({ success: true, message: 'updated' })
	} catch (err) {
		return next(err)
	}
}

exports.deleteSkill = async (req, res, next) => {
	const { id, sid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	try {
		await user.updateOne({ $pull: { skills: { id: sid } } })
		res.status(200).json({ success: true, message: 'deleted' })
	} catch (err) {
		return next(err)
	}
}

//interests

exports.createInterest = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newInterest = {
		id: uuid.v1(),
		name: req.body.name
	}

	user.interests.push(newInterest)

	try {
		await user.save()
	} catch (err) {
		return next(err)
	}
	res.json(user)
}

exports.getInterests = async (req, res, next) => {
	const { id } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	res.status(200).json(user.interests)
}
;``
exports.getInterest = async (req, res, next) => {
	const { id, sid } = req.params

	let user
	let interest

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	interest = user.interests.find(e => e.id === sid)

	res.status(200).json(interest)
}

exports.updateInterest = async (req, res, next) => {
	const { id, sid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	const newInterest = {
		id: sid,
		name: req.body.name
	}

	try {
		await user.updateOne({ $pull: { interests: { id: sid } } })
		await user.updateOne({ $push: { interests: newInterest } })
		res.status(200).json({ success: true, message: 'updated' })
	} catch (err) {
		return next(err)
	}
}

exports.deleteInterest = async (req, res, next) => {
	const { id, sid } = req.params

	let user

	try {
		user = await User.findById(id)
	} catch (err) {
		return next(err)
	}

	try {
		await user.updateOne({ $pull: { interests: { id: sid } } })
		res.status(200).json({ success: true, message: 'deleted' })
	} catch (err) {
		return next(err)
	}
}

// invite new friend
exports.inviteNewFriend = async (req, res) => {
	const { email } = req.body
	const { userEmail } = req.body

	try {
		//finding user by userEmail
		const user = await User.findOne({ userEmail })

		//if user doesn't exist
		if (!user)
			return res.status(404).json({ message: "You don't have an account!" })

		// HTML Message
		const message = `
            <h1>Your friend ${user.firstname} ${user.lastname} invited to WEBH!</h1>
            <p>Please click on this link to get register to the WebH!</p>
            <a href="https://mywebh.com:3000/auth" clicktracking=off>Click here</a>
        `

		try {
			//sending the the email
			await sendEmail({
				to: email,
				subject: 'Invite Request from WEBH!',
				text: message
			})
			res.status(200).json({ success: true, data: 'Email Sent' })
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Email could not be sent', error: error.message })
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Something went wrong', error: error.message })
	}
}
