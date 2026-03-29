FinWise: Tu Negocio Bajo Control
FinWise nació en una hackatón con una misión clara: que los emprendedores dejen de caminar a ciegas. El problema más común ademas de la falta de ventas es el desorden estructural en las cuentas. Mezclar la billetera personal con la caja del negocio es el camino más rápido hacia el fracaso, y este sistema fue diseñado para evitarlo.

Qué Resolvemos
Damos una estructura lógica al caos diario. FinWise separa tu capacidad de gasto personal de las necesidades operativas de tu emprendimiento. No es un simple anotador de gastos; es un tablero de comando que te permite entender si realmente estás ganando dinero o si solo estás moviendo capital de un lado a otro.

Funcionalidades 
División de Capital: Separamos tu "bolsillo" (lo que es realmente tuyo para vivir) de los fondos del "negocio" (lo que necesitás para seguir operando).

Punto de Equilibrio Real: El sistema te indica el número exacto que necesitás facturar para cubrir tus costos fijos y variables. Es tu meta mínima de supervivencia.

Ratios de Salud Económica: Traducimos conceptos de ingeniería económica en indicadores simples para que entiendas la rentabilidad y el margen de seguridad de tu modelo de negocio en tiempo real.


Análisis de Negocio y Estrategia
Mercado y Oportunidad
Existe un vacío entre las apps de finanzas personales (demasiado simples) y los ERP corporativos (demasiado complejos). FinWise ataca el océano azul de los microemprendedores que sufren de "ceguera financiera" al mezclar sus cuentas personales con las del negocio.

Público Objetivo (Target)

Emprendedores operativos: Dueños de pequeños negocios o profesionales independientes.

Perfil: Personas con gran capacidad técnica en su oficio pero que necesitan una herramienta que les diga, sin vueltas, cuánto dinero pueden retirar hoy sin fundir el negocio mañana.

Modelo de Negocio
Estructura SaaS (Software as a Service) con niveles:

Core (Gratuito): Gestión de flujo de caja y cálculo de punto de equilibrio.

Pro (Suscripción): Reportes proyectivos, exportación de métricas y análisis de salud estructural para escalabilidad.




1. Stack Tecnológico
Frontend: React + Vite (Rápido y moderno).
Estado Global: Zustand (Simplifica la gestión de datos sin el boilerplate de Redux).
Estilos: Tailwind CSS (Diseño responsivo y premium mediante utilidades).
Gráficos: Recharts (Visualización de tendencias e ingresos).
2. Arquitectura de Archivos
/src/context/store.js: El "cerebro" de la app. Centraliza las llamadas a la API y el procesamiento de datos (como el cálculo de reservas ARCA e impuestos).
/src/pages:
Inicio.jsx: Resumen ejecutivo de la cuenta.
Metricas.jsx: Panel de control fiscal donde se encuentra el sistema de diagnóstico educativo.
Negocio.jsx: Gestión de presupuestos y salud operativa.
Gastos.jsx: Listado y control de transacciones.
/src/utils/format.js: Utilidad centralizada para dar formato de moneda (fmt).
3. Lógica de Negocio Crítica
El sistema utiliza una lógica determinística en el frontend para calcular:

Ganancia Neta: Lo que queda despues de los gastos.
Sueldo del Dueño: Basado en un porcentaje de la ganancia neta (configurable).
Ratios: Margen de Seguridad y Apalancamiento Operativo.
4. Estado del Despliegue
El código está configurado para conectarse a una API mediante la variable VITE_API_URL.
Se han aplicado parches de Case-Sensitivity en Git para asegurar que el despliegue en Linux (Vercel/Netlify) no falle por nombres de archivos (ej. Metricas.jsx vs metricas.jsx).
TIP

Punto Fuerte: El código actual es altamente desacoplado; cambiar la lógica de cálculo en el store.js actualiza automáticamente todas las vistas de la aplicación.

