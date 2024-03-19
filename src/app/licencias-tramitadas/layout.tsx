import Position from '@/components/stage/position';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Position />
      <div className="mx-3 mx-lg-5 py-4">{children}</div>
    </>
  );
}
