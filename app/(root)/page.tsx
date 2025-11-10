import React from 'react'
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import DoughnutChart from '@/components/DoughnutChart';
import RightSideBar from '@/components/RightSideBar';

const Home = () => {
  const loggedInUser = {firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com'};
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
        RECENT TRANSACTIONS

      </div>
      <RightSideBar 
        user={loggedInUser}
        transactions={[]}
        banks={[{currentBalance: 1000, name: 'Bank of America'}, {currentBalance: 2000, name: 'Chase'}]}
      />
    </section>
  )
}

export default Home