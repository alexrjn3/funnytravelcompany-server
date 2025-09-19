import Oferta from "../models/oferteModel.js";

const getNextId = async () => {
  // preluăm toate id-urile existente, sortate crescător
  const allIds = await Oferta.find({}, { id: 1, _id: 0 }).sort({ id: 1 });
  const usedIds = allIds.map((o) => o.id);

  // căutăm cel mai mic ID liber
  let nextId = 1;
  for (let id of usedIds) {
    if (id === nextId) {
      nextId++;
    } else if (id > nextId) {
      break; // am găsit primul liber
    }
  }
  return nextId;
};

export default getNextId;
