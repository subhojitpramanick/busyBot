import React from "react";

// Data array for testimonials - easier to manage and scale
const testimonialsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Digital Marketer",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    quote:
      "This tool has completely streamlined our content creation workflow. What used to take days now takes hours, allowing us to focus on strategy and creativity.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Startup Founder",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    quote:
      "As a founder, efficiency is everything. busyBot's AI-powered tools have been a game-changer for our marketing visuals, giving us a professional edge without the agency price tag.",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Graphic Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
    rating: 5,
    quote:
      "I was skeptical at first, but the quality of the generated assets is outstanding. It's the perfect assistant for overcoming creative blocks and exploring new design concepts.",
  },
];

// Reusable Star Icon Component for cleaner code
const StarIcon = () => (
  <svg
    className="w-4 h-4 text-yellow-400"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.881 3.861 4.256.618c.725.105 1.018.995.494 1.503l-3.08 2.99.728 4.238c.124.723-.634 1.283-1.29.941L10 14.939l-3.805 2.001c-.656.342-1.414-.218-1.29-.941l.728-4.238-3.08-2.99c-.524-.508-.23-1.398.494-1.503l4.256-.618 1.881-3.861z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Testimonial() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ✨ Enhanced Heading Section ✨ */}
        <div className="mx-auto max-w-2xl text-center animate-fade-in-down">
          <h2 className="text-base font-semibold leading-7 text-purple-600">
            Voices of Success
          </h2>
          <p className="mt-2 font-serif text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent sm:text-5xl">
            Crafting Brilliance, One Story at a Time.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex flex-col w-full max-w-sm flex-grow lg:w-1/3 animate-fade-in-up"
                style={{
                  animationDelay: `${200 + index * 150}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex-grow rounded-2xl bg-gray-50 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <blockquote className="text-lg leading-7 tracking-tight text-gray-700">
                    <p>“{testimonial.quote}”</p>
                  </blockquote>
                  <footer className="mt-8">
                    <img
                      className="h-16 w-16 mx-auto rounded-full"
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile picture`}
                    />
                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <svg
                        viewBox="0 0 2 2"
                        width="3"
                        height="3"
                        aria-hidden="true"
                        className="fill-gray-900"
                      >
                        <circle cx="1" cy="1" r="1" />
                      </svg>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                    <div className="flex items-center justify-center mt-3 gap-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, starIndex) => (
                          <StarIcon key={starIndex} />
                        )
                      )}
                    </div>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
