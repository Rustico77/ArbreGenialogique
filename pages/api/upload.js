// pages/api/upload.js
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // obligatoire pour formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const uploadDir = path.join(process.cwd(), "/public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: err.message });
    }

    const file = files.file; // IMPORTANT: doit correspondre au name="file" du <input>
    if (!file) return res.status(400).json({ error: "Fichier manquant" });

    // Selon la version de Formidable, le nom final est file.newFilename
    const fileName = file[0].newFilename;

    res.status(200).json({ url: `/uploads/${fileName}` });
  });
}
