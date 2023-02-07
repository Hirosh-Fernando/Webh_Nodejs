const CommunityModel = require("../models/CommunityModel");
const User = require("../models/User");
const mongoose = require('mongoose');
const uuid = require('uuid')

//create new one
exports.createCommunity = async (req, res) => {
 
    const newCommunity = new CommunityModel({
        userId:req.body.userId,
        name: req.body.name,
        industry: req.body.industry,
        email: req.body.email,
        members: [req.body.senderId, req.body.receiverId],
        invitedList: req.body.invitedList,
        desc: req.body.desc
      });
  try {
    await newCommunity.save();
    res.status(200).json(newCommunity);
  } catch(error) {
    res.status(500).json({message:"Fail to send request",error:error.message})
  }
  
  }
  
  //Get BY USER
  exports.userCommunities = async (req, res) => {

    try{
      const community = await CommunityModel.find({
        members: {$in: [req.params.userId]}
      });
      res.status(200).json(community);
    } catch (error) {
      res.status.json(error);
    }

  }

  // find community
  exports.findCommunity = async(req,res) => {
    
    try{
        const community = await CommunityModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
          });
        res.status(200).json(community);
    } catch(error){
        res.status(500).json({message:"Error with finding details",error:error.message});
    }

  }

  
  //view Requests
  exports.getCommunities = async (req, res) => {
   
    //calling model
    CommunityModel.find().then((request) => {
      res.status(200).json(request.sort((a,b)=>{
        return b.createdAt - a.createdAt;
      }))
    }).catch((error) => {
      res.status(500).json({ message: "Error with fetching details", error: error.message });
    })
  }

  // get one community
  exports.getCommunity = async (req, res) => {
    const communityId = req.params.id;

    try {
      const community = await CommunityModel.findById(communityId);
      res.status(200).json({ community });
    } catch (error) {
      res.status.json(error);
    }
  };

  // user request
  exports.userRequest = async (req, res) => {
    
    const userId = req.params.id;
    const { communityId } = req.body;
    const community = await CommunityModel.findById(communityId);

    if (community.userId === userId) {
      res.status(200).json({ success: true, message: 'Action Denied!' });
    } else {
      try {
        const user = await User.findById(userId);
        const admin = await User.findById(community.userId);
      	const id = uuid.v1()

        if (!community.members.includes(userId) && !user.myCommunityRequests.includes(communityId) ) {
          await user.updateOne({ $push: { myCommunityRequests: communityId } });
          await admin.updateOne({ $push: { communityRequests: {id,user:userId,community:communityId} } });
          res.status(200).json({ success: true, message: 'Community Request set successfully!' });
        } else {
          res.status(403).json('Community already requested by you!');
        }
      } catch (error) {
        res
          .status(500)
          .json({
            success: false,
            message: 'Something went wrong',
            error: error.message
          });
      }
    }
  };

      //cancel join request
      exports.cancelJoinRequest = async (req, res) => {
    
        const userId = req.params.id;
        const { communityId } = req.body;
  
        const community = await CommunityModel.findById(communityId);
        let aid;
      
        if (community.userId === userId) {
          res.status(200).json({ success: true, message: 'Action Denied!' });
        } else {
          try {
            const user = await User.findById(userId);
            const admin = await User.findById(community.userId);
      
            if (user.myCommunityRequests.includes(communityId)) {
      
            for (let join of admin.communityRequests) {
      
              if (join.user === userId) {
                aid = join.id;
              }
            }
              await admin.updateOne({ $pull: { communityRequests: { id: aid } } });
              await user.updateOne({ $pull: { myCommunityRequests: communityId } });
              res.status(200).json({ success: true, message: 'Request Canceled!' });
            } else {
              res.status(403).json('User is already Rejected by you!');
            }
          } catch (error) {
            res
              .status(500)
              .json({
                success: false,
                message: 'Something went wrong',
                error: error.message
              });
          }
        }
      };

  // get community requests
