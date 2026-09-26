export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface UserProfile {
  id: string;
  user_id?: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation?: string;
  city?: string;
  state?: string;
  gstin?: string;
  created_at: string;
  updated_at: string;
}

export type RFQStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEED_INFORMATION"
  | "QUOTATION_PREPARED"
  | "QUOTATION_SENT"
  | "APPROVED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type RFQPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface RFQSpecification {
  grade?: string;
  dimensions?: string;
  surfaceFinish?: string;
  tolerance?: string;
  standards?: string; // e.g. IS 2062, ASTM A36, 6063-T6
  packaging?: string;
  [key: string]: string | undefined;
}

export interface RFQ {
  id: string;
  rfq_number: string;
  customer_id: string;
  customer?: UserProfile;
  product_id?: string;
  product_name?: string;
  title: string;
  description: string;
  quantity: number;
  unit: "MT" | "Tons" | "KG" | "Meters" | "Pieces" | "Assemblies";
  material: "Steel" | "Aluminium" | "Custom Alloy" | "Stainless Steel";
  specifications: RFQSpecification;
  priority: RFQPriority;
  status: RFQStatus;
  delivery_date: string;
  assigned_to?: string; // Engineer Name
  assigned_engineer_email?: string;
  attachments?: Attachment[];
  estimated_value?: number;
  quotation_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RFQUpdate {
  id: string;
  rfq_id: string;
  admin_id?: string;
  admin_name?: string;
  old_status?: RFQStatus;
  new_status: RFQStatus;
  comment: string;
  is_internal?: boolean;
  created_at: string;
}

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface QuotationItem {
  id: string;
  quotation_id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
  hsn_code?: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  rfq_id: string;
  rfq_number?: string;
  customer_id: string;
  customer_name?: string;
  customer_company?: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number; // 18% GST typical in India
  shipping: number; // Transport/Freight
  discount: number;
  total: number;
  valid_until: string;
  payment_terms: string;
  delivery_terms: string;
  notes?: string;
  status: QuotationStatus;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  rfq_id?: string;
  uploaded_by?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string; // recipient profile id
  rfq_id?: string;
  quotation_id?: string;
  title: string;
  message: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export type ProductCategory =
  | "Steel Products"
  | "Aluminium Products"
  | "Custom Products"
  | "Fabricated Structures";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  short_description: string;
  material: "Steel" | "Aluminium" | "Alloy";
  grades: string[];
  specifications: Record<string, string>;
  applications: string[];
  manufacturing_process: string[];
  technical_info: Record<string, string>;
  image_url: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  industry: string;
  location: string;
  description: string;
  materials: string;
  scope: string;
  year: number;
  client?: string;
  tonnage?: string;
  image_url: string;
  gallery?: string[];
  features?: string[];
  created_at: string;
}

export interface Capability {
  id: string;
  name: string;
  slug: string;
  machinery: string;
  capacity: string;
  materials: string[];
  tolerances: string;
  description: string;
  applications: string[];
  image_url: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  hero_image: string;
  applications: string[];
  key_products: string[];
  statistics: string;
}
