export function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[#13bfd3] to-[#156eea] shadow-lg shadow-blue-200">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 fill-white"
        >
          <path d="M12 21s-7.5-4.28-7.5-11.3V5.6L12 3l7.5 2.6v4.1C19.5 16.72 12 21 12 21Zm-3.7-10.2h2.45V8.35h2.5v2.45h2.45v2.5h-2.45v2.45h-2.5V13.3H8.3v-2.5Z" />
        </svg>
      </div>

      <div className="leading-tight">
        <p className="text-sm font-extrabold tracking-tight text-[#12324f]">
          Medisystem <span className="text-[#156eea]">HIS</span>
        </p>
        <p className="text-[10px] font-medium text-slate-400">
          Hospital Information System
        </p>
      </div>
    </div>
  );
}