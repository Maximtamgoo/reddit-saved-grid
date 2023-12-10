import { useState } from "react";
import style from "./Card.module.css";
import { MasonryPost } from "../../types/MasonryPost.type";

type Props = {
  data: MasonryPost;
  onOpen: () => void;
};

export default function Card({ data, onOpen }: Props) {
  const [loading, setLoading] = useState(true);

  async function onLoad() {
    // await new Promise(r => setTimeout(r, 2000))
    setLoading(false);
  }

  if (data.type !== "error") {
    return (
      <div className={style.card} onClick={onOpen}>
        <img
          className={style.card_img}
          onLoad={onLoad}
          src={data.card.url}
          alt="Reddit Content"
          style={{ filter: loading ? "blur(5px)" : "blur(0)" }}
        />
        {data.type === "gallery" ? (
          <div className={style.gallery_count}>{data.modal.length}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={style.card} onClick={onOpen}>
      <div className={style.unknown}>?</div>
    </div>
  );
}
