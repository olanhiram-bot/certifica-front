# Instrucciones para GitHub Copilot — Sistema de Diseño NL

> **Template para proyectos nuevos.**
> Copia este archivo a `.github/copilot-instructions.md` en el proyecto nuevo y personaliza las secciones marcadas con `[...]`.

---

## Contexto del proyecto

- **Nombre del sistema:** [Nombre del sistema/aplicación]
- **Dependencia:** [Nombre de la secretaría o dependencia]
- **Tipo:** [Sistema interno de administración / Portal ciudadano / Ambos]
- **Framework backend:** [Laravel / Node.js / .NET / Python / otro]
- **Framework frontend:** [HTML vanilla / Vue 3 / Inertia.js / otro]

---

## Sistema de Diseño — Reglas obligatorias

Este proyecto usa el **Sistema de Diseño del Gobierno del Estado de Nuevo León**.

### NUNCA hagas esto

- Inventar o crear clases CSS propias. Solo existen las clases documentadas aquí.
- Usar `btn btn-primary` de Bootstrap cuando existe `boton boton_primario` del sistema.
- Escribir `style="..."` inline para compensar estilos del sistema.
- Cargar `master.css` antes de Bootstrap CSS.
- Omitir `class="administracion"` en `<html>` para sistemas internos.

### Dependencias en `<head>` (orden obligatorio)

```html
<link href="assets/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
<link rel="stylesheet" href="assets/css/master.css" type="text/css">
```

**CDN de producción:**
- Bootstrap CSS: `https://recursos.digital.nl.gob.mx/assets/libs/bootstrap/css/bootstrap.min.css`
- Bootstrap JS: `https://recursos.digital.nl.gob.mx/assets/libs/bootstrap/js/bootstrap.bundle.min.js`
- Master CSS: `https://recursos.digital.nl.gob.mx/assets/css/master.min.css`

### Íconos — orden de preferencia

1. `<span class="material-symbols-outlined">nombre</span>` — siempre primero
2. `<span class="material-icons">nombre</span>` — uso mínimo
3. `<i class="bi bi-nombre"></i>` — solo para redes sociales

---

## Referencia de clases del sistema

| Categoría | Clases |
|-----------|--------|
| **Layout** | `contenedor_general`, `caja_titulo`, `seccion_titulo`, `seccion_componente`, `area_componente` |
| **Header** | `caja_header`, `area_logo`, `logo_header`, `boton_hamburguesa`, `caja_verificador`, `es_estatico` |
| **Sidebar** | `menu_vertical`, `menu_con_iconos` |
| **Footer** | `seccion_enlaces`, `area_enlaces`, `escudo_enlaces`, `seccion_redes`, `caja_redes`, `escudo_footer` |
| **Botones** | `boton boton_primario`, `boton boton_secundario`, `boton boton_terciario`, `solo_icono`, `boton_etiqueta` |
| **Alertas** | `seccion_alerta`, `caja_alerta`, `contendido_alerta`, `es_exito`, `es_error`, `es_alerta` |
| **Tablas** | `estilo_tabla`, `caja_tabla`, `titulo_tabla` |
| **Tarjetas** | `seccion_tarjetas`, `caja_tarjeta`, `imagen_tarjeta`, `cuerpo_tarjeta`, `titulo_tarjeta`, `texto_tarjeta` |
| **Formularios** | `seccion_formulario`, `area_formulario`, `elemento_forma`, `1_columna`, `2_columnas`, `3_columnas` |
| **Form controls** | `caja_checkbox`, `caja_radio`, `caja_switch`, `checkbox`, `radio`, `switch`, `slider round` |
| **Tabs** | `caja_navtab`, `notificacion`, `es_completo`, `es_landing` |
| **Links** | `link`, `link es_externo`, `link tiene_flecha` |
| **Login** | `body_login`, `caja_login`, `leon_para_caja`, `tiene_fondo`, `tiene_personas` |
| **Utilidades** | `contenedor_resumen`, `con_salto`, `nota_pie`, `es_label`, `modo_oscuro`, `migas` |
| **Otros** | `caja_lista`, `caja_busqueda`, `caja_avatar`, `es_inicial`, `caja_navtab`, `actividades_tarjetas`, `contador`, `es_redondeado` |

---

## Patrones de generación de código

### Botones

