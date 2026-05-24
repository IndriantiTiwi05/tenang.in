type Workload =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

type Mood =
  | "sad"
  | "bad"
  | "neutral"
  | "good"
  | "excellent";

type Risk =
  | "low"
  | "medium"
  | "high";

export function calculateBurnout(
  sleep: number,
  workload: Workload,
  mood: Mood,
  sadness: number
) {

  let score = 20;
  if (sleep <= 3) {
    score += 35;

  } else if (sleep <= 5) {
    score += 25;

  } else if (sleep <= 6) {
    score += 15;

  } else if (sleep >= 8) {
    score -= 5;
  }

  switch (workload) {

    case "very_low":
      score += 0;
      break;

    case "low":
      score += 5;
      break;

    case "medium":
      score += 15;
      break;

    case "high":
      score += 25;
      break;

    case "very_high":
      score += 40;
      break;
  }

  switch (mood) {

    case "excellent":
      score -= 10;
      break;

    case "good":
      score -= 5;
      break;

    case "neutral":
      score += 5;
      break;

    case "bad":
      score += 20;
      break;

    case "sad":
      score += 30;
      break;
  }

  if (sadness >= 0.8) {

    score += 30;

  } else if (sadness >= 0.5) {

    score += 15;
  }

  if (score > 100) {
    score = 100;
  }

  if (score < 0) {
    score = 0;
  }

  let risk: Risk = "low";

  if (score >= 75) {

    risk = "high";

  } else if (score >= 45) {

    risk = "medium";
  }

  return {
    risk,
    score,
  };
}

export function generateInsight(
  risk: Risk
) {

  switch (risk) {

    case "high":
      return "Kondisimu cukup berat. Segera istirahat dan kurangi tekanan.";

    case "medium":
      return "Kamu mulai mengalami tekanan mental. Coba atur pola hidup.";

    default:
      return "Kondisimu cukup baik. Pertahankan pola hidup sehat.";
  }
}