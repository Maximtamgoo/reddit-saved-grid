type Props = {
  text: string;
};

export default function Text({ text }: Props) {
  return (
    <div className="overflow-hidden whitespace-break-spaces break-words rounded-lg px-4">
      {text}
    </div>
  );
}
