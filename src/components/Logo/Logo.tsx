import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, width, height, style }) => {
  const LOGO_URL = "https://winiisvzhzgiufkujcsn.supabase.co/storage/v1/object/public/assets/Mukherjee%20Tea%20logo%20Final.png";

  return (
    <Image 
      src={LOGO_URL}
      alt="Mukherjee Tea Company Logo"
      width={335}
      height={214}
      className={className}
      style={{ 
        width: width || (height ? 'auto' : '100%'), 
        height: height || 'auto', 
        objectFit: 'contain',
        ...style 
      }}
      priority
    />
  );
};

export default Logo;
