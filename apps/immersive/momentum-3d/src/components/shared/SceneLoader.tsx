'use client'

export function SceneLoader() {
  return (
    <div className="absolute top-0 left-0 w-full h-1 z-50 overflow-hidden bg-black/20">
      <div className="h-full bg-[#00E5FF] animate-progress-indefinite shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
    </div>
  );
}
