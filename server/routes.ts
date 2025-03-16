import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertContactRequestSchema, insertCategorySchema, insertProductSchema, insertProductImageSchema, insertHeroImageSchema, insertSettingSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import multer from "multer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Session store
const MemoryStoreSession = MemoryStore(session);
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

// Login attempts tracking
const loginAttempts = new Map<string, { count: number, lockUntil?: number }>();

// Configure multer for file uploads
const storage_config = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage_config });

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "shivanshi-enterprises-secret",
      resave: true,
      saveUninitialized: true,
      cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: false 
      },
      store: new MemoryStoreSession({
        checkPeriod: 86400000,
      }),
    })
  );

  // Configure Passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if user is locked out
        const attempts = loginAttempts.get(username) || { count: 0 };
        if (attempts.lockUntil && attempts.lockUntil > Date.now()) {
          return done(null, false, { message: "Account is locked. Try again later." });
        }

        const user = await storage.validateUser(username, password);

        if (!user) {
          // Increment failed login attempts
          loginAttempts.set(username, {
            count: attempts.count + 1,
            lockUntil: attempts.count + 1 >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCK_TIME : undefined
          });

          return done(null, false, { message: "Invalid username or password" });
        }

        // Reset login attempts on successful login
        loginAttempts.delete(username);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware to ensure a user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Middleware to ensure a user has super_admin role
  const isSuperAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any).role === 'super_admin') {
      // Protect Ankit's account
      if ((req.params.id === '2' || req.body.username === 'ankit') && (req.user as any).username !== 'ankit') {
        return res.status(403).json({ message: "Cannot modify super admin account" });
      }
      return next();
    }
    res.status(403).json({ message: "Forbidden - requires super admin privileges" });
  };

  // Error handler for Zod validation errors
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    return res.status(500).json({ message: "Server error" });
  };

  // Public API endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(Number(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;

      let products;
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId);
      } else {
        products = await storage.getProducts();
      }

      // Enhance products with category info and main image
      const enhancedProducts = await Promise.all(
        products.map(async (product) => {
          const category = product.categoryId 
            ? await storage.getCategory(product.categoryId) 
            : undefined;

          const images = await storage.getProductImages(product.id);
          const mainImage = images.find(img => img.isMain) || images[0];

          return {
            ...product,
            category: category ? { id: category.id, name: category.name } : null,
            mainImage: mainImage ? mainImage.imageUrl : null
          };
        })
      );

      res.json(enhancedProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const category = product.categoryId 
        ? await storage.getCategory(product.categoryId) 
        : undefined;

      const images = await storage.getProductImages(product.id);

      res.json({
        ...product,
        category: category ? { id: category.id, name: category.name } : null,
        images: images
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/hero-images", async (req, res) => {
    try {
      const heroImages = await storage.getHeroImages();
      res.json(heroImages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero images" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactRequestSchema.parse(req.body);
      const result = await storage.createContactRequest(contactData);

      // Here you would typically add code to send email notification
      // But we'll skip that for now since we don't have access to an email service

      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      // Convert array to key-value object
      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string | undefined>);

      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Auth endpoints
  app.post("/api/login", (req, res, next) => {
    try {
      const loginData = loginSchema.parse(req.body);

      // Check if user is locked out
      const attempts = loginAttempts.get(loginData.username) || { count: 0 };
      if (attempts.lockUntil && attempts.lockUntil > Date.now()) {
        const remainingTime = Math.ceil((attempts.lockUntil - Date.now()) / 60000);
        return res.status(429).json({ 
          message: `Account is locked. Try again in ${remainingTime} minutes.` 
        });
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.status(401).json({ message: info.message });
        }

        req.logIn(user, (err) => {
          if (err) return next(err);

          // Set session cookie to expire in 30 days
          if (req.session) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
          }

          // Reset login attempts
          if (loginAttempts.has(loginData.username)) {
            loginAttempts.delete(loginData.username);
          }

          // Remove sensitive info
          const safeUser = {
            id: user.id,
            username: user.username,
            role: user.role
          };

          return res.json({ user: safeUser });
        });
      })(req, res, next);
    } catch (error) {
      handleZodError(error, res);
    }
  });
  
  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ message: "Failed to destroy session" });
          }
          res.clearCookie("connect.sid");
          return res.json({ message: "Logged out successfully" });
        });
      } else {
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      }
    });
  });

  app.get("/api/current-user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Remove sensitive info
    const user = req.user as any;
    const safeUser = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    res.json({ user: safeUser });
  });

  // Admin API endpoints (protected)
  // Categories management
  app.post("/api/admin/categories", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const categoryData = insertCategorySchema.parse({
        ...req.body,
        image: imageUrl || req.body.image
      });

      const result = await storage.createCategory(categoryData);
      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/admin/categories/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Only include the image in the update if a new one was uploaded
      const updateData = { ...req.body };
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const result = await storage.updateCategory(id, updateData);
      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.delete("/api/admin/categories/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteCategory(id);

      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Products management
  app.post("/api/admin/products", isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const result = await storage.createProduct(productData);
      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const result = await storage.updateProduct(id, req.body);

      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.delete("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteProduct(id);

      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Images
  app.post("/api/admin/product-images", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const imageData = insertProductImageSchema.parse({
        ...req.body,
        productId: Number(req.body.productId),
        imageUrl: imageUrl,
        isMain: req.body.isMain === "true",
        order: Number(req.body.order || 0)
      });

      // If this is the main image, update other images for this product
      if (imageData.isMain) {
        const existingImages = await storage.getProductImages(imageData.productId);
        for (const image of existingImages) {
          if (image.isMain) {
            await storage.updateProductImage(image.id, { isMain: false });
          }
        }
      }

      const result = await storage.createProductImage(imageData);
      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.delete("/api/admin/product-images/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteProductImage(id);

      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }

      res.json({ message: "Product image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product image" });
    }
  });

  // Hero Images
  app.get("/api/admin/hero-images", isAuthenticated, async (req, res) => {
    try {
      // For admin, get all hero images including inactive ones
      const heroImages = Array.from((await storage as any).heroImages.values())
        .sort((a: any, b: any) => a.order - b.order);

      res.json(heroImages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hero images" });
    }
  });

  app.post("/api/admin/hero-images", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const imageData = insertHeroImageSchema.parse({
        ...req.body,
        imageUrl: imageUrl,
        order: Number(req.body.order || 0),
        isActive: req.body.isActive === "true"
      });

      const result = await storage.createHeroImage(imageData);
      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.put("/api/admin/hero-images/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Only include the imageUrl in the update if a new one was uploaded
      const updateData = { ...req.body };
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      // Parse boolean and number fields
      if (updateData.order !== undefined) {
        updateData.order = Number(updateData.order);
      }
      if (updateData.isActive !== undefined) {
        updateData.isActive = updateData.isActive === "true";
      }

      const result = await storage.updateHeroImage(id, updateData);

      if (!result) {
        return res.status(404).json({ message: "Hero image not found" });
      }

      res.json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  app.delete("/api/admin/hero-images/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteHeroImage(id);

      if (!success) {
        return res.status(404).json({ message: "Hero image not found" });
      }

      res.json({ message: "Hero image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete hero image" });
    }
  });

  // Contact Requests
  app.get("/api/admin/contact-requests", isAuthenticated, async (req, res) => {
    try {
      const contactRequests = await storage.getContactRequests();
      res.json(contactRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  app.put("/api/admin/contact-requests/:id/status", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!status || !["new", "processing", "completed", "archived"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const result = await storage.updateContactRequestStatus(id, status);

      if (!result) {
        return res.status(404).json({ message: "Contact request not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact request status" });
    }
  });

  app.delete("/api/admin/contact-requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteContactRequest(id);

      if (!success) {
        return res.status(404).json({ message: "Contact request not found" });
      }

      res.json({ message: "Contact request deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact request" });
    }
  });

  // Settings
  app.get("/api/admin/settings", isAuthenticated, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", isAuthenticated, async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const result = await storage.upsertSetting(settingData);
      res.status(201).json(result);
    } catch (error) {
      handleZodError(error, res);
    }
  });

  // User management (super_admin only)
  app.get("/api/admin/users", isSuperAdmin, async (req, res) => {
    try {
      // Get all users (this is for super_admin only)
      const allUsers = Array.from((await storage as any).users.values()).map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt
      }));

      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}