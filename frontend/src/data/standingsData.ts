// ISO country codes for FlagCDN
export const countries = [
  { name: 'Argentina', code: 'ar' }, { name: 'France', code: 'fr' }, { name: 'Japan', code: 'jp' }, { name: 'Morocco', code: 'ma' },
  { name: 'Brazil', code: 'br' }, { name: 'Germany', code: 'de' }, { name: 'Spain', code: 'es' }, { name: 'England', code: 'gb' },
  { name: 'Netherlands', code: 'nl' }, { name: 'Portugal', code: 'pt' }, { name: 'Croatia', code: 'hr' }, { name: 'Belgium', code: 'be' },
  { name: 'Uruguay', code: 'uy' }, { name: 'Senegal', code: 'sn' }, { name: 'USA', code: 'us' }, { name: 'Mexico', code: 'mx' },
  { name: 'South Korea', code: 'kr' }, { name: 'Switzerland', code: 'ch' }, { name: 'Cameroon', code: 'cm' }, { name: 'Ghana', code: 'gh' },
  { name: 'Canada', code: 'ca' }, { name: 'Ecuador', code: 'ec' }, { name: 'Poland', code: 'pl' }, { name: 'Australia', code: 'au' },
  { name: 'Denmark', code: 'dk' }, { name: 'Tunisia', code: 'tn' }, { name: 'Costa Rica', code: 'cr' }, { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Qatar', code: 'qa' }, { name: 'Iran', code: 'ir' }, { name: 'Serbia', code: 'rs' }, { name: 'Wales', code: 'gb-wls' },
  { name: 'Italy', code: 'it' }, { name: 'Colombia', code: 'co' }, { name: 'Sweden', code: 'se' }, { name: 'Ukraine', code: 'ua' },
  { name: 'Peru', code: 'pe' }, { name: 'Chile', code: 'cl' }, { name: 'Nigeria', code: 'ng' }, { name: 'Egypt', code: 'eg' },
  { name: 'Algeria', code: 'dz' }, { name: 'Turkey', code: 'tr' }, { name: 'Austria', code: 'at' }, { name: 'Hungary', code: 'hu' },
  { name: 'Czech Republic', code: 'cz' }, { name: 'Romania', code: 'ro' }, { name: 'Greece', code: 'gr' }, { name: 'New Zealand', code: 'nz' }
];

export interface Team {
  name: string;
  code: string;
  pld: number;
  w: number;
  d: number;
  l: number;
  pts: number;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface ThirdPlaceTeam {
  name: string;
  code: string;
  group: string;
  pld: number;
  w: number;
  d: number;
  l: number;
  pts: number;
}

// Generate the 12 Groups (A to L)
export const groups: Group[] = Array.from({ length: 12 }, (_, i) => {
  const groupLetter = String.fromCharCode(65 + i); // A to L
  const groupTeams = countries.slice(i * 4, i * 4 + 4).map((c, tIdx) => {
    // Simulated dummy points
    const pts = tIdx === 0 ? 7 : tIdx === 1 ? 4 : tIdx === 2 ? 3 : 1;
    const w = tIdx === 0 ? 2 : tIdx === 1 ? 1 : tIdx === 2 ? 1 : 0;
    const d = tIdx === 0 ? 1 : tIdx === 1 ? 1 : tIdx === 2 ? 0 : 1;
    const l = tIdx === 0 ? 0 : tIdx === 1 ? 1 : tIdx === 2 ? 2 : 2;
    return {
      ...c,
      pld: 3,
      w,
      d,
      l,
      pts
    };
  });

  return {
    name: `Group ${groupLetter}`,
    teams: groupTeams
  };
});

// Generate 12 Third-Place Teams sorted by points
export const bestThirdPlaceTeams: ThirdPlaceTeam[] = groups.map((g, i) => {
  const team = g.teams[2];
  let pts = 1;
  let w = 0, d = 1, l = 2;
  if (i < 3) {
    pts = 5; w = 1; d = 2; l = 0;
  } else if (i < 7) {
    pts = 4; w = 1; d = 1; l = 1;
  } else if (i < 10) {
    pts = 3; w = 1; d = 0; l = 2;
  }
  return {
    name: team.name,
    code: team.code,
    group: g.name.replace('Group ', ''),
    pld: 3,
    w,
    d,
    l,
    pts
  };
}).sort((a, b) => b.pts - a.pts);
