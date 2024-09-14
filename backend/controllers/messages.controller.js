const { uploadFile } = require("../services/file.service");
const messagesService = require("../services/messages.service");
// const upload = require("../services/upload.service");

class MessageController {
    async send(req, res, next) {
        try {
            const { roomId, friendId: receiverId } = req.params;
            const { content, fileType } = req.body;
            const senderId = req.user.id;
            const file = req.file;

            let fileUrl;

            if (!senderId || !receiverId || (!content && !file && !fileType)) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            if (!fileType && !file) {
                const newMessage = {
                    content,
                    receiverId,
                    chatId: roomId,
                    senderId,
                };
                const { message } = await messagesService.send(newMessage);

                return res.status(201).json(message);
            }

            if (file) {
                fileUrl = await uploadFile(fileType, file);
            }

            const newMessage = {
                content: content?.length > 0 ? content : null,
                file: fileUrl,
                fileType,
                receiverId,
                chatId: roomId,
                senderId,
            };

            const { message } = await messagesService.send(newMessage);

            return res.status(201).json(message);

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async update(req, res, next) {
        try {
            const { messageId } = req.params;
            const updatedMessage = req.body;
            const file = req.file;
            let newMessage = { ...updatedMessage };

            if (file) {
                const fileUrl = await uploadFile(updatedMessage.fileType, file);
                newMessage.file = fileUrl;
            }

            const { message } = await messagesService.update(messageId, newMessage);

            return res.status(201).json(message);
        } catch (error) {
            // Error handling
            return res.status(400).json({ message: error.message });
        }
    }


    async delete(req, res, next) {
        try {
            const { messageId } = req.params;
            const { message } = await messagesService.delete(messageId);

            return res.status(201).json({ message });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getAll(req, res, next) {
        try {
            const { roomId } = req.params;
            const pagination = req.query;
            const { messages } = await messagesService.getAll(roomId, pagination);

            return res.status(201).json(messages);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new MessageController();
