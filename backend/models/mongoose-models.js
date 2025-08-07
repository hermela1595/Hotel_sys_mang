const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Reservation Schema
const reservationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
reservationSchema.index({ user_id: 1 });
reservationSchema.index({ check_in: 1 });
reservationSchema.index({ check_out: 1 });
reservationSchema.index({ type: 1 });

// Models
const User = mongoose.model("User", userSchema);
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = {
  User,
  Reservation,
};
