# 🛒 Admin Ecommerce – Panel de Administración

Panel de administración del sistema **Ecommerce**, desarrollado en **Angular**, que permite gestionar configuraciones, servicios, empresas, credenciales y URLs utilizadas por el sistema.

Este proyecto corresponde al **frontend administrativo** del ecommerce.

---

## 🚀 Tecnologías

- Angular
- TypeScript
- SCSS
- Bootstrap / Ng-Bootstrap
- Node.js (API)
- MySQL
- Git / GitHub

---

## 📦 Funcionalidades

- Gestión de configuraciones de servicios
- Registro y edición de llaves públicas y privadas
- Administración de empresas
- Manejo dinámico de URLs por servicio
- Activar / desactivar configuraciones
- Visualización de URLs en modal
- Formularios reactivos con validaciones
- Integración con API REST

---

## 📁 Estructura del proyecto

src/
 ├── app/
 │   ├── core/
 │   ├── modules/
 │   │   ├── configuration
 │   │   ├── company
 │   │   └── services
 │   ├── shared/
 │   └── app.module.ts
 ├── assets/
 └── environments/

---

## ⚙️ Requisitos

- Node.js >= 16
- Angular CLI
- Git

---

## ▶️ Instalación

1. Clonar el repositorio:

git clone https://github.com/deyvisgc/admin-inversionesrd.git

2. Entrar al proyecto:

cd admin-inversionesrd

3. Instalar dependencias:

npm install

4. Ejecutar el proyecto:

ng serve

5. Abrir en el navegador:

http://localhost:4200

---

## 🔐 Configuración de entorno

Editar el archivo environment.ts:

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

---

## 🧠 Buenas prácticas aplicadas

- Uso de Reactive Forms
- Manejo correcto de FormArray
- Conversión de fechas solo al guardar
- Uso de NgBootstrap Modals
- Separación de lógica y vista
- Código organizado por módulos

---

## 🛠 Próximas mejoras

- Control de roles y permisos
- Dashboard con métricas
- Auditoría y logs
- Internacionalización (i18n)

---

## 👨‍💻 Autor

Deyvis García  
📧 dgarciacercado@gmail.com  
🐙 GitHub: https://github.com/deyvisgc

---

## 📄 Licencia

Proyecto privado – uso interno.
