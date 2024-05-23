import { CARD_MAX_HEIGHT, CARD_MIN_HEIGHT } from "@src/constant";

type Props = {
  text: string;
};

export default function Text({ text }: Props) {
  return (
    <div
      className="overflow-hidden whitespace-break-spaces break-words px-4"
      style={{
        minHeight: CARD_MIN_HEIGHT,
        maxHeight: CARD_MAX_HEIGHT
      }}
    >
      {text}
    </div>
  );
}
