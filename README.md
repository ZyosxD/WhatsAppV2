# 🤖 ZBot - Tu Asistente de Ventas de Bots para WhatsApp

¡Bienvenido a **ZBot**! 🚀 Un bot de ventas profesional diseñado para capturar, calificar y gestionar leads interesados en la creación de bots de WhatsApp personalizados para sus empresas. Potenciado con la **API de Asistentes de OpenAI (v2)**, este bot opera 24/7 desde **Utah (America/Denver)**, asegurando que nunca pierdas una oportunidad de negocio.

---

### ✨ Características Principales

| Característica | Estado | Descripción |
| :--- | :---: | :--- |
| **🧠 Inteligencia Artificial** | ✅ | Utiliza **OpenAI Assistants v2** para conversaciones fluidas y naturales. |
| **📞 Captura de Leads** | ✅ | Recopila información clave del cliente de manera inteligente. |
| **🗂️ Almacenamiento JSON** | ✅ | Guarda todos los leads en un archivo `storage.json` fácil de gestionar. |
| **📈 Reportes Instantáneos** | ✅ | Envía un resumen del lead al administrador **inmediatamente** después de la captura. |
| **🕰️ Operación 24/7** | ✅ | El bot está siempre activo, sin importar la hora. |
| **🏔️ Zona Horaria de Utah** | ✅ | Todos los registros y mensajes usan la hora local de **America/Denver**. |
| **🛡️ Sistema Anti-Ban** | ✅ | Simula la escritura humana para mayor seguridad. |
| ** modular** | ✅ | Código organizado en módulos para fácil mantenimiento y escalabilidad. |
| **✍️ Firma Profesional** | ✅ | Creado y firmado por **Zyos**, experto en automatización. |

---

### 🛠️ Instalación y Puesta en Marcha

Sigue estos sencillos pasos para tener tu bot funcionando en menos de 5 minutos.

#### 1. Prerrequisitos
- **Node.js** (versión 16 o superior)
- Una cuenta de **OpenAI** con créditos y un **Assistant ID**.

#### 2. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>
```

#### 3. Instalar Dependencias
```bash
npm install
```

#### 4. Configurar Variables de Entorno
Crea un archivo llamado `.env` en la raíz del proyecto (puedes duplicar y renombrar `.env.example`) y añade tus credenciales:

```env
# Clave secreta de la API de OpenAI
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ID del Asistente de OpenAI que has creado
ASSISTANT_ID="asst_xxxxxxxxxxxxxxxxxxxxxxxx"

# Tu número de WhatsApp (con código de país, sin '+' o espacios)
ADMIN_PHONE="13856012999"
```

#### 5. Iniciar el Bot
```bash
node index.js
```

#### 6. Escanear el Código QR
Al ejecutar el comando anterior, aparecerá un **código QR** en tu terminal. Ábrelo con WhatsApp en tu teléfono (en la sección de *Dispositivos Vinculados*) para conectar el bot.

¡Y listo! 🎉 Tu bot ZBot está activo y listo para empezar a vender.

---

### ✒️ Firmado por

> **Zyos**
> Experto en bots de WhatsApp con Node.js
> Creador de soluciones automatizadas para empresas
> WhatsApp: +1 (385) 601-2999
