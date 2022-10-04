import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <h1 className="text-slate-100">This is the index page</h1>
      <p className="text-slate-300">Welcome {user?.email}</p>
    </div>
  );
}
