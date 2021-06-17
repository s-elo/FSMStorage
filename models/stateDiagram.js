const mongoose = require("mongoose");

const stateDiagramSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  entityName: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Datas", stateDiagramSchema);
