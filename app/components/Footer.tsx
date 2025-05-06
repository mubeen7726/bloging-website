"use client";
import Image from "next/image";
import Link from "next/link";
export default function Footer() {
  return (
    <div>
      <footer className="bg-[#84a6e8] dark:bg-zinc-700 inset-shadow-accent-foreground shadow-lg relative bottom-0 right-0 left-0 text-[#fcfdff] font-semibold">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="hover:text-shadow-teal-600  text-shadow-md transition-all text-2xl font-bold text-teal-800 mb-20"
                  aria-label="Home"
                >
                 <Image src={'https://res.cloudinary.com/dktdpqfqk/image/upload/v1746537279/Bloging%20website%20seperate%20image/rhtnp9g482vzt6qpnv4y.png'} loading="lazy" width={100} height={100} className="w-25 h-25" alt="logo not found"></Image>

                </Link>
              </div>
              <p>Your trusted source for tech reviews and comparisons</p>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Categories
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="hover:text-custom">
                    Mobile Phones
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Laptops
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Bikes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Comparisons
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="hover:text-custom">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-custom">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="flex space-x-6">
                <Link href="#" className="hover:text-custom">
                  <i className="fab fa-facebook-f" />
                </Link>
                <Link href="#" className="hover:text-custom">
                  <i className="fab fa-twitter" />
                </Link>
                <Link href="#" className="hover:text-custom">
                  <i className="fab fa-instagram" />
                </Link>
                <Link href="#" className="hover:text-custom">
                  <i className="fab fa-youtube" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-center">
                © 2024 TechReviews Hub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
