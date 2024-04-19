type Props = {
  title: string;
  id: string;
  children: React.ReactNode;
};

export const Section = ({ title, id, children }: Props) => {
  return (
    <section id={id} className="py-16 md:py-24 space-y-16">
      <h2 className="text-center text-gradient text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {title}
      </h2>

      {children}
    </section>
  );
};
