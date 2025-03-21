# Cloud Database Setup Guide

This project has been configured to use a cloud-hosted PostgreSQL database. Here's how to use it:

## Database Connection Details

- **Host**: postgresql-194487-0.cloudclusters.net
- **Port**: 10138
- **Database**: my_shivi_db
- **User**: ankittgiri
- **Password**: Ankit@8511

## Environment Variables

The application uses the following environment variables for database connection:

```
DATABASE_URL=postgres://ankittgiri:Ankit@8511@postgresql-194487-0.cloudclusters.net:10138/my_shivi_db
```

For development, this is configured in the `.env` file.
For production, use the `.env.production` file.

## Development Setup

1. For local development using the cloud database, make sure your `.env` file contains the correct `DATABASE_URL`.
2. Run the application with:
   ```
   npm run dev
   ```

## Database Management

The following scripts are available for database management:

- **Set up database schema**: Creates all tables in the cloud database
  ```
  npm run db:setup-cloud
  ```

- **Seed the database**: Populates the cloud database with initial data
  ```
  npm run db:seed-cloud
  ```

- **Migrate data**: If you have data in a local database and want to migrate it to the cloud
  ```
  npm run db:migrate-to-cloud
  ```

## Production Deployment

For production deployment:

1. Use the `.env.production` file or set the environment variables on your hosting platform.
2. Build the application with:
   ```
   npm run build
   ```
3. Start the application with:
   ```
   npm run start
   ```

## Connecting to the Database Directly

To connect to the database directly using standard PostgreSQL tools:

```
psql -h postgresql-194487-0.cloudclusters.net -p 10138 -U ankittgiri -d my_shivi_db
```

When prompted, enter the password: `Ankit@8511`

## Alternative Users

There is also an alternative admin user for the database:

- **User**: cloud_admin
- **Password**: Ankit@8511

You can use this account for administrative tasks if needed. 