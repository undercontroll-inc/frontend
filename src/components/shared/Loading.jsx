const Loading = ({ text = "Carregando..." }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
