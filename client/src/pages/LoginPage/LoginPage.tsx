import style from "./LoginPage.module.css";

export default function LoginPage() {
  return (
    <div className={style.login}>
      <div className={style.title}>Reddit Saved Masonry</div>
      <button className={style.btn} onClick={() => (window.location.href = "/api/authurl")}>
        Login with Reddit
      </button>
      <div className={style.description}>Display your saved Reddit content in a masonry grid.</div>
    </div>
  );
}
