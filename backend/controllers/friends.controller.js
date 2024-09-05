const friendsService = require('../services/friends.service');

class FriendController {
    async friendCreate(req, res, next) {
        try {
            const myUserId = req.user.id;
            const userId = req.params;
            const { relationshipType, status } = req.body;

            const result = await friendsService.friendCreate(myUserId, userId, relationshipType, status);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // Block a user
    async friendBlock(req, res, next) {
        try {
            const myUserId = req.user;
            const { userId } = req.body;

            const result = await friendsService.friendBlock(myUserId, userId);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async friendUpdate(req, res, next) {
        try {
            const myUserId = req.user;
            const { userId, updateData } = req.body;
            const result = await friendsService.friendUpdate(myUserId, userId, updateData);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new FriendController();
