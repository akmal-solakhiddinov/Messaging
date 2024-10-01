# Welcome to Messaging!

Hi! This is a real-time messaging application built using **React**, **Express.js**, **Socket.IO**, **MySQL/Prisma ORM** for backend, and **React Query/WebSockets** for frontend communication.

### **Features**:

-   Real-time chat using WebSockets.
-   User authentication.
-   Message CRUD operations (Create, Read, Update, Delete).
-   Room management for chat conversations.
-   User privacy settings (public/private accounts).
-   Notifications for new messages when not in the chat room.

----------

### **Getting Started**

#### **Prerequisites**:

Before you begin, ensure you have the following installed:

-   **Node.js** (v14.x or above)
-   **MySQL/PostgreSQL** (for the database)
-   **NPM** or **Yarn** (for managing dependencies)

----------

## **Installation**

To get the project running locally, follow these steps:

1.  Clone the repository:
    
    `git clone https://github.com/akmal-solakhiddinov/Messaging.git` 
    
2.  Navigate into the project directory:
    
    `cd Messaging` 
    
3.  In the project directory, you'll find two folders:
    
    -   `backend` (for the server-side code)
    -   `frontend` (for the client-side React code)
4.  Enter the **backend** folder:

    `cd backend` 
    
5.  Install backend dependencies:
 
    `npm install` 
   
----------

### **Environment Setup**:

Create an `.env` file in the `backend` folder and set up the following environment variables:

`DATABASE_URL=your_database_url
FIREBASE_SERVICE_ACCOUNT_KEY=your_firebase_admin_sdk_json_file
API_URL=your_backend_application_url
CLIENT_URL=your_client_url
EMAIL_PASSWORD=your_email_password
EMAIL_USER=your_email_user
EMAIL_HOST=your_email_host
EMAIL_PORT=587
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACTIVATION_SECRET=your_jwt_activation_secret
JWT_PASSWORD_SECRET=your_jwt_password_secret` 

Make sure to replace the placeholders with your actual credentials.

----------

### **Prisma Setup**

Prisma is used as the ORM for database management. After setting up the environment variables, run the following commands to initialize the database schema and migrate it.

1.  **Generate Prisma Client**: This will generate the Prisma client so you can interact with the database.
**Make sure you are in backend folder ** 

    `npx prisma generate` 
    
2.  **Run Prisma Migrations**: If this is your first time setting up the project, run the migration to create the database schema.

    `npx prisma migrate dev --name init` 
    
    This command will:
    
    -   Create the database tables according to your Prisma schema.
    -   Apply the migration to your database.
4.  **Seeding the Database (Optional)**: If you have a seed file and want to prepopulate your database with initial data, you can run:
  
    `npx prisma db seed` 
    
5.  **Open Prisma Studio** (optional but useful): Prisma Studio provides a GUI to inspect and interact with your database.

    `npx prisma studio`
