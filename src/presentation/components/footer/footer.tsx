import { Link } from '@heroui/react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      Desenvolvido com ❤️ por{' '}
      <Link
        href="https://github.com/evertonfxavier"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-blue-600 hover:underline"
      >
        evertonfxavier
      </Link>
    </footer>
  )
}
