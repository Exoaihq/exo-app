export default function Divider({ className }: { className?: string }) {
  return (
    <div className={`${className} flex items-center my-4`}>
      <div className="h-0.5 bg-slate-200 w-full"></div>
    </div>
  );
}
