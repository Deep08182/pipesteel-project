import {
  UserProfile,
  RFQ,
  RFQUpdate,
  RFQStatus,
  RFQPriority,
  Quotation,
  QuotationStatus,
  Product,
  Project,
  Capability,
  Industry,
  Notification,
} from "@/types";
import {
  SEED_PROFILES,
  SEED_PRODUCTS,
  SEED_RFQS,
  SEED_RFQ_UPDATES,
  SEED_QUOTATIONS,
  SEED_PROJECTS,
  SEED_CAPABILITIES,
  SEED_INDUSTRIES,
  SEED_NOTIFICATIONS,
} from "./seed-data";

const STORAGE_KEY_PREFIX = "steelcore_db_";

class DatabaseStore {
  private profiles: UserProfile[] = [];
  private products: Product[] = [];
  private rfqs: RFQ[] = [];
  private rfqUpdates: Record<string, RFQUpdate[]> = {};
  private quotations: Quotation[] = [];
  private projects: Project[] = [];
  private capabilities: Capability[] = [];
  private industries: Industry[] = [];
  private notifications: Notification[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    if (!this.isBrowser()) return fallback;
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Failed to read ${key} from storage:`, e);
      return fallback;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to save ${key} to storage:`, e);
    }
  }

  public initialize(): void {
    if (this.isInitialized && !this.isBrowser()) return;

    this.profiles = this.loadFromStorage("profiles", [...SEED_PROFILES]);
    this.products = this.loadFromStorage("products", [...SEED_PRODUCTS]);
    this.rfqs = this.loadFromStorage("rfqs", [...SEED_RFQS]);
    this.rfqUpdates = this.loadFromStorage("rfq_updates", { ...SEED_RFQ_UPDATES });
    this.quotations = this.loadFromStorage("quotations", [...SEED_QUOTATIONS]);
    this.projects = this.loadFromStorage("projects", [...SEED_PROJECTS]);
    this.capabilities = this.loadFromStorage("capabilities", [...SEED_CAPABILITIES]);
    this.industries = this.loadFromStorage("industries", [...SEED_INDUSTRIES]);
    this.notifications = this.loadFromStorage("notifications", [...SEED_NOTIFICATIONS]);

    this.isInitialized = true;
  }

  public resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_PREFIX + "profiles");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "products");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "rfqs");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "rfq_updates");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "quotations");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "projects");
      localStorage.removeItem(STORAGE_KEY_PREFIX + "notifications");
    }
    this.profiles = [...SEED_PROFILES];
    this.products = [...SEED_PRODUCTS];
    this.rfqs = [...SEED_RFQS];
    this.rfqUpdates = { ...SEED_RFQ_UPDATES };
    this.quotations = [...SEED_QUOTATIONS];
    this.projects = [...SEED_PROJECTS];
    this.capabilities = [...SEED_CAPABILITIES];
    this.industries = [...SEED_INDUSTRIES];
    this.notifications = [...SEED_NOTIFICATIONS];
  }

  // Profiles
  public getProfiles(): UserProfile[] {
    return this.profiles;
  }

  public getProfile(idOrEmail: string): UserProfile | undefined {
    return this.profiles.find((p) => p.id === idOrEmail || p.email.toLowerCase() === idOrEmail.toLowerCase());
  }

  public getCustomerProfiles(): UserProfile[] {
    return this.profiles.filter((p) => p.role === "CUSTOMER");
  }

  public createProfile(data: Omit<UserProfile, "id" | "created_at" | "updated_at">): UserProfile {
    const newProfile: UserProfile = {
      ...data,
      id: `usr-cust-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.profiles.push(newProfile);
    this.saveToStorage("profiles", this.profiles);
    return newProfile;
  }

  // Products
  public getProducts(): Product[] {
    return this.products;
  }

  public getProduct(slugOrId: string): Product | undefined {
    return this.products.find((p) => p.slug === slugOrId || p.id === slugOrId);
  }

  // RFQs
  public getRFQs(customerId?: string): RFQ[] {
    const list = customerId ? this.rfqs.filter((r) => r.customer_id === customerId) : this.rfqs;
    return list.map((rfq) => ({
      ...rfq,
      customer: this.getProfile(rfq.customer_id),
    }));
  }

  public getRFQ(idOrNumber: string): RFQ | undefined {
    const rfq = this.rfqs.find((r) => r.id === idOrNumber || r.rfq_number === idOrNumber);
    if (!rfq) return undefined;
    return {
      ...rfq,
      customer: this.getProfile(rfq.customer_id),
      attachments: rfq.attachments || [],
    };
  }

  public generateRFQNumber(): string {
    const year = new Date().getFullYear();
    const count = this.rfqs.length + 1;
    const padded = String(count + 124).padStart(5, "0");
    return `RFQ-${year}-${padded}`;
  }

  public createRFQ(data: {
    customer_id: string;
    product_id?: string;
    product_name?: string;
    title: string;
    description: string;
    quantity: number;
    unit?: RFQ["unit"];
    material: RFQ["material"];
    specifications?: Record<string, string | undefined>;
    delivery_date: string;
    priority?: RFQPriority;
    attachments?: RFQ["attachments"];
  }): RFQ {
    const rfqNumber = this.generateRFQNumber();
    const now = new Date().toISOString();
    const id = `rfq-${Date.now().toString().slice(-6)}`;

    const newRFQ: RFQ = {
      id,
      rfq_number: rfqNumber,
      customer_id: data.customer_id,
      product_id: data.product_id,
      product_name: data.product_name,
      title: data.title,
      description: data.description,
      quantity: Number(data.quantity) || 1,
      unit: data.unit || "Tons",
      material: data.material,
      specifications: data.specifications || {},
      priority: data.priority || "NORMAL",
      status: "SUBMITTED",
      delivery_date: data.delivery_date,
      attachments: data.attachments || [],
      created_at: now,
      updated_at: now,
    };

    this.rfqs.unshift(newRFQ);
    this.saveToStorage("rfqs", this.rfqs);

    // Add initial status update
    this.addRFQUpdate({
      rfq_id: id,
      new_status: "SUBMITTED",
      admin_name: "System",
      comment: `RFQ generated successfully. Reference: ${rfqNumber}. Queued for initial engineering review.`,
    });

    // Notify Admins
    this.addNotification({
      user_id: "usr-admin-01",
      rfq_id: id,
      title: `New RFQ: ${rfqNumber}`,
      message: `${newRFQ.title} (${newRFQ.quantity} ${newRFQ.unit}) received. Review required.`,
      link: `/admin/requests/${id}`,
    });

    // Notify Customer
    this.addNotification({
      user_id: data.customer_id,
      rfq_id: id,
      title: `Quotation Request Logged: ${rfqNumber}`,
      message: `Your request has been registered under ${rfqNumber}. Our engineering desk will review technical details within 24 hours.`,
      link: `/customer/requests/${id}`,
    });

    return newRFQ;
  }

  public updateRFQStatus(
    rfqId: string,
    newStatus: RFQStatus,
    adminId?: string,
    comment?: string,
    additionalUpdates?: Partial<RFQ>
  ): RFQ | undefined {
    const index = this.rfqs.findIndex((r) => r.id === rfqId || r.rfq_number === rfqId);
    if (index === -1) return undefined;

    const oldRFQ = this.rfqs[index];
    const oldStatus = oldRFQ.status;
    const admin = adminId ? this.getProfile(adminId) : undefined;
    const adminName = admin ? admin.full_name : "Engineering Desk";

    const updatedRFQ: RFQ = {
      ...oldRFQ,
      ...additionalUpdates,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    this.rfqs[index] = updatedRFQ;
    this.saveToStorage("rfqs", this.rfqs);

    // Record history update
    this.addRFQUpdate({
      rfq_id: updatedRFQ.id,
      admin_id: adminId,
      admin_name: adminName,
      old_status: oldStatus,
      new_status: newStatus,
      comment: comment || `Status updated to ${newStatus.replace("_", " ")} by ${adminName}.`,
    });

    // Notify customer
    this.addNotification({
      user_id: updatedRFQ.customer_id,
      rfq_id: updatedRFQ.id,
      title: `RFQ ${updatedRFQ.rfq_number} Updated`,
      message: `Status changed to ${newStatus.replace("_", " ")}: ${comment || "Engineering review progress updated."}`,
      link: `/customer/requests/${updatedRFQ.id}`,
    });

    return updatedRFQ;
  }

  // RFQ Updates / Timeline
  public getRFQUpdates(rfqId: string): RFQUpdate[] {
    const list = this.rfqUpdates[rfqId] || [];
    return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public addRFQUpdate(data: Omit<RFQUpdate, "id" | "created_at">): RFQUpdate {
    const update: RFQUpdate = {
      ...data,
      id: `upd-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };

    if (!this.rfqUpdates[data.rfq_id]) {
      this.rfqUpdates[data.rfq_id] = [];
    }

    this.rfqUpdates[data.rfq_id].push(update);
    this.saveToStorage("rfq_updates", this.rfqUpdates);
    return update;
  }

  // Quotations
  public getQuotations(customerId?: string): Quotation[] {
    return customerId
      ? this.quotations.filter((q) => q.customer_id === customerId)
      : this.quotations;
  }

  public getQuotation(idOrNumber: string): Quotation | undefined {
    return this.quotations.find(
      (q) => q.id === idOrNumber || q.quotation_number === idOrNumber || q.rfq_id === idOrNumber
    );
  }

  public generateQuotationNumber(): string {
    const year = new Date().getFullYear();
    const count = this.quotations.length + 1;
    const padded = String(count + 52).padStart(4, "0");
    return `QT-${year}-${padded}`;
  }

  public createQuotation(data: Omit<Quotation, "id" | "quotation_number" | "created_at" | "updated_at">): Quotation {
    const quoteNumber = this.generateQuotationNumber();
    const now = new Date().toISOString();
    const id = `quote-${Date.now().toString().slice(-6)}`;

    const newQuotation: Quotation = {
      ...data,
      id,
      quotation_number: quoteNumber,
      status: "SENT",
      created_at: now,
      updated_at: now,
    };

    this.quotations.unshift(newQuotation);
    this.saveToStorage("quotations", this.quotations);

    // Link quotation to RFQ and update RFQ status to QUOTATION_SENT
    this.updateRFQStatus(
      data.rfq_id,
      "QUOTATION_SENT",
      undefined,
      `Quotation ${quoteNumber} issued and dispatched to customer portal. Total Value: ₹${newQuotation.total.toLocaleString("en-IN")}.`,
      { quotation_id: id, estimated_value: newQuotation.total }
    );

    // Notify Customer
    this.addNotification({
      user_id: data.customer_id,
      rfq_id: data.rfq_id,
      quotation_id: id,
      title: `Official Quotation Received: ${quoteNumber}`,
      message: `STEELCORE has generated formal commercial quotation ${quoteNumber} for your review. Total amount: ₹${newQuotation.total.toLocaleString("en-IN")}.`,
      link: `/customer/quotations/${id}`,
    });

    return newQuotation;
  }

  public updateQuotationStatus(
    quotationId: string,
    status: QuotationStatus,
    comment?: string
  ): Quotation | undefined {
    const index = this.quotations.findIndex((q) => q.id === quotationId || q.quotation_number === quotationId);
    if (index === -1) return undefined;

    const quote = this.quotations[index];
    quote.status = status;
    quote.updated_at = new Date().toISOString();
    this.saveToStorage("quotations", this.quotations);

    // If customer accepted, upgrade RFQ status to APPROVED
    if (status === "ACCEPTED") {
      this.updateRFQStatus(
        quote.rfq_id,
        "APPROVED",
        undefined,
        comment || `Customer ${quote.customer_name} accepted quotation ${quote.quotation_number}. Work order confirmed and transitioning to production scheduling.`
      );

      // Notify Admins
      this.addNotification({
        user_id: "usr-admin-01",
        rfq_id: quote.rfq_id,
        quotation_id: quote.id,
        title: `Quotation Accepted! (${quote.quotation_number})`,
        message: `${quote.customer_company} has accepted quotation ${quote.quotation_number} (₹${quote.total.toLocaleString("en-IN")}). Order is now APPROVED.`,
        link: `/admin/requests/${quote.rfq_id}`,
      });
    } else if (status === "REJECTED") {
      this.updateRFQStatus(
        quote.rfq_id,
        "NEED_INFORMATION",
        undefined,
        comment || `Quotation ${quote.quotation_number} rejected or revisions requested by customer: ${comment || "Commercial terms revision requested."}`
      );
    }

    return quote;
  }

  // Notifications
  public getNotifications(userId?: string): Notification[] {
    if (!userId) return this.notifications;
    return this.notifications
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public addNotification(data: Omit<Notification, "id" | "created_at" | "is_read">): Notification {
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage("notifications", this.notifications);
    return newNotif;
  }

  public markNotificationAsRead(id: string): void {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.is_read = true;
      this.saveToStorage("notifications", this.notifications);
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.saveToStorage("notifications", this.notifications);
  }

  // Projects, Capabilities, Industries
  public getProjects(): Project[] {
    return this.projects;
  }

  public getProject(slugOrId: string): Project | undefined {
    return this.projects.find((p) => p.slug === slugOrId || p.id === slugOrId);
  }

  public getCapabilities(): Capability[] {
    return this.capabilities;
  }

  public getIndustries(): Industry[] {
    return this.industries;
  }

  // Dashboard Aggregates
  public getAdminStats() {
    const total = this.rfqs.length;
    const pending = this.rfqs.filter((r) => r.status === "SUBMITTED").length;
    const underReview = this.rfqs.filter((r) => r.status === "UNDER_REVIEW" || r.status === "NEED_INFORMATION").length;
    const quotations = this.rfqs.filter((r) => r.status === "QUOTATION_PREPARED" || r.status === "QUOTATION_SENT").length;
    const activeOrders = this.rfqs.filter((r) => r.status === "APPROVED" || r.status === "IN_PRODUCTION").length;
    const completed = this.rfqs.filter((r) => r.status === "COMPLETED").length;
    const totalPipelineValue = this.rfqs.reduce((acc, curr) => acc + (curr.estimated_value || 0), 0);

    return {
      total,
      pending,
      underReview,
      quotations,
      activeOrders,
      completed,
      totalPipelineValue,
    };
  }

  public getCustomerStats(customerId: string) {
    const customerRfqs = this.rfqs.filter((r) => r.customer_id === customerId);
    const total = customerRfqs.length;
    const pending = customerRfqs.filter((r) => r.status === "SUBMITTED").length;
    const underReview = customerRfqs.filter((r) => r.status === "UNDER_REVIEW" || r.status === "NEED_INFORMATION").length;
    const quoted = customerRfqs.filter((r) => r.status === "QUOTATION_PREPARED" || r.status === "QUOTATION_SENT").length;
    const approved = customerRfqs.filter((r) => r.status === "APPROVED" || r.status === "IN_PRODUCTION").length;
    const completed = customerRfqs.filter((r) => r.status === "COMPLETED").length;

    return {
      total,
      pending,
      underReview,
      quoted,
      approved,
      completed,
    };
  }
}

// Singleton instance
export const db = new DatabaseStore();
