"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_PUBLIC_URL = "https://incident-zero-stack.vercel.app";
const DEFAULT_OUT_DIR = path.join(os.homedir(), ".codex", "tmp", "incident-zero-stack", "demo-storyboard-video");

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index === process.argv.length - 1) return fallback;
  return process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_PUBLIC_URL).replace(/\/+$/, "");
}

function safeSegmentName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildStoryboard(options = {}) {
  const publicUrl = normalizeBaseUrl(options.publicUrl);
  return [
    {
      title: "Incident Zero Agent",
      kicker: "Slack Agent Builder demo",
      durationSeconds: 12,
      url: `${publicUrl}/`,
      bullets: [
        "One command becomes a structured incident brief.",
        "Evidence, actions, owner, risk, and handoff stay connected.",
        "No tokens, secrets, or private Slack data are stored."
      ]
    },
    {
      title: "Slack-ready response",
      kicker: "Command result",
      durationSeconds: 30,
      url: `${publicUrl}/api/slack-agent`,
      bullets: [
        "/incident-zero scenario=identity severity=critical",
        "Block Kit-style fields: severity, owner, risk, next update.",
        "Buttons point to handoff, due tasks, and evidence."
      ]
    },
    {
      title: "Same engine in the cockpit",
      kicker: "Public review flow",
      durationSeconds: 38,
      url: `${publicUrl}/`,
      bullets: [
        "Run demo shows deterministic incident state.",
        "Risk score, SLA windows, evidence ledger, and action board.",
        "Reviewers can inspect behavior without private workspace access."
      ]
    },
    {
      title: "Structured handoff",
      kicker: "Records and audit trail",
      durationSeconds: 35,
      url: `${publicUrl}/api/handoff?scenario=identity`,
      bullets: [
        "Executive handoff is generated from case state.",
        "Case, alert, task, evidence, update, and audit records align.",
        "DynamoDB-shaped records show a path to live storage."
      ]
    },
    {
      title: "API / MCP + Records",
      kicker: "Architecture",
      durationSeconds: 30,
      url: "https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack-agent-architecture.svg",
      bullets: [
        "Slack posts to a public HTTPS endpoint.",
        "API core renders the Slack response from the shared engine.",
        "MCP tools expose brief, handoff, and storage preview workflows."
      ]
    },
    {
      title: "Submission boundary",
      kicker: "Review-safe package",
      durationSeconds: 20,
      url: "https://raw.githubusercontent.com/OOYXLOO/incident-zero-stack/master/docs/slack_challenge_submission_pack.md",
      bullets: [
        "Public source, deterministic demo data, and review pages only.",
        "Real Slack sandbox clip can replace the preview segment later.",
        "No workspace secrets, private messages, billing, or customer data."
      ]
    }
  ];
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderTextBlock(lines, x, y, options = {}) {
  const size = options.size || 42;
  const fill = options.fill || "#e9f0ff";
  const weight = options.weight || 500;
  const gap = options.gap || Math.round(size * 1.35);
  return lines.map((line, index) => (
    `<text x="${x}" y="${y + index * gap}" fill="${fill}" font-size="${size}" font-weight="${weight}">${escapeXml(line)}</text>`
  )).join("\n");
}

function renderSlideSvg(slide, options = {}) {
  const width = options.width || 1920;
  const height = options.height || 1080;
  const index = options.index || 0;
  const total = options.total || 1;
  const titleLines = wrapText(slide.title, 34);
  const urlLines = wrapText(slide.url, 62);
  const bulletLines = slide.bullets.flatMap((bullet) => wrapText(`- ${bullet}`, 54));
  const progressWidth = Math.round(((index + 1) / total) * 1320);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="1920" height="1080" fill="#0b1220"/>
  <rect x="80" y="74" width="1760" height="932" rx="34" fill="#101a2e" stroke="#2dd4bf" stroke-width="3"/>
  <circle cx="1650" cy="230" r="210" fill="#1d4ed8" opacity="0.20"/>
  <circle cx="1510" cy="790" r="260" fill="#14b8a6" opacity="0.16"/>
  <path d="M112 884 C 420 740, 640 920, 950 780 S 1440 640, 1810 780" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.35"/>
  <text x="132" y="150" fill="#2dd4bf" font-size="34" font-weight="700" letter-spacing="2">${escapeXml(slide.kicker.toUpperCase())}</text>
  ${renderTextBlock(titleLines, 132, 276, { size: 84, fill: "#f8fafc", weight: 800, gap: 96 })}
  <rect x="132" y="466" width="1180" height="3" fill="#2dd4bf" opacity="0.75"/>
  ${renderTextBlock(bulletLines, 168, 556, { size: 42, fill: "#dbeafe", weight: 500, gap: 58 })}
  <rect x="132" y="838" width="1250" height="92" rx="18" fill="#08111f" stroke="#334155" stroke-width="2"/>
  <text x="168" y="880" fill="#94a3b8" font-size="28" font-weight="700">Review URL</text>
  ${renderTextBlock(urlLines, 168, 916, { size: 26, fill: "#bae6fd", weight: 500, gap: 34 })}
  <rect x="460" y="966" width="1320" height="10" rx="5" fill="#1e293b"/>
  <rect x="460" y="966" width="${progressWidth}" height="10" rx="5" fill="#2dd4bf"/>
  <text x="132" y="980" fill="#64748b" font-size="28" font-weight="700">Scene ${index + 1}/${total}</text>
  <text x="1458" y="930" fill="#e2e8f0" font-size="30" font-weight="700">Incident Zero Stack</text>
  <text x="1458" y="970" fill="#94a3b8" font-size="24">Public demo rehearsal asset</text>
</svg>
`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeStoryboardAssets(options = {}) {
  const outDir = path.resolve(options.outDir || DEFAULT_OUT_DIR);
  const storyboard = buildStoryboard({ publicUrl: options.publicUrl });
  ensureDir(outDir);
  const width = options.width || 1920;
  const height = options.height || 1080;
  const slides = storyboard.map((slide, index) => {
    const filename = `${String(index + 1).padStart(2, "0")}-${safeSegmentName(slide.title)}.svg`;
    const file = path.join(outDir, filename);
    fs.writeFileSync(file, renderSlideSvg(slide, { width, height, index, total: storyboard.length }), "utf8");
    return { ...slide, filename, file };
  });
  const manifest = {
    generatedAt: new Date(0).toISOString(),
    kind: "incident-zero-demo-storyboard-video-assets",
    publicUrl: normalizeBaseUrl(options.publicUrl),
    width,
    height,
    totalDurationSeconds: storyboard.reduce((sum, slide) => sum + slide.durationSeconds, 0),
    slides: slides.map(({ file, ...slide }) => slide)
  };
  fs.writeFileSync(path.join(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(outDir, "README.md"), renderReadme(manifest), "utf8");
  return { outDir, manifest, slides };
}

function renderReadme(manifest) {
  return `# Incident Zero demo storyboard video assets

These generated assets are a public-only rehearsal package for the Slack Agent Builder demo video.

They do not claim that a real Slack sandbox is installed. Replace the command-result segment with a real sandbox clip after the Slack app gate is complete.

Public runtime:

\`\`\`text
${manifest.publicUrl}
\`\`\`

Total planned duration: ${manifest.totalDurationSeconds} seconds.

Sensitive-content boundary:

- Do not include Slack tokens, signing secrets, workspace cookies, private messages, customer records, payment pages, tax/KYC pages, or private account exports.
- Use these SVG slides only as a recording scaffold or fallback rehearsal asset.
`;
}

function ffmpegExists() {
  try {
    childProcess.execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch (_) {
    return false;
  }
}

function renderMp4(assets, options = {}) {
  if (!ffmpegExists()) return { rendered: false, reason: "ffmpeg not found" };
  const output = path.resolve(options.output || path.join(assets.outDir, "incident-zero-demo-storyboard.mp4"));
  const args = ["-y"];
  for (const slide of assets.slides) {
    args.push("-loop", "1", "-t", String(slide.durationSeconds), "-i", slide.file);
  }
  const filter = `${assets.slides.map((_, index) => `[${index}:v]scale=1920:1080,format=yuv420p[v${index}]`).join(";")};${assets.slides.map((_, index) => `[v${index}]`).join("")}concat=n=${assets.slides.length}:v=1:a=0[outv]`;
  args.push("-filter_complex", filter, "-map", "[outv]", "-r", "30", "-movflags", "+faststart", output);
  childProcess.execFileSync("ffmpeg", args, { stdio: "pipe" });
  return { rendered: true, output };
}

function run() {
  const publicUrl = argValue("--public-url", DEFAULT_PUBLIC_URL);
  const outDir = argValue("--out-dir", DEFAULT_OUT_DIR);
  const output = argValue("--output", path.join(path.resolve(outDir), "incident-zero-demo-storyboard.mp4"));
  const assets = writeStoryboardAssets({ publicUrl, outDir });
  const renderResult = hasFlag("--render") ? renderMp4(assets, { output }) : { rendered: false, reason: "render flag not set" };
  process.stdout.write(`${JSON.stringify({
    outDir: assets.outDir,
    manifest: path.join(assets.outDir, "manifest.json"),
    slideCount: assets.slides.length,
    totalDurationSeconds: assets.manifest.totalDurationSeconds,
    render: renderResult
  }, null, 2)}\n`);
}

if (require.main === module) {
  run();
}

module.exports = {
  buildStoryboard,
  renderSlideSvg,
  safeSegmentName,
  writeStoryboardAssets,
  renderMp4
};
