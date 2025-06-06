// app/page.tsx
"use client";

import Image from "next/image";
import Link from 'next/link';
import { useEffect } from "react";

export default function Home() {
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
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 shadow bg-white">
        <div className="flex items-center space-x-4">
          <img
            src="/img/logo/Vector HRIS.png"
            alt="Logo HRIS"
            className="h-8 w-4"
          />
          {/* Menu */}
          <ul className="md:flex space-x-8 text-sm font-medium text-gray-700">
            <li>
              <a href="#" className="hover:text-dodgerblue">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/sign-in"
            className="px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 rounded hover:bg-gray-200"
          >
            Sign in →
          </a>
          <a
            href="/sign-up"
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-8 py-20 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Get the Perfect <br />
              Tools to Empower <br />
              Your Workforce
            </h1>
            <p className="text-gray-700 mb-8">
              Managing people isn’t just about processes—it’s about people. <br />
              Our Top HRMS takes the stress out of HR, so you can focus on <br />
              what really matters: building a happy, productive team.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition">
              Get Started with a Demo
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
            <div className="mt-4 flex items-center justify-center md:justify-start space-x-4 text-green-600">
              <div className="flex items-center space-x-1">
                <i className="fas fa-check-circle"></i>
                <span>Free Trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <i className="fas fa-stopwatch"></i>
                <span>2 minutes to get started</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="relative bg-blue-50">
        <div className="container mx-auto px-8 py-20">
          <h2 className="text-center text-5xl font-bold mb-10 text-gray-900">
            HRIS Pricing Plans
          </h2>
          <p className="text-center text-gray-800 mb-10">
            <span className="block">Choose the plan that best suits your business!</span>
            <span className="block">This HRIS offers both subscription and pay-as-you-go payment options,</span>
            <span className="block">available in the following packages:</span>
          </p>

          {/* Toggle Package/Seat */}
          <div className="flex justify-center mt-6 mb-10">
            <div className="relative flex bg-white shadow-md rounded-full overflow-hidden w-80">
              <input type="radio" name="tab" id="package" className="hidden" defaultChecked />
              <input type="radio" name="tab" id="seat" className="hidden" />
              <div id="slidingBg" className="absolute top-0 left-0 h-full w-1/2 bg-[#1D395E] rounded-full transform transition-all duration-300"></div>
              <label htmlFor="package" id="packageLabel" className="relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all text-white">Package</label>
              <label htmlFor="seat" id="seatLabel" className="relative z-10 w-1/2 py-3 text-sm font-semibold text-center cursor-pointer transition-all text-gray-700">Seat</label>
            </div>
          </div>

          {/* Pricing Cards Container */}
          <div id="pricingCardsContainer" className="min-h-[600px]">
            {/* Package Cards */}
            <div id="packageCards" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Card */}
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
                <button className="mt-6 w-full bg-[#2D8DFE] text-white font-bold py-3 rounded-lg hover:bg-[#2278D2] transition">
                  Current Plan
                </button>
              </div>

              {/* Lite Card */}
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
                <Link href="/plans/choose-lite" className="mt-6 w-full bg-white text-blue-500 font-bold py-3 rounded-lg hover:bg-gray-200 transition block text-center">
                  Upgrade Plan
                </Link>
              </div>

              {/* Pro Card */}
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
                <Link href="/plans/choose-pro" className="mt-6 w-full bg-white text-blue-500 font-bold py-3 rounded-lg hover:bg-gray-200 transition block text-center">
                  Upgrade Plan
                </Link>
              </div>
            </div>

            {/* Seat Cards */}
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
        </div>
      </section>

      {/* cmlabs SEO Section */}
      <section className="bg-blue-50">
        <div className="container mx-auto px-8 py-20 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="w-full h-64 bg-gray-300 rounded-lg"></div>
          </div>
          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              cmlabs SEO Agency Indonesia
            </h2>
            <p className="text-gray-700 mb-6">
              cmlabs is a global SEO agency that offers its services in
              Indonesia. We help businesses achieve optimal visibility on search
              engine results pages (SERPs). With attentive website optimization
              and impactful digital marketing solutions, we will be your guide to
              a sustainable and authoritative online presence!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <span className="text-4xl font-bold text-blue-600 mb-1">
                  314,566,114+
                </span>
                <span className="text-gray-600">Total Engagement</span>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <span className="text-4xl font-bold text-blue-600 mb-1">15.425</span>
                <span className="text-gray-600">Avg Keyword Rank</span>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <span className="text-4xl font-bold text-blue-600 mb-1">20,836+</span>
                <span className="text-gray-600">Content Produced</span>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <span className="text-4xl font-bold text-blue-600 mb-1">
                  9,185,238,642+
                </span>
                <span className="text-gray-600">Total Reach</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="container mx-auto px-8 py-12">
          <h3 className="text-center text-xl font-semibold text-gray-800 mb-6">
            cmlabs Clients
          </h3>
          <p className="text-center text-gray-600 mb-8">
            We have been working with some Fortune 40+ clients
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img src="/img/siloam.png" alt="Siloam" className="h-12" />
            <img src="/img/aqua.png" alt="Aqua" className="h-12" />
            <img src="/img/shopee.png" alt="Shopee" className="h-12" />
            <img src="/img/enesis.png" alt="Enesis" className="h-12" />
            <img src="/img/ocbc.png" alt="OCBC" className="h-12" />
            <img src="/img/pegadaian.png" alt="Pegadaian" className="h-12" />
            <img src="/img/sribu.png" alt="Sribu" className="h-12" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-300">
        <div className="container mx-auto px-8 py-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Don't miss a thing!</h2>
          <p className="text-gray-800 mb-8">
            Stay in the loop for smarter HR solutions, feature updates, and special
            offers.
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-md focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200">
        <div className="container mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img
              src="/img/logo/Logo HRIS-1.png"
              alt="Logo HRIS"
              className="h-8 mb-4"
            />
            <p className="text-gray-400 mb-4">
              Mengelola orang bukan sekadar proses—ini tentang orang. HRIS kami
              membantu meringankan beban HR Anda.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-github fa-lg"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="hover:text-white">
                <i className="fab fa-youtube fa-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contacts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Legal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Stay up to date</h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-md focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
          © Copyright 911. All rights reserved
        </div>
      </footer>
    </>
  )
}

