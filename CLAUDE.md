# Azenza

Sitio de Azenza, una consultora de profesionalización de negocios. Tiene una
landing pública y **Azenza IA**: una auditoría de marca que cruza la estrategia
declarada por el usuario (3 preguntas de texto) con una captura de su perfil de
Instagram/Facebook, y devuelve un informe generado por GPT.

## Stack

- **Frontend:** React 19 + Vite, React Router 7, Bootstrap 5 (por CDN) + CSS propio, Font Awesome 6. Desplegado en Netlify.
- **Backend:** Node + Express 5 (ESM), Multer (imágenes en memoria), SDK de OpenAI (`gpt-5-mini`). Desplegado en Render.
- **Base de datos:** PostgreSQL en Neon, con Prisma como ORM.
- **Auth:** sesiones de `express-session` guardadas en Postgres (`connect-pg-simple`), contraseñas con bcrypt.

## Comandos

```bash
# Backend (desde backend/)
node src/app.js                      # levantar servidor (puerto 3000)
npx prisma migrate dev --name <nombre>   # crear y aplicar migración
npx prisma studio                    # inspeccionar la base

# Frontend (desde frontend/)
npm run dev                          # Vite (puerto 5173)
npm run build
npm run lint
```

## Arquitectura

**Backend** — `app.js` monta CORS (con `credentials: true`), `express.json`,
`cookie-parser`, el middleware de sesión, y después las rutas.
Flujo por capas: `routes/` → `middlewares/` → `controllers/` → `services/`.

- `POST /api/analyze` — requiere sesión. Cadena: `requireAuth` → `rateLimitMiddleware` → `upload.single("image")` → controller. El controller pasa la imagen a base64 y llama a `openai.service.js`, que devuelve JSON estructurado (`profileAnalysis`, `visualIdentity`, `contentStrategy`, `overallSummary`).
- `/api/auth/*` — registro, login, logout, `me`, edición de perfil y cambio de contraseña. Ver `AUTENTICACION.md`.
- El rate limit (3 análisis por día, 10 intentos de login cada 15 min) es **en memoria**, se pierde al reiniciar el servidor. Si hace falta que sobreviva o escalar a varias instancias, hay que moverlo a la base o a Redis.

**Frontend** — `AuthProvider` (en `context/`) consulta `/api/auth/me` al montar
y expone `user`, `cargando` y las acciones de auth. `ProtectedRoute` envuelve
`/analisis`, `/loading`, `/results` y `/perfil`; si no hay sesión redirige a
`/login` guardando el destino en `location.state.from`.

La landing (`/`, `/inicio`) es pública a propósito: cualquiera puede leer la
propuesta, pero para usar el análisis hay que estar logueado.

El estado del análisis viaja entre pantallas por `location.state` de React
Router (`navigate('/results', { state: { results } })`), no hay store global.

## Convenciones

- **Todo en castellano rioplatense**: nombres de variables, funciones, comentarios, textos de UI y mensajes de error. Los nombres de la API y los campos que consume el modelo quedan en inglés (`problem`, `diff`, `target`, `score`, `positives`...).
- **Indentación de 4 espacios** en JS/JSX y CSS.
- Componentes exportados como **named exports** (`export function Header()`), no default. La excepción es `App.jsx`.
- **Todo el CSS vive en `frontend/src/App.css`**, en un solo archivo con secciones separadas por comentarios de banner. No hay CSS modules ni styled-components. Antes de escribir estilos nuevos, reutilizar las variables de `:root` (paleta teal, `--radius-*`, `--transition`) y las clases utilitarias `.glass-panel`, `.text-gradient`, `.reveal`.
- Las animaciones de entrada se hacen con la clase `.reveal` + un `IntersectionObserver` que agrega `.visible`.
- Se mezclan clases de Bootstrap con clases propias; está bien, pero para componentes nuevos preferir las propias.
- `frontend/.env` usa el prefijo `VITE_` (`VITE_BACKEND_URL`). Los `.env` están gitignoreados; `backend/.env.example` documenta las variables.

## Cuidado con esto

- `app.js` arranca con `import "dotenv/config"` **como primer import**. No cambiarlo por `dotenv.config()` en el cuerpo: varios módulos (OpenAI, sesiones) leen `process.env` al importarse, o sea antes de que corra el cuerpo del archivo.
- En producción la cookie de sesión necesita `secure: true` + `sameSite: "none"` porque Netlify y Render están en dominios distintos. Eso lo activa `NODE_ENV=production`, y depende de `app.set("trust proxy", 1)`. Si el login "no persiste" en producción, mirar ahí primero.
- Nunca devolver `passwordHash` al frontend: los controllers pasan por el helper `publicUser()`.
- El límite de 150 caracteres por campo del formulario está validado en el frontend; el backend sólo verifica que los campos no estén vacíos.

## Convención de commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance opcional>): <descripción corta en imperativo>

<cuerpo opcional: por qué, no qué>
```

- **Tipos** (en inglés, para que los reconozcan las herramientas): `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`.
- **Descripción y cuerpo**: en castellano rioplatense, como el resto del proyecto.
- **Alcance**: opcional, nombra el área afectada (`auth`, `prisma`, `ui`, `inicio`).

Ejemplos:

```
feat(auth): agregar registro, login y edición de perfil con sesiones
fix(prisma): sincronizar versiones de prisma y @prisma/client
style(ui): agregar botón para mostrar/ocultar contraseña
```

## Estado y próximos pasos

Funcionando: landing, auth completa (registro / login / perfil editable / cambio
de contraseña), análisis protegido por sesión.

Ideas pendientes, ninguna empezada:

- Guardar el historial de análisis por usuario (hay un modelo `Analysis` comentado en `prisma/schema.prisma` listo para descomentar).
- Recuperación de contraseña por email.
- Los enlaces del footer a "Política de privacidad" y "Términos de uso" son `href="#"`.
- El formulario de análisis usa `alert()` para validar; convendría pasarlo a mensajes en la UI como en `Login.jsx` y `Registro.jsx`.
