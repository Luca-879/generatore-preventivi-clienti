
export enum ProjectCategory {
  WORDPRESS_PAGE_BUILDER = "WordPress (Page Builder)",
  WORDPRESS_CUSTOM = "WordPress (Sviluppo Custom)",
  FRONTEND_DEV = "Sviluppo Frontend",
  BACKEND_DEV = "Sviluppo Backend",
  FULLSTACK_DEV = "Sviluppo Fullstack",
  ECOMMERCE = "E-commerce",
  MOBILE_APP = "App Mobile",
  CONSULTING = "Consulenza IT/Strategia",
  DESIGN_UI_UX = "Design UI/UX",
  SEO_MARKETING = "SEO & Marketing Digitale",
  OTHER = "Altro (Specificare)",
}

export interface QuoteItem {
  id: string;
  description: string;
  hours: number;
}

// Props for generic input components
export interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
}

export interface NumberInputFieldProps {
  label: string;
  id: string;
  value: number | string; // Allow string for empty input state
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: number;
  step?: number;
  required?: boolean;
  className?: string;
}

export interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}
