interface Props {
  total: number;
  currentSlide: number;
  onChange: (index: number) => void;
}

export default function HeroDots({
  total,
  currentSlide,
  onChange,
}: Props) {
  return (
    <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-3">

      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`
            h-2
            rounded-full
            transition-all
            ${
              currentSlide === index
                ? "w-6 bg-primary"
                : "w-2 bg-white"
            }
          `}
        />
      ))}
    </div>
  );
}