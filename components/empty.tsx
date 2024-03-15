interface EmptyProps {
  label: string;
}

export default function Empty({ label }: EmptyProps) {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
      <p className="text-primary text-4xl text-center">{label}</p>
    </div>
  );
}
