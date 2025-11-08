# 🤖 ZyosMass - Bot de WhatsApp para Envío Masivo con IA

¡Bienvenido a **ZyosMass**! 🚀 Un bot de WhatsApp potente y seguro, diseñado para automatizar el envío masivo de mensajes programados utilizando Node.js, WhatsApp-Web.js y la inteligencia artificial de OpenAI (API v2).

Creado por **ZyosxD**, experto en automatización masiva con WhatsApp.

---

### ✨ Características Principales

| Característica | Implementada | Descripción |
|---------------|--------------|-------------|
| 🤖 **OpenAI para Mensajes Únicos** | ✅ | Genera variaciones de texto para evitar el spam. |
| 📂 **Estructura Modular** | ✅ | Código organizado y fácil de mantener. |
| 👥 **Lectura desde `numbers.txt`** | ✅ | Carga la lista de contactos de forma sencilla. |
| 🖼️ **Soporte Multimedia** | ✅ | Envía texto, imágenes y captions personalizados. |
| 📊 **Reportes Instantáneos** | ✅ | Recibe notificaciones al instante en tu WhatsApp. |
| ⏰ **Zona Horaria de Utah** | ✅ | Todos los registros en `America/Denver`. |
| 🛡️ **Anti-Ban Avanzado** | ✅ | Simula comportamiento humano para mayor seguridad. |
| ✍️ **Firma Personalizada** | ✅ | Incluye la firma de `ZyosxD - t.me/zyosxd`. |
| ⚙️ **Comandos de Control** | ✅ | Pausa, reanuda o detén la campaña desde tu móvil. |

---

### 📂 Estructura del Proyecto

```
/
├── index.js          # 🚀 Orquestador principal
├── config.js         # 🔑 Manejo de variables de entorno
├── logger.js         # 📝 Sistema de logs con colores
├── handler.js        # 💬 Lógica de comandos del admin
├── assistant.js      # 🤖 Lógica de OpenAI
├── storage.js        # 💾 Registro de envíos en JSON
├── time.js           # ⏰ Manejo de la zona horaria
├── report.js         # 📈 Reportes al administrador
├── antiBan.js        # 🛡️ Simulación de comportamiento humano
├── sender.js         # ✉️ Motor de envío masivo
├── numbers.txt       # 👥 Lista de números de contacto
├── messages/         # 📁 Carpeta para plantillas de mensajes
│   ├── message_1.txt
│   ├── image_1.jpg
│   └── caption_1.txt
├── sent_log.json     # 📊 Log de mensajes enviados
├── package.json      # 📦 Dependencias del proyecto
├── .env.example      # 📋 Ejemplo de variables de entorno
└── README.md         # 📄 ¡Estás aquí!
```

---

### 🛠️ Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** (generalmente viene con Node.js)
- Una cuenta de **OpenAI** con una API Key
- Un número de **WhatsApp** para el bot y otro para el admin

---

### 🚀 Instalación y Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/zyosmass.git
    cd zyosmass
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    - Renombra el archivo `.env.example` a `.env`.
    - Abre el archivo `.env` y añade tus credenciales:
      ```env
      # Tu clave de API de OpenAI
      OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

      # Tu número de WhatsApp para recibir reportes (formato internacional)
      ADMIN_PHONE=+1234567890
      ```

4.  **Prepara tus listas y mensajes:**
    - **Números:** Añade los números de contacto en `numbers.txt` (uno por línea, formato `+1234567890`).
    - **Mensajes:**
        - Edita el texto base en `messages/message_1.txt`.
        - Reemplaza `messages/image_1.jpg` con la imagen que deseas enviar.
        - Edita el pie de foto en `messages/caption_1.txt`.

---

### ▶️ ¿Cómo Ejecutar el Bot?

Una vez configurado, inicia el bot con el siguiente comando:

```bash
node index.js
```

1.  **Escanea el QR:**
    - Se mostrará un código QR en tu terminal.
    - Ábrelo con WhatsApp en tu teléfono (`Configuración > Dispositivos Vinculados > Vincular un dispositivo`).

2.  **¡Listo!**
    - Una vez que el cliente se conecte, el envío masivo comenzará automáticamente.
    - Recibirás reportes en tu número de admin por cada mensaje enviado.

---

### ⚙️ Comandos del Administrador

Puedes controlar la campaña de envío masivo desde tu número de WhatsApp de administrador. Simplemente envía los siguientes comandos al número del bot:

- `!status` → Muestra el progreso actual de la campaña.
- `!pause` → Pausa temporalmente el envío de mensajes.
- `!resume` → Reanuda una campaña pausada.
- `!stop` → Detiene la campaña por completo.

---

### 👨‍💻 Creado y Firmado por:

> **ZyosxD**
> *Experto en automatización masiva con WhatsApp*
> [t.me/zyosxd](https://t.me/zyosxd)

¡Disfruta de tu campaña masiva 24/7 desde Utah! 🏔️
