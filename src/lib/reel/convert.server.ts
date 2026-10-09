import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

function encoderPath(): string | null {
  const candidates = [process.env.FFMPEG_PATH, "/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg"].filter(
    (item): item is string => Boolean(item),
  );
  return candidates.find((item) => existsSync(item)) ?? null;
}

export async function convertWebmToMp4(data: Uint8Array): Promise<Uint8Array> {
  const bin = encoderPath();
  if (!bin || !existsSync(bin)) {
    throw new Error("MP4 encoder is not available on this server");
  }
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const input = resolve(tmpdir(), `reel-${stamp}.webm`);
  const output = resolve(tmpdir(), `reel-${stamp}.mp4`);
  await writeFile(input, data);
  try {
    await new Promise<void>((resolveDone, reject) => {
      const child = spawn(bin, [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        input,
        "-map",
        "0:v:0",
        "-map",
        "0:a:0?",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-profile:v",
        "high",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "30",
        "-movflags",
        "+faststart",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        output,
      ]);
      let err = "";
      const timer = setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          /* already gone */
        }
        reject(new Error("FFmpeg conversion timed out"));
      }, 300_000);
      child.stderr.on("data", (chunk: Buffer) => {
        err += chunk.toString();
      });
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code === 0) resolveDone();
        else reject(new Error(err.slice(-500) || "FFmpeg conversion failed"));
      });
    });
    const mp4 = await readFile(output);
    if (mp4.length < 1000) throw new Error("FFmpeg produced an unexpectedly small MP4");
    if (mp4.subarray(4, 8).toString("ascii") !== "ftyp") throw new Error("FFmpeg output is not a valid MP4");
    return mp4;
  } finally {
    await Promise.allSettled([unlink(input), unlink(output)]);
  }
}
