import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex px-5 items-end justify-end">
      <input
        type="checkbox"
        id="theme-toggle"
        className="sr-only"
        checked={theme === 'dark'}
        onChange={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      />
      <label htmlFor="theme-toggle" className="cursor-pointer">
        {theme === 'dark' ? (
          <span role="img" aria-label="Light mode">☀️</span>
        ) : (
          <span role="img" aria-label="Dark mode">🌙</span>
        )}
      </label>
    </div>
  );
}
