import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-100">
          Welcome to the most awesome AI Writing Assistant
        </h1>
        {user ? (
          <div className="mx-auto flex w-full text-slate-200 ">
            <p>Welcome {user.email}</p>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Log out
              </button>
            </Form>
          </div>
        ) : (
          <div className="flex gap-5 text-slate-200">
            <Link
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              to="/join"
            >
              Join
            </Link>
            <Link
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              to="/login"
            >
              Login
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
