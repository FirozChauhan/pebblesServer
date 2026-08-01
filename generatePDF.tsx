import puppeteer from "puppeteer";
import { accessSync, constants } from "node:fs";

//  Flags needed on containers/Render where Chrome runs as a non-root user and
//  /dev/shm is small. Without --disable-dev-shm-usage Puppeteer can crash with
//  "Target closed" on low-memory hosts.
const BASE_ARGS = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];

function canExec(path: string): boolean {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

//  Return the first usable Chrome/Chromium binary, or undefined if none exists.
//  Tries, in order: an explicit PUPPETEER_EXECUTABLE_PATH (if valid), the
//  common system Chrome/Chromium locations, and Puppeteer's own bundled browser.
async function resolveExecutablePath(): Promise<string | undefined> {
  const candidates: (string | undefined)[] = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/opt/google/chrome/chrome",
    await puppeteer.executablePath().catch(() => undefined),
  ];

  const seen = new Set<string>();
  for (const p of candidates) {
    if (!p || seen.has(p)) continue;
    seen.add(p);
    if (canExec(p)) return p;
  }
  return undefined;
}

export async function generatePDF(htmlContent: string): Promise<Buffer> {
  let browser;
  try {
    //  Prefer whatever Puppeteer resolves on its own (valid PUPPETEER_EXECUTABLE_PATH
    //  or its bundled browser).
    browser = await puppeteer.launch({ headless: true, args: BASE_ARGS });
  } catch {
    //  Default browser is missing — probe the installed system Chrome/Chromium.
    const executablePath = await resolveExecutablePath();
    if (!executablePath) {
      throw new Error(
        "Could not find a Chromium/Chrome browser to render the PDF. Install one " +
          "on the server or deploy with the provided Dockerfile (which bundles Chromium)."
      );
    }
    browser = await puppeteer.launch({ headless: true, args: BASE_ARGS, executablePath });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0" as any,
    });
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    return pdf as Buffer;
  } finally {
    await browser.close();
  }
}

