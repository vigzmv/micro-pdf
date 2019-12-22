const Puppeteer = require("puppeteer");
const { send, json } = require("micro");

const puppeteerLaunchOptions = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--window-size=1366x768"
  ]
};

class PuppeteerService {
  constructor() {
    let createBrowser = async () => {
      console.log("Launching browser...");
      this.browser = await Puppeteer.launch(puppeteerLaunchOptions);
      this.browser.on("disconnected", createBrowser);
    };

    (async () => {
      await createBrowser();
    })();
  }

  newPage() {
    return this.browser.newPage();
  }
}

const puppeteerService = new PuppeteerService();

module.exports = async (req, res) => {
  const { html, format = "A$" } = await json(req);
  const page = await puppeteerService.newPage();

  page.setJavaScriptEnabled(false); // Enable if javascript is needed to

  await page.setContent(html, {
    waitUntil: "networkidle0" // wait until images and css are loaded
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });
  page.close();

  const filename = `filename=Example.pdf`;
  res.setHeader("Content-Disposition", filename);
  res.setHeader("X-Content-Type-Options", "application/pdf");
  res.setHeader("Content-Type", "application/pdf");

  console.log("PDF Created");
  send(res, 200, pdf);
};
