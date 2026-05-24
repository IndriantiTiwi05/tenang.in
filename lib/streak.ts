export function calculateStreak(history: any[]) {
  if (!history?.length) return 0;

  const uniqueDates = Array.from(
    new Set(
      history
        .map(item => item.createdAt ? new Date(item.createdAt).toISOString().split("T")[0] : null)
        .filter((d): d is string => d !== null)
    )
  ).sort((a, b) => (a > b ? -1 : 1));

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterdayStr) {
    return 0;
  }

  // Hitung streak
  streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const diff = (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i+1]).getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }

  return streak;
}