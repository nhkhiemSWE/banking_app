'use client'
import React from 'react'
import CountUp from 'react-countup'

const AnimatedCountUp = ({ amount }: { amount: number }) => {
  return (
    <CountUp 
    end={amount}
    duration={2} 
    separator=","
    decimals={2}
    decimal="."
    prefix="$"
    suffix=" USD"
    />
  )
}

export default AnimatedCountUp