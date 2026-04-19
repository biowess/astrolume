import { useStore } from '../../store/useStore';

export function Background() {
  const { settings } = useStore();
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[var(--bg)]">
      {/* Subtle radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[rgba(229,193,88,0.03)] rounded-full blur-[120px]" />
      
      {/* Stars Background */}
      {settings.showStars && (
        <div className="absolute inset-0 opacity-40 mix-blend-screen" 
             style={{
               backgroundImage: `radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.8), rgba(0,0,0,0))`,
               backgroundSize: '200px 200px'
             }}>
        </div>
      )}
    </div>
  );
}
