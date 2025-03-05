import mongoose, { Schema, Document, Model } from "mongoose";

interface ITicket extends Document {
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  user: mongoose.Types.ObjectId;
}

const TicketSchema: Schema<ITicket> = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TicketModel: Model<ITicket> = mongoose.model<ITicket>(
  "Ticket",
  TicketSchema,
);

export default TicketModel;
