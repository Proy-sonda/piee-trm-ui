import Position from '@/components/stage/position';

export default function LicenciasTramitadasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Position tabActiva="licencias-tramitadas" />
      <div className="mx-3 mx-lg-5 py-4">{children}</div>
    </>
  );
}
