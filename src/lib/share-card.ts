import type { EvaluationResponse } from "./types";

const WIDTH = 1200;
const HEIGHT = 630;

function taskLines(context: CanvasRenderingContext2D, task: string, maxWidth: number): string[] {
  const words = task.trim().split(/\s+/);
  const lines: string[] = [];
  let line = "";
  let truncated = false;

  for (const [index, word] of words.entries()) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === 3) {
      truncated = true;
      break;
    }
    if (index === words.length - 1 && context.measureText(word).width > maxWidth) truncated = true;
  }
  if (line && lines.length < 3) lines.push(line);

  if (truncated || context.measureText(lines.at(-1) ?? "").width > maxWidth) {
    let last = lines[lines.length - 1] ?? "";
    while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
    lines[lines.length - 1] = `${last.trimEnd()}…`;
  }
  return lines;
}

export async function createShareCard(response: EvaluationResponse): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create the result card.");

  context.fillStyle = "#21242e";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = "#7a8aba";
  context.fillRect(22, 22, WIDTH - 44, HEIGHT - 44);
  context.strokeStyle = "#3d4f97";
  context.lineWidth = 5;
  context.strokeRect(22, 22, WIDTH - 44, HEIGHT - 44);

  context.fillStyle = "#26365f";
  context.font = "bold 21px Arial, sans-serif";
  context.fillText("THE SELF-REFERENCE TEST", 58, 72);
  context.fillText("JEV VS. JEV", 977, 72);
  context.strokeStyle = "#3d4f97";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(58, 93);
  context.lineTo(1142, 93);
  context.stroke();

  context.fillStyle = "#ffffff";
  context.font = "900 67px Arial Black, Arial, sans-serif";
  context.fillText("SHOULD JEV DO IT?", 58, 173);

  context.fillStyle = "#8ba1d4";
  context.fillRect(58, 211, 1084, 299);
  context.strokeStyle = "#3d4f97";
  context.lineWidth = 3;
  context.strokeRect(58, 211, 1084, 299);

  context.fillStyle = "#3d4f97";
  context.font = "bold 21px Arial, sans-serif";
  context.fillText("THE TASK", 82, 255);
  context.fillText("JEV'S CALL", 801, 255);

  context.save();
  context.beginPath();
  context.rect(82, 275, 674, 205);
  context.clip();
  context.fillStyle = "#21242e";
  context.font = "bold 40px Arial, sans-serif";
  taskLines(context, response.task, 650).forEach((line, index) => {
    context.fillText(line, 82, 323 + index * 54);
  });
  context.restore();

  context.fillStyle = response.result.verdict === "YES" ? "#f68d1f" : "#dce8f2";
  context.fillRect(798, 276, 315, 149);
  context.strokeStyle = "#3d4f97";
  context.strokeRect(798, 276, 315, 149);
  context.fillStyle = "#21242e";
  context.font = "900 93px Arial Black, Arial, sans-serif";
  context.fillText(response.result.verdict, 819, 377);
  context.fillStyle = "#3d4f97";
  context.font = "bold 25px Arial, sans-serif";
  context.fillText(`${Math.round(response.result.answerProbability * 100)}% toward ${response.result.verdict.toLowerCase()}`, 800, 466);

  context.fillStyle = "#26365f";
  context.font = "bold 19px Arial, sans-serif";
  context.fillText("A PLAYFUL SELF-CHECK, NOT A CAPABILITY GUARANTEE.", 58, 554);
  context.fillStyle = "#f68d1f";
  context.fillText("JEV-VS-JEV.VERCEL.APP", 895, 554);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Your browser could not save the result card."));
    }, "image/png");
  });
}
