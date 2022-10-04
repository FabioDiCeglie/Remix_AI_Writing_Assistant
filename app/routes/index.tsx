import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <h1 className="text-slate-100">This is the index page</h1>
      {user ? (
        <p className="text-slate-300">Welcome {user.email}</p>
      ) : (
        <div className="flex gap-5">
          <Link to="/join">Join</Link>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
}
