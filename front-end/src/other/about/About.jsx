import React from "react";
import { Award, Heart, MapPin, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, Users } from "lucide-react";

const highlights = [
  {
    icon: Award,
    title: "Trusted Quality",
    text: "Every fabric is selected with care for comfort, color, finish, and long-lasting value.",
  },
  {
    icon: Sparkles,
    title: "Festive Elegance",
    text: "From everyday essentials to grand occasions, our collections are curated for every family moment.",
  },
  {
    icon: Users,
    title: "Family Shop",
    text: "Mens, womens, kids, and festive wear come together in one convenient shopping experience.",
  },
];

const stats = [
  { value: "25+", label: "Years of textile trust" },
  { value: "5k+", label: "Happy family shoppers" },
  { value: "100+", label: "Curated seasonal styles" },
  { value: "7", label: "Days customer support" },
];

const promises = [
  {
    icon: ShoppingBag,
    title: "Carefully Curated",
    text: "Our team selects collections that balance traditional charm, practical comfort, and modern fashion needs.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Shopping",
    text: "We focus on clear product information, helpful support, and consistent service from selection to checkout.",
  },
  {
    icon: Truck,
    title: "Order Guidance",
    text: "Customers can get support for product choices, video call purchases, order updates, and delivery questions.",
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
    address: "Sri Venkateswara garments, Madurai, Tamil Nadu",
    linkUrl: "https://maps.app.goo.gl/KkEmSmUztYduQ9US6",
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15719.903593313511!2d78.11655978715821!3d9.935963200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00c513f3c8dfff%3A0x63ea76f754e4feeb!2sSri%20Venkateswara%20garments-%20Men%27s%20wear%2C%20kids%20wear%2C%20ladies%20garments%20%26%20fashion%20accessories!5e0!3m2!1sen!2sin!4v1778240363556!5m2!1sen!2sin",
  },
];

const About = () => {
  return (
    <section className="bg-[#FAF0E6] px-5 py-8 md:px-16 md:py-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9F0F2] to-[#FFF1E6] px-6 py-9 text-center shadow-[0_6px_24px_rgba(77,167,175,0.16)] md:px-14 md:py-10">
          <div className="relative z-10">
          <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
            Our Story
          </span>
          <h1 className="mt-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
            About Sri Venkateswara Family Shop
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Discover our journey, quality promise, and family-focused textile collections made for every occasion.
          </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <Heart size={24} />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="text-base leading-7 text-gray-600">
              Sri Venkateswara Family Shop was built with a simple promise: make quality textile shopping easy, warm, and reliable. Our store focuses on fabrics and outfits that feel good, look elegant, and suit real family celebrations, daily wear, gifting, and special occasions.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h2 className="mb-3 text-2xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-base leading-7 text-gray-600">
              Explore sarees, shirts, kids collections, festive wear, daily essentials, and premium textile selections. We aim to give customers a smooth shopping experience with friendly support, fair pricing, and dependable product quality.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white/90 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8510A] text-white">
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-base leading-7 text-gray-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-gradient-to-br from-orange-50 to-teal-50 p-5 text-center">
              <h3 className="text-3xl font-extrabold text-[#E8510A]">{item.value}</h3>
              <p className="mt-2 text-base font-medium text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl bg-gradient-to-br from-[#4DA7AF] to-[#2F8F96] p-8 text-white shadow-xl">
            <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-base font-semibold">
              Why Families Choose Us
            </span>
            <h2 className="mt-5 text-3xl font-extrabold">One store for every occasion</h2>
            <p className="mt-4 text-base leading-7 text-white/85">
              We understand family shopping needs: school days, office wear, weddings, festivals, gifting, and daily essentials. That is why our collections are arranged to help customers compare, select, and shop with confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Sarees", "Mens Wear", "Kids Wear", "Festive Wear", "Essentials"].map((item) => (
                <span key={item} className="rounded-full bg-white/18 px-4 py-2 text-base font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {promises.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-lg">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <Icon size={23} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
              <Star size={25} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Our Shopping Promise</h2>
            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-gray-600">
              We keep every customer experience simple: friendly guidance, quality-focused products, clean presentation, fair value, and support after purchase. Sri Venkateswara Family Shop is built for families who want dependable fashion without confusion.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-6 text-center">
            <span className="inline-flex rounded-full bg-orange-100 px-5 py-2 text-base font-semibold text-orange-600">
              Our Branches
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              Visit Our Stores
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-gray-600">
              Sri Venkateswara Family Shop is available in Trichy and Madurai for family shopping support.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="shrink-0 text-orange-600" size={22} />
                    <h3 className="text-xl font-bold text-gray-900">
                      {branch.name}
                    </h3>
                  </div>
                  <p className="text-base leading-7 text-gray-600">
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
                  className="h-72 w-full border-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
