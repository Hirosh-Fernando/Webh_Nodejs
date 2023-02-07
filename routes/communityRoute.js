const router = require("express").Router();
const { createCommunity, getCommunities, userCommunities, findCommunity, getCommunity, userRequest, getRequests, userAcceptance, userRejectRequest, inviteFriends, acceptInvite, getInvites, rejectInvite, cancelInviteFriends, cancelJoinRequest,deleteCommunity } = require('../controllers/CommunityController.js')
 
//add new request
router.post('/', createCommunity);

//get communities
router.get('/communities', getCommunities);
 
//get chat by user id
router.get('/:userId', userCommunities);
 
//get chat by search
router.get('/find/:firstId/:secondId', findCommunity);

// get topic
router.get('/:id/community', getCommunity);

// request for joining
router.put("/:id/com-request", userRequest)

// get request list
router.get('/:id/request', getRequests)

// accept request
router.put("/:id/accept", userAcceptance)

// reject request
router.put("/:id/reject", userRejectRequest)

// invite for joining
router.put("/:id/invite", inviteFriends)

// reject request
router.put("/:id/invite-cancel", cancelInviteFriends)

// get request list
router.get('/:id/invite', getInvites)

// accept invite
router.put("/:id/invite-accept", acceptInvite)

// reject request
router.put("/:id/invite-reject", rejectInvite)

// reject request
router.put("/:id/cancel-req", cancelJoinRequest)

//delete request
router.delete('/:id/delete', deleteCommunity);

module.exports = router;