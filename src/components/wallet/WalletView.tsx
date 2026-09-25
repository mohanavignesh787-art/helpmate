import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  Send,
  X,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WalletView: React.FC = () => {
  const { currentUser, transactions, withdrawEarnings, t, language } = useApp();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(currentUser.wallet.available || 500);
  const [withdrawMethod, setWithdrawMethod] = useState<'upi' | 'bank_account'>('upi');
  const [accountDetails, setAccountDetails] = useState('arunkumar@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > currentUser.wallet.available) {
      alert('Invalid withdrawal amount.');
      return;
    }
    setIsProcessing(true);
    const success = await withdrawEarnings(withdrawAmount, withdrawMethod, accountDetails);
    setIsProcessing(false);

    if (success) {
      setSuccessMsg(`Successfully initiated instant payout of ₹${withdrawAmount} via ${withdrawMethod.toUpperCase()}`);
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (_) {}
      setTimeout(() => {
        setIsWithdrawOpen(false);
        setSuccessMsg(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.earnings} & Razorpay Escrow Wallet
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instant UPI & Bank Payouts · Protected by 100% Escrow Hold
          </p>
        </div>

        <button
          onClick={() => setIsWithdrawOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>{t.withdrawToUPI}</span>
        </button>
      </div>

      {/* Wallet Balance Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-6 rounded-3xl shadow-lg shadow-teal-700/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{t.availableBalance}</span>
              <Wallet className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-3xl font-black mt-2">
              ₹{currentUser.wallet.available.toLocaleString()}
            </h3>
          </div>
          <p className="text-[11px] text-white/80 mt-4 font-medium">
            Ready for instant UPI or IMPS withdrawal
          </p>
        </div>

        {/* Pending in Escrow */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.pendingEscrow}</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              ₹{currentUser.wallet.pendingEscrow.toLocaleString()}
            </h3>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-4 font-semibold">
            Releases upon requester 1-click confirmation
          </p>
        </div>

        {/* Total Lifetime Earned */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.totalEarned}</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              ₹{currentUser.wallet.totalEarnings.toLocaleString()}
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 font-medium">
            From {currentUser.completedTasksCount || 18} successfully completed tasks
          </p>
        </div>

        {/* Helper Points */}
        <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.helperPoints}</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
              {currentUser.helperPoints}
            </h3>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-4 font-semibold">
            Redeemable for platform commission waivers
          </p>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            {t.transactionHistory}
          </h3>
          <span className="text-xs text-slate-400">All transactions verified on blockchain/Razorpay</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase font-bold">
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Date & Time</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-2">
                    <span className={`p-2 rounded-xl inline-flex items-center justify-center ${
                      tx.type === 'EARNING' || tx.type === 'ESCROW_RELEASE'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : tx.type === 'PAYOUT'
                        ? 'bg-blue-500/10 text-blue-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {tx.type === 'PAYOUT' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-slate-200">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-2 text-slate-400">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      tx.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : tx.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`py-3.5 px-2 text-right font-black text-sm ${
                    tx.type === 'PAYOUT' ? 'text-slate-800 dark:text-slate-200' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {tx.type === 'PAYOUT' ? '-' : '+'}₹{tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Instant Payout Withdrawal</h3>
              </div>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center text-emerald-600 font-bold text-xs">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Withdrawal Amount (Max: ₹{currentUser.wallet.available})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min={10}
                      max={currentUser.wallet.available}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Payout Destination
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('upi')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                        withdrawMethod === 'upi'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      ⚡ Instant UPI (VPA)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod('bank_account')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                        withdrawMethod === 'bank_account'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      🏦 Bank IMPS / NEFT
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {withdrawMethod === 'upi' ? 'UPI ID (e.g. mobile@upi)' : 'Account Number & IFSC'}
                  </label>
                  <input
                    type="text"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing || withdrawAmount <= 0}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Confirm Payout of ₹{withdrawAmount}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
