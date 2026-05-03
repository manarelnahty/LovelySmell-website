export function Marquee({ text, repeat = 6 }: { text: string; repeat?: number }) {
  return (
    <div className="overflow-hidden bg-[#2C2C2C] py-4 select-none" dir="ltr">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: repeat * 2 }).map((_, i) => (
          <span
            key={i}
            className="mx-8 text-sm tracking-[0.3em] text-[#C4A36E]/70 font-playfair uppercase"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
