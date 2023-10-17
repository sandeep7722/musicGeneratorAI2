import express from "express";
import Replicate from "replicate";
import multer from "multer";
import fetch from "node-fetch";
import "cross-fetch/dist/node-polyfill.js";

global.fetch = fetch;

const app = express();
const port = 3000; // You can use any available port

const replicate = new Replicate({
  auth: "r8_Vdzl2SE8fN2qJuOczQjXZZUq5jm4cMx4LM4lO", // replicate api token
});

const model = "meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906";

app.use(express.json());
app.use(express.static("public"));

// Configure multer to store uploaded files in a specific directory
const storage = multer.diskStorage({
  destination: "public/uploads", // Create an 'uploads' directory in your project
  filename: (req, file, callback) => {
    const fileName = Date.now() + "-" + file.originalname;
    callback(null, fileName);
  },
});

const upload = multer({ storage });

app.post("/generate-audio", upload.single("audioFile"), async (req, res) => {
    console.log(req.file.path);
  try {
    const output = await replicate.run(model, {
      input: {
        model_version: "melody",
        prompt: req.body.prompt,
        duration: 28,
        input_audio: req.file.path, // Use the uploaded file path
      },
    });

    const audioUrl = output;
    console.log("Generated Audio URL:", audioUrl);

    res.json({ audioUrl });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({ error: "Failed to generate audio." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
