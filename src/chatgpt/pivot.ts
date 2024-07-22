// Add stealth plugin and use defaults
import pluginStealth from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-extra";

// Use stealth
puppeteer.use(pluginStealth());

// List of URLs

const urls: { period: string; url: string }[] = [
  {
    period: "1 minute",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/1m",
  },

  {
    period: "5 minutes",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/5m",
  },
  {
    period: "15 minutes",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/15m",
  },
  {
    period: "30 minutes",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/30m",
  },
  {
    period: "1 hour",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/1h",
  },
  {
    period: "5 hours",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/5h",
  },
  {
    period: "1 day",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/1d",
  },
  {
    period: "1 week",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/1w",
  },
  {
    period: "1 month",
    url: "https://api.investing.com/api/financialdata/technical/analysis/945629/1mo",
  },
];

// Function to fetch pivot points from a single URL
async function fetchPivotPoints(page: any, url: any) {
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Get the HTML content of the page
  const html = await page.content();

  // Extract the JSON string containing the pivotPoints data
  const jsonString = html?.match(/<pre>(.*?)<\/pre>/s)[1];

  // Parse the JSON string
  const data = JSON.parse(jsonString ?? "{}");

  return data;
}

// Main function to extract pivot points from all URLs
export async function getPivotPoints(): Promise<any> {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  console.log("Puppeteer started.");

  const page = await browser.newPage();
  const allPivotPoints: { period: string; priceData: any }[] = [];

  for (const url of urls) {
    try {
      const priceData = await fetchPivotPoints(page, url.url);
      allPivotPoints.push({ period: url.period, priceData });
    } catch (error) {
      console.error(`Error fetching data from ${url.url}:`, error);
    }
  }
  await page.close();
  await browser.close();
  console.log("Fetch result:", allPivotPoints);
  return allPivotPoints;
}
