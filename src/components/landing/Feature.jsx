import React from 'react'

function Feature() {
    return (
        <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why use FairShare?</h2>
            <p className="mt-4 text-gray-600">We make money talk less awkward.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Setup</h3>
              <p className="text-gray-500 leading-relaxed">
                Create a group in seconds. Add expenses as you go and let us handle the complex math behind the scenes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Balances</h3>
              <p className="text-gray-500 leading-relaxed">
                See exactly who owes who. We simplify debts to minimize the total number of transactions needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Private & Guest Mode</h3>
              <p className="text-gray-500 leading-relaxed">
                Your data is safe. Use our Guest mode for one-off events where you don't want to create an account.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Feature
