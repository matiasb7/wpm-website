import { useState, useEffect } from 'react'
export const useCountUp = (target: number, duration: number) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0

    // If duration is not specified or less than 30ms (minimum frame duration for 30fps), default to 2000ms
    const totalDuration = duration && duration >= 30 ? duration : 2000
    if (start === target) return

    const increment = target / (totalDuration / 30)

    const timer = setInterval(() => {
      start += increment
      if (start > target) start = target
      setCount(start)
      if (start === target) clearInterval(timer)
    }, 30)

    return () => { clearInterval(timer) }
  }, [target, duration])

  return Math.floor(count)
}