exports.getRequests = async (req, res) => {
	let userId = req.params.id;
	let user = await User.findById(userId);
	try {
		if (user) {
			const { password, ...otherDetails } = user._doc;

			res
				.status(200)
				.json({ success: true, community_list: otherDetails.communityRequests });
		} else {
			res.status(404).json('No such a user!');
		}
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};


// accept user request in community
exports.userAcceptance = async (req, res, next) => {
	const userId = req.params.id;

	const { communityId } = req.body;
  const community = await CommunityModel.findById(communityId);

	if (community.userId === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' });
	} else {
		try {
			const user = await User.findById(userId);
			const admin = await User.findById(community.userId);
      let aid;

			if (!community.members.includes(userId)) {

				await community.updateOne({ $push: { members: userId } });
				await user.updateOne({ $pull: { myCommunityRequests: communityId } });
        for (let request of admin.communityRequests) {

          if (request.user === userId) {
            aid = request.id;
          }
        }
        await admin.updateOne({ $pull: { communityRequests: { id: aid } } });
        res.status(200).json({ success: true, message: 'User Accepted!' });
			} else {
				res.status(403).json('User is already Followed by you!');
			}
		} catch (error) {
			res
				.status(500)
				.json({
					success: false,
					message: 'Something went wrong',
					error: error.message
				});
		}
	}
};

// user reject
exports.userRejectRequest = async (req, res, next) => {
	const userId = req.params.id;

	const { communityId } = req.body;
  const community = await CommunityModel.findById(communityId);
  let aid;

	if (community.userId === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' });
	} else {
		try {
			const user = await User.findById(userId);
			const admin = await User.findById(community.userId);

			if (user.myCommunityRequests.includes(communityId)) {
				await user.updateOne({ $pull: { myCommunityRequests: communityId } });
        for (let request of admin.communityRequests) {

          if (request.user === userId) {
            aid = request.id;
          }
        }
        await admin.updateOne({ $pull: { communityRequests: { id: aid } } });
				res.status(200).json({ success: true, message: 'User Rejected!' });
			} else {
				res.status(403).json('User is already Rejected by you!');
			}
		} catch (error) {
			res
				.status(500)
				.json({
					success: false,
					message: 'Something went wrong',
					error: error.message
				});
		}
	}
};

  // invite friends
  exports.inviteFriends = async (req, res) => {
    
    const userId = req.params.id;
    const { communityId } = req.body;
    const { invitedUserId } = req.body;
    const community = await CommunityModel.findById(communityId);

    if (community.userId === userId) {
      res.status(200).json({ success: true, message: 'Action Denied!' });
    } else {
      try {
        const user = await User.findById(userId);
        const invitedUser = await User.findById(invitedUserId);
      	const id = uuid.v1()

        if (!community.members.includes(userId) && !community.invitedList.includes(userId) ) {
          // user.communityInvites.includes(communityId)
          if (user.communityInvites.length === 0) {
            await user.updateOne({ $push: { communityInvites: {id, community: communityId, requestedBy:invitedUser._id} } });
          } else {
            for (let invite of user.communityInvites) {

              if (invite.community !== communityId) {
                await user.updateOne({ $push: { communityInvites: {id, community: communityId, requestedBy:invitedUserId} } });
              }  
            }
          }
          await community.updateOne({ $push: { invitedList: userId } });
          res.status(200).json({ success: true, message: 'Invited successfully!' });
        } else {
          res.status(403).json('Already Invited!');
        }
      } catch (error) {
        res
          .status(500)
          .json({
            success: false,
            message: 'Something went wrong',
            error: error.message
          });
      }
    }
  };

    //cancel invite
    exports.cancelInviteFriends = async (req, res) => {
    
      const userId = req.params.id;
      const { communityId } = req.body;

      const community = await CommunityModel.findById(communityId);
      let aid;
    
      if (community.userId === userId) {
        res.status(200).json({ success: true, message: 'Action Denied!' });
      } else {
        try {
          const user = await User.findById(userId);
    
          if (community.invitedList.includes(userId)) {
    
          for (let invite of user.communityInvites) {
    
            if (invite.community === communityId) {
              aid = invite.id;
            }
          }
            await user.updateOne({ $pull: { communityInvites: { id: aid } } });
            await community.updateOne({ $pull: { invitedList: userId } });
            res.status(200).json({ success: true, message: 'Invite Canceled!' });
          } else {
            res.status(403).json('User is already Rejected by you!');
          }
        } catch (error) {
          res
            .status(500)
            .json({
              success: false,
              message: 'Something went wrong',
              error: error.message
            });
        }
      }
    };

// get community invites
exports.getInvites = async (req, res) => {
	let userId = req.params.id;
	let user = await User.findById(userId);
	try {
		if (user) {
			const { password, ...otherDetails } = user._doc;

			res
				.status(200)
				.json({ success: true, invite_list: otherDetails.communityInvites });
		} else {
			res.status(404).json('No such a user!');
		}
	} catch (error) {
		res
			.status(500)
			.json({
				success: false,
				message: 'Something went wrong',
				error: error.message
			});
	}
};

// accept for invite
exports.acceptInvite = async (req, res, next) => {
	const userId = req.params.id;

	const { communityId } = req.body;
  const community = await CommunityModel.findById(communityId);

	if (community.userId === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' });
	} else {
		try {
			const user = await User.findById(userId);
			const admin = await User.findById(community.userId);
      let aid;

			if (!community.members.includes(userId)) {

				await community.updateOne({ $push: { members: userId } });
				await community.updateOne({ $pull: { invitedList: userId } });
        for (let invite of user.communityInvites) {

          if (invite.community === communityId) {
            aid = invite.id;
          }
        }
        await user.updateOne({ $pull: { communityInvites: { id: aid } } });
        res.status(200).json({ success: true, message: 'Accepted!' });
			} else {
				res.status(403).json('User Already in the community!');
			}
		} catch (error) {
			res
				.status(500)
				.json({
					success: false,
					message: 'Something went wrong',
					error: error.message
				});
		}
	}
};

// reject invite
exports.rejectInvite = async (req, res, next) => {
	const userId = req.params.id;

	const { communityId } = req.body;
  const community = await CommunityModel.findById(communityId);
  let aid;

	if (community.userId === userId) {
		res.status(200).json({ success: true, message: 'Action Denied!' });
	} else {
		try {
			const user = await User.findById(userId);
			const admin = await User.findById(community.userId);

			if (community.invitedList.includes(userId)) {

      for (let invite of user.communityInvites) {

        if (invite.community === communityId) {
          aid = invite.id;
        }
      }
        await user.updateOne({ $pull: { communityInvites: { id: aid } } });
				await community.updateOne({ $pull: { invitedList: userId } });
				res.status(200).json({ success: true, message: 'User Rejected!' });
			} else {
				res.status(403).json('User is already Rejected by you!');
			}
		} catch (error) {
			res
				.status(500)
				.json({
					success: false,
					message: 'Something went wrong',
					error: error.message
				});
		}
	}
};

// delete community
exports.deleteCommunity = async (req, res) => {
	const communityId = req.params.id;
	const {userId} = req.body;

	try {
		const community = await CommunityModel.findById(communityId);
		if (community.userId === userId) {
			await community.deleteOne();
			res.status(200).json({ status: 'Post Deleted' });
		} else {
			res.status(403).json('Action Forbidden!');
		}
	} catch (error) {
		res
			.status(500)
			.json({ status: 'Error with Deleting Request', error: error.message });
	}
};