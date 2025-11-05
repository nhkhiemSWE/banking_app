import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import DoughnutChart from '@/components/DoughnutChart';

const Home = () => {
  const loggedInUser = {firstName: 'John', lastName: 'Doe'};
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome'
            subtext='Access and manage your accounts and transactions efficiently.'
            user={loggedInUser?.firstName || "Guest"}
          />

          <TotalBalanceBox
            accounts={[]}
            totalBanks={0}
            totalCurrentBalance={1200}
          />
        </header>
      </div>
    </section>
  )
}

export default Home