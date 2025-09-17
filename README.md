<img width="1782" height="866" alt="image" src="https://github.com/user-attachments/assets/55b53be4-bf3d-4d9c-903b-342b07ab0ce2" /># CampusEntry Project
<img width="1776" height="872" alt="image" src="https://github.com/user-attachments/assets/820352d8-a777-49b4-b463-29c64cefdd2d" />


## Overview
CampusEntry is a full-stack application designed to manage student entries and administrative tasks efficiently. The frontend is built with React, TypeScript, and Vite, providing a modern and responsive user interface. The backend is powered by Node.js, Express, and MongoDB, ensuring robust data management and API services.

## Frontend
- Built with React 19.1.1 and TypeScript.
- Uses Vite as the build tool and development server.
- TailwindCSS for styling.
- React Router DOM for client-side routing.
- Features include login authentication, student management forms, and dashboards.

## Backend
- Node.js with Express framework.
- MongoDB for database, connected via Mongoose.
- API routes for student and admin management.
- Passwords and sensitive data are encrypted.
- Environment variables are used for configuration.

## Encryption Implementation
Encryption is implemented using the CryptoJS library, which provides AES (Advanced Encryption Standard) encryption for securing sensitive data such as passwords.

- **Backend Encryption**: In the backend (`cebackend/src/utils/crypto.ts`), passwords and sensitive data are encrypted using AES encryption with a secret key. The secret key is retrieved from the `SECRET_KEY` environment variable, with a fallback to a default key if not set. This ensures that data stored in the database is encrypted and can only be decrypted with the correct key.

- **Frontend Encryption**: The frontend (`CampusEntry/src/utils/crypto.ts`) uses the same AES encryption method for consistency. It employs a fixed secret key ('campusentry123') that matches the backend key to allow seamless encryption and decryption across the application.

**Note**: In production environments, it is crucial to use strong, unique secret keys stored securely in environment variables to prevent unauthorized access. The current setup uses a default key for simplicity, but this should be changed for security reasons.

## Installation

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- MongoDB instance (local or cloud)

### Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd CampusEntry
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173` (or the port Vite uses).

### Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd cebackend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `cebackend` directory with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
   Replace `your_mongodb_connection_string` with your actual MongoDB connection URI.

4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

   ### (Optional)

   The .env file is pushed in the repository to simplify installation and setup. 
   Note: This  is    not a good security practice for production or public repos as it exposes sensitive data. Please handle environment variables securely in real deployments
 

5. The backend API will be available at `http://localhost:5000`.

## Environment Variables (.env)
- `MONGO_URI`: MongoDB connection string.
- `PORT`: Port number for the backend server (default is 5000).

## Credentials
- Admin and user credentials are managed via the backend.
- Passwords are encrypted for security.
- Use the admin login form on the frontend to authenticate.

### Default Credentials
- **Admin Login**:
  - Email: test@example.com
  - Password: admin123
   
- **User Login**:
  - Email: omkar@example.com
  - Password: admin123
<img width="1782" height="866" alt="image" src="https://github.com/user-attachments/assets/bfa5c421-cfb1-4988-9c40-5487e84e47b6" />

<img width="1752" height="872" alt="image" src="https://github.com/user-attachments/assets/130fca70-0637-4715-afbe-2c3697ce0fa3" />

<img width="1781" height="876" alt="image" src="https://github.com/user-attachments/assets/31bad947-b09a-4166-a4e3-b26fa9cf0f22" />

<img width="1777" height="882" alt="image" src="https://github.com/user-attachments/assets/45e146fc-d842-497f-8732-7d85dc6fd34b" />


<img width="1770" height="867" alt="image" src="https://github.com/user-attachments/assets/bca038d5-eb35-43f1-8bfd-9aa390d81dc2" />


## Additional Notes
- The frontend and backend run independently; ensure both are running for full functionality.
- The backend API endpoints are prefixed with `/api` (e.g., `/api/admin/login`).
- For production deployment, consider environment-specific configurations and secure storage of environment variables.


## Author
Developed by ❤️ Srujal
