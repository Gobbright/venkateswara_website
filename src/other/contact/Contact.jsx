import React from "react";
import { Mail, MapPin, Phone, Clock, Send } from "lucide-react";

const contactCards = [
  {
    icon: MapPin,
    title: "Visit Store",
    text: "Mosque Building, 7, Manthai street, Thennur High Rd, opp. to Tennur, Tiruchirappalli, Tamil Nadu 620017",
  },
  {
    icon: Phone,
    title: "Call Us",
    text: "+91 98765 43210",
  },
  {
    icon: Mail,
    title: "Email Support",
    text: "care@venkateshwaratextiles.in",
  },
  {
    icon: Clock,
    title: "Store Hours",
    text: "Monday to Sunday, 10:00 AM - 9:00 PM",
  },
];

const branches = [
  {
    name: "Trichy Tennur Branch",
    address:
      "Mosque Building, 7, Manthai street, Thennur High Rd, opp. to Tennur, Tiruchirappalli, Tamil Nadu 620017",
    linkUrl: "https://maps.app.goo.gl/VYJqudvH4ek4vqF78",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.928254782591!2d78.6830595!3d10.8168025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5a09a2db4f1%3A0xc99796d7f5036d41!2sSri%20Venkateswara%20Family%20Shop%20%E2%80%93%20Men%E2%80%99s%2C%20Women%E2%80%99s%20%26%20Kids%20Wear%20%7C%20Trichy!5e0!3m2!1sen!2sin!4v1778240366385!5m2!1sen!2sin",
  },
  {
    name: "Madurai Branch",
    address:
      "Sri Venkateswara garments, Madurai, Tamil Nadu",
    linkUrl: "https://maps.app.goo.gl/KkEmSmUztYduQ9US6",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15719.903593313511!2d78.11655978715821!3d9.935963200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c513f3c8dfff%3A0x63ea76f754e4feeb!2sSri%20Venkateswara%20garments-%20Men%27s%20wear%2C%20kids%20wear%2C%20ladies%20garments%20%26%20fashion%20accessories!5e0!3m2!1sen!2sin!4v1778240363556!5m2!1sen!2sin",
  },
];

const Contact = () => {
  return (
    <section className="bg-[#FAF0E6] px-5 py-8 md:px-16 md:py-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] px-6 py-9 text-center shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:px-14 md:py-10">
          <div className="relative z-10">
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            We Are Here To Help
          </span>
          <h1 className="mt-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Contact Sri Venkateswara Family Shop
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Need help with products, video call purchase, orders, or store details? Send us a message and our team will guide you.
          </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {contactCards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Icon size={22} />
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{title}</h3>
              <p className="text-base leading-7 text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-6">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:grid md:grid-cols-[0.85fr_1.15fr]"
            >
              <div className="p-6 md:p-8">
                <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                  Branch
                </span>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {branch.name}
                </h2>
                <p className="mt-3 text-base leading-7 text-gray-600">
                  {branch.address}
                </p>
                <a
                  href={branch.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white !no-underline transition hover:bg-orange-700"
                >
                  Open Map
                </a>
              </div>
              <iframe
                title={`${branch.name} map`}
                src={branch.mapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0 md:h-full"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">Enquiry Form</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-full bg-orange-50 px-5 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Your Name" />
              <input className="rounded-full bg-orange-50 px-5 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Phone Number" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <select className="rounded-full bg-orange-50 px-5 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300">
                <option>Product Category</option>
                <option>Silk Sarees</option>
                <option>Mens Wear</option>
                <option>Kids Collection</option>
                <option>Festive Wear</option>
              </select>
              <input className="rounded-full bg-orange-50 px-5 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Product / Size / Color" />
            </div>
            <input className="mt-4 w-full rounded-full bg-orange-50 px-5 py-3 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Email Address" />
            <textarea className="mt-4 min-h-32 w-full rounded-2xl bg-orange-50 px-5 py-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-orange-300" placeholder="Tell us what you are looking for..." />
            <button type="button" className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-600 px-7 py-3 text-base font-semibold text-white transition hover:bg-gradient-to-r hover:from-orange-600 hover:via-[#FFBE8A] hover:to-[#4DA7AF]">
              Send Enquiry
              <Send size={16} />
            </button>
          </form>

          <div className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Shopping Support</h2>
            <p className="text-base leading-7 text-gray-600">
              Our team can help you choose fabric, confirm product availability, assist with festive collections, and guide you through order support. For quick purchase help, use the video call purchase option in the navbar.
            </p>
            <div className="mt-6 rounded-2xl bg-gradient-to-br from-orange-50 to-teal-50 p-5">
              <h3 className="mb-2 font-bold text-gray-900">Quick Response</h3>
              <p className="text-base leading-7 text-gray-600">
                We usually respond during store working hours. Please share your phone number for faster support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
