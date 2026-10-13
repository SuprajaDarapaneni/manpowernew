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
  Hammer,
  Scissors,
  Car,
  Droplets,
  Utensils,
  Coffee,
  Heart,
  Star,
  ShoppingBag,
  Briefcase,
  Camera,
  Clock,
  Home,
  Building,
  Building2,
  Factory,
  Flame,
  FileText,
  Key,
  Lock,
  Navigation,
  Phone,
  Sun,
  Umbrella,
  Award,
  Lightbulb,
  Activity,
  Cpu,
  MapPin,
  Tag,
} from 'lucide-react';

export interface CategoryIconProps {
  name?: string;
  iconName?: string;
  className?: string;
}

// Check if string contains an emoji or custom symbol
const isEmojiOrSymbol = (str: string) => {
  if (!str) return false;
  // Regex detecting common emojis and unicode symbols
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
  return emojiRegex.test(str) || (str.length <= 2 && !/^[a-zA-Z0-9]+$/.test(str));
};

const ICON_MAP: Record<string, React.ElementType> = {
  package: Package,
  packages: Package,
  box: Boxes,
  boxes: Boxes,
  sparkles: Sparkles,
  cleaning: Sparkles,
  truck: Truck,
  transport: Truck,
  moving: Truck,
  bike: Bike,
  delivery: Bike,
  courier: Bike,
  hardhat: HardHat,
  construction: HardHat,
  users: Users,
  event: Users,
  hospitality: Users,
  trees: Trees,
  garden: Trees,
  gardening: Trees,
  lawn: Trees,
  wrench: Wrench,
  mechanic: Wrench,
  plumbing: Wrench,
  zap: Zap,
  electric: Zap,
  electrical: Zap,
  electrician: Zap,
  paintbrush: Paintbrush,
  paint: Paintbrush,
  painter: Paintbrush,
  shield: Shield,
  security: Shield,
  layers: Layers,
  hammer: Hammer,
  carpentry: Hammer,
  carpenter: Hammer,
  scissors: Scissors,
  tailor: Scissors,
  car: Car,
  driver: Car,
  driving: Car,
  droplets: Droplets,
  water: Droplets,
  utensils: Utensils,
  cooking: Utensils,
  catering: Utensils,
  food: Utensils,
  coffee: Coffee,
  cafe: Coffee,
  heart: Heart,
  star: Star,
  shoppingbag: ShoppingBag,
  shop: ShoppingBag,
  retail: ShoppingBag,
  briefcase: Briefcase,
  office: Briefcase,
  camera: Camera,
  photography: Camera,
  clock: Clock,
  home: Home,
  house: Home,
  building: Building,
  building2: Building2,
  factory: Factory,
  warehouse: Factory,
  flame: Flame,
  welding: Flame,
  filetext: FileText,
  key: Key,
  lock: Lock,
  navigation: Navigation,
  phone: Phone,
  sun: Sun,
  umbrella: Umbrella,
  award: Award,
  lightbulb: Lightbulb,
  activity: Activity,
  cpu: Cpu,
  tech: Cpu,
  mappin: MapPin,
  tag: Tag,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, iconName, className = 'w-5 h-5' }) => {
  const effectiveName = name || iconName;
  if (!effectiveName) {
    return <Layers className={className} />;
  }

  const cleanName = effectiveName.trim();

  // If client entered an emoji or unicode symbol directly (e.g. ⚡, 🔨, 🧹, 🚚, 📦, etc.)
  if (isEmojiOrSymbol(cleanName)) {
    return (
      <span className={`inline-flex items-center justify-center leading-none text-base select-none ${className}`}>
        {cleanName}
      </span>
    );
  }

  // Lookup in Lucide dictionary (case-insensitive and whitespace normalized)
  const normalizedKey = cleanName.toLowerCase().replace(/[\s\-_]/g, '');
  const IconComponent = ICON_MAP[normalizedKey];

  if (IconComponent) {
    return <IconComponent className={className} />;
  }

  // If 1-3 character abbreviation or custom text code
  if (cleanName.length <= 3) {
    return (
      <span className={`inline-flex items-center justify-center font-bold text-xs uppercase leading-none ${className}`}>
        {cleanName}
      </span>
    );
  }

  return <Layers className={className} />;
};
