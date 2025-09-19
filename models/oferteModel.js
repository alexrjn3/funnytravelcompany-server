import mongoose from "mongoose";

const ofertaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "O oferta trebuie sa aiba un id"],
    unique: true,
  },
  country: {
    type: String,
    required: [true, "O oferta trebuie sa aiba o tara"],
  },
  city: {
    type: String,
    required: [true, "O oferta trebuie sa aiba un oras"],
  },
  location: {
    type: String,
    required: [true, "O oferta trebuie sa aiba o locatie"],
  },
  adress: {
    type: String,
    required: [true, "O oferta trebuie sa aiba o adresa"],
  },
  type_oferta: {
    type: String,
    required: [true, "O oferta trebuie sa aiba un tip de oferta"],
  },
  data: {
    type: Date,
    required: [true, "O oferta trebuie sa aiba o data"],
  },
  nights: {
    type: Number,
    required: [true, "O oferta trebuie sa aiba nopti"],
  },
  images: {
    type: [String],
    required: [true, "O oferta trebuie sa aiba un poster"],
  },
  price: {
    type: Number,
    required: [true, "O oferta trebuie sa aiba un pret"],
  },
  new_Oferta: {
    type: Boolean,
    default: true,
  },
  description_1: {
    type: String,
    required: [true, "O oferta trebuie sa aiba o descriere"],
  },
  description_2: {
    type: String,
    default: "",
  },
  servici: {
    type: String,
    default: "",
  },
  coord: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
});

const Oferta = mongoose.model("Oferta", ofertaSchema);

export default Oferta;
