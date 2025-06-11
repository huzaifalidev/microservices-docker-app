const mongoose = require("mongoose");

function calculateAverageRating(portfolio) {
  const ratings = portfolio.completedTasks
    .filter(task => typeof task.rating === 'number')
    .map(task => task.rating);

  if (ratings.length === 0) {
    portfolio.averageRating = 0;
  } else {
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    portfolio.averageRating = sum / ratings.length;
  }
}

const portfolioSchema = new mongoose.Schema(
  {
    serviceProviderId: {
      type: String,
      required: true,
    },
    serviceProviderName: {
      type: String,
      required: true,
    },
    aboutMe: {
      type: String,
      required: true,
    },
    workExperience: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    certImages: [
      {
        type: String,
      },
    ],
    cnicImages: [
      {
        type: String,
      },
    ],
    portfolioStatus: {
      type: String,
      enum: ["pending", "approved", "modify"],
      default: "pending",
    },
    profileImage: {
      type: String,
    },
    cnicNumber: {
      type: String,
    },
    completedTasks: [
      {
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Client",
        },
        clientName: {
          type: String,
        },
        review: {
          type: String,
        },
        rating: {
          type: Number,
        },
        reviewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    notifications: [
      {
        clientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Client",
        },
        taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
        type: {
          type: String,
          enum: [
            "PORTFOLIO_APPROVED_BY_ADMIN",
            "PORTFOLIO_MODIFIED_BY_ADMIN",
            "PORTFOLIO_PENDING_BY_ADMIN",
            "CLIENT_ACCEPTED_OFFER",
            "CLIENT_REVIEWED_TASK",
            "NEW_MESSAGE",
            "REVIEW_ADDED",
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
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: false,
  }
);
portfolioSchema.pre("save", function (next) {
  if (this.isModified("completedTasks")) {
    calculateAverageRating(this);
  }
  next();
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
