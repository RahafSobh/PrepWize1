/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Check, ArrowLeft, CreditCard, Shield, Star, Award, Zap, Sparkles, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface PricingScreenProps {
  currentProfile: UserProfile;
  onClose: () => void;
  onUpdatePlan: (newPlan: 'Free' | 'Starter' | 'Pro' | 'Career+') => void;
}

export default function PricingScreen({ currentProfile, onClose, onUpdatePlan }: PricingScreenProps) {
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      priceDesc: 'per month',
      desc: 'Test core simulation modules and basic AI feedback.',
      features: [
        '3 mock interview simulations / month',
        'Basic AI feedback insights',
        'Standard algorithm compiler access',
        'Limited past metrics tracking history'
      ],
      badge: 'Basic Entry',
      style: 'border-zinc-200 bg-white text-zinc-900'
    },
    {
      name: 'Starter',
      price: '$9.99',
      priceDesc: 'per month',
      desc: 'Level-up algorithms and behavioral STAR structures.',
      features: [
        'Up to 20 mock simulations / month',
        'Advanced technical + behavioral tracks',
        'Personalized detailed AI feedback reports',
        'Custom role-specific study metrics paths',
        'SLA latency guarantee < 4s response'
      ],
      badge: 'Value Selection',
      style: 'border-zinc-250 bg-white text-zinc-900 ring-2 ring-emerald-500/10'
    },
    {
      name: 'Pro',
      price: '$24.99',
      priceDesc: 'per month',
      desc: 'Master architecture and hard FAANG whiteboard setups.',
      features: [
        'Unlimited mock simulations / session',
        'Adaptive difficulty (recalculated real-time)',
        'Comprehensive System Design practice panels',
        'FAANG-style strict feedback algorithms',
        'Full historic metrics trend SVG dashboards'
      ],
      badge: 'Popular Choice',
      style: 'border-emerald-500 bg-neutral-950 text-white relative scale-102 shadow-lg ring-2 ring-emerald-500/20'
    },
    {
      name: 'Career+',
      price: '$49.99',
      priceDesc: 'per month',
      desc: 'Premium verbal training and personal coaching roadmap.',
      features: [
        'Unlimited AI interview sessions',
        'Voice-based interactive interviewer simulator',
        'Dynamic browser speech-to-text logging',
        'Personalized automated learning guides',
        'Priority feature roadmap deployments API'
      ],
      badge: 'Maximum Support',
      style: 'border-zinc-200 bg-white text-zinc-900'
    }
  ];

  const handleStartCheckout = (tierName: string) => {
    if (tierName === currentProfile.plan) return;
    setCheckoutPlan(tierName);
  };

  const handleCompleteMockPurchase = () => {
    if (!checkoutPlan) return;
    setIsProcessing(true);
    
    // Simulate transaction latency to meet high standards
    setTimeout(() => {
      onUpdatePlan(checkoutPlan as any);
      setIsProcessing(false);
      setCheckoutPlan(null);
    }, 1800);
  };

  return (
    <div id="pricing-screen-container" className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Checkout modal overlay sheet */}
      {checkoutPlan && (
        <div id="payment-checkout-overlay" className="absolute inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 text-zinc-900 shadow-2xl">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-bold font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">MOCK TRANSACTION SCREEN</span>
                <h4 className="text-sm font-bold text-zinc-900 mt-2">Finish Upgrading to {checkoutPlan}</h4>
              </div>
              <button 
                onClick={() => setCheckoutPlan(null)} 
                className="text-xs text-zinc-400 font-bold hover:text-zinc-800 transition cursor-pointer"
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>

            <div className="bg-zinc-50 border border-zinc-150 p-4 rounded-2xl flex items-center gap-3">
              <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-bold font-mono text-zinc-800">
                  Total price: {tiers.find(t => t.name === checkoutPlan)?.price} / month
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">End-to-end checkout subscription simulated for testing parameters.</p>
              </div>
            </div>

            {/* Payment Fields mock inputs */}
            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Card details (Testing numbers valid)</span>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-hidden"
                  />
                  <CreditCard className="absolute right-3.5 top-3 w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">EXP DATE</span>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-50 border border-zinc-250 rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">CVC</span>
                  <input
                    type="password"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-50 border border-zinc-250 rounded-xl px-3.5 py-2.5 focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleCompleteMockPurchase}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-2xl shadow-xs transition cursor-pointer"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing transaction pipeline...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Authorize Mock Purchase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-100 transition text-zinc-650 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900">Manage Membership License</h2>
          <p className="text-xs text-zinc-500">Upgrade tiers to test limit controls, system design whiteboards, or speech APIs.</p>
        </div>
      </div>

      {/* Main pricing tiers columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-2">
        {tiers.map((t) => {
          const isCurrent = t.name === currentProfile.plan;
          return (
            <div 
              key={t.name}
              className={`border rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 ${t.style}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold font-mono tracking-wider uppercase px-2.5 py-1 rounded-full ${
                    t.name === 'Pro' ? 'bg-zinc-850 text-emerald-400 border border-zinc-800' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {t.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  <p className={`text-xs mt-1 leading-normal ${t.name === 'Pro' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-normal font-mono tracking-tight">{t.price}</span>
                  <span className={`text-xs font-mono ml-1 ${t.name === 'Pro' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {t.priceDesc}
                  </span>
                </div>

                <hr className={t.name === 'Pro' ? "border-zinc-800" : "border-zinc-150"} />

                <ul className="space-y-2.5 text-xs">
                  {t.features.map((feat, i) => (
                    <li key={i} className="flex gap-2 leading-relaxed">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${t.name === 'Pro' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  id={`purchase-btn-${t.name}`}
                  onClick={() => handleStartCheckout(t.name)}
                  className={`w-full text-center text-xs font-semibold py-3 rounded-xl cursor-pointer ${
                    isCurrent 
                      ? 'bg-zinc-100 border border-zinc-200 text-zinc-500 cursor-default font-normal' 
                      : t.name === 'Pro'
                      ? 'bg-white hover:bg-zinc-100 text-zinc-950 font-bold transition'
                      : 'bg-neutral-950 hover:bg-zinc-800 text-white transition'
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Active Model' : `Select ${t.name}`}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
