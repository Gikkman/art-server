import express from "express";
import { getCardDataByName, getCardDataByNameAndSet, getCardDataBySetAndNumber } from "./database";
import { getCardImages } from "./cards";

const app = express();
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
  const {name, nr, set} = req.query;
  
  if(!isValidRequest(name, nr, set)) {
    return res.status(400).send("Invalid request")
  }

  if(typeof nr === "string" && typeof set === "string") {
    const data = await getCardDataBySetAndNumber(set, nr);
    const images = await getCardImages(data);
    return res.json(images)
  }
  if(typeof name === "string" && typeof set === "string") {
    const data = await getCardDataByNameAndSet(set, name);
    const images = await getCardImages(data);
    return res.json(images)
  }
  if(typeof name === "string") {
    const data = await getCardDataByName(name);
    const images = await getCardImages(data);
    return res.json(images)
  }
  res.status(400).send("Bad set of params. Require [set, name] or [set, nr] or [name]")
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

function isValidRequest(name: unknown, nr: unknown, set: unknown): boolean {
  const validName = typeof name === "string";
  const validNumber = typeof nr === "string" && parseInt(nr);
  const validSet = typeof set === "string";

  return (validNumber && validSet) || (validName)
}