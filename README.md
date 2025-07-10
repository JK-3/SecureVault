# SecureVault

SecureVault is a full-stack secure file storage system that allows authenticated users to upload, view, download, and delete files. It supports role-based access control and tracks file metadata such as filename, type, size, uploader, and upload timestamp.

## Features

* Secure file upload and download
* JWT-based authentication and authorization
* Admin and user dashboards with filtered views
* PostgreSQL for file metadata storage
* AWS S3 or LocalStack for file storage
* React frontend with search, pagination, and download support

## Tech Stack

### Backend

* Java 17
* Spring Boot 3
* Spring Security (JWT)
* PostgreSQL
* AWS SDK (S3) or LocalStack

### Frontend

* React 18
* Axios
* Tailwind CSS

## Getting Started

### Prerequisites

* Java 17+
* Node.js and npm
* PostgreSQL
* AWS credentials (or LocalStack)

### Backend Setup

1. Clone the repository and navigate to the backend directory:

```bash
git clone https://github.com/your-username/securevault.git
cd securevault/securevault-backend
```

2. Configure `application.properties` or `application.yml`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/securevault
spring.datasource.username=your_pg_user
spring.datasource.password=your_pg_password

application.security.jwt.secret-key=your-512-bit-secret
application.security.jwt.expiration=86400000
```

3. Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd ../securevault-frontend
npm install
```

2. Create a `.env` file:

```env
REACT_APP_API_BASE=http://localhost:8080
REACT_APP_AUTH_TOKEN=your_jwt_token
```

3. Start the React application:

```bash
npm start
```

## API Endpoints

| Method | Endpoint                         | Access              |
| ------ | -------------------------------- | ------------------- |
| POST   | /api/v1/files/upload             | Authenticated Users |
| GET    | /api/v1/files/list               | Authenticated Users |
| GET    | /api/v1/files/my                 | Authenticated Users |
| GET    | /api/v1/files/all                | Admin Only          |
| DELETE | /api/v1/files/delete/{fileKey}   | Owner/Admin         |
| GET    | /api/v1/files/download/{fileKey} | Owner/Admin         |

## Roles

* USER: Can upload, view, and manage their own files
* ADMIN: Can view and manage all files

## Test Credentials

| Username                                | Password | Role  |
| --------------------------------------- | -------- | ----- |
| [admin@mail.com](mailto:admin@mail.com) | admin123 | ADMIN |
| [user@mail.com](mailto:user@mail.com)   | user123  | USER  |

## Optional Enhancements

* Add user registration and login UI
* Enable audit logging
* Add file size/type validations
* Support multiple file uploads

## License

This project is licensed under the MIT License.
