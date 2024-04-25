import { AlertaConfirmacion } from '@/utilidades';

export default function ExportarTabla({ data, nombre }: any) {
  // exportar los datos a csv
  const exportarCSV = async () => {
    const resp = await AlertaConfirmacion.fire({ html: '¿Desea exportar los datos a CSV?' });
    if (!resp.isConfirmed) return;
    const csv = data.map((row: any) => {
      return Object.values(row).join(',');
    });
    csv.unshift(Object.keys(data[0]).join(','));
    const csvArray = csv.join('\r\n');
    const a = document.createElement('a');
    a.href = 'data:attachment/csv,' + encodeURIComponent(csvArray);
    a.target = '_blank';
    a.download = `${nombre}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <a
      className="text-primary"
      style={{
        cursor: 'pointer',
      }}
      onClick={exportarCSV}>
      Exportar
    </a>
  );
}
