const mongoose = require('mongoose');

const MessagingSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        enum: ['serviceProvider', 'client'],
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        required: true
    },
}, {
    timestamps: true
});

MessagingSchema.index({ senderId: 1, receiverId: 1 });
MessagingSchema.index({ taskId: 1 });

module.exports = mongoose.model("Messaging", MessagingSchema);
