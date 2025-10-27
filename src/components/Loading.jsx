const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <p className="text-gray-600 text-lg font-semibold">読み込み中...</p>
      </div>
    </div>
  );
};

export default Loading;
