# EvParcial — API Node.js con Pipeline CI/CD

## Descripción del proyecto

API REST construida con Express.js que expone tres endpoints:

* `GET /` → mensaje de bienvenida.
* `GET /saludo/:nombre` → saludo personalizado.
* `POST /usuario` → creación de usuario con datos JSON.

Este proyecto corresponde a la Evaluación Parcial N°2 de Ingeniería DevOps. Su objetivo es implementar un pipeline CI/CD funcional que automatice pruebas, análisis de seguridad, análisis de calidad, construcción de imagen Docker y despliegue local usando Docker Compose y un self-hosted runner de GitHub Actions.

---

## Estrategia de ramas (GitFlow)

| Rama        | Propósito                           |
| ----------- | ----------------------------------- |
| `main`      | Código estable en producción        |
| `develop`   | Integración de funcionalidades      |
| `feature/*` | Nuevas funcionalidades              |
| `fix/*`     | Corrección de errores en desarrollo |
| `hotfix/*`  | Correcciones urgentes en producción |

---

## Pipeline CI/CD — GitHub Actions

El pipeline se encuentra en `.github/workflows/ci.yml` y se ejecuta en cada push a `main` o `develop`, y en cada Pull Request hacia `main`.

### Flujo de ejecución

El pipeline está dividido en jobs encadenados. Si un job falla, los siguientes no se ejecutan automáticamente. Esto permite controlar que el código avance solo si supera las validaciones anteriores.

Orden de ejecución:

1. `security`
2. `test`
3. `sonar`
4. `build`

---

### Job 1: `security` — Análisis de seguridad

Este job realiza el análisis de seguridad de las dependencias del proyecto.

* **npm audit** escanea dependencias con vulnerabilidades conocidas.
* El pipeline se bloquea si encuentra vulnerabilidades de severidad `high` o superior.
* **Snyk** realiza un análisis SCA (Software Composition Analysis) sobre las dependencias del proyecto.
* Snyk bloquea el pipeline si detecta vulnerabilidades de severidad alta.
* El reporte de Snyk se sube como artefacto descargable llamado `snyk-security-report`.
* Si el job falla, se muestra un mensaje explícito de error en GitHub Actions.

Este job se ejecuta primero para aplicar una estrategia de seguridad temprana antes de probar, analizar o desplegar la aplicación.

---

### Job 2: `test` — Pruebas unitarias

Este job solo se ejecuta si `security` pasó exitosamente.

Ejecuta las pruebas automatizadas del proyecto usando Jest y Supertest.

Comando utilizado:

```bash
npm test
```

Las pruebas permiten validar el comportamiento básico de los endpoints principales de la API antes de continuar con las siguientes etapas del pipeline.

---

### Job 3: `sonar` — Análisis de calidad estática

Este job solo se ejecuta si `test` pasó exitosamente.

SonarCloud analiza el código fuente para detectar problemas de calidad, mantenibilidad y posibles errores en el código propio.

Requiere tener configurado el secret `SONAR_TOKEN` en el repositorio de GitHub.

La configuración de SonarCloud se encuentra en el archivo:

```text
sonar-project.properties
```

---

### Job 4: `build` — Construcción y despliegue local

Este job solo se ejecuta si `sonar` pasó exitosamente.

Se encarga de:

* Limpiar contenedores anteriores.
* Construir la imagen Docker de la API.
* Levantar los servicios con Docker Compose.
* Verificar que los contenedores estén activos.
* Esperar a que la API inicie correctamente.
* Probar el endpoint principal con `curl.exe`.

Este job utiliza un self-hosted runner configurado en Windows, por lo que el despliegue se realiza de forma local en el computador donde está instalado el runner.

Configuración usada en el workflow:

```yaml
runs-on: [self-hosted, Windows, X64, local, docker]
```

---

## Self-hosted runner para despliegue local

Para cumplir con el despliegue local, se configuró un self-hosted runner de GitHub Actions en Windows.

Este runner permite que el job de construcción y despliegue se ejecute directamente en el computador local usando Docker Desktop.

Antes de ejecutar el pipeline, se debe verificar que:

1. Docker Desktop esté abierto y funcionando.
2. El runner esté iniciado desde PowerShell.

Comando para iniciar el runner:

```powershell
cd C:\actions-runner
./run.cmd
```

Cuando aparece el mensaje:

```text
Listening for Jobs
```

significa que el runner está conectado a GitHub y listo para recibir trabajos del pipeline.

---

## Cómo se garantiza la trazabilidad y calidad

### Trazabilidad

* **Historial de commits:** cada ejecución del pipeline queda asociada a un commit específico del repositorio.
* **Ejecuciones en GitHub Actions:** cada push o Pull Request genera una ejecución visible en la pestaña Actions.
* **Jobs encadenados con `needs`:** el orden explícito de ejecución permite saber en qué etapa falló o pasó el proceso.
* **Artefactos descargables:** el reporte de Snyk se almacena como artefacto en cada ejecución del pipeline.
* **Logs por job:** GitHub Actions permite revisar el detalle de cada etapa, incluyendo seguridad, pruebas, análisis de calidad y despliegue.
* **Ramas separadas:** el uso de `develop` y `main` permite diferenciar integración de código y versión estable.

