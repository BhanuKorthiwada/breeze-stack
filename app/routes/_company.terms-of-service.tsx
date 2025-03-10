export default function page() {
  return (
    <main className="min-h-[70vh] container mx-auto px-4 py-8">
      <title>Terms of Service - Breeze Stack</title>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Service</h1>
        <div className="prose prose-blue max-w-none text-gray-700">
          <p className="text-lg mb-6">
            Welcome to Breeze Stack. By using our services, you agree to the following terms of service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Acceptance of Terms</h2>
          <p>
            By using Breeze Stack, you agree to these terms of service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. Use of Services</h2>
          <p>
            You must be at least 18 years old to use Breeze Stack.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>
      </div>
    </main>
  )
}
