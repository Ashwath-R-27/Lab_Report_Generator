export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* The main box handles overall spacing; headers will mount dynamically inside children */}
            <main className="bg-transparent flex-1 text-white">
                {children}
            </main>
        </div>
    );
}