import { Form, Link } from "@remix-run/react";
import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { json, LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return json({ ok: true });
};

// create form for input
// create the action for the form
// bring recent completion into page from the database

export default function Writing() {
  const user = useUser();
  return <div className="text-slate-100">{user.email}</div>;
}
