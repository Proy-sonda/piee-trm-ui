import { Empleador } from '@/modelos/empleador';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { generarCSVLicencias } from '../(helper)';
import { LicenciaTramitar } from '../(modelos)';

interface ExportarCSVProps {
  licenciaTramitar: LicenciaTramitar[];
  empleadores: Empleador[];
}

const ExportarCSV: React.FC<ExportarCSVProps> = ({ licenciaTramitar, empleadores }) => {
  return (
    <OverlayTrigger overlay={<Tooltip>Exportar licencias</Tooltip>}>
      <button
        disabled={!licenciaTramitar || licenciaTramitar.length === 0}
        className="btn btn-sm border border-0"
        style={{ fontSize: '20px' }}
        onClick={() => generarCSVLicencias(licenciaTramitar, empleadores)}>
        <i className="bi bi-filetype-csv"></i>
      </button>
    </OverlayTrigger>
  );
};

export default ExportarCSV;
