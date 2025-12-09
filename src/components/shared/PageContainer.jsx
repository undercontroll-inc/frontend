const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen dark:bg-zinc-950" style={{ marginLeft: 'var(--sidebar-offset, 280px)', transition: 'margin-left 300ms ease-in-out', willChange: 'margin-left' }}>
      <div className="w-full px-4 md:px-8 py-6 flex justify-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
