'use client';

import { Unidadesrrhh } from '@/modelos';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { InputReciclableBase } from './base-props';
import { ComboSimple, esElValorPorDefecto, valorPorDefectoCombo } from './combo-simple';

interface ComboUnidadesRRHHProps extends InputReciclableBase {
  rutEmpleadorSeleccionado: string;
  unidadesRRHH?: Unidadesrrhh[];
}

/**
 * Separa el ID de la unidad obtenido desde el {@link ComboUnidadesRRHH} en el codigo de la unidad
 * y el ID del operador.
 */
export const descomponerIdUnidad = (idUnidadRRHH: `${string}|${number}`) => {
  if (esElValorPorDefecto(idUnidadRRHH)) {
    return undefined;
  }

  const [codigoUnidad, idOperador] = idUnidadRRHH.split('|');
  return {
    codigoUnidad,
    idOperador: parseInt(idOperador, 10),
  };
};

/**
 * El valor del combo sera un string con el siguiente formato `<codigo unidad>|<id operador>`, por
 * ejemplo "TE01|3", que indica la unidad con código `TE01` de IMED.
 */
export const ComboUnidadesRRHH: React.FC<ComboUnidadesRRHHProps> = ({
  name,
  label,
  className,
  unidadesRRHH,
  rutEmpleadorSeleccionado,
  opcional,
}) => {
  const { setValue } = useFormContext();

  // Restaura el valor del combo a la opcion por defecto cuando no hay empleador
  useEffect(() => {
    if (esElValorPorDefecto(rutEmpleadorSeleccionado)) {
      setValue(name, valorPorDefectoCombo('string'));
    }
  }, [rutEmpleadorSeleccionado]);

  const ordenarUnidades = (unidades: Unidadesrrhh[]) => {
    const unidadesImed = unidades
      .filter((u) => u.CodigoOperador === 3)
      .sort((a, b) => a.GlosaUnidadRRHH.localeCompare(b.GlosaUnidadRRHH));

    const unidadesMedipass = unidades
      .filter((u) => u.CodigoOperador === 4)
      .sort((a, b) => a.GlosaUnidadRRHH.localeCompare(b.GlosaUnidadRRHH));

    return unidadesImed.concat(unidadesMedipass);
  };

  return (
    <ComboSimple
      opcional={opcional}
      name={name}
      label={label}
      datos={ordenarUnidades(unidadesRRHH ?? [])}
      idElemento={(u) => `${u.CodigoUnidadRRHH}|${u.CodigoOperador}`}
      descripcion={(u) => {
        const operador = u.CodigoOperador === 3 ? 'imed' : 'medipass';
        return `(${operador}) ${u.GlosaUnidadRRHH}`;
      }}
      tipoValor="string"
      className={className}
    />
  );
};
