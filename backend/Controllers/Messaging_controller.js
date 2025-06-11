const Messaging = require('../Models/Messaging');
const Client = require('../Models/Client');
const ServiceProvider = require('../Models/ServiceProvider');
const get_messages = async (req, res) => {
    try {
        const { id, role } = req.user;

        const messages = await Messaging.find({
            $or: [{ senderId: id }, { receiverId: id }]
        });

        if (!messages.length) {
            return res.status(404).json({
                status: 404,
                message: "No messages found"
            });
        }
        const lastMessages = {};
        messages.forEach(msg => {
            const otherUserId = msg.senderId.toString() === id ? msg.receiverId.toString() : msg.senderId.toString();
            if (!lastMessages[otherUserId] || msg.createdAt > lastMessages[otherUserId].createdAt) {
                lastMessages[otherUserId] = msg;
            }
        });

        const userIds = Object.keys(lastMessages);

        let users = [];
        if (role === "serviceProvider") {
            users = await Client.find(
                { _id: { $in: userIds } },
                'name email phoneNumber profilePicture role'
            );
        } else {
            users = await ServiceProvider.find(
                { _id: { $in: userIds } },
                'name email phoneNumber profilePicture role'
            );
        }

        const unreadChats = {};
        messages.forEach(msg => {
            const otherUserId = msg.senderId.toString() === id ? msg.receiverId.toString() : msg.senderId.toString();
            if (msg.receiverId.toString() === id && msg.status === "sent") {
                unreadChats[otherUserId] = (unreadChats[otherUserId] || 0) + 1;
            }
        });

        const data = users.map(user => {
            const userId = user._id.toString();
            return {
                user: user.toObject(),
                unreadChats: unreadChats[userId] || 0,
                lastMessage: lastMessages[userId]
            };
        });

        return res.status(200).json({
            status: 200,
            message: "Messages retrieved successfully",
            data: data,
            totalUnreadChats: Object.values(unreadChats).reduce((acc, count) => acc + count, 0)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

module.exports = { get_messages };

