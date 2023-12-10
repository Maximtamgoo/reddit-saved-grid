import style from "./Navbar.module.css";
import { useStore } from "../../store";
import { ReactComponent as Github } from "../../svg/github.svg";

export default function Navbar() {
  return (
    <div className={style.navbar}>
      <div className={style.wrap}>
        <div className={style.title}>Reddit Saved Masonry</div>
        <div className={style.name}>u/{useStore.getState().username}</div>
      </div>
      <a
        className={style.github_link}
        href="https://github.com/Maximtamgoo/reddit-saved-masonry"
        target="_blank"
        rel="noreferrer"
      >
        <Github />
      </a>
      <button className={style.signout_btn} onClick={useStore.getState().signOut}>
        Sign Out
      </button>
    </div>
  );
}
