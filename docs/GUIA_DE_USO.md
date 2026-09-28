# Guía de Uso y Manual de Operaciones — WACRM

Bienvenido al manual de uso de **WACRM**, una solución integral de CRM para WhatsApp basada en Next.js, Supabase, Meta Cloud API e Inteligencia Artificial.

---

## ⚡ 1. Funcionalidades Automáticas del Sistema

### A. Gestión de Mensajes y Contactos (Tiempo Real)
- **Creación automática de contactos:** Cuando un cliente nuevo escribe por primera vez al número de WhatsApp vinculado, el sistema crea automáticamente su ficha de contacto y abre una nueva conversación en el Inbox.
- **Sincronización de estados:** Registra en tiempo real los estados de entrega de cada mensaje (*Enviado*, *Entregado*, *Leído*, *Fallido*) reflejados con los tildes nativos de WhatsApp.
- **Deduplicación automática:** Evita duplicar contactos o conversaciones cuando un cliente escribe desde diferentes canales o números repetidos.

### B. Asistente y Bot de Respuestas con IA (OpenRouter / GPT-4o-mini)
- **Auto-Reply (Respuesta automática inteligente):** Si se activa el Auto-Reply, la IA responde automáticamente las dudas de los clientes analizando el contexto y el historial de la conversación.
- **Base de Conocimiento (RAG / Knowledge Base):** Puedes subir documentos, preguntas frecuentes (FAQs), catálogos o políticas comerciales en **Settings → AI Assistant → Knowledge Base**. La IA consultará estos fragmentos para responder con precisión sobre el negocio.
- **Handoff Inteligente (Pase a humanos):** Si un cliente pide explícitamente hablar con un asesor o el bot no dispone de información suficiente, el bot se detiene automáticamente en esa conversación y notifica al equipo humano.
- **Borrador Asistido (Draft Reply):** Los agentes humanos pueden pulsar el botón de ayuda de IA en cualquier chat para generar respuestas sugeridas en un solo clic antes de enviarlas.

### C. Motor de Automatizaciones y Flujos (*Automations / Flows*)
Reglas configurables sin código:
- **Disparadores (*Triggers*):**
  - Entrada de mensajes con palabras clave específicas (ej: *"precio"*, *"catálogo"*, *"asesor"*, *"comprar"*).
  - Creación de un nuevo contacto.
  - Eventos programados o temporizadores de espera (*Wait steps*).
- **Acciones automáticas:**
  - Envío automático de mensajes o plantillas aprobadas por Meta.
  - Asignación o eliminación de etiquetas (*Tags*).
  - Asignación automática de la conversación a un agente específico.
  - Disparo de Webhooks hacia sistemas externos (ERP, Make, Zapier, n8n).

---

## 📊 2. Pipelines de Ventas (Tablero Kanban)

El módulo de **Pipelines** permite gestionar el ciclo de vida de los prospectos comerciales:

1. **Gestión Manual (Drag & Drop):**
   - Creación de tratos (*Deals*) asociados a contactos y conversaciones de WhatsApp.
   - Asignación de valores monetarios y probabilidad de cierre.
   - Movimiento de tratos entre etapas (*Lead → Contactado → Propuesta → Ganado / Perdido*).
2. **Automatización:**
   - A través del motor de **Flows / Automations** o de la **API Pública (`/api/v1`)**, los tratos pueden crearse o cambiar de etapa automáticamente según las interacciones del cliente en WhatsApp.

---

## 📖 3. Módulos y Secciones del CRM

| Sección | Función Principal | Flujo de Trabajo Recomendado |
| :--- | :--- | :--- |
| **📥 Inbox** | Bandeja de entrada compartida | Atender clientes en equipo, asignar agentes, usar respuestas rápidas (*Quick Replies*), notas internas y borrador con IA. |
| **👥 Contacts** | Directorio de clientes | Gestionar fichas de clientes, importar/exportar listas CSV, asignar etiquetas (*Tags*) y campos personalizados. |
| **📊 Pipelines** | Tablero Kanban de ventas | Medir el valor económico del embudo de ventas, mover tratos de etapa y controlar cierres. |
| **📢 Broadcasts** | Envíos masivos | Enviar campañas masivas con plantillas oficiales de Meta a audiencias segmentadas por etiquetas. |
| **⚡ Automations & Flows** | Constructor visual de bots | Diseñar árboles de decisión interactivos, respuestas automáticas y menús guiados por botones. |
| **⚙️ Settings** | Ajustes del sistema | Conectar número de WhatsApp (WABA), afinar el Asistente de IA, invitar compañeros de equipo y generar API Keys. |

---

## 🔌 4. Integraciones y API Pública

- **REST API (`/api/v1`):** Permite consultar y gestionar contactos, mensajes, conversaciones y webhooks desde aplicaciones externas mediante API Keys con permisos revocables.
- **Protocolo MCP (Model Context Protocol):** Ubicado en `mcp-server/`, permite conectar el CRM con asistentes de IA externos como Claude Desktop o Cursor para consultar y operar el CRM mediante lenguaje natural.
