import { AuthForm } from "@/components/authentication";

type AuthPageProps = {
  searchParams: Promise<{
    message?: string
  }>
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { message } = await searchParams;

  return (
    <main>
      <AuthForm message={message}/>
    </main>
  )
}