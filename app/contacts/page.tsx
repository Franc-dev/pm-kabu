import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-lg py-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-blue-800">Contact Us</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">We’d Love to Hear From You!</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Have any questions? Need help with our services? Drop us a message, and we&lsquo;ll get back to you as soon as possible.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information Section */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Our Contact Info</h3>
                  <ul className="space-y-5 text-lg text-gray-700">
                    <li className="flex items-center">
                      <MapPin className="h-6 w-6 text-blue-500 mr-4" />
                      <span>Kabarak University, Nakuru, Kenya</span>
                    </li>
                    <li className="flex items-center">
                      <Phone className="h-6 w-6 text-blue-500 mr-4" />
                      <span>+254 123 456 789</span>
                    </li>
                    <li className="flex items-center">
                      <Mail className="h-6 w-6 text-blue-500 mr-4" />
                      <span>projectmanagement@kabarak.ac.ke</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Form Section */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">Send Us a Message</h3>
                  <form>
                    <div className="mb-6">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Full Name"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Email Address"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Write your message here"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>

              {/* Google Maps Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">Visit Us</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31918.388656132007!2d35.95808745643588!3d-0.18022557305173315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1829f6f367bba6d9%3A0x363c14244dccdde!2sKabarak%20University!5e0!3m2!1sen!2ske!4v1740052361591!5m2!1sen!2ske"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                  ></iframe>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
