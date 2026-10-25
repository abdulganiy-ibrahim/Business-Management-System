import { AuthForm } from "@/components/authentication";
import AuthNotice from "@/components/authentication/AuthNotice";

type AuthPageProps = {
  searchParams: Promise<{
    message?: string
  }>
}

export async function AuthPage({ searchParams }: AuthPageProps) {

  const { message } = await searchParams;

  return (
    <main>
      <AuthNotice code={message} />

      <AuthForm />
    </main>
  )
}