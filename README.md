# AromaLuxe Perfume Catalog

A modern, full-stack web application for managing and browsing a perfume catalog with beautiful UI and robust backend functionality.

## ✨ Features

### 🎨 Frontend (React + Vite + Tailwind CSS)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **User Management**: Complete user authentication and role management
- **Admin Dashboard**: Comprehensive admin panel for catalog management
- **Image Management**: File upload and image handling
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-first approach

### 🔧 Backend (Spring Boot + Java)
- **RESTful API**: Clean, well-structured REST endpoints
- **Security**: JWT-based authentication with role-based access control
- **Database**: PostgreSQL with JPA/Hibernate
- **File Handling**: Secure file upload and storage
- **Validation**: Comprehensive input validation and error handling

### 🗄️ Database
- **PostgreSQL**: Robust, scalable database
- **JPA/Hibernate**: Object-relational mapping
- **Data Seeding**: Initial data population

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot 3** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data access layer
- **PostgreSQL** - Database
- **Maven** - Dependency management

### Development Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **PostgreSQL 12+** (for database)
- **Maven 3.6+** (for backend dependencies)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone git@github.com:yowazga/parfum-catelog.git
cd parfum-catelog
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
mvn clean install

# Configure database in application.yml
# Update database connection details

# Run the application
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API base URL in .env.local
VITE_API_BASE_URL=http://localhost:8080

# Run development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=AromaLuxe Catalog
```

#### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/perfume_catalog
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

## 📱 Usage

### Public Features
- Browse perfume catalog
- Search and filter perfumes
- View brand and category information
- Responsive design for all devices

### Admin Features
- **User Management**: Create, edit, and manage users
- **Category Management**: Organize perfumes by categories
- **Brand Management**: Manage perfume brands with images
- **Perfume Management**: Add, edit, and delete perfumes
- **Image Management**: Handle file uploads and storage

## 🔐 Authentication

- **JWT-based authentication**
- **Role-based access control** (USER, ADMIN)
- **Session management** with timeout
- **Secure password handling**

## 📁 Project Structure

```
parfum-catelog/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/cataloghakim/perfume/
│   │       ├── controller/ # REST controllers
│   │       ├── service/    # Business logic
│   │       ├── entity/     # JPA entities
│   │       ├── repository/ # Data access
│   │       ├── dto/        # Data transfer objects
│   │       └── config/     # Configuration classes
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend (Railway/Heroku)
1. Build JAR: `mvn clean package`
2. Deploy the JAR file
3. Configure database and environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 👨‍💻 Author

**Younes** - [GitHub](https://github.com/yowazga)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing frontend library
- Tailwind CSS for the beautiful design system
- All contributors and supporters

---

**Made with ❤️ for perfume enthusiasts everywhere**
