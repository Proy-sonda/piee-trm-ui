import React from 'react';
import { Form, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import IfContainer from '../if-container';
import { InputReciclableBase } from './base-props';
import { useInputReciclable } from './hooks';

interface InputNumeroProps extends InputReciclableBase {}

export const InputNumero: React.FC<InputNumeroProps> = ({ name, label, className }) => {
  const { register, setValue } = useFormContext();

  const { idInput, textoLabel, tieneError, mensajeError } = useInputReciclable({
    prefijoId: 'numero',
    name,
    label: { texto: label },
  });

  return (
    <>
      <FormGroup className={`${className ?? ''} position-relative`} controlId={idInput}>
        <IfContainer show={textoLabel}>
          <Form.Label>
            <span> {textoLabel}</span>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={(props) => (
                <Tooltip id="button-tooltip" {...props}>
                  {'Ingresar "S/N" si no tiene número'}
                </Tooltip>
              )}>
              <i className="ms-2 text-primary bi bi-info-circle" style={{ fontSize: '16px' }}></i>
            </OverlayTrigger>
          </Form.Label>
        </IfContainer>

        <Form.Control
          type="text"
          autoComplete="new-custom-value"
          isInvalid={tieneError}
          {...register(name, {
            required: {
              message: 'Este campo es obligatorio',
              value: true,
            },
            pattern: {
              value: /^(\d{1,20}|[Ss]\/[Nn])$/g,
              message: 'Debe contener solo dígitos o S/N',
            },
            maxLength: {
              value: 20,
              message: 'No puede tener más de 20 dígitos',
            },
            onChange: (event: any) => {
              const regex = /[^0-9SsnN\/]/g;
              const valor = event.target.value as string;

              if (regex.test(valor)) {
                const valorSoloDigitos = valor.replaceAll(regex, '');
                setValue(name, valorSoloDigitos);
              }
            },
            onBlur: (event: any) => {
              setValue(name, (event.target.value as string).toUpperCase());
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
