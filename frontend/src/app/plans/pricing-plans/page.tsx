'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  useEffect(() => {
    const packageRadio = document.getElementById('package') as HTMLInputElement;
    const seatRadio = document.getElementById('seat') as HTMLInputElement;
    const packageLabel = document.getElementById('packageLabel')!;
    const seatLabel = document.getElementById('seatLabel')!;
    const slidingBg = document.getElementById('slidingBg')!;
    const packageCards = document.getElementById('packageCards')!;
    const seatCards = document.getElementById('seatCards')!;

    function updateToggle() {
      if (seatRadio.checked) {
        slidingBg.style.transform = 'translateX(100%)';
        packageLabel.classList.remove('text-white');
        packageLabel.classList.add('text-gray-700');
        seatLabel.classList.remove('text-gray-700');
        seatLabel.classList.add('text-white');

        packageCards.classList.add('hidden');
        seatCards.classList.remove('hidden');
      } else {
        slidingBg.style.transform = 'translateX(0)';
        packageLabel.classList.remove('text-gray-700');
        packageLabel.classList.add('text-white');
        seatLabel.classList.remove('text-white');
        seatLabel.classList.add('text-gray-700');

        packageCards.classList.remove('hidden');
        seatCards.classList.add('hidden');
      }
    }

    packageRadio?.addEventListener('change', updateToggle);
    seatRadio?.addEventListener('change', updateToggle);
    updateToggle();
  }, []);

  return (
    <main className="font-inter min-h-screen bg-gradient-to-b from-white via-blue-100 to-blue-500 flex items-center justify-center">
      <section className="py-20 text-center">
        <h2 className="py-3 text-5xl font-bold mb-10 text-gray-900" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)' }}>
          HRIS Pricing Plans
        </h2>

        <p className="text-gray-800 mb-10">
          <span className="block">Choose the plan that best suits your business!</span>
          <span className="block">This HRIS offers both subscription and pay-as-you-go payment options,</span>
          <span className="block">available in the following packages:</span>
        </p>

        <div className="flex justify-center mt-6 mb-10">
          <div className="relative flex bg-white shadow-md rounded-full overflow-hidden w-80">
            <input type="radio" name="tab" id="package" className="hidden" defaultChecked />
            <input type="radio" name="tab" id="seat" className="hidden" />
            <div id="slidingBg" className="absolute top-0 left-0 h-full w-1/2 bg-[#1D395E] rounded-full transform transition-all duration-300"></div>
            <label htmlFor="package" id="packageLabel" className="relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all text-white">Package</label>
            <label htmlFor="seat" id="seatLabel" className="relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all text-gray-700">Seat</label>
          </div>
        </div>

        <div id="pricingCardsContainer" className="min-h-[600px]">
          <div id="packageCards" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
            <div className="bg-gradient-to-l from-[#1D395E] to-[#3C77C4] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Starter</h3>
              <p className="text-4xl font-bold text-left">Free</p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>GPS-based attendance validation</li>
                <li>Employee data management</li>
                <li>Leave and time-off request</li>
                <li>Overtime management</li>
                <li>Fixed work schedule management</li>
                <li>Automatic fixed calculation</li>
              </ul>
              <button className="mt-6 w-full bg-[#2D8DFE] text-white font-bold py-3 rounded-lg hover:bg-[#2278D2] transition">Current Plan</button>
            </div>

            <div className="bg-[#2E2E3A] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Lite <span className="text-sm">(Recommended)</span></h3>
              <p className="text-4xl font-bold text-left">$15 <span className="text-lg">/year</span></p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>All standard features</li>
                <li>Clock-in clock-out attendance settings</li>
                <li>Employee document management</li>
                <li>Sick leave & time-out settings</li>
                <li>Shift management</li>
                <li>Site password protection</li>
              </ul>
              <Link href="/choose-package-lite" className="mt-6 w-full bg-white text-blue-500 font-bold py-3 rounded-lg hover:bg-gray-200 transition block text-center">Upgrade Plan</Link>
            </div>

            <div className="bg-gradient-to-l from-[#7CA5BF] to-[#3A4D59] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Pro</h3>
              <p className="text-4xl font-bold text-left">$35 <span className="text-lg">/year</span></p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>2 Projects</li>
                <li>Client billing</li>
                <li>Free staging</li>
                <li>Code export</li>
                <li>White labeling</li>
                <li>Site password protection</li>
              </ul>
              <Link href="/choose-package-pro" className="mt-6 w-full bg-white text-blue-500 font-bold py-3 rounded-lg hover:bg-gray-200 transition block text-center">Upgrade Plan</Link>
            </div>
          </div>

          <div id="seatCards" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 hidden">
            <div className="bg-gradient-to-l from-[#1D395E] to-[#3C77C4] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Standard Seat</h3>
              <p className="text-4xl font-bold text-left">$5 <span className="text-lg">/seat</span></p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>Basic access</li>
                <li>Time tracking</li>
                <li>Email support</li>
              </ul>
              <button className="mt-6 w-full bg-[#2D8DFE] text-white font-bold py-3 rounded-lg hover:bg-[#2278D2] transition">Select Seat</button>
            </div>

            <div className="bg-[#2E2E3A] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Premium Seat</h3>
              <p className="text-4xl font-bold text-left">$10 <span className="text-lg">/seat</span></p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>Advanced access</li>
                <li>Priority support</li>
                <li>Detailed reports</li>
              </ul>
              <button className="mt-6 w-full bg-[#2D8DFE] text-white font-bold py-3 rounded-lg hover:bg-[#2278D2] transition">Select Seat</button>
            </div>

            <div className="bg-gradient-to-l from-[#7CA5BF] to-[#3A4D59] text-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold text-left">Enterprise Seat</h3>
              <p className="text-4xl font-bold text-left">$15 <span className="text-lg">/seat</span></p>
              <hr className="border-t-2 border-white my-4" />
              <ul className="mt-6 text-sm text-left list-disc list-inside space-y-2">
                <li>Full feature access</li>
                <li>Dedicated support</li>
                <li>Custom integrations</li>
              </ul>
              <button className="mt-6 w-full bg-[#2D8DFE] text-white font-bold py-3 rounded-lg hover:bg-[#2278D2] transition">Select Seat</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
