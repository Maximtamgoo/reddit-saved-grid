export default function LoginPage() {
  return (
    <div className="absolute flex h-full w-full flex-col items-center gap-10 bg-zinc-900 pt-32 text-blue-500">
      <div className="text-center text-4xl">Reddit Saved Masonry</div>
      <button
        className="h-12 w-44 rounded-md border-2 border-blue-500"
        onClick={() => (window.location.href = "/api/authurl")}
      >
        Login with Reddit
      </button>
      <div>View your saved Reddit posts in a masonry grid.</div>
    </div>
  );
}
