# ===== المرحلة الأولى: بناء التطبيق =====
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# تحميل الاعتمادات أولاً للاستفادة من الـ cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# نسخ الكود وبناء الـ JAR
COPY src ./src
RUN mvn package -DskipTests -B

# ===== المرحلة الثانية: تشغيل التطبيق =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# نسخ الـ JAR من مرحلة البناء
COPY --from=build /app/target/*.jar app.jar

# إنشاء مجلد الملفات المرفوعة
RUN mkdir -p /app/uploads

# فتح البورت 8080
EXPOSE 8080

# تشغيل التطبيق
ENTRYPOINT ["java", "-jar", "app.jar"]