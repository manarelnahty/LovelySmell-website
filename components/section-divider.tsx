export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="h-px w-16 bg-gradient-to-l from-[#C4A36E] to-transparent" />
      <div className="w-2 h-2 rotate-45 border border-[#C4A36E]" />
      <div className="h-px w-16 bg-gradient-to-r from-[#C4A36E] to-transparent" />
    </div>
  );
}
