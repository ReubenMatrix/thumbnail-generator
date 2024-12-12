import Image from 'next/image';
import { StaticImageData } from 'next/image';

interface StyleProps {
  image: string | StaticImageData; 
  selectedStyle: () => void;
  isSelected: boolean;
}

const Style: React.FC<StyleProps> = ({ image, selectedStyle, isSelected }) => {
  return (
    <div
      className={`min-w-32 p-1 rounded-lg cursor-pointer border-2 transition-colors ${
        isSelected ? 'border-black' : 'border-white'
      }`}
      onClick={selectedStyle}
    >
      <Image
        alt="style"
        className="rounded-lg"
        src={image} 
        width={350} 
        height={300} 
      />
    </div>
  );
};

export default Style;