### Calidad

* **Seguridad temprana:** el pipeline comienza con análisis de seguridad antes de construir o desplegar.
* **SCA con Snyk:** detecta vulnerabilidades en dependencias de terceros.
* **npm audit:** revisa vulnerabilidades conocidas en paquetes npm.
* **Pruebas unitarias con Jest:** validan el funcionamiento esperado de la API.
* **SAST con SonarCloud:** analiza problemas de calidad y mantenibilidad del código.
* **Docker:** asegura que la aplicación pueda ejecutarse en un contenedor.
* **Docker Compose:** permite orquestar la API y la base de datos en un entorno local simulado.
* **Self-hosted runner:** permite validar el despliegue local de forma automatizada desde GitHub Actions.

---

## Orquestación con Docker Compose

El archivo `docker-compose.yml` define dos servicios principales:

| Servicio | Imagen      | Puerto | Descripción         |
| -------- | ----------- | ------ | ------------------- |
| `db`     | mysql:8.0   | 3306   | Base de datos MySQL |
| `api`    | build local | 3000   | API Node.js         |

### Características de la orquestación

* **Servicio `api`:** contiene la aplicación Node.js.
* **Servicio `db`:** levanta una base de datos MySQL para simular un entorno con persistencia.
* **Red interna `evparcial-network`:** permite la comunicación entre los contenedores.
* **Volumen persistente `db_data`:** conserva los datos de MySQL aunque los contenedores se reinicien.
* **Variables de entorno:** la API recibe los datos de conexión a la base de datos mediante variables.
* **Restart policy:** `unless-stopped` permite reiniciar servicios si se detienen inesperadamente.
* **Límites de recursos:** se definen límites de CPU y memoria para evitar consumo excesivo del host.
* **Despliegue local automatizado:** Docker Compose es ejecutado desde el pipeline usando el self-hosted runner.

### Comandos principales

```bash
# Levantar el stack completo
docker compose up -d --build

# Ver estado de los contenedores
docker compose ps

# Ver logs en tiempo real de la API
docker compose logs -f api

# Ver contenedores activos
docker ps

# Detener sin eliminar datos
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

---

## Contenerización con Docker

El proyecto incluye un `Dockerfile` para construir la imagen de la API Node.js.

La imagen utiliza Node.js sobre Alpine, lo que permite trabajar con una base liviana. Además, se copian las dependencias y el código de la aplicación para ejecutar el microservicio dentro del contenedor.

Comando para construir la imagen manualmente:

```bash
docker build -t evparcial-api .
```

---

## Dependabot

El proyecto incluye configuración de Dependabot en:

```text
.github/dependabot.yml
```

Dependabot revisa semanalmente:

* Dependencias de npm.
* Acciones de GitHub Actions.
* Imágenes Docker.

Esto ayuda a mantener el proyecto actualizado y a reducir riesgos de seguridad por dependencias antiguas.

---

## Secrets requeridos en GitHub

Los secrets deben configurarse en:

```text
Settings → Secrets and variables → Actions
```

| Secret        | Descripción                    | Dónde obtenerlo      |
| ------------- | ------------------------------ | -------------------- |
| `SNYK_TOKEN`  | Token de autenticación de Snyk | Cuenta de Snyk       |
| `SONAR_TOKEN` | Token de SonarCloud            | Cuenta de SonarCloud |

---

## Estructura del proyecto

```text
EvParcial/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── dependabot.yml
├── tests/
│   └── app.test.js
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
├── package-lock.json
├── README.md
└── sonar-project.properties
```

---

## Instalación y ejecución local

### Instalar dependencias

```bash
npm install
```

### Ejecutar la API localmente

```bash
npm start
```

### Ejecutar pruebas

```bash
npm test
```

### Ejecutar análisis de vulnerabilidades

```bash
npm audit
```

---

## Ejecución con Docker Compose

Para levantar la aplicación completa con Docker Compose:

```bash
docker compose up -d --build
```

Para verificar los contenedores:

```bash
docker ps
```

Para probar la API:

```bash
curl http://localhost:3000/
```

Para detener los contenedores:

```bash
docker compose down
```

---

## Evidencia de funcionamiento

El pipeline fue ejecutado correctamente en GitHub Actions, completando las siguientes etapas:

* Seguridad con Snyk y npm audit.
* Pruebas unitarias con Jest.
* Análisis de calidad con SonarCloud.
* Construcción de imagen Docker.
* Despliegue local con Docker Compose usando self-hosted runner.

El resultado final del pipeline fue exitoso, demostrando que la API puede ser validada, analizada, contenerizada y desplegada automáticamente.

---
