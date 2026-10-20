# Proyecto_TFG_LAB
Proyecto de fin de grado del ciclo de Desarrollo de Aplicaciones Web, consistente en una aplicación web educativa sobre ciberseguridad. La plataforma permite al usuario explorar distintos tipos de vulnerabilidades web, comprender cómo funcionan y aprender a explotarlas mediante ejemplos prácticos, todo dentro de un entorno controlado y seguro.

El objetivo principal es concienciar sobre algunas de las vulnerabilidades más comunes en aplicaciones web actuales, muchas de ellas evitables con buenas prácticas de desarrollo y un control riguroso del código.

La aplicacion va dirigida a estudiantes de desarrollo de aplicaciones web, ciberseguridad, y en general para las personas que quieran introducirse en el mundo de la seguridad de la informacion en entornos en red.

- Las instrucciones de instalación básicas son las siguientes:

1.	Verificar que Node esta instalado abriendo un terminal y ejecutando node --version , donde debería  mostrar Versión 18.0.0 o superior.
2.	Clonar el repositorio desde la terminal de vscode con el comando git clone https://github.com/Javip1991/Proyecto_TFG_LAB
3.	Acceder a la carpeta del repositorio a traves del comando cd Proyecto_TFG_LAB.
4.	Instalar las dependencias con npm install.
5.	Crear el fichero de variables de entorno copiando la plantilla cp .env.example .env
6.	Editar el archivo .env con los valores correctos.
7.	Arrancar el servidor con npm run dev.
8.	Abrir el navegador y acceder a la direccion https://localhost:3000. Deberia aparecer la pagina principal de CYBERLAB.

- Requisitos mínimos del sistema y dependencias:

•	Procesador: cualquier CPU moderna de 64 bits.
•	RAM: 512 minimo, 1GB recomendado.
•	Espacio en el disco: 200MB para la aplicación y dependencias

- Requisitos de software:

•	Sistema operativo: Windows 10/11, macOS 12 o superior, o cualquier distribución de Linux moderna.
•	Node.js versión 8 o superior.
•	Npm versión 8 o superior (se instala junto a Node.js).
•	Git (para clonar el repositorio).
•	Navegador web moderno: Chrome 90+, Firefox 88+, Edge 90+ o Safari14+.
•	Conexion a internet active durante la ejecución, ya que la base de datos esta alojada en Neon (PostgreSQL en la nube) y React se carga desde CDN. 

- Dependencias principales del proyecto (Instaladas automáticamente con npm install):

•	Express
•	Ejs
•	Sequelize
•	pg (driver de postgreSQL para Node.js, requerido por Sequelize para conexión con Neon)
•	pg-hstore (Serialización de objetos JSON para PostgreSQL)
•	bcrypt
•	jsonwebtoken
•	axios
•	helmet
•	express-session
•	express-rate-limit
•	dotenv

- Configuración necesaria:

La configuración necesaria explica que valores hay que configurar antes de lanzar la aplicación y que significa cada uno. La aplicación necesita un archivo .env en la raíz del proyecto con las siguientes variables:

•	PORT: es el puerto en el que escuchará el servidor. Por defecto será el 3000 pero si esta ocupado se puede cambiar por otro libre.
•	DB_NAME: nombre de la base de datos creada en Neon.
•	DB_USER: nombre del usuario de la base de datos de Neon.
•	DB_PASS: cadena secreta para firmar las cookies de sesión. Debe ser larga y aleatoria.
•	DB_HOST: dirección del servidor de Neon donde está alojada la base de datos.
•	DB_PORT: puerto en el que se encuentra alojada la base de datos de la aplicación.
•	JWT_SECRET: clave secreta para firmar los tokens JWT del laboratorio. En el laboratorio se usa una clave débil intencionadamente para demostrar la vulnerabilidad del algoritmo none.
•	DATABASE_URL: cadena de conexión completa proporcionada por Neon. Se obtiene desde el panel de Neon en “Conecction Details”. Incluye usuario, contrraseña, host, nombre de la base de datos y el parámetro sslmode=none obligatorio para conectar con Neon de forma segura.

- Configuración de Sequelize con Neon:
La conexión con Neon requiere que SSL este habilitado explícitamente en la configuración de Sequelize. En el fichero config/database.js debe estar configurado de la siguiente forma:
 
- Planes de contingencia (que hacer si algo falla):

Problema 1: El servidor no arranca – error de puerto ocupado
-	Síntoma: aparece un mensaje de error referido al puerto.
-	Solución: Cambiar el valor de PORT en el fichero .env a otro puerto disponible, por ejemplo el 3001, y volver a lanzar la aplicación.

Problema 2: Error de conexión con Neon
-	Síntoma: aparece el mensaje SequelizeConnectionError o connection refused al arrancar el servidor.
-	Solucion: verificar los siguientes puntos en orden:
o	Comprobar que la variable DATABASE_URL en el fichero .env es correcta y esta completa, incluyendo ?sslmode_require al final.
o	Verificar que hay conexión a internet activa, ya que Neon es una base de datos en la nube.
o	Acceder al panel de Neon en https://console.neon.tech y comprobar que el proyecto esta activo y no suspendido. Neon suspende automáticamente los proyectos inactivos en el plan gratuito. Basta con acceder al panel para reactivarlo.
o	Verificar que SSL esta correctamente coonfigurado en config/database.js con rejectUnauthorized: false.

Problema 3: La tabla lab_sqli_users no existe o esta vacia:
-	Síntoma: el laboratorio de SQL Injection da error o no muestra los resultados al hacer Login.
-	Solución: Sequelize sincroniza y crea la tabla automáticamente al arrancar el servidor mediante sequelize.sync(). Si la tabla no se ha creado, revisar que la conexión con Neon es correcta y que en server.js se llama a sequelize.sync() antes de que el servidor empiece a escuchar peticiones. Si la tabla existe pero esta vacía, verificar que el seed de datos de prueba se ejecuta correctamente al arrancar.

Problema 4: Error al instalar dependencias con npm install:
-	Síntoma: errores durante la instalación, especialmente bcrypt que requiere compilación nativa, o en pg que necesita librerías del sistema.
-	Solución: verificar que la versión de Node.js sea 18 o superior con node --version. En Windows puede ser necesario instalar las herramientas de compilación, y en Linux asegurarse de tener instalado build-essential con apt install build-essential.

Problema 5: El diccionario React no carga:
-	Síntoma: La pagina del diccionario no aparece o aparece en blanco.
-	Solución: Verificar la conexión a internet, ya que React carga desde CDN de Cloudflare y sin conexión activa aparecerá vacio o en blanco.

Problema 6: El modo vulnerable/seguro no se mantiene entre paginas:
-	Síntoma: al cambiar de modo en un laboratorio y navegar a otra pagina, el modo vuelve al estado por defecto.
-	Solución: verificar que SESSION_SECRET esta correctamente definido y que el middleware de sesiones esta cargado antes que los routers en app.js.

Problema 7: Neon suspende la base de datos durante una demostración:
-	Síntoma: La aplicación deja de responder o muestra errores de conexión de forma inesperada durante el uso normal.
-	Solución: esto ocurre en el plan gratuito de Neon cuando la base de datos lleva varios minutos sin actividad. La reactivación es automática en cuanto llega una nueva petición, aunque puede tardar entre 1 y 3 segundos. Si esto ocurre, también se puede recargar la pagina para arreglar el problema. 


