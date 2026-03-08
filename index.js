const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/convert', async (req, res) => {
  const html = req.body.html;
  const width = parseInt(req.body.width) || 1080;
  const height = parseInt(req.body.height) || 1350;
  const quality = parseInt(req.body.quality) || 100;

  if (!html) return res.status(400).json({ error: 'html is required' });

  let browser;
  try {
    browser = await puppeteer.launch({
  headless: 'new',
  executablePath: '/usr/bin/chromium',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-extensions'
  ]
});

    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality,
      clip: { x: 0, y: 0, width, height }
    });

    res.set('Content-Type', 'image/jpeg');
    res.send(screenshot);

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(3033, () => console.log('html2img running on port 3033'));
