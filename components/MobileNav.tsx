'use client'

import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import Image from 'next/image'
import { sidebarLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MobileNav = ({user}: MobileNavProps) => {
  const pathname = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg" 
            alt="menu" 
            width={30} 
            height={30} 
            className='cursor-pointer' 
            />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-white'>
          <SheetClose asChild>
            <Link href="/"
              className="cursor-pointer flex items-center gap-1 px-4 mt-4 ml-2">
                <Image 
                  src="/icons/logo.svg"
                  width={30}
                  height={30}
                  alt="logo"
                  className='size-[24px] max-xl:size-14 mr-2'
                  />
                <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>HK Bank</h1>
            </Link>
          </SheetClose>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-8 px-8 text-white">
                {/* Sidebar Links */}
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
                  return (  
                    <SheetClose asChild key={link.label}>
                      <Link key={link.label} href={link.route}
                      className={cn('mobilenav-sheet_close', { 'bg-bank-gradient': isActive })}
                      >
                        <div className="relative size-6">
                          <Image 
                            src={link.imgURL} 
                            alt={link.label} 
                            fill 
                            className={cn( {'brightness-[3] invert-0' : isActive })} 
                          />
                        </div>
                        <p className= {cn('text-16 font-semibold text-black-2', { 'text-white!' : isActive })}>{link.label}</p>
                      </Link>
                    </SheetClose>
                  )
                })}
                USER
              </nav>
            </SheetClose>
            FOOTER
          </div>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default MobileNav

