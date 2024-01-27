const { Schema, model } = require("mongoose");

const ticketSchema = new Schema({
  Guild: String,
  Channel: String,
  Ticket: String,
});

module.exports = model("ticketSchema", ticketSchema);