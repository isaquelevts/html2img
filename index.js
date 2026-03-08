const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/convert', async (req, res) => {
  const { html, width = 1080, height = 1350, quality = 100 } = req.body;

  if (!html) return res.status(400).json({ error: 'html is required' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
