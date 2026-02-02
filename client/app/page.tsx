import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 leading-tight">
            Your Journey to{" "}
            <span className="bg-linear-to-r from-calm-600 to-calm-800 bg-clip-text text-transparent">
              Mental Wellness
            </span>
            <br />
            Starts Here
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Professional support, personalized resources, and a caring community
            to help you thrive every day.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button href="/register" variant="primary" size="lg">
              Get Started Free
            </Button>
            <Button href="/login" variant="ghost" size="lg">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 bg-linear-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-neutral-900 mb-16">
            Why Choose MindCare?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <GlassCard hover className="animate-slide-up space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-calm-400 to-calm-600 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Professional Support
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Connect with licensed therapists and counselors who understand
                your unique journey.
              </p>
            </GlassCard>

            {/* Feature 2 */}
            <GlassCard
              hover
              className="animate-slide-up [animation-delay:100ms] space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                Safe & Private
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Your privacy is our priority. All sessions and data are fully
                encrypted and confidential.
              </p>
            </GlassCard>

            {/* Feature 3 */}
            <GlassCard
              hover
              className="animate-slide-up [animation-delay:200ms] space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-teal to-accent-purple flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                24/7 Resources
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Access tools, exercises, and support whenever you need it, day
                or night.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center space-y-8" padding="xl">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Join thousands who have taken the first step towards better mental
              health.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/register" variant="primary" size="lg">
                Create Free Account
              </Button>
              <Button href="/login" variant="outline" size="lg">
                Sign In
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
