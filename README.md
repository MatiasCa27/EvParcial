# EvParcial — API Node.js con Pipeline CI/CD

## Descripción del proyecto

API REST desarrollada con Express.js que implementa un pipeline CI/CD completo utilizando GitHub Actions. Automatiza validaciones de seguridad, pruebas, análisis de calidad, construcción de imágenes Docker, despliegue en una instancia Amazon EC2 y monitoreo mediante AWS CloudWatch.

## Pipeline CI/CD

Orden:
1. security
2. test
3. sonar
4. build
5. deploy

Si una etapa falla, las siguientes no se ejecutan.

### security
- npm audit
- Snyk
- Bloqueo ante vulnerabilidades críticas.

### test
```bash
npm test
```

### sonar
Análisis de calidad mediante SonarCloud.

### build
Construcción de la imagen Docker.

### deploy
Despliegue automático en Amazon EC2 mediante SSH y Docker Compose.

## Docker Compose
Servicios:
- api
- db (MySQL)

Incluye red, volumen persistente, variables de entorno, healthcheck, restart policy y límites de recursos.

## AWS CloudWatch
Se recopilan métricas de CPU, memoria y disco. Además, el CloudWatch Agent envía automáticamente los logs de Docker a CloudWatch Logs. Se utilizan dashboards personalizados para monitoreo.

## Políticas de cumplimiento
- SonarCloud
- Snyk
- npm audit
- Ruleset de GitHub para proteger la rama main.

## Protección del pipeline
El despliegue se cancela automáticamente si fallan las pruebas, SonarCloud o los análisis de seguridad.

## Dependabot
Configurado para dependencias npm, Docker y GitHub Actions.

## Secrets
- SONAR_TOKEN
- SNYK_TOKEN
- EC2_HOST
- EC2_USERNAME
- EC2_SSH_KEY

## Instalación
```bash
npm install
npm test
docker compose up -d --build
```