```html
<!-- Primario -->
<button type="button" class="boton boton_primario">Guardar</button>

<!-- Con ícono -->
<button type="button" class="boton boton_primario">
  <span class="material-symbols-outlined">save</span> Guardar
</button>

<!-- Solo ícono — siempre con title -->
<button type="button" class="boton boton_primario solo_icono" title="Editar">
  <span class="material-symbols-outlined">edit</span>
</button>

<!-- Secundario -->
<button type="button" class="boton boton_secundario">Exportar</button>

<!-- Terciario / cancelar -->
<button type="button" class="boton boton_terciario">Cancelar</button>
```

### Alertas

```html
<!-- Éxito -->
<div class="seccion_alerta alert es_exito fade show" role="alert">
  <div class="caja_alerta">
    <span class="material-symbols-outlined">check_circle</span>
    <div class="contendido_alerta">Operación exitosa.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</div>

<!-- Error -->
<div class="seccion_alerta alert es_error fade show" role="alert">
  <div class="caja_alerta">
    <span class="material-symbols-outlined">error</span>
    <div class="contendido_alerta">Ocurrió un error.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</div>

<!-- Advertencia -->
<div class="seccion_alerta alert es_alerta fade show" role="alert">
  <div class="caja_alerta">
    <span class="material-symbols-outlined">warning</span>
    <div class="contendido_alerta">Revisa antes de continuar.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</div>

<!-- Informativa (sin modificador) -->
<div class="seccion_alerta alert fade show" role="alert">
  <div class="caja_alerta">
    <span class="material-symbols-outlined">info</span>
    <div class="contendido_alerta">Información relevante.</div>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
  </div>
</div>
```

### Tabla con acciones

```html
<div class="caja_tabla">
  <h3 class="titulo_tabla">Listado</h3>
  <table class="estilo_tabla">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre</th>
        <th scope="col">Estado</th>
        <th scope="col">Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Juan García</td>
        <td><span class="boton_etiqueta">Activo</span></td>
        <td>
          <button type="button" class="boton boton_primario solo_icono" title="Editar">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button type="button" class="boton boton_terciario solo_icono" title="Eliminar">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Formulario

```html
<form class="seccion_formulario" action="" method="POST">
  <div class="area_formulario">
    <div class="seccion_titulo">
      <h3>Sección del formulario</h3>
    </div>

    <div class="elemento_forma 2_columnas">
      <label for="campo" class="form-label">Etiqueta</label>
      <input id="campo" class="form-control" type="text" placeholder="Texto">
    </div>

    <div class="elemento_forma 2_columnas">
      <label for="select" class="form-label">Selecciona</label>
      <select id="select" class="form-select">
        <option disabled selected hidden>-Selecciona-</option>
        <option value="1">Opción 1</option>
      </select>
    </div>

    <div class="elemento_forma 1_columna">
      <button type="submit" class="boton boton_primario">Guardar</button>
      <button type="button" class="boton boton_terciario">Cancelar</button>
    </div>
  </div>
</form>
```

Columnas de `elemento_forma`: `1_columna` (100%) | `2_columnas` (50%) | `3_columnas` (33%)

### Modal de confirmación

```html
<button type="button" class="boton boton_primario"
  data-bs-toggle="modal" data-bs-target="#modal_1">
  Abrir modal
</button>

<div class="modal fade" id="modal_1" tabindex="-1"
  aria-labelledby="modal_1_label" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title" id="modal_1_label">Confirmación</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      <div class="modal-body">
        <p>¿Deseas continuar con esta acción?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="boton boton_terciario" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="boton boton_primario">Confirmar</button>
      </div>
    </div>
  </div>
</div>
```

### Tarjetas en grid

```html
<div class="seccion_tarjetas 3_columnas">
  <div class="caja_tarjeta">
    <div class="imagen_tarjeta">
      <img src="/assets/img/muestras/imagen.png" alt="Descripción">
    </div>
    <div class="cuerpo_tarjeta">
      <h4 class="titulo_tarjeta">Título</h4>
      <p class="texto_tarjeta">Descripción breve.</p>
      <button type="button" class="boton boton_primario">Ver más</button>
    </div>
  </div>
