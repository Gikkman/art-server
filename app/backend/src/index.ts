import express from "express";
import { getCardDataByName, getCardDataByNameAndSet, getCardDataBySetAndNumber, query } from "./mtg-json-database";
import path from "path";
import { downloadIfNotPresent, runDownload } from "./mtg-json-downloader";

downloadIfNotPresent()
  .then(() => {
    setInterval(() => runDownload(), 1000 * 60 * 60 * 6); // 6 hours
  })
  .then(() => {
    const app = express();
    const port = process.env.PORT || 8080;

    app.use((req, res, next) => {
      const now = Date.now();
      res.on("finish", () => {
        console.log(`[server (${Date.now() - now} ms)]: ${req.url} - ${res.statusCode}`);
      });
      next();
    });

    app.get("/query", async (req, res) => {
      const { name } = req.query;
      if (!name) return res.json({});
      if (typeof name !== "string") return res.json({});

      const names = await query(name);
      return res.json({ names });
    });

    app.get("/search", async (req, res) => {
      const { name, nr, set } = req.query;

      if (!isValidRequest(name, nr, set)) {
        return res.status(400).send("Invalid request");
      }

      if (typeof nr === "string" && typeof set === "string") {
        const data = await getCardDataBySetAndNumber(set, nr);
        return res.json(data);
      }

      if (typeof name === "string" && typeof set === "string") {
        const data = await getCardDataByNameAndSet(set, name);
        return res.json(data);
      }

      if (typeof name === "string") {
        const data = await getCardDataByName(name);
        return res.json(data);
      }

      res.status(400).send("Bad set of params. Require [set, name] or [set, nr] or [name]");
    });

    const staticPath = path.resolve(path.join("..", "frontend", "_dist"));
    app.use("/", express.static(staticPath, { index: "index.html" }));

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  });

function isValidRequest(name: unknown, nr: unknown, set: unknown): boolean {
  const validName = typeof name === "string";
  const validNumber = typeof nr === "string" && parseInt(nr);
  const validSet = typeof set === "string";

  return (validNumber && validSet) || validName;
}
