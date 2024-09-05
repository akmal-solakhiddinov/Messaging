const requestService = require("../services/request.service");
const { getIO } = require('../socket/socket')

const io = getIO()

class RequestController {
    async friend(req, res, next) {
        try {
            const senderId = req.user.id;
            const { friendId } = req.params;
            const { request } = await requestService.friend(senderId, friendId)
            io.to(friendId).emit('notification', JSON.stringify({ title: 'You have friend request', description: `This person send you friend request` }))


            return res.status(201).json(request)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async friendRequestStatus(req, res, next) {
        try {
            const { requestId } = req.params;
            const { status } = req.query;

            const { request } = await requestService.friendRequestStatus(requestId, status);
            return res.status(200).json({ request });
        } catch (error) {
            console.error('Error in friendRequestStatus controller:', error.message);
            return res.status(400).json({ message: error.message });
        }
    }


    /*     async friendReject(req, res, next) {
            try {
    
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }
        }
     a*/
    async friendRequestAll(req, res, next) {
        try {
            const userId = req.user.id;
            const { requests } = await requestService.friendRequestAll(userId)

            if (requests.length < 0) throw new Error('Request not Found')

            return res.status(200).json(requests);
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }


}

module.exports = new RequestController()