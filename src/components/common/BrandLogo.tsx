import React from 'react';
import {
  Users,
  ShieldCheck,
  HardHat,
  Briefcase,
  Zap,
  Flame,
  Sparkles,
  Building2,
  Hammer,
  Rocket,
  Wrench,
  Activity,
} from 'lucide-react';
import { LogoIconType, LogoShapeType, LogoGradientType } from '../../types';

interface BrandLogoProps {
  icon?: LogoIconType;
  imageUrl?: string;
  shape?: LogoShapeType;
  gradient?: LogoGradientType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  type?: 'icon' | 'image';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  icon = 'users',
  imageUrl,
  shape = 'squircle',
  gradient = 'red-yellow',
  size = 'md',
  className = '',
  type = 'icon',
}) => {
  // Render icon based on name
  const renderIcon = (iconSizeClass: string) => {
    switch (icon) {
      case 'shield':
        return <ShieldCheck className={iconSizeClass} />;
      case 'hardhat':
        return <HardHat className={iconSizeClass} />;
      case 'briefcase':
        return <Briefcase className={iconSizeClass} />;
      case 'zap':
        return <Zap className={iconSizeClass} />;
      case 'flame':
        return <Flame className={iconSizeClass} />;
      case 'sparkles':
        return <Sparkles className={iconSizeClass} />;
      case 'building':
        return <Building2 className={iconSizeClass} />;
      case 'hammer':
        return <Hammer className={iconSizeClass} />;
      case 'rocket':
        return <Rocket className={iconSizeClass} />;
      case 'wrench':
        return <Wrench className={iconSizeClass} />;
      case 'activity':
        return <Activity className={iconSizeClass} />;
      case 'users':
      default:
        return <Users className={iconSizeClass} />;
    }
  };

  // Dimensions & padding
  const sizeClasses = {
    xs: { box: 'w-6 h-6', icon: 'w-3.5 h-3.5', text: 'text-[9px]' },
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-sm' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-base' },
    xl: { box: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-xl' },
  }[size];

  // Shape classes
  const shapeClasses = {
    squircle: 'rounded-2xl',
    rounded: 'rounded-xl',
    circle: 'rounded-full',
    square: 'rounded-lg',
  }[shape];

  // Gradient classes
  const gradientClasses = {
    'red-yellow': 'bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 text-white shadow-md shadow-red-500/20',
    'ruby-gold': 'bg-gradient-to-br from-rose-700 via-red-600 to-amber-400 text-white shadow-md shadow-rose-600/30',
    'amber-fire': 'bg-gradient-to-br from-amber-600 via-red-600 to-yellow-400 text-white shadow-md shadow-amber-600/30',
    'crimson-black': 'bg-gradient-to-br from-slate-900 via-red-950 to-red-600 text-yellow-300 shadow-md shadow-slate-900/40',
    'gold-dark': 'bg-gradient-to-br from-amber-500 via-yellow-400 to-stone-900 text-slate-950 shadow-md shadow-amber-500/30',
    'sunset-gradient': 'bg-gradient-to-tr from-red-600 via-orange-500 to-yellow-400 text-white shadow-md shadow-orange-500/30',
  }[gradient];

  if (type === 'image' && imageUrl && imageUrl.trim()) {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center bg-white border border-slate-200 shadow-xs ${sizeClasses.box} ${shapeClasses} ${className}`}
      >
        <img
          src={imageUrl}
          alt="Brand Logo"
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            // fallback if image link breaks
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center font-bold select-none ${sizeClasses.box} ${shapeClasses} ${gradientClasses} ${className}`}
    >
      {renderIcon(sizeClasses.icon)}
    </div>
  );
};
