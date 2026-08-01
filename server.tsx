import Groq from "groq-sdk";
import dotenv from "dotenv";
import { getPrompt } from "./prompt";
import test from "./test.json";
import { renderToString } from "react-dom/server";
import ResumePDF from "./ResumePDF";
import { generatePDF } from "./generatePDF";
import express from "express";
import cors from "cors";
import multer from "multer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

//  GROQ Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

//  Extract text from a PDF buffer (multer memoryStorage keeps the file in memory)
const extractTextFromBuffer = async (buffer: Buffer): Promise<string> => {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  await parser.destroy();
  return text;
};

//  GROQ responses sometimes wrap JSON in markdown fences - strip those & isolate the object
const parseJsonContent = (content: string): any => {
  let cleaned = content.trim();
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) cleaned = fence[1].trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
  return JSON.parse(cleaned);
};

//  Call GROQ to get the optimized resume data
const optimiseWithGroq = async (
  resumeText: string,
  jobRole: string
): Promise<any> => {
  const pmt = getPrompt(resumeText, jobRole);
  console.log("Sending to GROQ...");
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: pmt }],
    model: "llama-3.3-70b-versatile",
  });
  const content = chatCompletion.choices[0]?.message?.content;
  if (!content) throw new Error("GROQ returned an empty response.");
  return parseJsonContent(content);
};

//  Server
app.get("/", (_req, res) => {
  res.json({ message: "200!" });
});

app.post("/optimise", upload.single("resumePdf"), async (req, res) => {
  try {
    const jobRole = (req.body?.jobRole || "").toString().trim();
    const file = req.file;

    if (!file || !file.buffer) {
      res.status(400).json({ error: "No resume PDF uploaded." });
      return;
    }

    console.log("Job Role:", jobRole);
    console.log("File:", file.originalname, `(${file.size} bytes)`);

    // 1. Extract text from the uploaded PDF
    const resumeText = await extractTextFromBuffer(file.buffer);

    // 2. Get the optimized resume data from GROQ
    const optimized =
      resumeText.trim().length > 0
        ? await optimiseWithGroq(resumeText, jobRole)
        : test;

    // 3. Render the resume HTML
    const html = renderToString(<ResumePDF data={optimized} />);

    // 4. Generate the final PDF
    const pdfBuffer = await generatePDF(html);

    // 5. Send the PDF back to the frontend
    const filename = `optimised_${file.originalname || "resume.pdf"}`;
    console.log(`Optimisation complete, sending ${filename} (${pdfBuffer.length} bytes)`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("Optimisation failed:", err);
    res.status(500).json({ error: "Optimisation failed: " + (err as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
