import { LucideIcon } from "lucide-react";
import {
  Home,
  User,
  Settings,
  Mail,
  Phone,
  Calendar,
  FileText,
  Folder,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Search,
  Bell,
  Heart,
  Star,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  Users,
  UserPlus,
  Globe,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Edit,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Shield,
  Zap,
  Target,
  Award,
  Gift,
  Briefcase,
  Building,
  Car,
  Plane,
  Ship,
  Truck,
  Coffee,
  Gamepad2,
  Headphones,
  Camera,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Wifi,
  Bluetooth,
  Battery,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Umbrella,
  Thermometer,
  Wind,
  Snowflake,
  Activity,
  MessageCircleQuestion,
} from "lucide-react";

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  user: User,
  settings: Settings,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  "file-text": FileText,
  folder: Folder,
  image: Image,
  video: Video,
  music: Music,
  download: Download,
  upload: Upload,
  search: Search,
  bell: Bell,
  heart: Heart,
  star: Star,
  "shopping-cart": ShoppingCart,
  "credit-card": CreditCard,
  "dollar-sign": DollarSign,
  "trending-up": TrendingUp,
  "bar-chart": BarChart,
  "pie-chart": PieChart,
  users: Users,
  "user-plus": UserPlus,
  globe: Globe,
  "map-pin": MapPin,
  clock: Clock,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "alert-circle": AlertCircle,
  info: Info,
  help: MessageCircleQuestion,
  edit: Edit,
  trash2: Trash2,
  plus: Plus,
  minus: Minus,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  menu: Menu,
  x: X,
  eye: Eye,
  "eye-off": EyeOff,
  lock: Lock,
  unlock: Unlock,
  key: Key,
  shield: Shield,
  zap: Zap,
  target: Target,
  award: Award,
  gift: Gift,
  briefcase: Briefcase,
  building: Building,
  car: Car,
  plane: Plane,
  ship: Ship,
  truck: Truck,
  coffee: Coffee,
  gamepad2: Gamepad2,
  headphones: Headphones,
  camera: Camera,
  smartphone: Smartphone,
  laptop: Laptop,
  monitor: Monitor,
  printer: Printer,
  wifi: Wifi,
  bluetooth: Bluetooth,
  battery: Battery,
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  "cloud-rain": CloudRain,
  umbrella: Umbrella,
  thermometer: Thermometer,
  wind: Wind,
  activity: Activity,
  snowflake: Snowflake,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
  fallback?: LucideIcon;
}

export default function DynamicIcon({ 
  name, 
  size = 24, 
  className = "", 
  color,
  fallback = MessageCircleQuestion
}: DynamicIconProps) {
  const IconComponent = iconMap[name.toLowerCase()] || fallback;
  
  return (
    <IconComponent 
      size={size} 
      className={className} 
      color={color}
    />
  );
}

// Función para obtener todos los iconos disponibles (útil para formularios)
export function getAvailableIcons() {
  return Object.keys(iconMap).map(key => ({
    value: key,
    label: key.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    icon: key
  }));
}

// Función para verificar si un icono existe
export function iconExists(name: string): boolean {
  return name.toLowerCase() in iconMap;
}