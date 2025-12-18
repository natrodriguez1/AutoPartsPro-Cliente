# ---- Build del frontend ----
FROM node:20-bullseye AS build
WORKDIR /web

COPY package*.json ./
RUN npm ci

COPY . .
# Construye (Vite o CRA)
RUN npm run build

# Normalizamos la salida a /web/_site
# - Vite por defecto: dist/
# - CRA: build/
RUN if [ -d "dist" ]; then \
      mv dist _site; \
    elif [ -d "build" ]; then \
      mv build _site; \
    else \
      echo "❌ No se encontró carpeta de salida (dist/ ni build/). Contenido actual:" && ls -la && exit 1; \
    fi

# ---- Imagen final Nginx ----
FROM nginx:1.27-alpine
COPY --from=build /web/_site/ /usr/share/nginx/html/
# Si usas proxy a /api y /agent, asegúrate de copiar también tu default.conf
# COPY nginx.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
