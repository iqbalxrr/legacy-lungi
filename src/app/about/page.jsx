
"use client";

export default function AboutUs() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 md:py-16 min-h-[90vh]">
      <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Welcome to ShopEase, your number one source for all things fashion, electronics, and more.
        We're dedicated to giving you the very best shopping experience, with a focus on quality, 
        customer service, and uniqueness.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <img
          src="/images/about-us.jpg"
          alt="About Us"
          className="rounded-lg shadow-lg w-full h-[300px] object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            Our mission is to make online shopping effortless and enjoyable for everyone. 
            We aim to provide a wide range of products, secure transactions, and fast delivery.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-gray-700">
            We envision a world where everyone can access high-quality products from the comfort of their home, 
            while enjoying top-notch customer service.
          </p>
        </div>
      </div>
    </div>
  );
}
