# EvParcial

Hemos decidido implementar **GitFlow** para este proyecto. 

**Justificación:** GitFlow nos permite tener un entorno de desarrollo seguro colaborativo. Al separar el código estable en `main`, el código en integración en `develop`, y trabajar las nuevas funcionalidades en ramas `feature/`, evitamos romper el trabajo del otro compañero. Además, el uso de ramas `hotfix/` nos da agilidad para solucionar errores críticos en producción sin interferir con el desarrollo diario.

Estructura de ramas
main: contiene la versión estable del proyecto
develop: contiene los cambios en desarrollo
feature/*: nuevas funcionalidades
fix/*: corrección de errores detectados durante el desarrollo
hotfix/*: correcciones urgentes en producción

Funcionalidades implementadas

Feature 1:
Mejora en el endpoint /saludo/:nombre, permitiendo personalizar el mensaje de bienvenida.

Feature 2:
Mejora del mensaje principal en la ruta /, agregando una versión más descriptiva.

Fix:
Corrección de errores en la funcionalidad de saludo donde los cambios no se reflejaban correctamente.

Hotfix:
Actualización del mensaje principal en producción para mejorar la salida final del sistema.

Convenciones de commits

Se utilizan mensajes estructurados para identificar los cambios:

feat: nueva funcionalidad
fix: corrección de errores

Ejemplos:

feat: mejora saludo principal
fix: corrige error en endpoint de saludo

Naming de ramas

Se sigue una estructura basada en GitFlow:

feature/nombre-descriptivo
fix/nombre-del-error
hotfix/nombre-del-arreglo

Ejemplos:

feature/mejora-hola-principal
fix/error-saludo
hotfix/mensaje-final

Flujo de trabajo
Se crea una rama desde develop para nuevas funcionalidades.
Se desarrollan los cambios en la rama feature/.
Se crea un Pull Request hacia develop.
Se revisa el código y se realiza el merge.
Para errores, se utiliza una rama fix/ basada en la feature correspondiente.
Para errores críticos, se crea una rama hotfix/ desde main y se mergea directamente a esta.

Estrategia de revisión
Todos los cambios se realizan mediante Pull Request.
Se verifica el funcionamiento del código antes de hacer merge.
Se prueban los endpoints en navegador o herramientas como Postman.
Se asegura que el código esté estable antes de integrarlo en develop o main.

GitHub Actions

Se configuró una acción automática que se ejecuta en:

Cada push a la rama develop
Cada Pull Request hacia main