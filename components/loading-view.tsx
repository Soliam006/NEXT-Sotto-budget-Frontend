// Loading Component for every page
export default function LoadingView() {
    return (
      <div className="flex items-center justify-center h-screen w-full">
          <p className="text-blue-500 text-sm animate-pulse" aria-busy="true">
              Loading...
          </p>
      </div>
    );
}
