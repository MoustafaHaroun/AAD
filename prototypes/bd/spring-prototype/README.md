# Spring Prototype

Spring Boot prototype for the **Advanced Application Development Specialisation** backend assignment 1.

## Requirements

- JDK 21  
- Gradle wrapper (`gradlew` / `gradlew.bat`)  
- Docker  

## Running Locally

**Windows:**

```powershell
.\gradlew.bat clean build
.\gradlew.bat bootRun
```

Unix/macOS:

```bash
./gradlew clean build
./gradlew bootRun
```

The app runs on the port in `src/main/resources/application.properties` (default `8080`).

## Run with Docker

Start app and monitoring stack together:

```bash
docker-compose up -d
```

## Sample credentials (demo)

- Username: admin
- Password: admin

Login endpoint: `POST /auth/login` 

Example JSON:

```JSON
{
    "username": "admin",
    "password": "admin"
}
```

## Monitoring (brief)

The repository includes a monitoring stack under `monitoring/` and the root `docker-compose.yml` runs:

- Grafana (http://localhost:3000)
- Prometheus (http://localhost:9090)
- Loki (http://localhost:3100)

Configs and dashboards live in the `monitoring/` folder.