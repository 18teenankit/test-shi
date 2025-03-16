import { 
  users, categories, products, productImages, heroImages, contactRequests, settings,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type ProductImage, type InsertProductImage,
  type HeroImage, type InsertHeroImage, type ContactRequest, type InsertContactRequest,
  type Setting, type InsertSetting
} from "@shared/schema";
import bcrypt from "bcrypt";

// Interface for storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | null>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Product Image methods
  getProductImages(productId: number): Promise<ProductImage[]>;
  createProductImage(image: InsertProductImage): Promise<ProductImage>;
  updateProductImage(id: number, image: Partial<InsertProductImage>): Promise<ProductImage | undefined>;
  deleteProductImage(id: number): Promise<boolean>;
  
  // Hero Image methods
  getHeroImages(): Promise<HeroImage[]>;
  createHeroImage(image: InsertHeroImage): Promise<HeroImage>;
  updateHeroImage(id: number, image: Partial<InsertHeroImage>): Promise<HeroImage | undefined>;
  deleteHeroImage(id: number): Promise<boolean>;
  
  // Contact Request methods
  getContactRequests(): Promise<ContactRequest[]>;
  getContactRequest(id: number): Promise<ContactRequest | undefined>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  updateContactRequestStatus(id: number, status: string): Promise<ContactRequest | undefined>;
  deleteContactRequest(id: number): Promise<boolean>;
  
  // Settings methods
  getSetting(key: string): Promise<Setting | undefined>;
  getAllSettings(): Promise<Setting[]>;
  upsertSetting(setting: InsertSetting): Promise<Setting>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private heroImages: Map<number, HeroImage>;
  private contactRequests: Map<number, ContactRequest>;
  private settings: Map<string, Setting>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private productCurrentId: number;
  private productImageCurrentId: number;
  private heroImageCurrentId: number;
  private contactRequestCurrentId: number;
  private settingCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.heroImages = new Map();
    this.contactRequests = new Map();
    this.settings = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.productCurrentId = 1;
    this.productImageCurrentId = 1;
    this.heroImageCurrentId = 1;
    this.contactRequestCurrentId = 1;
    this.settingCurrentId = 1;
    
    // Initialize with default admin users
    this.initializeDefaultData();
  }
  
  private async initializeDefaultData() {
    // Create default admin users
    const hashedPassword1 = await bcrypt.hash("Girisunil@4444", 10);
    this.users.set(this.userCurrentId, {
      id: this.userCurrentId++,
      username: "Sunilgiri@admin",
      password: hashedPassword1,
      role: "super_admin",
      createdAt: new Date()
    });
    
    const hashedPassword2 = await bcrypt.hash("Ankit@968511", 10);
    this.users.set(this.userCurrentId, {
      id: this.userCurrentId++,
      username: "Ankit@admin",
      password: hashedPassword2,
      role: "manager",
      createdAt: new Date()
    });
    
    // Empty categories - to be added from admin panel
    const categories = [];
    
    // Empty products - to be added from admin panel
    const products = [];
    
    // Empty product images - to be added from admin panel
    const productImages = [];
    
    // Hero images for chemicals company
    const heroImages = [
      { 
        imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
        title: "Quality Chemicals & Compounds",
        subtitle: "Your trusted partner for industrial chemicals across PAN India.",
        buttonText: "Explore Products",
        buttonLink: "/products",
        order: 0,
        isActive: true
      },
      { 
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69",
        title: "Industrial Chemical Solutions",
        subtitle: "Premium quality chemicals for manufacturing and industrial applications.",
        buttonText: "View Products",
        buttonLink: "/products",
        order: 1,
        isActive: true
      },
      { 
        imageUrl: "https://images.unsplash.com/photo-1581093196277-9f608af9db55",
        title: "Nationwide Delivery",
        subtitle: "Fast and reliable shipping across all of India.",
        buttonText: "Contact Us",
        buttonLink: "/contact",
        order: 2,
        isActive: true
      }
    ];
    
    heroImages.forEach(image => {
      this.heroImages.set(this.heroImageCurrentId, {
        id: this.heroImageCurrentId,
        imageUrl: image.imageUrl,
        title: image.title,
        subtitle: image.subtitle,
        buttonText: image.buttonText,
        buttonLink: image.buttonLink,
        order: image.order,
        isActive: image.isActive
      });
      this.heroImageCurrentId++;
    });
    
    // Default settings
    const defaultSettings = [
      { key: "company_name", value: "Shivanshi Enterprises" },
      { key: "company_tagline", value: "Chemicals & Compound Dealers" },
      { key: "company_address", value: "55 2B 9 SANGAM ROAD NAINI INDUSTRIAL AREA PRAYAGRAJ UTTAR PRADESH INDIA- 211008" },
      { key: "company_phone", value: "+91 9418974444" },
      { key: "company_email", value: "shivanshienterprises44@gmail.com" },
      { key: "company_hours", value: "Monday - Saturday: 9:00 AM - 6:00 PM" },
      { key: "company_delivery", value: "Pan India Delivery Available" },
      { key: "social_whatsapp", value: "+919418974444" },
      { key: "social_whatsapp_link", value: "https://wa.me/919418974444" },
      { key: "google_maps_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.9321413865613!2d81.7956!3d25.3503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDIxJzAxLjAiTiA4McKwNDcnNDQuMiJF!5e0!3m2!1sen!2sin!4v1615473046844!5m2!1sen!2sin" }
    ];
    
    defaultSettings.forEach(setting => {
      this.settings.set(setting.key, {
        id: this.settingCurrentId++,
        key: setting.key,
        value: setting.value
      });
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: this.userCurrentId++,
      ...insertUser,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: this.categoryCurrentId++,
      ...category,
      createdAt: new Date()
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId,
    );
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.productCurrentId++,
      ...product,
      createdAt: new Date()
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Product Image methods
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(
      (image) => image.productId === productId,
    );
  }
  
  async createProductImage(image: InsertProductImage): Promise<ProductImage> {
    const newImage: ProductImage = {
      id: this.productImageCurrentId++,
      ...image
    };
    this.productImages.set(newImage.id, newImage);
    return newImage;
  }
  
  async updateProductImage(id: number, imageUpdate: Partial<InsertProductImage>): Promise<ProductImage | undefined> {
    const image = this.productImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...imageUpdate };
    this.productImages.set(id, updatedImage);
    return updatedImage;
  }
  
  async deleteProductImage(id: number): Promise<boolean> {
    return this.productImages.delete(id);
  }
  
  // Hero Image methods
  async getHeroImages(): Promise<HeroImage[]> {
    return Array.from(this.heroImages.values())
      .filter(image => image.isActive)
      .sort((a, b) => a.order - b.order);
  }
  
  async createHeroImage(image: InsertHeroImage): Promise<HeroImage> {
    const newImage: HeroImage = {
      id: this.heroImageCurrentId++,
      ...image
    };
    this.heroImages.set(newImage.id, newImage);
    return newImage;
  }
  
  async updateHeroImage(id: number, imageUpdate: Partial<InsertHeroImage>): Promise<HeroImage | undefined> {
    const image = this.heroImages.get(id);
    if (!image) return undefined;
    
    const updatedImage = { ...image, ...imageUpdate };
    this.heroImages.set(id, updatedImage);
    return updatedImage;
  }
  
  async deleteHeroImage(id: number): Promise<boolean> {
    return this.heroImages.delete(id);
  }
  
  // Contact Request methods
  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }
  
  async getContactRequest(id: number): Promise<ContactRequest | undefined> {
    return this.contactRequests.get(id);
  }
  
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const newRequest: ContactRequest = {
      id: this.contactRequestCurrentId++,
      ...request,
      status: "new",
      createdAt: new Date()
    };
    this.contactRequests.set(newRequest.id, newRequest);
    return newRequest;
  }
  
  async updateContactRequestStatus(id: number, status: string): Promise<ContactRequest | undefined> {
    const request = this.contactRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, status };
    this.contactRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  
  async deleteContactRequest(id: number): Promise<boolean> {
    return this.contactRequests.delete(id);
  }
  
  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }
  
  async getAllSettings(): Promise<Setting[]> {
    return Array.from(this.settings.values());
  }
  
  async upsertSetting(setting: InsertSetting): Promise<Setting> {
    const existingSetting = this.settings.get(setting.key);
    
    if (existingSetting) {
      const updatedSetting = { ...existingSetting, value: setting.value };
      this.settings.set(setting.key, updatedSetting);
      return updatedSetting;
    } else {
      const newSetting: Setting = {
        id: this.settingCurrentId++,
        ...setting
      };
      this.settings.set(setting.key, newSetting);
      return newSetting;
    }
  }
}

export const storage = new MemStorage();
