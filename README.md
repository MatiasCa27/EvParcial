# EvParcial — API Node.js con Pipeline CI/CD

## Descripción del proyecto

EvParcial es una API REST desarrollada con Node.js y Express.js cuyo objetivo es demostrar la implementación de un proceso completo de Integración Continua y Despliegue Continuo (CI/CD). El proyecto automatiza las etapas de validación de seguridad, ejecución de pruebas, análisis de calidad del código, construcción de imágenes Docker y despliegue automático en una instancia de Amazon EC2 utilizando GitHub Actions.

La aplicación se ejecuta mediante contenedores Docker y utiliza una base de datos MySQL. Además, integra AWS CloudWatch para el monitoreo de métricas del servidor y la centralización de los logs generados por la aplicación.

---

# Arquitectura del proyecto

El proyecto está compuesto por los siguientes componentes:

- API REST desarrollada con Express.js.
- Base de datos MySQL ejecutándose en Docker.
- GitHub Actions como plataforma de Integración Continua y Despliegue Continuo.
- SonarCloud para el análisis de calidad del código.
- Snyk y npm audit para el análisis de vulnerabilidades.
- Docker y Docker Compose para la contenerización de la aplicación.
- Amazon EC2 como servidor de despliegue.
- AWS CloudWatch para el monitoreo de métricas y centralización de logs.

---

# Pipeline CI/CD

El flujo completo del pipeline es el siguiente:

1. Security
2. Test
3. Sonar
4. Build
5. Deploy

Cada etapa depende del éxito de la anterior. Si alguna falla, el pipeline se detiene automáticamente y el despliegue no se realiza.

---

## Etapa Security

Durante esta etapa se realizan controles automáticos de seguridad para detectar vulnerabilidades conocidas en las dependencias del proyecto.

Herramientas utilizadas:

- npm audit
- Snyk

Objetivos:

- Detectar vulnerabilidades críticas y de alta severidad.
- Evitar desplegar aplicaciones con dependencias inseguras.
- Garantizar un nivel mínimo de seguridad antes de continuar con el pipeline.

---

## Etapa Test

Se ejecutan automáticamente las pruebas del proyecto.

```bash
npm test
```

Objetivos:

- Verificar que la aplicación continúa funcionando correctamente.
- Detectar errores antes del despliegue.

---

## Etapa Sonar

Se realiza un análisis estático del código utilizando SonarCloud.

Se evalúan aspectos como:

- Bugs
- Vulnerabilidades
- Code Smells
- Duplicación de código
- Mantenibilidad

El proyecto debe cumplir con los criterios establecidos por el Quality Gate para permitir continuar con el pipeline.

---

## Etapa Build

Una vez superadas todas las validaciones anteriores, se construye la imagen Docker de la aplicación.

Durante esta etapa:

- Se genera una imagen actualizada.
- Se prepara la aplicación para su despliegue.
- Se verifica que el proceso de construcción finalice correctamente.

---

## Etapa Deploy

Si todas las etapas anteriores son exitosas, GitHub Actions realiza automáticamente el despliegue en Amazon EC2.

El proceso consiste en:

- Conectarse mediante SSH a la instancia.
- Actualizar el repositorio.
- Reconstruir los contenedores Docker.
- Levantar nuevamente los servicios utilizando Docker Compose.

Todo el proceso se ejecuta automáticamente sin necesidad de acceder manualmente al servidor.

---

# Docker

La aplicación se ejecuta completamente dentro de contenedores Docker.

Los servicios definidos en Docker Compose son:

- api
- db (MySQL)

La configuración incluye:

- Red interna entre contenedores.
- Volúmenes persistentes para la base de datos.
- Variables de entorno.
- Healthcheck para verificar el estado de la API.
- Política de reinicio automático.
- Límites de recursos para los contenedores.

La utilización de Docker permite mantener un entorno consistente tanto durante el desarrollo como en producción.

---

# Monitoreo con AWS CloudWatch

La infraestructura se monitorea mediante Amazon CloudWatch.

El CloudWatch Agent instalado en la instancia EC2 recopila automáticamente las siguientes métricas:

- Uso de CPU.
- Uso de memoria.
- Uso de disco.

Además, los logs generados por los contenedores Docker son enviados automáticamente a CloudWatch Logs, permitiendo consultar los registros de la aplicación desde la consola de AWS.

Se utilizan Dashboards personalizados para visualizar el estado general de la instancia y facilitar el monitoreo del sistema.

---

# Políticas de cumplimiento

El proyecto incorpora diferentes mecanismos para garantizar la calidad y seguridad del código antes del despliegue.

Entre ellos se encuentran:

- SonarCloud para calidad del código.
- Snyk para análisis de vulnerabilidades.
- npm audit para revisión de dependencias.
- Ruleset de GitHub que protege la rama principal.

La rama `main` no permite recibir cambios directamente. Todas las modificaciones deben integrarse mediante Pull Request.

---

# Protección del pipeline

El pipeline está diseñado para impedir el despliegue de versiones que no cumplan con los estándares definidos.

El despliegue se cancela automáticamente cuando ocurre cualquiera de las siguientes situaciones:

- Fallo en las pruebas.
- Vulnerabilidades detectadas por Snyk.
- Vulnerabilidades encontradas por npm audit.
- Quality Gate fallido en SonarCloud.
- Error durante la construcción de la imagen Docker.

De esta forma únicamente se despliegan versiones que hayan superado todas las validaciones.

---

# Dependabot

El proyecto utiliza Dependabot para mantener actualizadas las dependencias.

Se encuentra configurado para revisar automáticamente:

- Dependencias npm.
- Imágenes Docker.
- GitHub Actions.

Cuando existe una actualización disponible, Dependabot genera automáticamente un Pull Request con la nueva versión.

---

# GitHub Secrets

Para proteger la información sensible se utilizan los siguientes secretos:

- SONAR_TOKEN
- SNYK_TOKEN
- EC2_HOST
- EC2_USERNAME
- EC2_SSH_KEY

Estos valores son utilizados durante la ejecución del pipeline y nunca se almacenan directamente dentro del repositorio.

---

# Instalación

Instalar dependencias:

```bash
npm install
```

Ejecutar pruebas:

```bash
npm test
```

Levantar la aplicación utilizando Docker Compose:

```bash
docker compose up -d --build
```

Acceder a la API:

```
http://localhost:3000
```

---

# Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- Docker
- Docker Compose
- GitHub Actions
- SonarCloud
- Snyk
- npm audit
- Amazon EC2
- AWS CloudWatch
- Dependabot
- GitHub Rulesets

---
