import { extensionArchivo, formatBytes } from '@/utilidades';
import React from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from '.';
import { useInputReciclable } from './hooks';

interface InputArchivoProps extends InputReciclableBase {
  multiple?: boolean;

  /** Propiedad `accept` del input nativo. */
  accept?: string;

  /**
   * Lista de extensiones permitidas para los archivos. Las extensiones deben contener un punto
   * al inicio.
   *
   * Usar esta propiedad para validar que los archivos tengan las extensiones permitidas porque
   * la propiedad `accept` es solo una ayuda para el navegador y el selector de archivos, pero no
   * valida que los archivos efectivamente tengan esas extensiones
   * ([mas info](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#overview))
   *
   * @example
   *  ```typescriptreact
   *  <InputArchivo extensionesPermitidas={['.pdf', '.mp3', '.flac']} />
   *  ```
   */
  extensionesPermitidas?: string[];

  /** Tamaño minimo de los archivos, en bytes. */
  tamanoMinimo?: number;

  /** Tamaño maximo de los archivos, en bytes. */
  tamanoMaximo?: number;
}

/** El valor del input va a ser un  {@link FileList} */
export const InputArchivo: React.FC<InputArchivoProps> = ({
  name,
  label,
  className,
  opcional,
  deshabilitado,
  multiple,
  accept,
  extensionesPermitidas,
  tamanoMinimo,
  tamanoMaximo,
}) => {
  const { register } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'archivo',
    name,
    label: {
      texto: label,
      opcional,
    },
  });

  return (
    <>
      <FormGroup controlId={idInput} className={`${className ?? ''} position-relative`}>
        {textoLabel && <Form.Label>{textoLabel}</Form.Label>}

        <Form.Control
          type="file"
          isInvalid={tieneError}
          accept={accept}
          disabled={deshabilitado}
          multiple={multiple !== undefined && multiple === true}
          {...register(name, {
            required: {
              value: !opcional,
              message: 'Este campo es obligatorio',
            },
            validate: {
              tamanoMinimoPermitido: (archivos: FileList) => {
                if (!tamanoMinimo) {
                  return;
                }

                for (let index = 0; index < archivos.length; index++) {
                  const archivo = archivos.item(index)!;

                  if (archivo.size < tamanoMinimo) {
                    return archivos.length === 1
                      ? `Debe tener un tamaño mayor o igual a ${formatBytes(tamanoMinimo)}`
                      : `Hay archivos con un tamaño menor a ${formatBytes(tamanoMinimo)}`;
                  }
                }
              },
              tamanoMaximoPermitido: (archivos: FileList) => {
                if (!tamanoMaximo) {
                  return;
                }

                for (let index = 0; index < archivos.length; index++) {
                  const archivo = archivos.item(index)!;

                  if (archivo.size > tamanoMaximo) {
                    return archivos.length === 1
                      ? `Debe tener un tamaño menor o igual a ${formatBytes(tamanoMaximo)}`
                      : `Hay archivos con un tamaño mayor a ${formatBytes(tamanoMaximo)}`;
                  }
                }
              },
              tienenExtensionesPermitidas: (archivos: FileList) => {
                if (!extensionesPermitidas) {
                  return;
                }

                for (let index = 0; index < archivos.length; index++) {
                  const archivo = archivos.item(index)!;

                  if (!extensionesPermitidas.includes(extensionArchivo(archivo.name))) {
                    const exts = extensionesPermitidas.join(' ,');

                    return archivos.length === 1
                      ? `Debe tener alguna de las siguientes extensiones: ${exts}`
                      : `Solo se permiten archivos con las siguientes extensiones: ${exts}`;
                  }
                }
              },
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
