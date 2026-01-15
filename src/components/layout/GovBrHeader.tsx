export function GovBrHeader() {
  return (
    <div className="govbr-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" style={{ color: '#1351B4' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <div className="border-l border-white/30 pl-3 h-10 flex flex-col justify-center">
              <div className="text-white font-semibold text-sm leading-tight">
                GOVERNO FEDERAL
              </div>
              <div className="text-white/90 text-xs leading-tight">
                AuroraGov
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
