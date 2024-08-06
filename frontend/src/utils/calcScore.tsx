export default function calcScore(start: number, end: number, length: number) {
  const duration = (end - start) / 60000;
  const wordsTyped = length / 5;
  const wpmScore = (wordsTyped / duration).toFixed(2);

  return {
    wpmScore,
  };
}
