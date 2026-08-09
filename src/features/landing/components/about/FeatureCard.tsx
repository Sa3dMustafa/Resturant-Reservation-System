interface Props {
  title: string;
  description: string;
}

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="relative flex flex-col items-center px-8 text-center">
      <h3 className="text-2xl font-semibold text-primary">{title}</h3>
      <p className="mt-8 max-w-sm text-lg leading-9 text-[#F5F1F2]">
        {description}
      </p>
    </div>
  );
}
