export function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <div
        className="ambient-blob w-96 h-96 top-[-10%] left-[-5%]"
        style={{ background: 'hsl(243 75% 59%)' }}
      />
      <div
        className="ambient-blob w-80 h-80 bottom-[-8%] right-[-3%]"
        style={{ background: 'hsl(280 80% 60%)', animationDelay: '-7s' }}
      />
      <div
        className="ambient-blob w-64 h-64 top-[40%] left-[50%]"
        style={{ background: 'hsl(190 90% 50%)', animationDelay: '-13s' }}
      />
    </div>
  )
}
