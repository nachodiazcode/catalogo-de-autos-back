# 🚀 API Catálogo de Autos

## 📌 Descripción
Esta API permite gestionar un catálogo de autos con funcionalidades como:
✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar autos).
✅ **Búsqueda avanzada** por marca, región, tipo de carrocería y precio.
✅ **Documentación interactiva** con Swagger.
✅ **Registro de logs en consola** con colores personalizados.

---

## 📦 Instalación

Clona el repositorio y accede al proyecto:
```bash
git clone https://github.com/usuario/catalogo-de-autos.git
cd catalogo-de-autos
```
Instala las dependencias necesarias:
```bash
npm install
```

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto y añade lo siguiente:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/autosDB
```

---

## 🚀 Ejecución

Para iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

Para iniciar en producción:
```bash
npm start
```

---

## 📖 Documentación con Swagger

Puedes acceder a la documentación completa de la API en:
```
http://localhost:5000/api-docs
```
Aquí podrás probar los endpoints directamente desde el navegador.

---

## 🛠 Endpoints Principales

### **1️⃣ Obtener todos los autos**
📌 **GET** `/api/autos`

#### **Ejemplo de respuesta:**
```json
[
  {
    "_id": "67808878f09034e6067385b3",
    "marca": "Toyota",
    "region": "Santiago",
    "tipoCarroceria": "SUV",
    "precio": 20000
  }
]
```

---

### **2️⃣ Buscar autos con filtros avanzados**
📌 **GET** `/api/autos/buscar?marca=Toyota&region=Santiago&tipoCarroceria=SUV&precio=5000`

#### **Ejemplo de respuesta:**
```json
[
  {
    "_id": "67808878f09034e6067385b3",
    "marca": "Toyota",
    "region": "Santiago",
    "tipoCarroceria": "SUV",
    "precio": 20000
  }
]
```

---

### **3️⃣ Obtener un auto por ID**
📌 **GET** `/api/autos/{id}`

#### **Ejemplo de respuesta:**
```json
{
  "_id": "67808878f09034e6067385b3",
  "marca": "Toyota",
  "region": "Santiago",
  "tipoCarroceria": "SUV",
  "precio": 20000
}
```

---

### **4️⃣ Crear un nuevo auto**
📌 **POST** `/api/autos`

#### **Ejemplo de solicitud:**
```json
{
  "marca": "Tesla",
  "region": "Santiago",
  "tipoCarroceria": "Eléctrico",
  "precio": 50000
}
```

#### **Ejemplo de respuesta:**
```json
{
  "_id": "67835f849f02af3b82ed477b",
  "marca": "Tesla",
  "region": "Santiago",
  "tipoCarroceria": "Eléctrico",
  "precio": 50000
}
```

---

### **5️⃣ Actualizar un auto**
📌 **PUT** `/api/autos/{id}`

#### **Ejemplo de solicitud:**
```json
{
  "precio": 52000
}
```

#### **Ejemplo de respuesta:**
```json
{
  "_id": "67835f849f02af3b82ed477b",
  "marca": "Tesla",
  "region": "Santiago",
  "tipoCarroceria": "Eléctrico",
  "precio": 52000
}
```

---

### **6️⃣ Eliminar un auto**
📌 **DELETE** `/api/autos/{id}`

#### **Ejemplo de respuesta:**
```json
{
  "message": "Auto eliminado correctamente"
}
```

---

## 🖥 Tecnologías Usadas
✅ **Node.js + Express** - Para la creación del backend.
✅ **MongoDB + Mongoose** - Para la base de datos.
✅ **Swagger** - Documentación de la API.
✅ **Winston + Chalk** - Logs personalizados en consola.
✅ **Helmet + Compression + CORS** - Seguridad y optimización.

---

## 🛠 Próximas Mejoras
🚀 **Autenticación con JWT**
🚀 **Filtros avanzados (año, combustible, transmisión, etc.)**
🚀 **Paginación y ordenamiento de resultados**
🚀 **Subida de imágenes con Multer**

---

## 🤝 Contribuir
Si quieres mejorar esta API, haz un **fork** del repositorio y crea un **Pull Request** con tus cambios. 😃

```bash
git checkout -b feature/nueva-funcionalidad
git commit -m "Agrega nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

---

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

---

🚀 **Hecho con ❤️ para una API extremadamente pro** 🚀
