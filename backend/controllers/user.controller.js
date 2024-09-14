const userService = require("../services/user.service")
const { uploadFile } = require('../services/file.service')

class UserController {
    async profile(req, res, next) {
        try {
            const userId = req.user.id;
            const { user } = await userService.profile(userId);

            return res.status(201).json(user)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

    async update(req, res, next) {
        console.log('Update process started');
        try {
            const userId = req.user.id;
            const file = req.file;

            let fileUrl;
            if (file) {
                fileUrl = await uploadFile('IMAGE', file);
            }
            const updatedUser = {
                ...req.body,
                ...(fileUrl && { image: fileUrl })
            };

            console.log(updatedUser, 'User update payload');

            const { user } = await userService.update(userId, updatedUser);
            return res.status(201).json(user);
        } catch (error) {
            console.error('Update error:', error);
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res, next) {
        try {
            const userId = req.user.id;
            const { user } = await userService.delete(userId)
            return res.status(201).json({ user, message: 'User successfully deleted' })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }


    async userSearch(req, res, next) {
        try {
            const query = req.body.query;
            console.log(query);
            const { users } = await userService.userSearch(query);
            if (users?.length <= 0) {
                return res.status(400).json({ message: 'User not found' })
            }

            return res.status(200).json(users)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }



    async getOneProfile(req, res, next) {
        try {
            const myUserId = req.user.id
            const { userId } = req.params;
            const { user } = await userService.getOneProfile(myUserId, userId)

            return res.status(200).json(user)
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }
}

module.exports = new UserController()