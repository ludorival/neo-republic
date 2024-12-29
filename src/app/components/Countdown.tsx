'use client'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type CountdownProps = {
  targetDate: Date
  label: string
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ targetDate, label }: CountdownProps) {
  const t = useTranslations('home.countdown')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    const timer = setInterval(calculateTimeLeft, 1000)
    calculateTimeLeft()

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="text-center p-6 backdrop-blur-sm bg-white/30 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{label}</h3>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.days}</div>
          <div className="text-sm">{t('days')}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm">{t('hours')}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm">{t('minutes')}</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm">{t('seconds')}</div>
        </div>
      </div>
    </div>
  )
} 