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
    
    // Sample categories
    const categories = [
      { name: "Electric Motors", description: "High-quality electric motors for industrial use", image: "https://images.unsplash.com/photo-1612441804231-77a36b284856" },
      { name: "Power Tools", description: "Professional-grade power tools", image: "https://images.unsplash.com/photo-1586864387789-628af9feed72" },
      { name: "Industrial Equipment", description: "Industrial machinery and equipment", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407" },
      { name: "Spare Parts", description: "Replacement parts for industrial machinery", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c" }
    ];
    
    categories.forEach(category => {
      this.categories.set(this.categoryCurrentId, {
        id: this.categoryCurrentId,
        name: category.name,
        description: category.description,
        image: category.image,
        createdAt: new Date()
      });
      this.categoryCurrentId++;
    });
    
    // Sample products
    const products = [
      { name: "3HP Electric Motor", description: "High-efficiency three-phase electric motor for industrial applications.", categoryId: 1, specifications: "3HP, 380V, 50Hz", inStock: true, discount: 0 },
      { name: "Heavy Duty Drill Machine", description: "Professional-grade drill machine with variable speed control.", categoryId: 2, specifications: "1200W, 20V, Variable speed", inStock: true, discount: 0 },
      { name: "Arc Welding Machine", description: "Industrial arc welding machine with thermal protection system.", categoryId: 3, specifications: "200A, 230V, IGBT technology", inStock: true, discount: 0 },
      { name: "Portable Generator", description: "5kVA portable generator with low noise operation and fuel efficiency.", categoryId: 4, specifications: "5kVA, 220V, Petrol", inStock: false, discount: 0 }
    ];
    
    products.forEach(product => {
      this.products.set(this.productCurrentId, {
        id: this.productCurrentId,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        specifications: product.specifications,
        inStock: product.inStock,
        discount: product.discount,
        createdAt: new Date()
      });
      this.productCurrentId++;
    });
    
    // Sample product images
    const productImages = [
      { productId: 1, imageUrl: "https://images.unsplash.com/photo-1612441804231-77a36b284856", isMain: true, order: 0 },
      { productId: 2, imageUrl: "https://images.unsplash.com/photo-1586864387789-628af9feed72", isMain: true, order: 0 },
      { productId: 3, imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407", isMain: true, order: 0 },
      { productId: 4, imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c", isMain: true, order: 0 }
    ];
    
    productImages.forEach(image => {
      this.productImages.set(this.productImageCurrentId, {
        id: this.productImageCurrentId,
        productId: image.productId,
        imageUrl: image.imageUrl,
        isMain: image.isMain,
        order: image.order
      });
      this.productImageCurrentId++;
    });
    
    // Sample hero images
    const heroImages = [
      { 
        imageUrl: "https://images.unsplash.com/photo-1593762149251-d8332d69f6e4",
        title: "Quality Industrial Solutions",
        subtitle: "Your trusted partner for industrial equipment and power tools.",
        buttonText: "Explore Products",
        buttonLink: "/products",
        order: 0,
        isActive: true
      },
      { 
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
        title: "High-Performance Motors",
        subtitle: "Top-quality electric motors for all industrial applications.",
        buttonText: "View Motors",
        buttonLink: "/category/1",
        order: 1,
        isActive: true
      },
      { 
        imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
        title: "Professional Tools",
        subtitle: "Durable and efficient power tools for professionals.",
        buttonText: "Shop Tools",
        buttonLink: "/category/2",
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
      { key: "company_address", value: "123 Industrial Area, Sector 5, Noida, Uttar Pradesh, India" },
      { key: "company_phone", value: "+91 98765 43210" },
      { key: "company_email", value: "info@shivanshienterprises.com" },
      { key: "company_hours", value: "Monday - Saturday: 9:00 AM - 6:00 PM" },
      { key: "social_facebook", value: "https://facebook.com/shivanshienterprises" },
      { key: "social_instagram", value: "https://instagram.com/shivanshienterprises" },
      { key: "social_linkedin", value: "https://linkedin.com/company/shivanshienterprises" },
      { key: "social_whatsapp", value: "+919876543210" },
      { key: "google_maps_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5233457151397!2d77.31303731508094!3d28.609911782428377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce57ca5ff4435%3A0x6de631b7a5bfdacb!2sIndustrial%20Area%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1620638123456!5m2!1sen!2sin" }
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
