import puppeteer from 'puppeteer';

export async function generatePDF(htmlContent: string): Promise<Buffer> {
  const launchOptions = {
    headless: true as const,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  };

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch {
    // Fall back to a system-installed Chrome if the bundled browser is missing
    browser = await puppeteer.launch({
      ...launchOptions,
      executablePath: "/usr/bin/google-chrome-stable",
    });
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
