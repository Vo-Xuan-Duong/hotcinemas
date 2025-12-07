# HotCinemas Backend API

Backend API for HotCinemas - A comprehensive cinema management system built with Spring Boot.

## 🚀 Features

- **User Management**: Complete user CRUD operations with role-based access
- **Authentication & Authorization**: JWT-based security with access/refresh tokens
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Data Validation**: Comprehensive input validation using Jakarta Bean Validation
- **Error Handling**: Global exception handling with structured error responses
- **Caching**: Redis integration for improved performance
- **Database**: PostgreSQL with JPA/Hibernate
- **File Storage**: Cloudinary integration for media files

## 🛠️ Technology Stack

- **Framework**: Spring Boot 3.5.3
- **Language**: Java 21
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI 3
- **Build Tool**: Maven
- **Cloud Storage**: Cloudinary

## 📋 Prerequisites

- Java 21 or higher
- Maven 3.6+
- PostgreSQL database
- Redis server
- IDE (IntelliJ IDEA, Eclipse, VS Code)

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd hotcinemas_be
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and configure the following variables:

```properties
# Database Configuration
DB_URL=jdbc:postgresql://your-db-host:5432/your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT Configuration
JWT_SECRET_ACCESS=your-access-secret-key
JWT_SECRET_REFRESH=your-refresh-secret-key
JWT_EXPIRATION_ACCESS=86400000
JWT_EXPIRATION_REFRESH=604800000
JWT_ISSUER=hotcinemas

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Install Dependencies
```bash
mvn clean install
```

### 4. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## 🔗 Available Endpoints

### Health Check
- `GET /api/v1/health` - Health check endpoint
- `GET /api/v1/health/version` - API version information

### User Management
- `POST /api/v1/users` - Create a new user
- `POST /api/v1/users/register` - Register a new user
- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/email/{email}` - Get user by email
- `GET /api/v1/users/username/{username}` - Get user by username
- `GET /api/v1/users/search` - Search users by keyword
- `GET /api/v1/users/role/{roleName}` - Get users by role
- `PUT /api/v1/users/{id}` - Update user information
- `PUT /api/v1/users/{id}/password` - Update user password
- `PUT /api/v1/users/{id}/avatar` - Update user avatar
- `PUT /api/v1/users/{id}/activate` - Activate user account
- `PUT /api/v1/users/{id}/deactivate` - Deactivate user account
- `POST /api/v1/users/{id}/roles/{roleName}` - Add role to user
- `DELETE /api/v1/users/{id}/roles/{roleName}` - Remove role from user
- `DELETE /api/v1/users/{id}` - Delete user

## 🗂️ Project Structure

```
src/
├── main/
│   ├── java/com/example/hotcinemas_be/
│   │   ├── config/           # Configuration classes
│   │   ├── controllers/      # REST controllers
│   │   ├── dtos/            # Data Transfer Objects
│   │   │   ├── requests/    # Request DTOs
│   │   │   └── responses/   # Response DTOs
│   │   ├── enums/           # Enumeration classes
│   │   ├── exceptions/      # Exception handling
│   │   ├── jwts/            # JWT utilities
│   │   ├── mappers/         # Entity-DTO mappers
│   │   ├── models/          # JPA entities
│   │   ├── repositorys/     # Data repositories
│   │   └── services/        # Business logic services
│   └── resources/
│       ├── application.properties
│       └── db/              # Database scripts
└── test/                    # Test classes
```

## 🔒 Security

The application implements:
- JWT-based authentication
- Role-based authorization
- Password encryption using BCrypt
- CORS configuration
- Input validation and sanitization

## 🧪 Testing

Run tests using Maven:
```bash
mvn test
```

## 🚀 Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/hotcinemas_be-0.0.1-SNAPSHOT.jar
```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "status": 200,
  "message": "Success message",
  "data": {...},
  "timestamp": "2025-01-07T10:30:00"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@hotcinemas.com or create an issue in the repository.

---
**HotCinemas Team** © 2025
