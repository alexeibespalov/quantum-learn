export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">QuantumLearn</h1>
          <p className="text-gray-600 mt-2">AI Tutor for Year 9 Students</p>
        </div>
        {children}
      </div>
    </div>
  );
}
