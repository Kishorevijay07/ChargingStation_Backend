import Charger from "./../model/crud.model.js";

// CREATE
export const createStation = async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;

    const station = await Charger.create({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      user: req.user._id
    });
    res.status(201).json({ message: "Charging station created", station });
  } catch (error) {
    res.status(500).json({ error: "Error creating station" });
  }
};

// READ (All for the user)
export const getStations = async (req, res) => {
  try {
    const stations = await Charger.find({ user: req.user._id });
    res.status(200).json(stations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stations" });
  }
};

// UPDATE
export const updateStation = async (req, res) => {
  try {
    const station = await Charger.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!station) return res.status(404).json({ error: "Station not found" });

    res.status(200).json({ message: "Station updated", station });
  } catch (error) {
    res.status(500).json({ error: "Error updating station" });
  }
};

// DELETE
export const deleteStation = async (req, res) => {
  try {
    const station = await Charger.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!station) return res.status(404).json({ error: "Station not found" });

    res.status(200).json({ message: "Station deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting station" });
  }
};

export const getallsatations = async (req, res) => {
    try {
        const stations = await Charger.find();
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching all stations" });
    }
}