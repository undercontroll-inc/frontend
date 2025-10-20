const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-8 py-6 flex justify-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
