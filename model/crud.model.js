import mongoose from "mongoose";

const chargerSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  powerOutput: { type: Number, required: true },
  connectorType: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Charger = mongoose.model("Charger", chargerSchema);
export default Charger;
