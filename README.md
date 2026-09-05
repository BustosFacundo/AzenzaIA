# Azenza

Sitio de Azenza, una consultora de profesionalización de negocios. Incluye una
landing pública y **Azenza IA**: una auditoría de marca que cruza la estrategia
declarada por el usuario (tres preguntas de texto) con una captura de su perfil
de Instagram/Facebook, y devuelve un informe generado con GPT.

## Funcionalidades

- Landing pública con la propuesta de valor de Azenza.
- **Azenza IA**: análisis de marca protegido por sesión, con límite de 3 análisis
  por día por usuario.
- Autenticación completa: registro, login, perfil editable y cambio de
  contraseña.

## Stack

| Capa            | Tecnología |
|-----------------|------------|
| Frontend        | React 19 + Vite, React Router 7, Bootstrap 5 + CSS propio, Font Awesome 6 |
| Backend         | Node + Express 5 (ESM), Multer, SDK de OpenAI |
| Base de datos   | PostgreSQL (Neon) con Prisma como ORM |
| Autenticación   | `express-session` persistida en Postgres (`connect-pg-simple`), contraseñas con bcrypt |
| Despliegue      | Frontend en Netlify, backend en Render |

## Estructura del repositorio

```
azenza/
├── backend/
│   ├── prisma/          # schema.prisma y migraciones
│   └── src/
│       ├── config/      # conexión a la base y configuración de sesión
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── services/    # integración con OpenAI
└── frontend/
    └── src/
        ├── components/
        ├── context/     # AuthProvider / AuthContext
        └── pages/
```

## Requisitos previos

- Node.js 18 o superior
- Una base de datos Postgres (el proyecto usa [Neon](https://neon.tech))
- Una API key de OpenAI

## Puesta en marcha

### Backend

```bash
cd backend
npm install
cp .env.example .env   # completar DATABASE_URL, SESSION_SECRET y OPENAI_API_KEY
npx prisma migrate dev
node src/app.js
```

El servidor levanta en `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
echo "VITE_BACKEND_URL=http://localhost:3000" > .env
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts disponibles

```bash
# Backend (desde backend/)
node src/app.js                        # levantar el servidor
npx prisma migrate dev --name <nombre> # crear y aplicar una migración
npx prisma studio                      # inspeccionar la base

# Frontend (desde frontend/)
npm run dev      # servidor de desarrollo (Vite)
npm run build    # build de producción
npm run lint     # ESLint
```

## Convenciones del proyecto

- Todo el código, comentarios y textos de UI están en castellano rioplatense.
  Los campos que consume el modelo de IA quedan en inglés (`problem`, `diff`,
  `target`, `score`, `positives`...).
- Indentación de 4 espacios en JS/JSX y CSS.
- Componentes exportados como named exports (`export function Header()`),
  salvo `App.jsx`.
- Todo el CSS vive en un único archivo, `frontend/src/App.css`.

## Convención de commits

Se usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance opcional>): <descripción corta en imperativo>

<cuerpo opcional: por qué, no qué>
```

- **Tipos** (en inglés): `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`.
- **Descripción y cuerpo**: en castellano rioplatense.
- **Alcance**: opcional, nombra el área afectada (`auth`, `prisma`, `ui`, `inicio`).

Ejemplo:

```
feat(auth): agregar registro, login y edición de perfil con sesiones
```
