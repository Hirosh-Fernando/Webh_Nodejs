const router = require('express').Router();
const userauth = require('../middleware/userauth');
const { usersignup, usersignin, adminSignIn, updateUser, deleteUser, followUser, unFollowUser, getUsers, updatePassword, userRequest, userAcceptance,getRequests, userRejectRequest
,fetchAll,fetchOne,forgotPassword, changePoints, Activation, 
getEducations, updateEducation, deleteEducation, getEducation, 
getContact, getContacts, updateContact, deleteContact, createEducation, adminImageUpload ,
 createContacts, 
 updateAdmin, check,resetPassword, createSkill, getSkills, getSkill, updateSkill, deleteSkill, createInterest, getInterests, getInterest, updateInterest, deleteInterest, inviteNewFriend, updateAdminCredential

} = require('../controllers/usercontroller.js');

//user sign up
router.post('/signup', usersignup);

//user sign in
router.post('/signin', usersignin);

//admin sign in
router.post('/admin-signin', adminSignIn);

//user update profile
router.put('/:id', updateUser);

//user delete profile
router.delete('/:id', deleteUser);

//find all users
router.get('/view', fetchAll);

//find one user
router.get('/:id', fetchOne);

//follow user
router.put('/:id/follow', followUser);  

//follow user
router.put('/:id/unfollow', unFollowUser);

// users
router.get('/', getUsers);

//update points
router.put('/:id/changePoints', changePoints);
router.put('/:id/activation', Activation);


// request
router.get('/:id/request',getRequests)
router.put('/:id/updatePassword',updatePassword)
router.put("/:id/followRequest",userRequest)
router.put("/:id/useAcceptance",userAcceptance)
router.put("/:id/rejectUser",userRejectRequest)

// forgot password 
router.post("/forgot-password", forgotPassword)
router.put('/reset-password/:resetPasswordToken', resetPassword);


//education
router.put('/education/:id',createEducation)
router.get('/:id/education',getEducations)
router.get('/:id/education/:eid',getEducation)
router.put('/:id/education/update/:eid',updateEducation)
router.put('/:id/education/delete/:eid',deleteEducation)

//skills
router.put('/skill/:id',createSkill)
router.get('/:id/skills',getSkills)
router.get('/:id/skill/:sid',getSkill)
router.put('/:id/skill/update/:sid',updateSkill)
router.put('/:id/skill/delete/:sid',deleteSkill)

//interest
router.put('/interest/:id',createInterest)
router.get('/:id/interest',getInterests)
router.get('/:id/interest/:sid',getInterest)
router.put('/:id/interest/update/:sid',updateInterest)
router.put('/:id/interest/delete/:sid',deleteInterest)

//contacts
router.put('/contact/:id',createContacts)
router.get('/:id/contact',getContacts)
router.get('/:id/contact/:cid',getContact)
router.put('/:id/contact/update/:cid',updateContact)
router.delete('/:id/contact/delete/:cid',deleteContact)

//admin image uploading
router.put('/:id/profilePic',adminImageUpload)
router.put('/:id/updateAdmin',updateAdmin)
router.put('/:id/resetAdminCredential',updateAdminCredential)

// invite new friend
router.post("/invite-new-friend", inviteNewFriend)

module.exports = router;

