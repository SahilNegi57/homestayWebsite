// One-time video compression: writes web-friendly 720p H.264 copies to
// src/assets/videos-opt/. Originals in src/assets/videos/ are left untouched.
// Usage: node scripts/compress-videos.js
//
// 720p is plenty for a 900px-wide embed (the video-frame is max ~898px), and
// CRF 26 with the slow preset gives the best quality-per-megabyte for hosting.
//
// Settings are deliberately strict for MOBILE compatibility: phone-recorded
// clips are often VFR (variable frame rate) and full-range yuvj420p, which
// some mobile decoders (Android Chrome, iOS Safari) refuse to play — the
// video just sits frozen on its poster/frame while it works fine on desktop.
// So we force constant 30 fps, standard limited-range yuv420p with bt709
// color tags, level 4.0 (safe for all phone decoders) and strip source
// metadata (Android capture tags etc.).
const ffmpeg = require("ffmpeg-static");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "src/assets/videos";
const OUT_DIR = "src/assets/videos-opt";
const HEIGHT = 720;    // long-edge target (portrait clips get 720px tall)
const CRF = 26;        // 18–28 scale; 26 = visually fine for web, much smaller
const FPS = 30;        // constant frame rate: mobile decoders dislike VFR

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter(f => f.toLowerCase().endsWith(".mp4"));
  for (const file of files) {
    const src = path.join(SRC_DIR, file);
    const base = path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const out = path.join(OUT_DIR, base + ".mp4");
    const before = fs.statSync(src).size;
    // -vf: scale to height 720 (width auto-rounded to a legal even value,
    // handles both landscape and portrait clips), then normalize pixel format
    // and frame rate for mobile decoders. faststart moves the index to the
    // front so playback starts before the whole file downloads.
    execFileSync(ffmpeg, [
      "-y", "-i", src,
      "-vf", `scale=-2:${HEIGHT},format=yuv420p,fps=${FPS}`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(CRF),
      "-profile:v", "high", "-level", "4.0",
      "-color_range", "tv", "-colorspace", "bt709",
      "-color_primaries", "bt709", "-color_trc", "bt709",
      "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709",
      "-c:a", "aac", "-b:a", "96k",
      "-movflags", "+faststart",
      "-map_metadata", "-1",
      out,
    ], { stdio: "inherit" });
    const after = fs.statSync(out).size;
    console.log(`${file} (${(before / 1048576).toFixed(1)}MB) -> ${path.relative(".", out)} (${(after / 1048576).toFixed(2)}MB, -${(100 - (after / before) * 100).toFixed(0)}%)`);
  }
  console.log("Done.");
})();
