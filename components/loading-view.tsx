// Loading Component for every page
export default function LoadingView() {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                    <div
                        className="absolute inset-2 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <div className="mt-4 text-primary font-mono text-sm tracking-wider">
                     Loading...
                </div>
            </div>
        </div>
    );
}
