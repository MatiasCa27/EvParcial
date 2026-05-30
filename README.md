# EvParcial — API Node.js con Pipeline CI/CD

## Descripción del proyecto

API REST construida con Express.js que expone tres endpoints:
- `GET /` → mensaje de bienvenida
- `GET /saludo/:nombre` → saludo personalizado
- `POST /usuario` → creación de usuario con datos JSON

---

## Estrategia de ramas (GitFlow)

| Rama | Propósito |
|------|-----------|
| `main` | Código estable en producción |
| `develop` | Integración de funcionalidades |
| `feature/*` | Nuevas funcionalidades |
| `fix/*` | Corrección de errores en desarrollo |
| `hotfix/*` | Correcciones urgentes en producción |

---

## Pipeline CI/CD — GitHub Actions

El pipeline se encuentra en `.github/workflows/ci.yml` y se ejecuta en cada push a `main` o `develop` y en cada Pull Request hacia `main`.

### Flujo de ejecución 
Si cualquier job falla, todos los siguientes se cancelan automáticamente.

### Job 1: `security` — Análisis de seguridad
- **npm audit** escanea dependencias con vulnerabilidades conocidas. Bloquea el pipeline si encuentra severidad `high` o superior.
- **Snyk** realiza un análisis SCA (Software Composition Analysis) sobre las dependencias del proyecto. Bloquea si detecta vulnerabilidades `high` o `critical`.
- El reporte de Snyk se sube como artefacto descargable (`snyk-security-report`) incluso si el job falla, garantizando trazabilidad del análisis.
- Si el job falla, se emite un mensaje de error explícito visible en GitHub Actions.

### Job 2: `test` — Pruebas unitarias
- Solo se ejecuta si `security` pasó exitosamente (`needs: security`).
- Corre `npm test` usando Jest como framework de pruebas.

### Job 3: `sonar` — Análisis de calidad estática (SAST)
- Solo se ejecuta si `test` pasó.
- SonarCloud analiza el código fuente en busca de bugs, code smells y problemas de seguridad en el código propio.
- Requiere el secret `SONAR_TOKEN` configurado en el repositorio.

### Job 4: `build` — Construcción y despliegue
- Solo se ejecuta si `sonar` pasó.
- Construye la imagen Docker usando un Dockerfile multi-stage.
- Levanta los servicios con Docker Compose.

---

## Cómo se garantiza la trazabilidad y calidad

### Trazabilidad
- **Artefactos descargables**: el reporte de Snyk se almacena como artefacto en cada ejecución del pipeline, permitiendo auditar el estado de seguridad en cualquier punto de la historia.
- **Jobs encadenados con `needs`**: el orden explícito de ejecución asegura que ninguna etapa avance sin que la anterior haya sido validada.
- **Convención de commits**: todos los commits siguen el formato `feat:`, `fix:`, `hotfix:`, lo que permite rastrear el propósito de cada cambio.
- **Pull Requests obligatorios**: todo cambio hacia `develop` o `main` pasa por revisión antes del merge.

### Calidad
- **Seguridad antes que todo** (shift-left security): el análisis de vulnerabilidades es el primer job, bloqueando el pipeline antes de que código inseguro llegue a producción.
- **SCA con Snyk**: detecta vulnerabilidades en dependencias de terceros (librerías npm).
- **SAST con SonarCloud**: detecta problemas en el código propio sin ejecutarlo.
- **Pruebas unitarias con Jest**: validan el comportamiento esperado de la aplicación.
- **Docker multi-stage**: la imagen de producción solo contiene lo necesario, reduciendo la superficie de ataque.

---

## Orquestación con Docker Compose

El archivo `docker-compose.yml` define dos servicios:

| Servicio | Imagen | Puerto | Descripción |
|----------|--------|--------|-------------|
| `db` | mysql:8.0 | 3306 | Base de datos MySQL |
| `api` | build local | 3000 | API Node.js |

### Características de la orquestación
- **Healthcheck en MySQL**: la API no inicia hasta que MySQL esté aceptando conexiones (`condition: service_healthy`), evitando errores de conexión al arrancar.
- **Red interna** (`evparcial-network`): los servicios se comunican entre sí por nombre sin exponer puertos internos al exterior innecesariamente.
- **Volumen persistente** (`db_data`): los datos de MySQL sobreviven al reinicio de los contenedores.
- **Límites de recursos**: cada servicio tiene límites de CPU y memoria para evitar que un contenedor consuma todos los recursos del host.
- **Restart policy**: `unless-stopped` reinicia la API automáticamente si falla.

### Comandos principales

```bash
# Levantar el stack completo
docker compose up -d --build

# Ver estado de los contenedores y healthcheck
docker compose ps

# Ver logs en tiempo real
docker compose logs -f api

# Detener sin eliminar datos
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

---

## Secrets requeridos en GitHub

Configúralos en Settings → Secrets and variables → Actions:

| Secret | Descripción | Dónde obtenerlo |
|--------|-------------|-----------------|
| `SNYK_TOKEN` | Token de autenticación de Snyk | [app.snyk.io/account](https://app.snyk.io/account) |
| `SONAR_TOKEN` | Token de SonarCloud | [sonarcloud.io/account/security](https://sonarcloud.io/account/security) |

---

## Estructura del proyecto