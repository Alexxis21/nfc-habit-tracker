# --- Etap 1: build ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Warstwa zależności osobno od kodu źródłowego — Docker cache'uje ten krok,
# więc kolejne buildy (po zmianie tylko kodu) nie pobierają zależności od nowa.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Etap 2: uruchomienie ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
