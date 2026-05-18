export function Marquee({ text, repeat = 6 }: { text: string; repeat?: number }) {
  return (
    <div className="overflow-hidden bg-[#2C2C2C] py-5 select-none" dir="ltr">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: repeat * 2 }).map((_, i) => (
          <span
            key={i}
            className="mx-8 text-[11px] md:text-xs font-light tracking-[0.45em] text-[#C4A36E] uppercase font-sans"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
