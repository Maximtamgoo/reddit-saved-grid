export default function LoginPage() {
  return (
    <div className="absolute mt-20 grid w-full place-content-center place-items-center gap-10 p-2 text-blue-500">
      <div className="text-center text-4xl">Reddit Saved Masonry</div>
      <button
        className="h-12 w-44 rounded-md border-2 border-blue-500"
        onClick={() => (window.location.href = "/api/authurl")}
      >
        Login with Reddit
      </button>
      <div className="text-base">View your saved Reddit posts in a masonry grid.</div>
    </div>
  );
}
