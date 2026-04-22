/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Configure puppeteer to use the system-installed Chrome on Render
  cacheDirectory: `${process.env.HOME}/.cache/puppeteer`,
  // Skip download and use system chrome on production
  skipDownload: process.env.NODE_ENV === "production",
};
