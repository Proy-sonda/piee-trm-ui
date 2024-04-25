'use client';

import { NoExistePdfLicenciaError, buscarPdfLicencia } from '@/servicios/buscar-pdf-licencia';
import { AlertaError } from '@/utilidades';
import React, { ReactNode } from 'react';

interface BotonVerPdfLicenciaProps {
  folioLicencia: string;
  idOperador: number;
  children: ReactNode;
  /** Tamaño del boton (defecto: `md`) */
  size?: 'sm' | 'md' | 'lg';
  onGenerarPdf: () => void;
  onPdfGenerado: () => void;
}

const TAMANOS_BOTON: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export const BotonVerPdfLicencia: React.FC<BotonVerPdfLicenciaProps> = ({
  folioLicencia,
  idOperador,
  children,
  size,
  onGenerarPdf,
  onPdfGenerado,
}) => {
  const buscarPdfLicenciaHandler = async () => {
    onGenerarPdf();

    try {
      const { archivo } = await buscarPdfLicencia(folioLicencia, idOperador);
      const dataUrl = `data:application/pdf;base64,${archivo}`;

      const newWindow = window.open();
      if (!newWindow) {
        return AlertaError.fire({
          title: 'Error',
          html: 'No se pudo abrir el archivo',
        });
      }

      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF Viewer</title>
        </head>
        <body style="margin: 0;">
          <iframe src="${dataUrl}" style="width: 100%; height: 100vh; border: none;"></iframe>
        </body>
        </html>
      `);
    } catch (error) {
      if (error instanceof NoExistePdfLicenciaError) {
        return AlertaError.fire({
          title: 'Error',
          html: `La licencia con folio <b>${folioLicencia}</b> no existe en el operador.`,
        });
      } else {
        return AlertaError.fire({
          title: 'Error',
          html: 'Hubo un error desconocido al generar el PDF de la licencia.',
        });
      }
    } finally {
      onPdfGenerado();
    }
  };

  return (
    <>
      <button
        className={`btn ${TAMANOS_BOTON[size ?? 'md']} btn-primary`}
        onClick={() => buscarPdfLicenciaHandler()}>
        {children}
      </button>
    </>
  );
};
