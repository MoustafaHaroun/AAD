# Spring Prototype

Spring Boot prototype for the **Advanced Application Development Specialisation** backend assignment 1.

You can test the API using Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Minimal Requirements
- Docker  

## Installation 

Start app and monitoring stack together:

```bash
docker-compose up -d
```

The app runs on the port in `src/main/resources/application.properties` (default `8080`).

## Sample credentials 

- Username: admin
- Password: admin123

Login endpoint: `POST /auth/login` 

Example JSON:

```JSON
{
    "username": "admin",
    "password": "admin123"
}
```

## Monitoring 

The repository includes a monitoring stack under `monitoring/` and the root `docker-compose.yml` runs:

- Grafana (http://localhost:3000)
- Prometheus (http://localhost:9090)
- Loki (http://localhost:3100)

Configs and dashboards live in the `monitoring/` folder.
If logs don’t show in Grafana, Loki might not be ready yet. Check readiness with:

```http
curl -s -X GET http://localhost:3100/ready
```
