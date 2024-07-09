'use client';

import { NoExistePdfLicenciaError, buscarPdfLicencia } from '@/servicios/buscar-pdf-licencia';
import { AlertaError, base64ToBlob } from '@/utilidades';
import React, { ReactNode } from 'react';

export interface PdfLicencia {
  blob: Blob;
  folioLicencia: string;
  idOperador: number;
}

interface BotonVerPdfLicenciaProps {
  folioLicencia: string;
  idOperador: number;
  children: ReactNode;
  /** Tamaño del boton (defecto: `md`) */
  size?: 'sm' | 'md' | 'lg';
  onGenerarPdf: () => void;
  onPdfGenerado: (pdfLicencia: PdfLicencia) => void;
  onErrorGenerarPdf: () => void;
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
  onErrorGenerarPdf,
}) => {
  const buscarPdfLicenciaHandler = async () => {
    onGenerarPdf();

    try {
      const { archivo } = await buscarPdfLicencia(folioLicencia, idOperador);
      const blobPdfLicencia = base64ToBlob(archivo, { type: 'application/pdf' });
      onPdfGenerado({
        blob: blobPdfLicencia,
        folioLicencia,
        idOperador,
      });
    } catch (error) {
      onErrorGenerarPdf();
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
