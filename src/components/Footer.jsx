// app/components/Footer.jsx
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#063238] text-white pt-12">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Website Name & About */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">legacy lungi</h2>
                    <p className="text-gray-300 text-sm">
                        legacy lungi is your trusted destination for premium, stylish and
                        comfortable lungis. We bring traditional wear with a modern touch.
                    </p>
                    {/* Social Icons */}
                    <div className="flex gap-3 mt-4">
                        <Link href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#ffb400] transition-colors">
                            <FaFacebookF size={16} />
                        </Link>
                        <Link href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#ffb400] transition-colors">
                            <FaInstagram size={16} />
                        </Link>
                        <Link href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#ffb400] transition-colors">
                            <FaTwitter size={16} />
                        </Link>
                        <Link href="#" className="bg-gray-700 p-2 rounded-full hover:bg-[#ffb400] transition-colors">
                            <FaYoutube size={16} />
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li><Link href="/shop" className="hover:underline">Shop</Link></li>
                        <li><Link href="/about" className="hover:underline">About Us</Link></li>
                        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                        <li><Link href="/return-policy" className="hover:underline">Return Policy</Link></li>
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Policies</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
                        <li><Link href="/shipping-policy" className="hover:underline">Shipping Policy</Link></li>
                        <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-gray-300 text-sm">📍 123 Lungi Street, Dhaka, Bangladesh</p>
                    <p className="text-gray-300 text-sm">📞 +880 1234-567890</p>
                    <p className="text-gray-300 text-sm">📧 info@lungishop.com</p>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 border-t border-gray-700 py-4 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} legacy lungi. All rights reserved.
            </div>
        </footer>
    );
}
