const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200" style={{ marginLeft: 'var(--sidebar-offset, 280px)' }}>
      <div className="w-full px-4 md:px-8 py-6 flex justify-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
