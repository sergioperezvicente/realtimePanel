# Instalación en Windows

Guía paso a paso para instalar y ejecutar realtimePanel en **entornos Windows 10/11**.



## 1. Requisitos previos

* **Git for Windows** → [descargar](https://git-scm.com/download/win)
* **Node.js v18+** (LTS recomendado) → [descargar](https://nodejs.org/en/download)
* **npm** (incluido con Node.js)
* **Docker Desktop para Windows** (opcional pero recomendado) → [descargar](https://www.docker.com/products/docker-desktop/)

  * Si no deseas usar Docker, es **necesario instalar PostgreSQL localmente** para ejecutar la aplicación.
* (Opcional) **Windows Terminal** o **PowerShell 7**

> ⚠️ `nvm` no es común en Windows, pero existe [nvm-windows](https://github.com/coreybutler/nvm-windows) si quieres gestionar versiones de Node.js.




## 2. Clonar el repositorio

>Primero situese en la carpeta donde quiere descargar el proyecto. Una vez dentro:

```powershell
git clone https://github.com/sergioperezvicente/realtimePanel.git
cd realtimePanel
```



## 3. Estructura inicial del proyecto

```
/ (root)
├─ realtimepanel-api/       # Backend NestJS
├─ realtimepanel-app/       # SPA Angular 20
├─ docs/                    # Documentación
```



## 4. Instalación de dependencias

### Backend (NestJS)

```powershell
cd realtimepanel-api
npm install
```

### Frontend (Angular 20)

```powershell
cd ../realtimepanel-app
npm install
```



## 5. Configuración de la base de datos y entorno

Vuelva al directorio de la api y copia la plantilla de variables de entorno:

```powershell
cd ../realtimepanel-api
copy .env.example .env
```

Edita el archivo `.env` para configurar la base de datos y parámetros de la aplicación. **Usa valores reales reemplazando los placeholders indicados entre corchetes** (`[valor]`):

```ini
# CONFIGURACIÓN DEL USER ROOT DE LA INSTANCIA POSTGRES 
PG_HOST=localhost
PG_PORT=5432
PG_ROOT_USER=postgres
PG_ROOT_PASSWORD=[tu_password_root_aqui]

# CONFIGURACIÓN DE LA BASE DE DATOS QUE USARÁ LA APLICACIÓN
APP_DB_NAME=realtimepanel
APP_DB_USER=app_user
APP_DB_PASSWORD=[tu_password_app_aqui]

# CONFIGURACIÓN DEL PUERTO Y URL DE LA API
PORT=3000
API_URL=http://localhost:3000

# CONFIGURACIÓN DEL JWT PARA AUTENTICACIÓN
JWT_SEED=[tu_valor_jwt_aqui]
```

**Notas importantes:**
- Los corchetes `[ ]` indican **placeholders** que deben ser reemplazados con tus valores reales.
- `PG_ROOT_PASSWORD` es únicamente para la creación inicial de la base de datos.
- `APP_DB_USER` y `APP_DB_PASSWORD` son las credenciales que usará la aplicación para conectarse.
- `JWT_SEED` debe ser un valor seguro y único para tu entorno.
- Si usas Docker Desktop, el `PG_HOST` será el nombre del servicio definido en `docker-compose.dev.yml` (ej. `db`).

- Para levantar la base de datos con Docker:

```powershell
docker compose -f docker-compose.dev.yml up -d
```




## 6. Arranque de la aplicación

>Desde el raiz del proyecto:

* **Backend:**

```powershell
cd realtimepanel-api
npm run start
```

* **Frontend:**

```powershell
cd realtimepanel-app
npm run start
```

* Accede a la SPA en [http://localhost:4200](http://localhost:4200) y al backend en [http://localhost:3000](http://localhost:3000).


## 7. Login

> ⚠️ Actualmente tiene seteado en el formulario de login el usuario y contraseña del usuario administrador.

`Nota!` Cuando se levanta la api por primera vez y se conecta con la base de datos, se chequea que no hay usuarios... Seguidamente se crean dos usuarios:

>admin@admin.com con la password `admin1234`

>user@user.com con la password `user1234`


## 8. Próximos pasos

Una vez que la aplicación esté en funcionamiento, puedes:

* Abrir dos ventanas del navegador y iniciar sesión con distintos usuarios para probar el **chat en tiempo real**.
* Acceder al **estado del servidor** y probar a añadir, borrar o editar usuarios, observando cómo se actualizan las vistas de todos los usuarios en tiempo real.
* Conceder los permisos necesarios a los usuarios para que puedan realizar acciones de administración y edición.
* Explorar todas las funcionalidades de **chat y monitorización**.
* Seguir la guía de instalación en **Linux** si deseas configurar la aplicación en otro entorno.


> ⚠️ El acceso a la terminal del servidor desde la app es un privilegio de los usuarios admin, NO de los usuarios. Acceda al menu configuración (siendo usuario admin) para poder activarla e interactue con otros usuarios.