</div>
```

### Tabs

```html
<div class="caja_navtab">
  <nav>
    <div class="nav nav-tabs" id="tabs_1" role="tablist">
      <button class="nav-link active" id="tab1-t_1"
        data-bs-toggle="tab" data-bs-target="#tab1-c_1"
        type="button" role="tab" aria-selected="true">Tab 1</button>
      <button class="nav-link" id="tab2-t_1"
        data-bs-toggle="tab" data-bs-target="#tab2-c_1"
        type="button" role="tab" aria-selected="false">Tab 2</button>
    </div>
  </nav>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="tab1-c_1" role="tabpanel">Contenido 1</div>
    <div class="tab-pane fade" id="tab2-c_1" role="tabpanel">Contenido 2</div>
  </div>
</div>
```

---

## Páginas completas de referencia

> Usa estos bloques como base. Cópialos completos y solo modifica el contenido.

### Reglas de estructura críticas

| Regla | Detalle |
|-------|---------|
| `<html class="administracion">` | Solo en sistemas internos. Portales públicos/login: sin esta clase. |
| `<aside>` (sidebar) ANTES del `<header>` | El CSS del sistema usa el orden DOM para posicionar el layout. Invertirlo rompe la pantalla. |
| Login: `<html>` sin `administracion`, `<body class="body_login">` | El login es página neutra aunque acceda a sistema interno. |
| `caja_titulo` va FUERA de `contenedor_general` | Siempre entre el header y el contenedor, nunca dentro. |

---

### Login completo

```html
<!DOCTYPE html>
<html lang="es">
<!-- Login NO lleva class="administracion" -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Iniciar sesión — [Nombre del Sistema]</title>
  <link href="assets/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
  <script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="assets/css/master.css" type="text/css">
</head>
<!-- Variantes: body_login | body_login tiene_fondo | body_login tiene_personas | + modo_oscuro -->
<body class="body_login tiene_fondo">
  <main>
    <div class="caja_login">

      <div class="leon_para_caja"></div>

      <!-- Alerta de error (oculta por defecto; mostrar con JS si falla el login) -->
      <div class="seccion_alerta alert es_error fade show d-none" role="alert" id="alerta_login">
        <div class="caja_alerta">
          <span class="material-symbols-outlined">error</span>
          <div class="contendido_alerta">Usuario o contraseña incorrectos.</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
      </div>

      <form class="seccion_formulario" action="/login" method="POST">
        <!-- Laravel: {{ csrf_field() }} | .NET: @Html.AntiForgeryToken() -->

        <div class="elemento_forma 1_columna">
          <label for="usuario" class="form-label">Usuario</label>
          <input id="usuario" name="usuario" class="form-control" type="text"
            placeholder="usuario@nl.gob.mx" autocomplete="username" required autofocus>
        </div>

        <div class="elemento_forma 1_columna">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input id="password" name="password" class="form-control" type="password"
              autocomplete="current-password" required>
            <button class="boton boton_secundario solo_icono" type="button"
              title="Mostrar u ocultar contraseña" onclick="togglePassword()">
              <span class="material-symbols-outlined" id="icono_password">visibility</span>
            </button>
          </div>
        </div>

        <div class="elemento_forma 1_columna">
          <button type="submit" class="boton boton_primario">
            <span class="material-symbols-outlined">login</span> Iniciar sesión
          </button>
        </div>

        <div class="elemento_forma 1_columna">
          <a class="link" href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
        </div>
      </form>

    </div>
  </main>
  <script>
    function togglePassword() {
      const input = document.getElementById('password');
      const icono = document.getElementById('icono_password');
      if (input.type === 'password') {
        input.type = 'text';
        icono.textContent = 'visibility_off';
      } else {
        input.type = 'password';
        icono.textContent = 'visibility';
      }
    }
  </script>
</body>
</html>
```

---

### Layout completo — sistema interno (navbar + sidebar + footer)

```html
<!DOCTYPE html>
<html lang="es" class="administracion">
<!-- class="administracion" activa el tema del sistema interno -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Sección] — [Nombre del Sistema]</title>
  <link href="assets/libs/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
  <script src="assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="assets/css/master.css" type="text/css">
