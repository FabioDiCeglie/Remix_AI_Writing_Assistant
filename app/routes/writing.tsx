import { Form, Link } from "@remix-run/react";
import { useUser } from "~/utils";

export default function Index() {
  const user = useUser();
  return <div className="text-slate-100">{user.email}</div>;
}
