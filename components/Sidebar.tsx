'use client'

import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const Sidebar = ({ user: _user }: SiderbarProps) => {
  const pathname = usePathname()
  return (
    <section className='sidebar'>
      <nav className="flex flex-col gap-4">
        <Link href="/"
          className="mb-12 cursor-pointer flex items-center gap-2 justify-center xl:justify-start">
              <Image 
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="logo"
                className='size-[24px] max-xl:size-14'
              />
            <h1 className='sidebar-logo'>HK Bank</h1>
        </Link>
        
        {/* Sidebar Links */}
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
          return (  
            <Link key={link.label} href={link.route}
            className={cn('sidebar-link cursor-pointer', { 'bg-bank-gradient': isActive })}
            >
              <div className="relative size-6">
                <Image 
                  src={link.imgURL} 
                  alt={link.label} 
                  fill 
                  className={cn( {'brightness-[3] invert-0' : isActive })} 
                />
              </div>
              <p className= {cn('sidebar-label', { 'text-white!' : isActive })}>{link.label}</p>
            </Link>
          )
        })}

        USER
      </nav>
      FOOTER
    </section>
  )
}

export default Sidebar