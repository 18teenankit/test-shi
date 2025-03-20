import { db } from '../server/db';
import { MemStorage } from '../server/storage';
import { users, categories, products, productImages, heroImages, contactRequests, settings } from '../shared/schema';
import bcrypt from 'bcrypt';

async function migrateData() {
  const oldStorage = new MemStorage();
  
  try {
    console.log('Starting data migration...');

    // Migrate users - we need to manually create the default users
    console.log('Migrating users...');
    await db.insert(users).values({
      username: "Sunilgiri@admin",
      password: await bcrypt.hash("Girisunil@4444", 10),
      role: "super_admin",
      createdAt: new Date()
    });
    
    await db.insert(users).values({
      username: "Ankit@admin",
      password: await bcrypt.hash("Ankit@968511", 10),
      role: "manager",
      createdAt: new Date()
    });

    // Migrate categories
    console.log('Migrating categories...');
    const oldCategories = await oldStorage.getCategories();
    for (const category of oldCategories) {
      await db.insert(categories).values({
        name: category.name,
        description: category.description,
        image: category.image,
        createdAt: category.createdAt
      });
    }

    // Migrate products
    console.log('Migrating products...');
    const oldProducts = await oldStorage.getProducts();
    for (const product of oldProducts) {
      await db.insert(products).values({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        createdAt: product.createdAt
      });
    }

    // Migrate product images
    console.log('Migrating product images...');
    // Get all product images from all products
    let allProductImages: any[] = [];
    const productIds = oldProducts.map(p => p.id);
    for (const productId of productIds) {
      const images = await oldStorage.getProductImages(productId);
      allProductImages = [...allProductImages, ...images];
    }
    
    for (const image of allProductImages) {
      await db.insert(productImages).values({
        productId: image.productId,
        imageUrl: image.imageUrl,
        isMain: image.isMain,
        order: image.order
      });
    }

    // Migrate hero images
    console.log('Migrating hero images...');
    const oldHeroImages = await oldStorage.getHeroImages();
    for (const image of oldHeroImages) {
      await db.insert(heroImages).values({
        imageUrl: image.imageUrl,
        title: image.title,
        subtitle: image.subtitle,
        buttonText: image.buttonText,
        buttonLink: image.buttonLink,
        order: image.order,
        isActive: image.isActive
      });
    }

    // Migrate contact requests
    console.log('Migrating contact requests...');
    const oldContactRequests = await oldStorage.getContactRequests();
    for (const request of oldContactRequests) {
      await db.insert(contactRequests).values({
        name: request.name,
        email: request.email,
        phone: request.phone,
        message: request.message,
        status: request.status,
        requestCallBack: request.requestCallBack,
        createdAt: request.createdAt
      });
    }

    // Migrate settings
    console.log('Migrating settings...');
    const oldSettings = await oldStorage.getAllSettings();
    for (const setting of oldSettings) {
      await db.insert(settings).values({
        key: setting.key,
        value: setting.value
      });
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    console.log('Migration process finished');
  }
}

// Run the migration
migrateData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  }); 