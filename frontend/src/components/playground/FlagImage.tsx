import React, { useState } from 'react';

const TLA_TO_COUNTRY_CODE: Record<string, string> = {
  // World Cup 2026 / Major teams
  'ARG': 'ar', // Argentina
  'FRA': 'fr', // France
  'JPN': 'jp', // Japan
  'MAR': 'ma', // Morocco
  'BRA': 'br', // Brazil
  'GER': 'de', // Germany
  'ESP': 'es', // Spain
  'ENG': 'gb-eng', // England
  'NED': 'nl', // Netherlands
  'POR': 'pt', // Portugal
  'CRO': 'hr', // Croatia
  'BEL': 'be', // Belgium
  'URU': 'uy', // Uruguay
  'SEN': 'sn', // Senegal
  'USA': 'us', // USA
  'MEX': 'mx', // Mexico
  'KOR': 'kr', // South Korea
  'SUI': 'ch', // Switzerland
  'CMR': 'cm', // Cameroon
  'GHA': 'gh', // Ghana
  'CAN': 'ca', // Canada
  'ECU': 'ec', // Ecuador
  'POL': 'pl', // Poland
  'AUS': 'au', // Australia
  'DEN': 'dk', // Denmark
  'TUN': 'tn', // Tunisia
  'CRC': 'cr', // Costa Rica
  'KSA': 'sa', // Saudi Arabia
  'QAT': 'qa', // Qatar
  'IRN': 'ir', // Iran
  'SRB': 'rs', // Serbia
  'WAL': 'gb-wls', // Wales
  'ITA': 'it', // Italy
  'COL': 'co', // Colombia
  'SWE': 'se', // Sweden
  'UKR': 'ua', // Ukraine
  'PER': 'pe', // Peru
  'CHI': 'cl', // Chile
  'NGA': 'ng', // Nigeria
  'EGY': 'eg', // Egypt
  'ALG': 'dz', // Algeria
  'TUR': 'tr', // Turkey
  'AUT': 'at', // Austria
  'HUN': 'hu', // Hungary
  'CZE': 'cz', // Czechia
  'ROU': 'ro', // Romania
  'GRE': 'gr', // Greece
  'NZL': 'nz', // New Zealand
  'RSA': 'za', // South Africa
  'BIH': 'ba', // Bosnia and Herzegovina
  'ALB': 'al', // Albania
  'HAI': 'ht', // Haiti
  'NOR': 'no', // Norway
  'CIV': 'ci', // Ivory Coast
  'COD': 'cd', // Congo DR
  'CPV': 'cv', // Cape Verde
  'SCO': 'gb-sct', // Scotland
  'SVK': 'sk', // Slovakia
  'SVN': 'si', // Slovenia
  'FIN': 'fi', // Finland
  'IRL': 'ie', // Ireland
  'NIR': 'gb-nir', // Northern Ireland
  'ISL': 'is', // Iceland
  'PAR': 'py', // Paraguay
  'BOL': 'bo', // Bolivia
  'VEN': 've', // Venezuela
  'PAN': 'pa', // Panama
  'HON': 'hn', // Honduras
  'SLV': 'sv', // El Salvador
  'JAM': 'jm', // Jamaica
  'CHN': 'cn', // China
  'IRQ': 'iq', // Iraq
  'UAE': 'ae', // UAE
  'OMN': 'om', // Oman
  'UZB': 'uz', // Uzbekistan
  'JOR': 'jo', // Jordan
  'BHR': 'bh', // Bahrain
  'SYR': 'sy', // Syria
  'PLE': 'ps', // Palestine
  'IND': 'in', // India
  'VIE': 'vn', // Vietnam
  'THA': 'th', // Thailand
  'MAS': 'my', // Malaysia
  'IDN': 'id', // Indonesia
  'NZD': 'nz', // New Zealand alternative
};

export const getTeamFlagUrl = (tla: string): string => {
  const cleanTla = tla.trim().toUpperCase();
  const code = TLA_TO_COUNTRY_CODE[cleanTla];
  if (code) {
    return `https://flagcdn.com/w40/${code}.png`;
  }
  // Try using the first two characters of TLA in lowercase as a fallback country code
  return `https://flagcdn.com/w40/${cleanTla.slice(0, 2).toLowerCase()}.png`;
};

interface FlagImageProps {
  tla: string;
  name: string;
  className?: string;
}

const FlagImage: React.FC<FlagImageProps> = ({ tla, name, className = "w-6 h-6" }) => {
  const [error, setError] = useState(false);

  if (error || !tla) {
    return (
      <div 
        title={name}
        className={`${className} rounded-full bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30 flex items-center justify-center font-bold text-[8px] uppercase shadow-inner shrink-0`}
      >
        {tla ? tla.slice(0, 3).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      src={getTeamFlagUrl(tla)}
      alt={name}
      title={name}
      crossOrigin="anonymous"
      className={`${className} object-contain shrink-0 rounded-[2px]`}
      onError={() => setError(true)}
    />
  );
};

export default FlagImage;
