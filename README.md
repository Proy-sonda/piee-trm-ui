# PIEE Tramitación <!-- omit in toc -->

## Índice <!-- omit in toc -->

- [Instalación](#instalación)
  - [Requerimientos](#requerimientos)
  - [Desarrollo](#desarrollo)
  - [Configurar prettier en VS Code](#configurar-prettier-en-vs-code)
  - [Formatear código](#formatear-código)
- [Estructura de carpetas](#estructura-de-carpetas)
  - [Carpeta `src`](#carpeta-src)
  - [Estructura por pantalla](#estructura-por-pantalla)
  - [¿Como refactorizar?](#como-refactorizar)
- [Convenciones de código](#convenciones-de-código)
- [TODO: Scripts](#todo-scripts)
- [TODO: Branches](#todo-branches)

## Instalación

### Requerimientos

- NodeJS >= 16.8
- Yarn 1.22.29. Si se instaló una versión de yarn >= se puede setear la versión de esta forma
  ```
  corepack prepare yarn@1.22.29 --activate
  ```

### Desarrollo

1. Instalar las dependencias con

   ```
   yarn install --frozen-lockfile
   ```

   El flag `--frozen-lockfile` evitará que se modifique el `yarn.lock`

2. Correr el proyeto con `yarn dev`

3. Abrir el navegador en http://localhost:3005

### Configurar prettier en VS Code

1. Instalar la extensión de prettier `esbenp.prettier-vscode`. Se puede usar ese nombre en el buscador de extensiones del VS Code.

2. Abrir las configuraciones en JSON del VS Code y agregar las siguientes líneas

   ```json
   "[typescriptreact]": {
       "editor.defaultFormatter": "esbenp.prettier-vscode",
       "editor.formatOnSave": true
   },
   ```

   Esto formateará los archivos `.tsx` automáticamente al momento de guardar.

   > Las configuraciones en JSON se encuentran apretando `F1` y escribiendo ">Open User Settings (JSON)"

### Formatear código

Para formatear todo el código dentro de la carpeta `/app` se puede usar el siguiente script

```shell
yarn format:fix
```

## Estructura de carpetas

Todo el código de la aplicación está en la carpeta `src`.

### Carpeta `src`

El primer nivel de la carpeta `src` tiene los elementos "globales" de la aplicación, es decir, que se usan en distintas pantallas/componentes/etc a través de toda la aplicación en vez de en un lugar concreto.

| Carpeta      | Descripción                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `app`        | Las páginas de la aplicación                                                                                                                |
| `components` | Componentes globales y returilizables                                                                                                       |
| `contexts`   | Contextos (TODO: definir mejor)                                                                                                             |
| `helpers`    | **_Deprecada_**. Era el equivalente a la carpeta `servicios`, pero hay que mover el código a las pantallas/componentes/etc correspondientes |
| `hooks`      | Hooks de react globales                                                                                                                     |
| `img`        | TODO: definir                                                                                                                               |
| `modelos`    | Tipos de datos globales                                                                                                                     |
| `servicios`  | Llamadas la API, etc. A diferencia de las utilidades estas tienen sentido de negocio o relacionadas a la aplicación.                        |
| `utilidades` | Funciones de caracter general (formateadores, validadores, etc)                                                                             |

### Estructura por pantalla

Como Nextjs tiene enrutamiento por la estructura de carpetas, cada subcarpeta dentro de `src/app` tiene la siguiente estructura

| Carpeta                 | Descripción                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/<path>/page.tsx`      | La pantalla que uno ve en el navegador                                                                                            |
| `/<path>/(componentes)` | Componentes usados solamente en la pantalla `/<path>/page.tsx`                                                                    |
| `/<path>/(servicios)`   | Servicios usados en la pantalla `/<path>/page.tsx` o en subrutas de esta                                                          |
| `/<path>/(modelos)`     | Modelos usados para tipear los servicios en `/<path>/(servicios)` o en las carpetas `(servicios)` de las subrutas de la pantalla. |

### ¿Como refactorizar?

TODO: Describir mejor

En caso de querer utilizar codigo en carpetas hermanas, por ejemplo, si `/path_1/path_2/pagina_1/page.tsx` se quiere usar un servicio que está en `/path_1/path_2/pagina_2/(servicios)`, en lugar de importar directamente mover el servicio a la ruta común más cercana (en `src/app`) que sería `/path_1/path_2/(servicios)`. En caso de que no exista una ruta común, moverlo a nivel global en `src/app/servicios`. Lo mismo para modelos y componentes.

## Convenciones de código

**Nombres de archivos**:

- Todo en minúscula, separado por un guión (`-`) cuando tiene más de una palabra.
- No usar abreviaciones en las palabras individuales, a menos que sea algo de conocimiento general como RRHH para recursos humanos.
- No ocupar "i" para indicar que es una interfaz.

| Ejemplos OK :blush:            | Ejemplos malos :rage:  |
| ------------------------------ | ---------------------- |
| `eliminar-usuario-asociado.ts` | `elimusua.ts`          |
| `buscar-empleadores.ts`        | `buscarEmpleadores.ts` |
| `trabajador.ts`                | `itrabajador.ts`       |
| `tabla-licencias-vencidas.tsx` | `TablaLicVen.tsx`      |

**Nombres de variables y funciones**:

- Usar camel case con la primera letra en minúscula.
- No usar abreviaciones en las palabras individuales, a menos que sea algo de conocimiento general como RRHH para recursos humanos.
- No ocupar "i" para indicar que es una interfaz.

| Ejemplos OK :blush:     | Ejemplos malos :rage:   |
| ----------------------- | ----------------------- |
| `buscarEmpleadorPorId`  | `buscarEmpId`           |
| `actividadesLaborales`  | `actLab`                |
| `sistemaDeRemuneracion` | `sistemaderemuneracion` |

## TODO: Scripts

¿Los scripts de npm y que es lo que hacen?

## TODO: Branches

- Ramas y para que se usan
- Convenciones en los nombres de las ramas
- Convenciones en estructuras de commits
- Convenciones al momento de integrar cambios (pull requests)
- etc
