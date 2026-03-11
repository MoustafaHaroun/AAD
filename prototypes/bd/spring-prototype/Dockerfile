# ---- Build stage ----
FROM gradle:8.7-jdk21 AS builder
WORKDIR /app

# copy gradle wrapper and config first (better caching)
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

RUN chmod +x gradlew

# download dependencies
RUN ./gradlew dependencies --no-daemon || true

# copy source
COPY src src

# build jar
RUN ./gradlew bootJar --no-daemon

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
