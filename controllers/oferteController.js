import Oferta from "./../models/oferteModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import upload from "./../utils/incarcarePoza.js";
import getNextId from "../utils/getNextId.js";
import path from "path";
import { promises as fs } from "fs";

const getSomeOferte = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  let filter;
  if (type === "Romania") {
    filter = { country: "Romania" };
  } else if (type === "International") {
    filter = { country: { $ne: "Romania" } };
  } else {
    return next(new AppError("Tip de oferte invalid", 400));
  }

  const oferte = await Oferta.find(filter).limit(12);

  if (!oferte || oferte.length === 0) {
    return next(new AppError("No oferte in DB", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: oferte.length,
    data: { oferte },
  });
});

const getAllTypeOferte = catchAsync(async (req, res, next) => {
  const { type } = req.params;

  let filter;
  if (type === "Romania") {
    filter = { country: "Romania" };
  } else if (type === "International") {
    filter = { country: { $ne: "Romania" } };
  } else {
    return next(new AppError("Tip de oferte invalid", 400));
  }

  const oferte = await Oferta.find(filter); // no limit, return all

  if (!oferte || oferte.length === 0) {
    return next(new AppError("No oferte in DB", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: oferte.length,
    data: { oferte },
  });
});

const getOferta = catchAsync(async (req, res, next) => {
  const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);
  const oferta = await Oferta.findOne({ id });

  if (!oferta) {
    return next(new AppError("No oferta found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      oferta,
    },
  });
});

const getAllOferte = catchAsync(async (req, res, next) => {
  const oferte = await Oferta.find();

  if (!oferte) {
    return next(new AppError("No oferte in DB", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: oferte.length,
    data: {
      oferte,
    },
  });
});

const updateOferta = catchAsync(async (req, res, next) => {
  const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);

  if ("__v" in req.body) delete req.body.__v;

  if (!req.body.coord) req.body.coord = { x: 0, y: 0 };

  const oferta = await Oferta.findOneAndUpdate(
    { id }, // acum tipul corespunde
    req.body,
    { new: true, runValidators: true }
  );

  if (!oferta) {
    return next(new AppError("Oferta not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      oferta, // așa cum ai în GET
    },
  });
});

const deleteOferta = catchAsync(async (req, res, next) => {
  const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);

  const oferta = await Oferta.findOne({ id });

  if (!oferta) {
    return next(new AppError("Oferta not found", 404));
  }

  // Ștergem fișierul poster
  if (oferta.poster_path) {
    const posterPath = path.join(process.cwd(), "public", oferta.poster_path);
    try {
      await fs.unlink(posterPath);
    } catch (err) {
      console.warn("Could not delete poster:", err.message);
    }
  }

  // Ștergem oferta din DB
  await Oferta.deleteOne({ id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

const createOferta = [
  upload.array("images", 10), // middleware pentru upload
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    console.log(data);
    data.new_Oferta = data.new_Oferta === "on" || data.new_Oferta === true;
    if (data.price) data.price = Number(data.price);
    if (data.data) data.data = new Date(data.data);

    // array cu path-urile imaginilor încărcate
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((file) => {
        return `${file.filename}`;
      });
    }
    console.log(data);
    if (data.coord_x !== undefined && data.coord_y !== undefined) {
      data.coord = {
        x: parseFloat(data.coord_x),
        y: parseFloat(data.coord_y),
      };
      delete data.coord_x;
      delete data.coord_y;
    } else {
      data.coord = { x: 0, y: 0 }; // fallback dacă nu vin coordonate
    }

    data.id = await getNextId();

    const oferta = await Oferta.create(data);

    res.status(201).json({
      status: "success",
      data: {
        data: oferta,
      },
    });
  }),
];

const getTipOferte = catchAsync(async (req, res, next) => {
  const { tipOferta } = req.params;

  const oferte = await Oferta.find({
    type_oferta: { $regex: `^${tipOferta}$`, $options: "i" },
  });

  if (!oferte) {
    return next(new AppError("No oferte in DB", 404));
  }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: oferte.length,
    data: {
      oferte,
    },
  });
});

const oferteController = {
  getSomeOferte,
  getOferta,
  getAllTypeOferte,
  getAllOferte,
  updateOferta,
  deleteOferta,
  getTipOferte,
  createOferta,
};

export default oferteController;
