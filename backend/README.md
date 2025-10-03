# Todo Application

A full-stack to-do application built with Spring Boot 3.x backend and React 18 frontend, using MySQL for data persistence.

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0 (Java 21)
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Migration**: Flyway
- **Code Generation**: Lombok (reduces boilerplate code)
- **Object Mapping**: ModelMapper (automatic mapping between DTOs and entities)
- **Testing**: JUnit 5, Mockito, Testcontainers, H2 (for unit tests)
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0
- **Reverse Proxy**: Nginx

## Features

- ✅ Create tasks with title and description
- ✅ View latest 5 uncompleted tasks
- ✅ Mark tasks as completed (removes from UI)
- ✅ Responsive UI with Tailwind CSS
- ✅ RESTful API endpoints
- ✅ Comprehensive testing (unit & integration)
- ✅ Docker containerization
- ✅ Clean code with Lombok annotations

## Lombok Integration

The application uses Lombok to reduce boilerplate code:

- **@Data**: Generates getters, setters, toString, equals, and hashCode
- **@Builder**: Provides a builder pattern for object creation
- **@NoArgsConstructor/@AllArgsConstructor**: Generates constructors
- **@RequiredArgsConstructor**: Generates constructor for final fields (dependency injection)

### Example Usage:
```java
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    private Long id;
    private String title;
    private String description;
    // Lombok generates all getters, setters, builders automatically
}

// Usage with builder pattern
Task task = Task.builder()
    .title("Learn Lombok")
    .description("Reduce boilerplate code")
    .build();
```

## ModelMapper Integration

The application uses ModelMapper for automatic object mapping between DTOs and entities, eliminating manual mapping code:

### Configuration
```java
@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(AccessLevel.PRIVATE);
        return mapper;
    }
}
```

### Service Layer Architecture
The application follows a clean service layer pattern:

- **TaskService** (Interface): Defines business operations
- **TaskServiceImpl** (Implementation): Implements business logic with ModelMapper

```java
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;

    public TaskResponse createTask(CreateTaskRequest request) {
        Task task = modelMapper.map(request, Task.class);
        Task savedTask = taskRepository.save(task);
        return modelMapper.map(savedTask, TaskResponse.class);
    }
}
```

### Benefits:
- **Automatic Mapping**: No manual field copying between objects
- **Type Safety**: Compile-time checking of mappings
- **Maintainable**: Changes to entities automatically reflect in mappings
- **Testable**: Easy to mock and test with clean interfaces

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for local development)
- IDE with Lombok plugin (IntelliJ IDEA, VS Code, Eclipse)

**Note**: For IDE support, make sure to install the Lombok plugin:
- **IntelliJ IDEA**: File → Settings → Plugins → Install "Lombok"
- **VS Code**: Install "Lombok Annotations Support" extension
- **Eclipse**: Download lombok.jar and run it to install

### Run with Docker (Recommended)

1. Clone the repository
2. Run the application:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

### Local Development

#### Backend
```bash
# Navigate to project root
cd to-do-task-project

# Start MySQL (or use Docker)
docker run --name todo-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=todoapp -p 3306:3306 -d mysql:8.0

# Run the Spring Boot application
./mvnw spring-boot:run
```

#### Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/recent` | Get latest 5 uncompleted tasks |
| PUT | `/api/tasks/{id}/complete` | Mark task as completed |

### Request/Response Examples

#### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Learn Spring Boot",
  "description": "Complete the tutorial and build a project"
}
```

#### Get Recent Tasks
```bash
GET /api/tasks/recent

Response:
[
  {
    "id": 1,
    "title": "Learn Spring Boot",
    "description": "Complete the tutorial and build a project",
    "createdAt": "2023-10-03T10:00:00",
    "completed": false
  }
]
```

## Database Schema

```sql
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE
);
```

## Testing

### Backend Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=TaskServiceTest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
to-do-task-project/
├── src/main/java/edu/icet/ecom/
│   ├── TodoApplication.java          # Main Spring Boot class
│   ├── controller/TaskController.java # REST API controller
│   ├── service/TaskService.java      # Business logic
│   ├── entity/Task.java              # JPA entity
│   ├── repository/TaskRepository.java # Data access layer
│   └── dto/                          # Data transfer objects
├── src/main/resources/
│   ├── application.yml               # Spring Boot configuration
│   └── db/migration/                 # Flyway migration scripts
├── src/test/java/                    # Unit and integration tests
├── frontend/
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── services/                 # API service layer
│   │   └── tests/                    # Component tests
│   ├── public/
│   └── package.json
├── docker-compose.yml                # Multi-service Docker setup
├── Dockerfile.backend               # Backend containerization
└── pom.xml                          # Maven configuration
```

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Frontend
- `REACT_APP_API_URL`: Backend API base URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run tests to ensure they pass
5. Submit a pull request

## License

This project is licensed under the MIT License.
