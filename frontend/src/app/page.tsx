// app/page.tsx
import Image from "next/image";

export default function Home() {
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
        {/* Background bisa kamu tweak sendiri, contohnya:
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-0 left-0 w-full h-full transform rotate-12 bg-gradient-to-tr from-blue-100 to-blue-300 opacity-20"></div>
//         </div> */}
        <div className="container mx-auto px-8 py-20">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
            HRIS Pricing Plans
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Choose the plan that best suit your business! This HRIS offers both
            subscription and pay-as-you-go payment options, available in the
            following packages:
          </p>

          {/* Toggle Paket / Seat */}
          <div className="flex justify-center mb-12">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-l-md">
              Package
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-r-md">
              Seat
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Starter</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4">Free</p>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>GPS based attendance validation</li>
                <li>Employee data management</li>
                <li>Leave and time-off request</li>
                <li>Overtime management</li>
                <li>Fixed work schedule management</li>
                <li>Automatic fixed calculation</li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Current plan
              </button>
            </div>

            {/* Lite (Recommended) */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl rounded-xl p-6 relative">
              <span className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
              <h3 className="text-xl font-semibold mb-4">Lite</h3>
              <p className="text-2xl font-bold mb-4">
                $15<span className="text-base">/year</span>
              </p>
              <p className="text-white opacity-80 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor
              </p>
              <ul className="space-y-2 mb-6">
                <li>All standard features</li>
                <li>Clock-in Clock-out attendance settings</li>
                <li>Employee document management</li>
                <li>Sick leave & time-out settings</li>
                <li>Shift management</li>
                <li>Site password protection</li>
              </ul>
              <button className="w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300">
                Upgrade plan
              </button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900 shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p className="text-2xl font-bold mb-4">
                $35<span className="text-base">/year</span>
              </p>
              <p className="text-gray-800 opacity-90 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor
              </p>
              <ul className="space-y-2 mb-6 text-gray-800">
                <li>2 Projects</li>
                <li>Client Billing</li>
                <li>Free Staging</li>
                <li>Code Export</li>
                <li>White labeling</li>
                <li>Site password protection</li>
              </ul>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Upgrade plan
              </button>
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

