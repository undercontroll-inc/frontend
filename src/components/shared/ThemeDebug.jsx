import { useTheme } from "./ThemeProvider";

export function ThemeDebug() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-[9999] p-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-yellow-500 rounded-lg shadow-xl">
      <div className="text-sm font-bold mb-2 text-gray-900 dark:text-white">
        Theme Debug
      </div>
      <div className="text-xs space-y-1">
        <div className="text-gray-700 dark:text-gray-300">
          Current: <span className="font-bold">{theme}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setTheme("light")}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-100"
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded text-xs hover:bg-gray-700"
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}
