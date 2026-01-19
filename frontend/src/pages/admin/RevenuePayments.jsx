import React, { useState } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Download, 
  FileText, 
  ArrowDownCircle, 
  ArrowUpCircle,
  CreditCard,
  Filter,
  Search,
  TrendingUp,
  ChevronDown,
  CheckCircle,
  XCircle
} from 'lucide-react';

const RevenuePayments = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [payoutStatus, setPayoutStatus] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().substr(0, 10),
    end: new Date().toISOString().substr(0, 10)
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for transactions
  const transactions = [
    { id: 'TXN-12345', vendor: 'Laundry Express', amount: 2450, commission: 245, date: '2025-05-09', status: 'completed' },
    { id: 'TXN-12344', vendor: 'Clean & Fold Co.', amount: 1890, commission: 189, date: '2025-05-09', status: 'completed' },
    { id: 'TXN-12343', vendor: 'Wash Kings', amount: 3200, commission: 320, date: '2025-05-08', status: 'completed' },
    { id: 'TXN-12342', vendor: 'Quick Press', amount: 1250, commission: 125, date: '2025-05-08', status: 'pending' },
    { id: 'TXN-12341', vendor: 'Spotless Laundry', amount: 2800, commission: 280, date: '2025-05-07', status: 'completed' },
    { id: 'TXN-12340', vendor: 'Fast Dry Cleaners', amount: 4500, commission: 450, date: '2025-05-07', status: 'pending' },
    { id: 'TXN-12339', vendor: 'Urban Washers', amount: 1720, commission: 172, date: '2025-05-06', status: 'completed' },
    { id: 'TXN-12338', vendor: 'Premium Laundry', amount: 3650, commission: 365, date: '2025-05-06', status: 'failed' },
  ];

  // Mock data for payouts
  const payouts = [
    { id: 'PAY-5678', vendor: 'Laundry Express', amount: 8200, date: '2025-05-05', status: 'completed' },
    { id: 'PAY-5677', vendor: 'Clean & Fold Co.', amount: 6500, date: '2025-05-05', status: 'completed' },
    { id: 'PAY-5676', vendor: 'Wash Kings', amount: 7400, date: '2025-05-04', status: 'completed' },
    { id: 'PAY-5675', vendor: 'Quick Press', amount: 4200, date: '2025-05-03', status: 'pending' },
    { id: 'PAY-5674', vendor: 'Spotless Laundry', amount: 5900, date: '2025-05-02', status: 'pending' },
    { id: 'PAY-5673', vendor: 'Fast Dry Cleaners', amount: 9100, date: '2025-05-01', status: 'failed' },
  ];

  const handleExportReport = () => {
    alert('Exporting revenue report');
  };

  const handleProcessPayouts = () => {
    alert('Processing pending payouts');
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeClass = status === 'completed' ? 'badge-success' : 
                       status === 'pending' ? 'badge-warning' : 'badge-danger';
    
    return (
      <span className={`badge ${badgeClass}`}>
        {status === 'completed' ? 
          <CheckCircle size={12} className="mr-1" /> : 
          status === 'pending' ? 
            <Calendar size={12} className="mr-1" /> : 
            <XCircle size={12} className="mr-1" />
        }
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 pt-6">
        <h1 className="text-2xl font-bold text-gray-800">Revenue & Payments</h1>
        <div className="flex gap-4">
          <button 
            className="btn btn-outline flex items-center gap-2"
            onClick={handleExportReport}
          >
            <Download size={16} />
            Export Report
          </button>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleProcessPayouts}
          >
            <CreditCard size={16} />
            Process Payouts
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        <div className="stat-card border-l-indigo-500">
          <div className="text-gray-500 text-sm font-medium">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">₹245,890</div>
          <div className="text-green-500 text-xs flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" />
            12.8% from last month
          </div>
        </div>
        
        <div className="stat-card border-l-emerald-500">
          <div className="text-gray-500 text-sm font-medium">Admin Commission</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">₹24,589</div>
          <div className="text-green-500 text-xs flex items-center mt-1">
            <TrendingUp size={14} className="mr-1" />
            10% platform fee
          </div>
        </div>
        
        <div className="stat-card border-l-amber-500">
          <div className="text-gray-500 text-sm font-medium">Pending Payouts</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">₹34,750</div>
          <div className="text-gray-500 text-xs mt-1">
            5 vendors awaiting payment
          </div>
        </div>
        
        <div className="stat-card border-l-red-500">
          <div className="text-gray-500 text-sm font-medium">Failed Transactions</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">₹3,650</div>
          <div className="text-red-500 text-xs flex items-center mt-1">
            <XCircle size={14} className="mr-1" />
            2 transactions failed
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-4 mb-6">
        <div className="flex border-b">
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'transactions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'payouts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('payouts')}
          >
            Vendor Payouts
          </button>
          <button 
            className={`px-4 py-2 font-medium text-sm ${selectedTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setSelectedTab('settings')}
          >
            Commission Settings
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="form-input text-sm p-2" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span>to</span>
            <input 
              type="date" 
              className="form-input text-sm p-2" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <select 
            className="form-input text-sm p-2"
            value={payoutStatus}
            onChange={(e) => setPayoutStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by vendor or transaction ID..."
              className="form-input pl-10 p-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>

      {/* Content based on selected tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-700">Revenue Breakdown</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Admin Commission</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
                  <span className="text-xs text-gray-500">Vendor Earnings</span>
                </div>
              </div>
            </div>
            <div className="h-72 flex items-center justify-center bg-gray-50 rounded">
              {/* Chart would be rendered here - using placeholder */}
              <div className="flex flex-col items-center">
                <TrendingUp size={48} className="text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">Revenue Chart</p>
              </div>
            </div>
          </div>

          {/* Commission Structure */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Commission Structure</h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Default Commission Rate</span>
                <span className="badge bg-indigo-100 text-indigo-800">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>

            <h4 className="text-md font-medium text-gray-700 mb-2">Vendor-Specific Rates</h4>
            <div className="bg-gray-50 rounded p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Laundry Express</div>
                    <div className="text-xs text-gray-500">Premium Partner</div>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-800">8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Clean & Fold Co.</div>
                    <div className="text-xs text-gray-500">Premium Partner</div>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-800">8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Wash Kings</div>
                    <div className="text-xs text-gray-500">Standard Partner</div>
                  </div>
                  <span className="badge bg-indigo-100 text-indigo-800">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Fast Dry Cleaners</div>
                    <div className="text-xs text-gray-500">New Partner</div>
                  </div>
                  <span className="badge bg-amber-100 text-amber-800">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'transactions' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Transaction ID</th>
                  <th className="table-header-cell">Vendor</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Admin Commission</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">{transaction.id}</td>
                    <td className="table-cell">{transaction.vendor}</td>
                    <td className="table-cell">₹{transaction.amount.toLocaleString()}</td>
                    <td className="table-cell">₹{transaction.commission.toLocaleString()}</td>
                    <td className="table-cell">{transaction.date}</td>
                    <td className="table-cell">
                      <StatusBadge status={transaction.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1-8</span> of <span className="font-medium">24</span> transactions
            </div>
            <div className="flex space-x-2">
              <button className="btn btn-outline px-3 py-1 text-sm">Previous</button>
              <button className="btn btn-primary px-3 py-1 text-sm">Next</button>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'payouts' && (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Payout ID</th>
                  <th className="table-header-cell">Vendor</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">{payout.id}</td>
                    <td className="table-cell">{payout.vendor}</td>
                    <td className="table-cell">₹{payout.amount.toLocaleString()}</td>
                    <td className="table-cell">{payout.date}</td>
                    <td className="table-cell">
                      <StatusBadge status={payout.status} />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-500 hover:text-indigo-600">
                          <FileText size={16} />
                        </button>
                        {payout.status === 'pending' && (
                          <button className="text-emerald-500 hover:text-emerald-600">
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1-6</span> of <span className="font-medium">16</span> payouts
            </div>
            <div className="flex space-x-2">
              <button className="btn btn-outline px-3 py-1 text-sm">Previous</button>
              <button className="btn btn-primary px-3 py-1 text-sm">Next</button>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Default Commission Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Default Commission Rate (%)</label>
                <div className="flex items-center">
                  <input type="number" className="form-input mr-2" defaultValue="10" min="0" max="100" />
                  <span>%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Applied to all vendors unless overridden</p>
              </div>
              
              <div>
                <label className="form-label">New Dhobi Commission Rate (%)</label>
                <div className="flex items-center">
                  <input type="number" className="form-input mr-2" defaultValue="12" min="0" max="100" />
                  <span>%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Applied to newly registered vendors</p>
              </div>
              
              <div>
                <label className="form-label">Premium Partner Commission Rate (%)</label>
                <div className="flex items-center">
                  <input type="number" className="form-input mr-2" defaultValue="8" min="0" max="100" />
                  <span>%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Applied to vendors with premium status</p>
              </div>
              
              <div className="pt-4">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Payout Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Minimum Payout Amount</label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <input type="number" className="form-input" defaultValue="500" min="0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum balance required for automatic payout</p>
              </div>
              
              <div>
                <label className="form-label">Payout Schedule</label>
                <select className="form-input">
                  <option value="weekly">Weekly (Every Monday)</option>
                  <option value="biweekly">Bi-weekly (1st and 15th)</option>
                  <option value="monthly">Monthly (Last day)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How often payouts are processed automatically</p>
              </div>
              
              <div>
                <label className="form-label">Payment Method</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="upi" className="mr-2" defaultChecked />
                    <label htmlFor="upi">UPI Transfer</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="bank" className="mr-2" defaultChecked />
                    <label htmlFor="bank">Bank Transfer (NEFT/IMPS)</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="wallet" className="mr-2" />
                    <label htmlFor="wallet">Digital Wallet</label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenuePayments;
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-500 hover:text-indigo-600">
                          <FileText size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-indigo-600">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>