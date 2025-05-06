import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <video
        loop
        autoPlay
        muted    
        src="/404.mp4"
      />
      <Link href="/">
      <Button className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-slate-100 hover:text-blue-600 rounded-full cursor-pointer  px-4 py-4">
        Home
      </Button>
      </Link>

    </div>
  )
}
