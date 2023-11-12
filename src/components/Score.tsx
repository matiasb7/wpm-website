import { useCountUp } from '../hooks/useCountUp.ts'

export default function Score ({ wpm, accuracy, modifierClass }: { wpm: number, accuracy: number, modifierClass: string | undefined }) {
  const animatedWPM = useCountUp(wpm, 1500) // Duration is 2000ms or 2 seconds
  const animatedAccuracy = useCountUp(accuracy * 100, 1500).toFixed(1)

  return (
    <section className={`flex gap-40 justify-center mt-20 mb-20 ${modifierClass ?? ''}`}>
        <div className='flex flex-col gap-4 items-center'>
          <span className='block text-5xl md:text-9xl'>{animatedWPM}</span>
          <span className='block text-xl md:text-2xl uppercase font-semibold'>WPM</span>
        </div>
        <div className='flex flex-col gap-4 items-center'>
          <span className='block text-5xl md:text-9xl'>{animatedAccuracy}%</span>
          <span className='block text-xl md:text-2xl uppercase font-semibold'>Accuracy</span>
        </div>
    </section>
  )
}