</head>
<body>

  <!-- SIDEBAR: SIEMPRE ANTES del header en el DOM -->
  <aside class="offcanvas offcanvas-start show menu_con_iconos menu_vertical"
    tabindex="-1" id="menu_vertical"
    data-bs-keyboard="false" data-bs-backdrop="false" data-bs-scroll="true">
    <div class="offcanvas-body">
      <ul>
        <!-- Ítem simple: agregar class="active" al ítem de la página actual -->
        <li>
          <a href="/inicio" class="active">
            <span class="material-icons">space_dashboard</span> Inicio
          </a>
        </li>
        <!-- Ítem con submenú colapsable -->
        <li>
          <a href="#submenu_catalogos"
            data-bs-toggle="collapse" data-bs-target="#submenu_catalogos" aria-expanded="false">
            <span class="material-icons">folder</span> Catálogos
          </a>
          <ul class="collapse" id="submenu_catalogos">
            <li><a href="/catalogos/usuarios">Usuarios</a></li>
            <li><a href="/catalogos/roles">Roles</a></li>
          </ul>
        </li>
        <li>
          <a href="/reportes">
            <span class="material-icons">bar_chart</span> Reportes
          </a>
        </li>
        <li>
          <a href="/configuracion">
            <span class="material-icons">settings</span> Configuración
          </a>
        </li>
      </ul>
    </div>
  </aside>

  <!-- HEADER: después del sidebar -->
  <header class="es_estatico">
    <!-- Verificador de sitio oficial -->
    <div class="caja_verificador">
      <div class="accordion caja_acordeon" id="verificador">
        <div class="accordion-item">
          <button id="verificador_boton" class="accordion-header accordion-button collapsed"
            type="button" data-bs-toggle="collapse"
            data-bs-target="#verificador_contenido"
            aria-expanded="false" aria-controls="verificador_contenido">
            <span>Este es un sitio web oficial del Gobierno del Estado de Nuevo León.
              <a class="link">Aprende a identificarlo</a>
            </span>
          </button>
          <div id="verificador_contenido" class="accordion-collapse collapse"
            aria-labelledby="verificador_boton" data-bs-parent="#verificador">
            <div class="accordion-body">
              <div class="row">
                <div class="col">
                  <img class="logo_verificar" src="/assets/img/logos/logo_circular.svg" alt="" loading="lazy">
                  <span>Los sitios oficiales están adheridos al dominio
                    <a class="link" href="https://nl.gob.mx" target="_blank" rel="noopener noreferrer">nl.gob.mx</a>
                  </span>
                </div>
                <div class="col">
                  <img class="logo_sitio_seguro" src="/assets/img/iconos/sitio_seguro.svg" alt="" loading="lazy">
                  <span>Todos los sitios cuentan con certificado de seguridad.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Barra de navegación principal -->
    <nav class="caja_header navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <div class="area_logo">
          <a class="logo_header" title="Gobierno de Nuevo León" href="/inicio"></a>
          <!-- Botón hamburguesa — activa el sidebar en móvil -->
          <button id="boton_hamburguesa" class="navbar-toggler boton_hamburguesa" type="button"
            data-bs-toggle="offcanvas" data-bs-target="#menu_vertical"
            aria-controls="menu_vertical" aria-expanded="false" aria-label="Abrir menú">
            <span class="material-icons">menu</span>
          </button>
        </div>
        <div id="navbarScroll" class="collapse navbar-collapse">
          <!-- Avatar + nombre + logout del usuario autenticado (alineado a la derecha) -->
          <div class="ms-auto d-flex align-items-center gap-2">
            <div class="caja_avatar es_inicial" aria-hidden="true">JG</div>
            <span>Juan García</span>
            <a class="boton boton_terciario solo_icono ms-2" href="/logout" title="Cerrar sesión">
              <span class="material-symbols-outlined">logout</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Encabezado de página: FUERA del contenedor_general, SIEMPRE presente -->
  <div class="caja_titulo">
    <h2>Nombre de la sección</h2>
    <p>Descripción breve del módulo o pantalla.</p>
  </div>

  <!-- CONTENIDO PRINCIPAL -->
  <div class="contenedor_general">

    <nav class="migas" aria-label="Ruta de navegación">
      <a href="/inicio">Inicio</a>
      <a href="/modulo">Módulo</a>
      <span>Sección actual</span>
    </nav>

    <!-- Alerta de operación (oculta/visible según resultado con JS) -->
    <div class="seccion_alerta alert es_exito fade show d-none" role="alert" id="alerta_operacion">
      <div class="caja_alerta">
        <span class="material-symbols-outlined">check_circle</span>
        <div class="contendido_alerta">Operación realizada correctamente.</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
      </div>
    </div>

    <!-- Ejemplo: tabla con acciones -->
    <div class="seccion_componente">
      <div class="seccion_titulo"><h3>Listado de registros</h3></div>
      <div class="area_componente">
        <div class="caja_tabla">
          <h3 class="titulo_tabla">Registros activos</h3>
          <table class="estilo_tabla">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Juan García</td>
                <td><span class="boton_etiqueta">Activo</span></td>
                <td>
                  <button type="button" class="boton boton_primario solo_icono" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button type="button" class="boton boton_terciario solo_icono" title="Eliminar"
                    data-bs-toggle="modal" data-bs-target="#modal_eliminar">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div><!-- /contenedor_general -->

  <!-- Modal al final del body, antes del footer -->
  <div class="modal fade" id="modal_eliminar" tabindex="-1"
    aria-labelledby="modal_eliminar_label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="modal_eliminar_label">Confirmar eliminación</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <p>¿Deseas eliminar este registro? Esta acción no puede deshacerse.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="boton boton_terciario" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="boton boton_primario">Eliminar</button>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer>
    <section class="seccion_enlaces">
      <div class="area_enlaces">
        <div class="col">
          <h5>Trámites y servicios</h5>
          <a class="link tiene_flecha" href="https://tramites.nl.gob.mx"
            target="_blank" rel="noopener noreferrer">Portal de trámites</a>
        </div>
        <div class="col">
          <h5>Gobierno del Estado</h5>
          <a class="link es_externo" href="https://nl.gob.mx"
            target="_blank" rel="noopener noreferrer">nl.gob.mx</a>
        </div>
        <div class="col">
          <h5>Transparencia</h5>
          <a class="link es_externo" href="https://transparencia.nl.gob.mx"
            target="_blank" rel="noopener noreferrer">Portal de transparencia</a>
        </div>
      </div>
      <div class="escudo_enlaces"></div>
    </section>
    <section class="seccion_redes">
      <div class="caja_redes">
        <div class="area_escudo">
          <div class="logo_secretaria"></div>
          <div class="leyenda_avisos">
            <a class="link" href="/privacidad" target="_blank" rel="noopener noreferrer">Datos personales</a>
            | Aviso de Privacidad
          </div>
        </div>
        <div class="area_redes">
          <div class="escudo_footer"></div>
          <div class="leyenda_redes">Manténte informado:</div>
          <a href="https://www.facebook.com/gobiernonuevoleon/" title="Facebook"
            target="_blank" rel="noopener noreferrer">
            <img src="https://recursos.digital.nl.gob.mx/assets/img/iconos/redes_sociales/facebook.svg" alt="Facebook">
          </a>
          <a href="https://twitter.com/nuevoleon" title="Twitter / X"
            target="_blank" rel="noopener noreferrer">
            <img src="https://recursos.digital.nl.gob.mx/assets/img/iconos/redes_sociales/twitter.svg" alt="Twitter">
          </a>
          <a href="https://www.instagram.com/gobiernonuevoleon/" title="Instagram"
            target="_blank" rel="noopener noreferrer">
            <img src="https://recursos.digital.nl.gob.mx/assets/img/iconos/redes_sociales/instagram.svg" alt="Instagram">
          </a>
          <a href="https://www.youtube.com/gobiernonuevoleon" title="YouTube"
            target="_blank" rel="noopener noreferrer">
            <img src="https://recursos.digital.nl.gob.mx/assets/img/iconos/redes_sociales/youtube.svg" alt="YouTube">
          </a>
        </div>
      </div>
    </section>
  </footer>

</body>
</html>
```

---

## Accesibilidad — reglas obligatorias

- `solo_icono` siempre con `title="Descripción de la acción"`.
- Imágenes con `alt` descriptivo; decorativas con `alt=""`.
- Campos con `<label>` relacionado por `for`/`id`.
- Links externos: `target="_blank" rel="noopener noreferrer"`.

---

## Componentes usados en este proyecto

> Marca los que aplican para orientar las sugerencias.

- [ ] Header con verificador oficial
- [ ] Sidebar (menú vertical)
- [ ] Megamenu horizontal
- [ ] Footer institucional
- [ ] Tablas con acciones
- [ ] Formularios con `seccion_formulario`
- [ ] Modales de confirmación
- [ ] Alertas (todas las variantes)
- [ ] Tarjetas en grid
- [ ] Tabs / Pestañas
- [ ] Acordeón / FAQ
- [ ] Breadcrumbs
- [ ] Carrusel / Banner
- [ ] Login institucional
- [ ] Numeralia / Contadores
- [ ] Chips / Etiquetas de estado
- [ ] Dropdowns
- [ ] Tooltips
- [ ] Avatar
- [ ] Buscador
