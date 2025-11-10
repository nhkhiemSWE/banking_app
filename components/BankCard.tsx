import { formatAmount } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

const BankCard = ({account, userName, showBalance: _showBalance = true}: CreditCardProps) => {
  return (
    <div className="flex flex-col">
      <Link href="/" className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {account.name || userName}
            </h1>
            <p className="font-ibm-plex-serif font-black text-white">
              {formatAmount(account.currentBalance)}
            </p>
          </div>
          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {userName}
              </h1>
              <h2 className="text-12 font-semibold text-white">
                ●● / ●●
              </h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white whitespace-nowrap">
            ●●●● ●●●● ●●●● <span className="text-14">1234</span>
            </p>
          </article>
        </div>
        <div className="bank-card_icon">
          <Image src="/icons/Paypass.svg" alt="pay" width={20} height={24} className="self-center" />
          <Image src="/icons/Visa.svg" alt="visa" width={45} height={32} className="self-center" />
          <Image src="/icons/lines.png" alt="lines" width={316} height={190} className="absolute top-0 left-0" />
        </div>
      </Link>
    </div>
  )
}

export default BankCard