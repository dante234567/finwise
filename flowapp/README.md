# FlowApp 🚀
**Gestión financiera para emprendedores** — React + Vite + Tailwind + Zustand

---

## 📁 Estructura del proyecto

```
flowapp/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # Punto de entrada
    ├── App.jsx               # Router principal
    ├── index.css             # Estilos globales + Tailwind
    │
    ├── data/
    │   └── mockData.js       # Datos mock iniciales
    │
    ├── context/
    │   └── store.js          # Estado global (Zustand) + localStorage
    │
    ├── utils/
    │   ├── format.js         # Formateo de moneda, fechas, WhatsApp
    │   └── pdf.js            # Generación de PDF con jsPDF
    │
    ├── components/
    │   ├── ui/
    │   │   └── index.jsx     # StatCard, Badge, Modal, ProgressBar, etc.
    │   └── layout/
    │       ├── Layout.jsx    # Wrapper con Outlet
    │       └── BottomNav.jsx # Navegación inferior mobile
    │
    └── pages/
        ├── Inicio.jsx        # Dashboard + Mi bolsillo
        ├── Negocio.jsx       # Finanzas + Presupuestos
        ├── Metricas.jsx      # Gráficos y KPIs
        ├── Gastos.jsx        # CRUD de movimientos
        └── Perfil.jsx        # Configuración del usuario
```

---

## ⚡ Cómo correr el proyecto localmente

### 1. Requisitos previos
- Node.js 18+ instalado ([descargar](https://nodejs.org))
- npm o yarn

### 2. Instalar dependencias
```bash
cd flowapp
npm install
```

### 3. Iniciar en desarrollo
```bash
npm run dev
```
Abrí http://localhost:5173 en tu navegador (idealmente con DevTools en modo mobile).

### 4. Build para producción
```bash
npm run build
npm run preview   # Para probar el build
```

---

## 🧪 Cómo testear cada funcionalidad

### Inicio (Mi bolsillo)
- Abrí la app y verificá que se muestre el monto disponible
- Tocá el tab "Negocio" para ver el resumen del negocio
- Los montos se calculan automáticamente de los movimientos

### Negocio
- **Finanzas**: verificá el gráfico de barras con datos reales del mes
- **Presupuestos**: tocá "Nuevo presupuesto", completá los campos y guardá
  - Podés agregar múltiples ítems con el botón "+ Agregar"
  - Abrí un presupuesto creado → cambiá el estado (pendiente/aprobado/rechazado)
  - Tocá "PDF" → se descarga un PDF con el detalle
  - Tocá "WhatsApp" → se abre WhatsApp con mensaje prearmado

### Métricas
- Verificá que los KPIs (ticket promedio, nro ventas, margen) calculen correctamente
- Cambiá el período (Mes / Trimestre / Año) con los tabs del header
- Los gráficos de línea, barras y dona deben renderizarse

### Gastos
- Tocá "Registrar movimiento" → seleccioná Gasto o Ingreso
- Completá descripción, monto y categoría → guardá
- El nuevo movimiento aparece en la lista y actualiza el Inicio
- Filtrá por Todos / Ingresos / Egresos con los tabs
- Tocá un movimiento → se abre el detalle con opción de eliminar
- Verificá que las barras de presupuesto por categoría se actualicen

### Perfil
- Cambiá el porcentaje de bolsillo → volvé al Inicio y verificá que el monto cambió
- Tocá "Editar datos" → modificá nombre y email → guardá
- Todos los cambios persisten al recargar la página (localStorage)

---

## 🗄️ Persistencia de datos

Los datos se guardan automáticamente en **localStorage** bajo la clave `flowapp-storage`.

Para resetear a los datos mock iniciales:
```javascript
// En la consola del navegador:
localStorage.removeItem('flowapp-storage')
// Luego recargá la página
```

---

## 🛠️ Tecnologías usadas

| Tecnología | Uso |
|---|---|
| React 18 | UI y componentes |
| React Router v6 | Navegación entre páginas |
| Zustand | Estado global + persistencia |
| Tailwind CSS | Estilos utilitarios |
| Recharts | Gráficos (barras, líneas, dona) |
| jsPDF + autoTable | Generación de PDFs |
| Vite | Bundler y dev server |

---

## 🔧 Cómo escalar el proyecto

### Agregar una nueva página
1. Crear `src/pages/NuevaPagina.jsx`
2. Agregar la ruta en `src/App.jsx`
3. Agregar el link en `src/components/layout/BottomNav.jsx`

### Conectar una API real (reemplazar localStorage)
En `src/context/store.js`, reemplazá el middleware `persist` por llamadas a tu API:
```javascript
// En lugar de persist(...)
addMovimiento: async (mov) => {
  const res = await fetch('/api/movimientos', { method: 'POST', body: JSON.stringify(mov) })
  const nuevo = await res.json()
  set((s) => ({ movimientos: [nuevo, ...s.movimientos] }))
}
```

### Agregar autenticación
Agregá un `AuthProvider` y protegé las rutas con un componente `PrivateRoute` en `App.jsx`.

---

## 📱 Nota sobre diseño mobile

La app está optimizada para mobile-first (375px de ancho).
Para la mejor experiencia en desarrollo:
- Abrí DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M)
- Seleccioná iPhone 14 o similar
