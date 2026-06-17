import { auth } from "../../../../lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/app");
  }

  return <LoginForm />;
}
