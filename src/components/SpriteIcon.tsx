

interface SpriteIconProps {
  imageSrc: string;
  totalIcons: number;
  index: number;
  size?: number;
  className?: string;
}

export default function SpriteIcon({ 
  imageSrc, 
  totalIcons, 
  index, 
  size = 64, 
  className = '' 
}: SpriteIconProps) {
  return (
    <div 
      className={`inline-block mix-blend-multiply ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${totalIcons * 100}% auto`,
        backgroundPosition: `${totalIcons > 1 ? (index / (totalIcons - 1)) * 100 : 0}% center`,
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
}
