import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "INFO" | "WARNING" | "ORDER" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

export const notificationSchema = new mongoose.Schema<INotification> ({
  userId: {
    type: String
  },
  type: {
    type: String,
    enum: ["INFO", "WARNING", "ORDER", "SYSTEM"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model<INotification>("Notification", notificationSchema);