// One-time image optimization: writes compressed copies to <dir>-opt/.
// Originals are left untouched. Usage: node scripts/optimize-images.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DIRS = ["src/assets/images/Rooms", "src/assets/images/galllery"];
const MAX_W = 1920; // long edge cap — plenty for full-width display
const JPEG_Q = 74;  // visually transparent for photos

(async () => {
  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;
    const outDir = dir + "-opt";
    fs.mkdirSync(outDir, { recursive: true });
    const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|JPE?G|png)$/i.test(f));
    for (const file of files) {
      const src = path.join(dir, file);
      // Normalize name: lowercase, simple ascii, single extension
      const ext = ".jpg";
      let base = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const out = path.join(outDir, base + ext);
      const before = fs.statSync(src).size;
      let img = sharp(src).rotate(); // respect EXIF orientation
      const meta = await img.metadata();
      if (meta.width > MAX_W) img = img.resize({ width: MAX_W });
      const buf = await img.jpeg({ quality: JPEG_Q, mozjpeg: true }).toBuffer();
      fs.writeFileSync(out, buf);
      console.log(`${file} (${(before / 1048576).toFixed(1)}MB) -> ${path.relative(".", out)} (${(buf.length / 1048576).toFixed(2)}MB)`);
    }
  }
  console.log("Done.");
})();
