# PIEE Tramitación <!-- omit in toc -->

## Índice <!-- omit in toc -->

- [Instalación](#instalación)
- [Requerimientos](#requerimientos)
- [Desarrollo](#desarrollo)
  - [Instalar proyecto](#instalar-proyecto)
  - [Configurar prettier en VS Code](#configurar-prettier-en-vs-code)
  - [Formatear código](#formatear-código)
- [Estructura de carpetas](#estructura-de-carpetas)
  - [Carpeta `src`](#carpeta-src)
  - [Estructura por pantalla](#estructura-por-pantalla)
  - [¿Como refactorizar?](#como-refactorizar)
- [Convenciones de código](#convenciones-de-código)
  - [Nombres de archivos](#nombres-de-archivos)
  - [Nombres de variables y funciones](#nombres-de-variables-y-funciones)
  - [¿Donde poner estilos?](#donde-poner-estilos)
- [Llamar a endpoints que solo traen datos](#llamar-a-endpoints-que-solo-traen-datos)
  - [Creación del modelo](#creación-del-modelo)
  - [Creación del servicio](#creación-del-servicio)
  - [Usar los hooks en los componentes](#usar-los-hooks-en-los-componentes)
  - [Preguntas Frecuentes](#preguntas-frecuentes)
    - [Como re ejecutar el hook cuando hay cambios](#como-re-ejecutar-el-hook-cuando-hay-cambios)
    - [Como usar el hook con datos que aún no se tienen](#como-usar-el-hook-con-datos-que-aún-no-se-tienen)
    - [Como trabajar con la respuesta dentro de `runFetchAbortable`](#como-trabajar-con-la-respuesta-dentro-de-runfetchabortable)
    - [Como parchar formularios una vez que se tengan los datos](#como-parchar-formularios-una-vez-que-se-tengan-los-datos)
- [Llamar a endpoints que hacen cambios](#llamar-a-endpoints-que-hacen-cambios)
- [Crear inputs reciclables](#crear-inputs-reciclables)
  - [Crear un nuevo input](#crear-un-nuevo-input)
  - [Preguntas frecuentes](#preguntas-frecuentes-1)
    - [¿Cómo sobreescribir los mensajes de error?](#cómo-sobreescribir-los-mensajes-de-error)
    - [¿Cómo unir input con field array de `react-hook-form`?](#cómo-unir-input-con-field-array-de-react-hook-form)
    - [¿Donde colocar los inputs?](#donde-colocar-los-inputs)
- [TODO: Scripts](#todo-scripts)
- [TODO: Branches](#todo-branches)

# Instalación

# Requerimientos

- NodeJS >= 16.8
- Yarn 1.22.29. Si se instaló una versión de yarn >= se puede setear la versión de esta forma
  ```
  corepack prepare yarn@1.22.29 --activate
  ```

# Desarrollo

## Instalar proyecto

1. Instalar las dependencias con

   ```
   yarn install --frozen-lockfile
   ```

   El flag `--frozen-lockfile` evitará que se modifique el `yarn.lock`

2. Correr el proyeto con `yarn dev`

3. Abrir el navegador en http://localhost:3005

## Configurar prettier en VS Code

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

## Formatear código

Para formatear todo el código dentro de la carpeta `/app` se puede usar el siguiente script

```shell
yarn format:fix
```

# Estructura de carpetas

Todo el código de la aplicación está en la carpeta `src`.

## Carpeta `src`

El primer nivel de la carpeta `src` tiene los elementos "globales" de la aplicación, es decir, que se usan en distintas pantallas/componentes/etc a través de toda la aplicación en vez de en un lugar concreto.

| Carpeta      | Descripción                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `app`        | Las páginas de la aplicación                                                                                         |
| `components` | Componentes globales y returilizables                                                                                |
| `contexts`   | Contextos (TODO: definir mejor)                                                                                      |
| `hooks`      | Hooks de react globales                                                                                              |
| `img`        | TODO: definir                                                                                                        |
| `modelos`    | Tipos de datos globales                                                                                              |
| `servicios`  | Llamadas la API, etc. A diferencia de las utilidades estas tienen sentido de negocio o relacionadas a la aplicación. |
| `utilidades` | Funciones de caracter general (formateadores, validadores, etc)                                                      |

## Estructura por pantalla

Como Nextjs tiene enrutamiento por la estructura de carpetas, cada subcarpeta dentro de `src/app` tiene la siguiente estructura

| Carpeta                 | Descripción                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/<path>/page.tsx`      | La pantalla que uno ve en el navegador                                                                                            |
| `/<path>/(componentes)` | Componentes usados solamente en la pantalla `/<path>/page.tsx`                                                                    |
| `/<path>/(servicios)`   | Servicios usados en la pantalla `/<path>/page.tsx` o en subrutas de esta                                                          |
| `/<path>/(modelos)`     | Modelos usados para tipear los servicios en `/<path>/(servicios)` o en las carpetas `(servicios)` de las subrutas de la pantalla. |

## ¿Como refactorizar?

TODO: Describir mejor

En caso de querer utilizar codigo en carpetas hermanas, por ejemplo, si `/path_1/path_2/pagina_1/page.tsx` se quiere usar un servicio que está en `/path_1/path_2/pagina_2/(servicios)`, en lugar de importar directamente mover el servicio a la ruta común más cercana (en `src/app`) que sería `/path_1/path_2/(servicios)`. En caso de que no exista una ruta común, moverlo a nivel global en `src/app/servicios`. Lo mismo para modelos y componentes.

# Convenciones de código

## Nombres de archivos

- Todo en minúscula, separado por un guión (`-`) cuando tiene más de una palabra.
- No usar abreviaciones en las palabras individuales, a menos que sea algo de conocimiento general como RRHH para recursos humanos.
- No ocupar "i" para indicar que es una interfaz.

| Ejemplos OK :blush:            | Ejemplos malos :rage:  |
| ------------------------------ | ---------------------- |
| `eliminar-usuario-asociado.ts` | `elimusua.ts`          |
| `buscar-empleadores.ts`        | `buscarEmpleadores.ts` |
| `trabajador.ts`                | `itrabajador.ts`       |
| `tabla-licencias-vencidas.tsx` | `TablaLicVen.tsx`      |

## Nombres de variables y funciones

- Usar camel case con la primera letra en minúscula.
- No usar abreviaciones en las palabras individuales, a menos que sea algo de conocimiento general como RRHH para recursos humanos.
- No ocupar "i" para indicar que es una interfaz.

| Ejemplos OK :blush:     | Ejemplos malos :rage:   |
| ----------------------- | ----------------------- |
| `buscarEmpleadorPorId`  | `buscarEmpId`           |
| `actividadesLaborales`  | `actLab`                |
| `sistemaDeRemuneracion` | `sistemaderemuneracion` |

## ¿Donde poner estilos?

Hay 2 opciones para poner los estilos

1. En un archivo `X.module.css` si los estilos aplican a un solo componente especifico.
2. En el archivo `src\app\globals.css` **_SOLO SI_** aplica para 2 o más componentes.

# Llamar a endpoints que solo traen datos

Para obtener datos para cargar combos o para parchar un formulario como obtener la entidad empleadora para editar, existen 3 funciones que estan en el modulo `@/hooks/use-merge-fetch`:

- `useMergeFetchObject`: Hace varias llamadas al mismo tiempo y unifica los resultados en un objeto.
- `useMergeFetchArray`: Hace varias llamadas al mismo tiempo y unifica los resultados en una tupla.
- `useFetch`: Obtiene los resultados de una sola llamada.

> IMPORTANTE Estas funciones son solo para obtener datos, para hacer cambios se debe hacer como se indica [aquí](#llamar-a-endpoints-que-hacen-cambios)

A continuación se pone un ejemplo de como usarlos, usando las convenciones detalladas arriba. Para el ejemplo se va a suponer que se está trabajando en una pantalla en la carpeta `src/app/ejemplo/page.tsx`.

## Creación del modelo

Primero se debe crear un tipo que refleje lo que devuelve la API, que debe ser una `interface` o un `type`.

```typescript
// Archivo: src/app/ejemplo/(modelos)/mi-modelo.ts
export interface MiModelo {
  idmodelo: number;
  glosamodelo: string;
}

// o tambien puede ser
export type MiModelo = {
  idmodelo: number;
  glosamodelo: string;
};
```

No se debe usar una clase (`class`) para definir el modelo porque por se usa un `JSON.parse` por debajo y este devuelve un objeto, no una clase. Además, al usar una clase se puede creer que se le pueden agregar métodos y typescript no se va a quejar, pero al momento de ejecutarse el código va a tirar un error de que el método no existe que ocurre debido a que, nuevamente, se va a devolver un objeto y no una clase.

## Creación del servicio

Una vez se creado el modelo se debe definir el servicio. Para poder usar un servicio dentro de los hooks mencionados arriba, se debe usar la función `runFetchAbortable` que tiene la misma interfaz que `fetch`

```typescript
// Archivo: src/app/ejemplo/(servicios)/buscar-mi-modelo-por-id.ts

import { runFetchAbortable } from '@/servicios/fetch';

export const buscarMiModeloPorId = (idModelo: number) => {
  return runFetchAbortable<MiModelo>(`${apiUrl()}/mimodelo/obtenerporid`, {
    method: 'POST',
    body: JSON.stringify({ idModelo }),
  });
};
```

Para `runFetchAbortable`, la parte que define el tipo `runFetchAbortable<MiModelo>` es solo una sugerencia para typescript, no se valida que lo devuelta tenga exactamente lo que dice tener el tipo.

## Usar los hooks en los componentes

Una vez listos los modelos y servicios, se pueden usar dentro de un componente de la siguiente forma

```typescript react
// Archivo: src/app/ejemplo/page.tsx

import { useFetch, useMergeFetchArray, useMergeFetchObject } from '@/hooks/use-merge-fetch';

const EjemploPage: React.FC<{}> = ({}) => {
  // Con useMergeFetchObject
  const [err, datos, cargando] = useMergeFetchObject({
    modelo: buscarMiModeloPorId(234),
  });

  return (
    { datos &&
      <div>
        <p>Modelo ID: {datos.modelo.idmodelo}</p>
        <p>Glosa Moedlo ID: {datos.modelo.glosamodelo}</p>
      </div>
    }
  );

  // Con useMergeFetchArray
  const [err, [modelo], cargando] = useMergeFetchArray([
    buscarMiModeloPorId(234),
  ]);

  return (
    { modelo &&
      <div>
        <p>Modelo ID: {modelo.idmodelo}</p>
        <p>Glosa Moedlo ID: {modelo.glosamodelo}</p>
      </div>
    }
  );

  // Con useFetch
  const [err, modelo, cargando] = useFetch(buscarMiModeloPorId(234));

  return (
    { modelo &&
      <div>
        <p>Modelo ID: {modelo.idmodelo}</p>
        <p>Glosa Moedlo ID: {modelo.glosamodelo}</p>
      </div>
    }
  );
}
```

## Preguntas Frecuentes

### Como re ejecutar el hook cuando hay cambios

Cada uno de los hooks aceptan un arreglo de dependencias que se puede usar para re ejecutar las llamadas cuando alguna de las dependencias cambie. En concreto, se puede usar el hook `useRefrescarPagina`. Para los ejemplos anteriores

```typescript react
// Archivo: src/app/ejemplo/page.tsx

import { useFetch, useMergeFetchArray, useMergeFetchObject } from '@/hooks/use-merge-fetch';
import { useRefrescarPagina } from '@/hooks/use-refrescar-pagina';  // Importar hook

const EjemploPage: React.FC<{}> = ({}) => {
  // El primer dato es para pasarlo como dependencia a los hooks y el segundo
  // es una funcion que va a cambiar el valor de `refresh` para que react
  // re ejecute los hooks
  const [refresh, refrescarHooks] = useRefrescarPagina();

  // Con useMergeFetchObject
  const [err, datos, cargando] = useMergeFetchObject(
    {
      modelo: buscarMiModeloPorId(234),
    },
    [refresh], // <=== Configurar el refrescado aqui
  );

  // Con useMergeFetchArray
  const [err, [modelo], cargando] = useMergeFetchArray(
    [
      buscarMiModeloPorId(234),
    ],
    [refresh], // <=== Configurar el refrescado aqui
  );

  // Con useFetch
  const [err, modelo, cargando] = useFetch(
    buscarMiModeloPorId(234),
    [refresh], // <=== Configurar el refrescado aqui
  );

  const crearNuevoModelo = () => {
    // Llamar algun endpoint que crea un nuevo modelo

    refrescarHooks();
  }

  return (...);
}
```

### Como usar el hook con datos que aún no se tienen

Si se necesita algún dato para ejecutar el servicio, pero esteno se tiene aún, se puede usar la función `emptyFetch` en conjunto con el arreglo de dependencias.

Para el ejemplo, suponer que el ID del modelo viene como propiedad del componente y que esta puede ser `undefined`. En este caso el servicio `buscarMiModeloPorId` va a reclamar porque espera un `number` como ID, no un `number | undefined`. Este tipo de casos se solucionan de esta forma

```typescript react
// Archivo: src/app/ejemplo/page.tsx

import { emptyFetch, useFetch, useMergeFetchArray, useMergeFetchObject } from '@/hooks/use-merge-fetch';


// En este caso se pasa el ID del modelo como propiedad, pero este puede ser
// undefined
const AlgunComponente: React.FC<{ idModelo?: number }> = ({ idModelo }) => {
  // En cada uno de los siguientes ejemplos, se usa el operador ternario ?: para
  // verificar que exista el ID este definido antes de llamar al servicio, de
  // lo contrario se usa el emptyFetch. Se debe pasar el idModelo como dependencia
  // a los hooks para que react vuelva a correr el hook cuando el idModelo este
  // definido

  // Con useMergeFetchObject
  const [err, datos, cargando] = useMergeFetchObject(
    {
      modelo: idModelo ? buscarMiModeloPorId(idModelo) : emptyFetch(),
    },
    [idModelo], // Pasar el idModelo como dependencia
  );

  // Con useMergeFetchArray
  const [err, [modelo], cargando] = useMergeFetchArray(
    [
      idModelo ? buscarMiModeloPorId(idModelo) : emptyFetch(),
    ],
    [idModelo], // Pasar el idModelo como dependencia
  );

  // Con useFetch
  const [err, modelo, cargando] = useFetch(
    idModelo ? buscarMiModeloPorId(idModelo) : emptyFetch(),
    [idModelo], // Pasar el idModelo como dependencia
  );

  const crearNuevoModelo = () => {
    // Llamar algun endpoint que crea un nuevo modelo

    refrescarHooks();
  }

  return (...);
}
```

### Como trabajar con la respuesta dentro de `runFetchAbortable`

Si por ABC motivo se necesita hacer algo con la respuesta de `runFetchAbortable` y no se puede devolver automáticamente, se puede destructurar el resultado de `runFetchAbortable`.

Para el ejemplo, se supone que se quiere transformar del tipo `MiModelo` a otro tipo
`MiModeloModificado`

```typescript
// Archivo: src/app/ejemplo/(servicios)/buscar-mi-modelo-por-id.ts

import { runFetchAbortable, FetchAbortableResponse } from '@/servicios/fetch';
import { emptyFetch, useFetch, useMergeFetchArray, useMergeFetchObject } from '@/hooks/use-merge-fetch';

// Se debe anotar usar este tipo para el retorno para que typescript lo considere
// como una tupla y no como un arreglo
export const buscarMiModeloPorId = (idModelo: number): FetchAbortableResponse<MiModeloModificado> => {
  const [request, abortador] = runFetchAbortable<MiModelo>(
    `${apiUrl()}/mimodelo/obtenerporid`,
    {
      method: 'POST',
      body: JSON.stringify({ idModelo }),
    }
  );

  // La anotacion del tipo de retorno es solo para el ejemplo, se puede omitir
  // si typescript detecta bien el tipo automaticamente
  const requestModificado = async (): Promise<MiModeloModificado> => {
    const response = await request();

    // Hacer lo que se necesite y devolver algo. En este caso suponemos
    // que se devuelve un nuevo tipo MiModeloModificado
    return ...
  };

  return [requestModificado, abortador];
};
```

### Como parchar formularios una vez que se tengan los datos

Se puede usar `useEffect` para parchar formulario una vez los datos esten disponibles

```typescript react
// En este caso se pasa el ID del modelo como propiedad, pero este puede ser
// undefined
const AlgunComponente: React.FC<{ idModelo?: number }> = ({ idModelo }) => {
   // Con useFetch
  const [err, modelo, cargando] = useFetch(
    idModelo ? buscarMiModeloPorId(idModelo) : emptyFetch(),
    [idModelo], // Pasar el idModelo como dependencia
  );


  useEffect(
    () => {
      if (!modelo) {  // No hacer nada si no hay modelo
        return;
      }

      // Parchar aqui el formulario
    },
    // Se debe pasar el modelo como dependencia para que react ejecute el efecto
    // automaticamente cuando el modelo este definido
    [ modelo ],
  );

  return (...);
}
```

# Llamar a endpoints que hacen cambios

`runFetchAbortable` no se debe usar para generar cambios como crear o eliminar, para eso se debe usar la función `runFetchConThrow` y que tiene la misma interfaz que `fetch`.

```typescript
// Archivo: src/app/ejemplo/(servicios)/crear-nuevo-mi-modelo.ts

import { runFetchAbortable } from '@/servicios/fetch';

export const crearNuevoMiModelo = (glosa: string) => {
  return runFetchConThrow<void>(`${apiUrl()}/mimodelo/crear`, {
    method: 'POST',
    body: JSON.stringify({ glosa }),
  });
};
```

`runFetchConThrow` va a considerar cualquier respuesta con codigo entre 200 y 299 como válida y en cualquier otro caso va a lanzar un error, por lo tanto en el componente se puede manejar de la siguiente forma

```typescript react
 este caso se pasa el ID del modelo como propiedad, pero este puede ser
// undefined
const AlgunComponente: React.FC<{}> = ({ }) => {

  const crearNuevoModelo = async () => {
    try {
      await crearNuevoMiModelo('nueva glosa');

      // Hacer otras cosas en caso de exito
    } catch (error: any) {
      // Hacer algo con el error
    }
  }

  return (...);
}
```

# Crear inputs reciclables

## Crear un nuevo input

Para el ejemplo se va a crear un nuevo input reciclable llamado `NuevoInput` en el archivo `src/components/form/nuevo-input.tsx`. En este archivo se debe agregar lo siguiente

```typescript react
// Archivo: src/components/form/nuevo-input.tsx

import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

// Crear una interfaz para las propiedades del nuevo input que extienda la
// interfaz base. Esta interfaz base incluye propiedades comunes a todos los
// inputs
interface NuevoInputProps extends InputReciclableBase {}

// Exportar directamente el nuevo input, NO USAR "export default" para facilitar
// la re exportación en el index.ts
export const NuevoInput: React.FC<NuevoInputProps> = ({
  name, // <= Con esta propiedad se une con react-hook-form
  label,
  className,
}) => {
  // Lo mínimo es usar esta función para poder registrar el componente con react-hook-form
  const { register } = useFormContext();

  // Este hook permite administrar más facilmente las propiedades comunes. Incluye
  // un id para el input, el label con (*) incluido de ser necesario y los
  // mensajes de error
  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'nuevoInput',
    name,
    label: {
      texto: label,
      opcional: false, // <= Estas son opcionales
      omitirSignoObligatorio: true, // <= Estas son opcionales
    },
  });

  // Aquí se debe definir la UI del input. Se recomienda usar react-bootstrap
  // para que quede más limpio el código
  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        {/* Aquí se definen las reglas de validación, mensajes, etc */}
        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              message: 'Este campo es obligatorio',
              value: true,
            },
            minLength: {
              value: 4,
              message: 'Debe tener al menos 4 caracteres',
            },
            maxLength: {
              value: 80,
              message: 'Debe tener a lo más 80 caracteres',
            },
          })}
        />

        <Form.Control.Feedback type="invalid" tooltip>
          {mensajeError}
        </Form.Control.Feedback>
      </FormGroup>
    </>
  );
};
```

> IMPORTANTE: Ver [aquí](#¿donde-colocar-los-inputs) para saber donde colocar los inputs.

Una vez creado el input se debe re exportar desde el siguiente archivo

```typescript
// Archivo: src\components\form\index.ts

// ... Otras re exportaciones
export * from './nuevo-input.tsx';
```

Finalmente, en algún otro componente se puede reutilizar este nuevo input.

```typescript react
import { FormProvider, useForm } from 'react-hook-form'; // Usar react-hook-form

// Definir interfaz para el formulario. Este deberia ir en un archivo separado
interface AlgunFormulario {
  nuevoInput: string;
}

export const AlgunComponente = () => {
  // Declarar el formulario para usar con react-hook-form
  const formulario = useForm<AlgunFormulario>();

  return (
    <>
      // Importante usar el nuevo input al interior de un FormProvider, sino // va a tirar un error
      <FormProvider {...formulario}>
        <NuevoInput
          // El valor de "name" debe ser alguna de las propiedades declaradas
          // en la interfaz AlgunFormulario
          name="nuevoInput"
          label="Mi nuevo input"
        />
      </FormProvider>
    </>
  );
};
```

## Preguntas frecuentes

### ¿Cómo sobreescribir los mensajes de error?

El input define interiormente los mensajes de error por defecto. Si se quiere sobreescribir algún mensaje extender las propiedades de la siguiente forma

```typescript react
// Archivo: src/components/form/nuevo-input.tsx

import { InputReciclableBase, ErroresEditables } from '@/components/form'

// Los errores que se pueden sobreescribir se declaran como un tipo union de strings
interface NuevoInputProps
  extends InputReciclableBase,
          ErroresEditables<'requerido' | 'muyCorto'>  { }

export const NuevoInput: React.FC<NuevoInputProps> = ({
  name,
  label,
  className,
  errores, // <= Usar la nueva propiedad de errores
}) => {

  return (
    <>
      // ...
      <Form.Control
        type="text"
        autoComplete="new-custom-value"
        isInvalid={tieneError}
        {...register(name, {
          required: {
            value: true,
            {/* Finalmente aquí se le da prioridad al mensaje de error sobreescrito
              y se usa algún mensaje por defecto en caso de que no se incluya */}
            message: errores?.requerido ?? 'Este campo es obligatorio',
          },
          minLength: {
            value: 4,
            message: errores?.muyCorto ?? 'Debe tener al menos 4 caracteres',
          },
          maxLength: {
            value: 80,
            message: 'Debe tener a lo más 80 caracteres',
          },
        })}
      />
    </>
  );
};
```

Por último, en el componente que usa el input se definen solamente los mensajes de error

```typescript react
export const AlgunComponente = () => {
  // ...

  return (
    <>
      <FormProvider {...formulario}>
        <NuevoInput
          name="nuevoInput"
          label="Mi nuevo input"
          // Se sobreescriben solo los mensajes necesarios
          errores={{
            muyCorto: 'Ponle más caracteres',
          }}
        />
      </FormProvider>
    </>
  );
};
```

### ¿Cómo unir input con field array de `react-hook-form`?

Para usar el input con un [useFieldArary de react-hook-form](<[https://](https://www.react-hook-form.com/api/usefieldarray/)>) se debe hacer lo siguiente

```typescript react
// Archivo: src/components/form/nuevo-input.tsx

import { InputReciclableBase, UnibleConFormArray } from '@/components/form'

// Extender la interfaz de propiedades base
interface NuevoInputProps extends InputReciclableBase, UnibleConFormArray { }

export const NuevoInput: React.FC<NuevoInputProps> = ({
  unirConFieldArray, // <= Deestructurar la siguiente propiedad nueva
}) => {
  // Este hook permite administrar más facilmente las propiedades comunes. Incluye
  // un id para el input, el label con (*) incluido de ser necesario y los
  // mensajes de error
  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'nuevoInput',
    name,
    label: { texto: label },
    // Pasar la nueva propiedad al hook para que pueda leer los mensajes de error
    unirConFieldArray,
  });
```

Por último en el componetne que utiliza el input

```typescript react
// Tipear el formulario
interface AlgunFormulario {
  nuevoInput: string;
  miArreglo: ItemArreglo[];
}

interface ItemArreglo {
  uncampo: string;
}

export const AlgunComponente = () => {
  // ...

  const algunFieldArray = useFieldArray({
    name: 'miArreglo',
    // ...otras propiedades
  });

  return (
    <>
      <FormProvider {...formulario}>
        {algunFieldArray.fields.map((field, index) => (
          <div key={field.id}>
            <NuevoInput
              name="nuevoInput"
              label="Mi nuevo input"
              unirConFieldArray={{
                index,
                //  La propiedad de la interfaz ItemArreglo
                campo: 'uncampo',
                // La propiedad de AlgunFormulario que representa el arreglo
                fieldArrayName: 'miArreglo',
              }}
            />
          </div>
        ))}
      </FormProvider>
    </>
  );
};
```

### ¿Donde colocar los inputs?

En la carpeta `src\component\form` si se va a usar en más de un componente, sino en la carpeta `(components)` de la pantalla que se esta implementando (Ver sección [estructura de carpetas](#estructura-de-carpetas)).

# TODO: Scripts

¿Los scripts de npm y que es lo que hacen?

# TODO: Branches

- Ramas y para que se usan
- Convenciones en los nombres de las ramas
- Convenciones en estructuras de commits
- Convenciones al momento de integrar cambios (pull requests)
- etc
