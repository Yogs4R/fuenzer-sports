export const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

export const poisson = (lambda: number, k: number): number => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

export const getHostAdvantage = (tla: string) => {
  return ['USA', 'CAN', 'MEX'].includes(tla) ? 5.0 : 0;
};

export const calculateWinProbability = (homePower: number, awayPower: number, homeTla: string, awayTla: string) => {
  // Apply host advantage
  const finalHomePower = homePower + getHostAdvantage(homeTla);
  const finalAwayPower = awayPower + getHostAdvantage(awayTla);

  const lamHome = Math.max(0.1, 1.2 + (finalHomePower - finalAwayPower) * 0.05);
  const lamAway = Math.max(0.1, 1.0 + (finalAwayPower - finalHomePower) * 0.05);

  let homeWinProb = 0;
  let awayWinProb = 0;
  let drawProb = 0;

  for (let i = 0; i <= 10; i++) {
    for (let j = 0; j <= 10; j++) {
      const prob = poisson(lamHome, i) * poisson(lamAway, j);
      if (i > j) {
        homeWinProb += prob;
      } else if (j > i) {
        awayWinProb += prob;
      } else {
        drawProb += prob;
      }
    }
  }

  // Knockout resolution: 50% chance for each team if draw
  homeWinProb += drawProb * 0.5;
  awayWinProb += drawProb * 0.5;

  // Normalize to ensure they sum exactly to 100% (handling floating point quirks)
  const total = homeWinProb + awayWinProb;
  
  return {
    homeWinProb: ((homeWinProb / total) * 100).toFixed(1),
    awayWinProb: ((awayWinProb / total) * 100).toFixed(1)
  };
};
