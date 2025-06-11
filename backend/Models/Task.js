const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    title: {
      type: String,
      required: [true],
      trim: true,
    },
    description: {
      type: String,
      required: [true],
      trim: true,
    },
    fare: {
      type: Number,
      required: [true],
      min: [250],
    },
    images: [
      {
        type: String,
      },
    ],
    timeSubmitted: {
      type: Date,
      default: Date.now,
    },
    taskStatus: {
      type: String,
      enum: ["pending", "approved", "modify", "completed", "in-progress"],
      default: "pending",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    clientName: {
      type: String,
      required: true,
    },
    cnicNumber: {
      type: String,
      required: true,
    },
    interestedServiceProviders: [
      {
        serviceProviderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceProvider",
        },
      },
    ],
    notifications: [
      {
        serviceProviderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Portfolio",
        },
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
        type: {
          type: String,
          enum: [
            "TASK_APPROVED_BY_ADMIN",
            "TASK_MODIFIED_BY_ADMIN",
            "TASK_COMPLETED_BY_ADMIN",
            "TASK_IN_PROGRESS_BY_ADMIN",
            "TASK_PENDING_BY_ADMIN",
            "SERVICE_PROVIDER_INTERESTED",
            "SP_IN_PROGRESS_TASK",
            "SP_IN_COMPLETED_TASK",
            "VIEW_PROGRESS_TASK",
            "TASK_COMPLETED",
            "NEW_MESSAGE",
          ],
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: false,
  }
);
taskSchema.index({ "notifications.read": 1 });

module.exports = mongoose.model("Task", taskSchema);
