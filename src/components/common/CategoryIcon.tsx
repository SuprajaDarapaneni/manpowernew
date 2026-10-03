import React from 'react';
import {
  Package,
  Sparkles,
  Truck,
  Bike,
  HardHat,
  Users,
  Trees,
  Boxes,
  Wrench,
  Zap,
  Paintbrush,
  Shield,
  Layers,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconMap: Record<string, React.ElementType> = {
    Package,
    Sparkles,
    Truck,
    Bike,
    HardHat,
    Users,
    Trees,
    Boxes,
    Wrench,
    Zap,
    Paintbrush,
    Shield,
  };

  const IconComponent = iconMap[name] || Layers;
  return <IconComponent className={className} />;
};
