import Position from '@/components/stage/position';

export default function ConsultasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Position tabActiva="consultas" />
      <div className="mx-3 mx-lg-5 py-4">{children}</div>
    </>
  );
}
