import express from "express";
import { insertOne, find, insertReview } from "../api/db.mjs";
import { search } from "../api/search.mjs";
import {
  autocompleteLocation,
  autocompleteSearch,
} from "../api/autocomplete.mjs";
import { detailLocation, detailStore } from "../api/detail.mjs";
import { setLocation } from "../api/set.mjs";
import { popularRestaurants } from "../api/get.mjs";

const router = express.Router();

// location requirement middleware
router.use((req, res, next) => {
  const locationRequiredEndpoints = [
    "/autocomplete/search",
    "/search",
    "/popularPicks",
  ];

  if (
    locationRequiredEndpoints.includes(req.url) &&
    (!req?.body?.cookies || !req?.body?.cookies["uev2.loc"])
  ) {
    res.status(400);
    res.json({ error: "missing required location data" });
  } else {
    next();
  }
});

router.post("/set/location", async (req, res) => {
  res.json(await setLocation(req.body));
});

router.post("/detail/location", async (req, res) => {
  res.json(await detailLocation(req.body));
});

router.post("/detail/store", async (req, res) => {
  res.json(
    await detailStore({ service: req.body.service, storeId: req.body.storeId })
  );
});

router.post("/autocomplete/location", async (req, res) => {
  res.json(await autocompleteLocation(req.body.query));
});

router.post("/autocomplete/search", async (req, res) => {
  try {
    res.json(await autocompleteSearch(req.body));
  } catch (e) {
    console.error(e);
  }
});

router.post("/search", async (req, res) => {
  try {
    res.json(await search(req.body));
  } catch (e) {
    console.error(e);
  }
});

router.get("/db/get/", async (req, res) => {
  const results = await find();
  res.status(200).send({ response: results });
});

router.post("/db/add/", async (req, res) => {
  const insertedId = await insertOne({ data: req.body.data });
  res.status(200).send({
    message: insertedId,
  });
});

router.post("/db/addReview/", async (req, res) => {
  const insertedId = await insertReview({ data: req.body.data });
  res.status(200).send({
    message: insertedId,
  });
});

router.post("/popularPicks", async (req, res) => {
  try {
    res.json(await popularRestaurants(req.body));
  } catch (e) {
    console.error(e);
  }
});

export default router;
