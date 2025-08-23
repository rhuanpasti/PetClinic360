# PetClinic360 🐾

A comprehensive veterinary clinic management system with a React Native mobile app frontend and Node.js/Express backend API.

## 🏗️ Project Structure

```
PetClinic360/
├── petclinic-api/          # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Custom middleware
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/       # Database seeders
│   ├── package.json
│   └── .sequelizerc
└── petclinic-front/        # Frontend (React Native/Expo)
    ├── src/
    │   ├── pages/          # App screens
    │   ├── routes/         # Navigation routes
    │   ├── contexts/       # React contexts
    │   └── assets/         # Images and static files
    ├── package.json
    └── app.json
```

## 🚀 Features

### Backend API
- **User Management**: Registration, authentication, and profile management
- **Pet Management**: CRUD operations for pet information
- **Appointment System**: Schedule and manage veterinary appointments
- **Medical Records**: Store and retrieve exam results and medical history
- **Swagger Documentation**: API documentation at `/api/docs`
- **JWT Authentication**: Secure user authentication
- **SQL Server Integration**: Database connectivity with Sequelize ORM

### Frontend Mobile App
- **Cross-platform**: iOS and Android support via React Native
- **User Authentication**: Login and registration screens
- **Pet Profiles**: Manage pet information and medical history
- **Appointment Booking**: Schedule veterinary consultations
- **Medical Records**: View exam results and medical documents
- **Responsive Design**: Optimized for mobile devices

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **SQL Server** - Database (via mssql driver)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Swagger** - API documentation

### Frontend
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation between screens
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form management
- **Yup** - Form validation

## 📱 App Screens

- **Welcome** - Introduction and navigation
- **Sign In** - User authentication
- **Registration** - New user registration
- **Home** - Main dashboard for users
- **HomeVt** - Veterinarian dashboard
- **Pet Management** - Add/edit pet information
- **Appointments** - Schedule and view consultations
- **Medical Records** - View exam results
- **Profile** - User profile management
- **Admin Panel** - Administrative functions

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- SQL Server instance
- Expo CLI (for frontend development)

### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd petclinic-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   ```

4. Run database migrations:
   ```bash
   node sync-db.js
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd petclinic-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API configuration:
   Edit `src/pages/config.js` to point to your backend URL

4. Start the development server:
   ```bash
   npm start
   ```

5. Use Expo Go app to scan the QR code and run on your device

## 📚 API Documentation

Complete API documentation can be found in the Swagger docs at `/api/docs` when the backend server is running.

## 🔧 Development

### Database Schema
The system uses the following main entities:
- **Users**: User accounts with roles (client, veterinarian, admin)
- **Pets**: Pet information linked to owners
- **Exams**: Medical examination records
- **Appointments**: Scheduled consultations

### Code Style
- Follow JavaScript/React Native best practices
- Use meaningful variable and function names
- Include proper error handling
- Document complex functions with JSDoc comments

## 🚀 Deployment

### Backend
- Deploy to cloud platforms (Heroku, AWS, Azure)
- Set production environment variables
- Use production database instance
- Enable HTTPS in production

### Frontend
- Build standalone APK/IPA files
- Deploy to app stores (Google Play, App Store)
- Configure production API endpoints

**PetClinic360** - Modern veterinary clinic management made simple! 🏥🐕
