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
  return (
    <div className="text-slate-100">
      <div className="mx-auto mt-4 flex w-full items-center justify-between text-slate-200">
        <p>Welcome {user.email}</p>
        <div className="flex gap-5">
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Log out
            </button>
          </Form>
        </div>
      </div>
      <h1 className="text-2xl font-bold">AI writing tool</h1>
    </div>
  );
}
