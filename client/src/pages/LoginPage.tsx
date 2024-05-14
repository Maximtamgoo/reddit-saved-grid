export default function LoginPage() {
  return (
    <div className="grid place-items-center gap-10 bg-zinc-900 pt-32 text-center text-blue-500">
      <div className="text-4xl">Reddit Saved Masonry</div>
      <button
        className="h-12 w-44 rounded-md border-2 border-blue-500"
        onClick={() => (window.location.href = "/api/authurl")}
      >
        Login with Reddit
      </button>
      View your saved Reddit posts in a masonry grid.
    </div>
  );
}
