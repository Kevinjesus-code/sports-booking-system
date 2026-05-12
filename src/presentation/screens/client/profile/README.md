# Profile Screen

## Descripción
Screen de perfil de usuario con dos modos: visualización y edición. Permite al usuario ver sus datos personales (nombre, apellido, DNI, correo y teléfono) y editar únicamente correo, teléfono y contraseña.

## Estructura

### Archivos principales
- **profile.jsx** - Componente principal que orquesta la lógica y presenta los otros componentes
- **profile.module.css** - Estilos globales de la pantalla

### Componentes (`/components`)
1. **ProfileHeader.jsx** - Encabezado con avatar, nombre de usuario y botón de editar/cancelar
2. **ProfileDisplay.jsx** - Muestra los datos del usuario en modo lectura
3. **ProfileForm.jsx** - Formulario de edición con validaciones

### Hooks (`/hooks`)
- **useProfileData.js** - Hook personalizado que maneja:
  - Estado del perfil (datos del usuario)
  - Estado editable (datos siendo editados)
  - Validaciones (email, teléfono, contraseña)
  - Lógica de alternancia entre modo lectura/edición
  - Manejo de errores

## Uso

```jsx
import Profile from './path/to/profile/profile.jsx';

// Renderizar en tu aplicación
<Profile />
```

## Datos editables
- ✏️ Correo electrónico
- ✏️ Teléfono
- ✏️ Contraseña (opcional)

## Datos no editables (visualización)
- 👁️ Nombre
- 👁️ Apellido
- 👁️ DNI

## Validaciones implementadas
- **Email**: Formato válido requerido
- **Teléfono**: Acepta formatos como +34, números, espacios y guiones
- **Contraseña**: Mínimo 8 caracteres (opcional si no se quiere cambiar)
- **Confirmar contraseña**: Debe coincidir con la contraseña

## Principios aplicados
✅ Single Responsibility Principle (SRP)
✅ Componentes reutilizables
✅ Lógica centralizada en hooks
✅ Estilos modularizados (CSS Modules)
✅ Importaciones controladas
