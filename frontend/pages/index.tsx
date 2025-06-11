import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/auth/sign-in')
  }, [router])

  return <div>Redirecting...</div>
}
