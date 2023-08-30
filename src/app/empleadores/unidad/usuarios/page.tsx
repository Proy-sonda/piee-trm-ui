import Titulo from '@/components/titulo/titulo';

interface iUsuarios {
  searchParams: {
    unidad: string;
    id: number;
    razon: string;
  };
}

const UsuariosPageRrhh = ({ searchParams }: iUsuarios) => {
  const { id, unidad, razon } = searchParams;
  return (
    <div className="bgads">
      <div className="ms-5 me-5">
        <div className="row">
          <Titulo manual="Manual" url="">
            <h5>Empleadores / Dirección y Unidades RRHH - {unidad}</h5>
          </Titulo>
        </div>

        <div className="row mt-2"></div>
      </div>
    </div>
  );
};

export default UsuariosPageRrhh;
