import { useState, useEffect } from "react";
import api from "../api";

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [country, setCountry] = useState("KE"); // Kenya default
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userPrefs, setUserPrefs] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const r = await api.get("/auth/profile");
      setUserPrefs(r.data);
      // Set country based on user's currency if available
      if (r.data?.currency === 'KES') setCountry('KE');
      else if (r.data?.currency === 'USD') setCountry('US');
    } catch (e) {
      console.error("Failed to load profile:", e);
    }
  };

  const calculateTax = async () => {
    if (!income || isNaN(income) || +income <= 0) {
      setError("Please enter a valid income amount");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const r = await api.post("/tax/calculate", {
        income: parseFloat(income),
        country: country
      });
      setResult(r.data);
    } catch (e) {
      console.error("Failed to calculate tax:", e);
      setError(e.message || "Failed to calculate tax");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tax Calculator</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Calculate Your Tax</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Annual Income</label>
              <input
                type="number"
                placeholder="Enter your annual income"
                value={income}
                onChange={e => setIncome(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="KE">Kenya</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="NG">Nigeria</option>
                {/* Add more countries as supported by your backend */}
              </select>
            </div>

            <button
              onClick={calculateTax}
              disabled={loading}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Calculate Tax"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tax Calculation Results</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Gross Income:</span>
                <span className="font-semibold text-lg">
                  ${parseFloat(result.income || income).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="font-semibold text-lg text-red-600">
                  ${parseFloat(result.tax).toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Effective Tax Rate:</span>
                <span className="font-semibold">
                  {result.rate ? `${result.rate}%` : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-600 font-semibold">Net Income:</span>
                <span className="font-bold text-xl text-green-600">
                  ${parseFloat(result.netIncome || (result.income - result.tax)).toFixed(2)}
                </span>
              </div>
            </div>

            {result.breakdown && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Tax Breakdown:</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(result.breakdown, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
