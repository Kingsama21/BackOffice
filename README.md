# BackOffice - Gestor de Proyectos

Un gestor de proyectos web con autenticación JWT integrada con la **Portfolio API** de la maestra.

## 🎯 Características

✅ **Autenticación segura**
- Registro de nuevos usuarios (con validación de Itson ID)
- Inicio de sesión con JWT
- Tokens almacenados en localStorage
- Cierre de sesión seguro

✅ **CRUD completo de proyectos**
- Crear proyectos (título, descripción, tecnologías, repositorio)
- Listar proyectos del usuario autenticado
- Editar proyectos existentes
- Eliminar proyectos con confirmación

✅ **Interfaz responsiva**
- Diseño moderno y adaptable
- Fondo personalizado (background.jpg)
- Formularios validados
- Mensajes de error claros

✅ **Rutas protegidas**
- Solo usuarios autenticados pueden acceder a Home
- Redirección automática a Login si no hay token válido
- Token requerido en todos los endpoints de proyectos

## 📁 Estructura del Proyecto

```
BackOffice/
├── index.html                # (Opcional) Página de bienvenida
├── Login.html               # Página de inicio de sesión
├── Register.html            # Página de registro
├── Home.html                # Panel principal (CRUD de proyectos)
├── services.js              # Funciones centralizadas para API
├── background.jpg           # Imagen de fondo
├── Styles/
│   ├── Login.css           # Estilos de Login
│   ├── Register.css        # Estilos de Register
│   ├── Home.css            # Estilos de Home
│   └── styles.css          # (Opcional) Estilos globales
└── README.md               # Este archivo
```

## 🚀 Cómo usar

### 1. Abrir localmente (desarrollo)

```bash
# Abrir directamente en navegador
# Desde Windows PowerShell en la carpeta del proyecto:
Start-Process .\Login.html

# O simplemente arrastra cualquier HTML al navegador
```

### 2. Flujo de uso

1. **Registro**
   - Abre `Register.html` o ve desde el enlace en Login
   - Completa: Nombre, Email, Itson ID (6 dígitos), Contraseña
   - El sistema usa los últimos 6 dígitos si tu Itson ID es más largo
   - Se registra en la API y redirige automáticamente a Login

2. **Login**
   - Ingresa tu Email y Contraseña
   - El token se guarda automáticamente en localStorage
   - Eres redirigido a Home

3. **Gestión de Proyectos** (en Home)
   - **Listar**: Ver todos tus proyectos
   - **Crear**: Haz clic en "+ Nuevo Proyecto"
   - **Editar**: Haz clic en el botón "✏️ Editar"
   - **Eliminar**: Haz clic en "🗑️ Eliminar" (requiere confirmación)

4. **Cerrar sesión**
   - Haz clic en "Cerrar sesión" en la esquina superior derecha
   - Tu token se limpia y eres redirigido a Login

## 🔌 API Endpoints (Portfolio API)

**Base URL:** `https://portfolio-api-three-black.vercel.app/api/v1`

### Autenticación
- `POST /auth/register` — Registrar usuario
- `POST /auth/login` — Iniciar sesión (devuelve token)

### Proyectos (requieren `auth-token` en headers)
- `GET /projects` — Obtener tus proyectos
- `POST /projects` — Crear proyecto
- `PUT /projects/:projectId` — Actualizar proyecto
- `DELETE /projects/:projectId` — Eliminar proyecto

## 🛠️ Tecnologías

- **HTML5** — Estructura
- **CSS3** — Estilos responsivos
- **Vanilla JavaScript** — Lógica y API calls
- **Fetch API** — Comunicación con backend
- **localStorage** — Almacenamiento de token y usuario

## 📝 Notas importantes

### Token y Seguridad
- El token JWT se almacena en `localStorage.authToken`
- Es enviado automáticamente en el header `auth-token` para todas las peticiones protegidas
- Al cerrar sesión, se elimina automáticamente

### Validaciones
- Email: validación básica de formato
- Itson ID: máximo 11 dígitos (se usan últimos 6)
- Contraseña: mínimo 6 caracteres (según API)
- Proyectos: título y descripción requeridos

### Limitaciones actuales
- Los proyectos solo pueden ser creados si el usuario está correctamente registrado en la API
- No hay límite de proyectos por usuario
- Las imágenes de proyectos deben ser URLs (no se pueden subir archivos)

## 🌐 Publicar en GitHub Pages

### Opción 1: Usando rama `gh-pages`

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kingsama21/BackOffice.git
cd BackOffice

# 2. Crear rama gh-pages
git checkout --orphan gh-pages

# 3. Agregar y hacer commit
git add .
git commit -m "Deploy to GitHub Pages"

# 4. Empujar a GitHub
git push origin gh-pages
```

### Opción 2: Usar rama `main` (si ya existe)

```bash
# En el repositorio de GitHub:
# 1. Ve a Settings → Pages
# 2. En "Source", selecciona "Deploy from a branch"
# 3. Rama: `main` | Carpeta: `/ (root)`
# 4. Guarda

# Tu sitio estará en: https://kingsama21.github.io/BackOffice
```

### Opción 3: Usar carpeta `docs` (si prefieres)

```bash
# 1. Crear carpeta docs y copiar archivos
mkdir docs
cp *.html docs/
cp -r Styles docs/
cp *.js docs/
cp *.jpg docs/

# 2. Commit y push
git add docs/
git commit -m "Add docs folder for GitHub Pages"
git push origin main

# 3. En Settings → Pages: selecciona `docs` como source
```

### Después de publicar
- Tu sitio estará disponible en: `https://kingsama21.github.io/BackOffice`
- Los cambios pueden tardar 1-2 minutos en verse
- Asegúrate de que `background.jpg` y todos los archivos estén incluidos

## ⚙️ Configuración local

### Cambiar API Base (opcional)

Si necesitas usar una API diferente, edita `services.js`:

```javascript
const API_BASE = "https://tu-api-aqui/api/v1";
```

### Cambiar tema/colores

Edita los archivos `Styles/*.css`:
- `--primary`: color azul principal
- `--muted`: colores de texto secundario
- Estilos de botones, inputs, etc.

## 🐛 Depuración

### Abrir Developer Tools
```
Windows/Linux: F12 o Ctrl+Shift+I
Mac: Cmd+Option+I
```

### Revisar token y usuario
```javascript
// En la consola:
localStorage.getItem('authToken')
JSON.parse(localStorage.getItem('user'))
```

### Ver peticiones de API
- DevTools → Network → Selecciona petición → ve Response y Status

## 📧 Contacto / Soporte

- **Maestra (API):** Contactar para arreglar errores del backend
- **Este proyecto:** https://github.com/Kingsama21/BackOffice

## 📄 Licencia

Proyecto educativo. Libre de usar y modificar.

---

**Última actualización:** Diciembre 2025  
**Estado:** En desarrollo (Fase 3)
