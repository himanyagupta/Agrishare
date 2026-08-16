import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-field-100 bg-field-950 text-field-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-turmeric-400 text-sm text-soil-900">
                AS
              </span>
              AgriShare
            </div>
            <p className="mt-3 text-sm text-field-300">
              Connecting idle machinery and crop residues with the farmers who need them —
              built for Smart India Hackathon.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-field-300">
              <li><Link href="/find-resources" className="hover:text-turmeric-300">Find Resources</Link></li>
              <li><Link href="/list-resource" className="hover:text-turmeric-300">List a Resource</Link></li>
              <li><Link href="/smart-match" className="hover:text-turmeric-300">Smart Match</Link></li>
              <li><Link href="/community-demand" className="hover:text-turmeric-300">Community Demand</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Resource Types</h4>
            <ul className="mt-3 space-y-2 text-sm text-field-300">
              <li>Tractors &amp; Rotavators</li>
              <li>Harvesters &amp; Seed Drills</li>
              <li>Wheat &amp; Paddy Straw</li>
              <li>Cotton Stalks &amp; Stover</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Prototype status</h4>
            <p className="mt-3 text-sm text-field-300">
              This build uses realistic mock data. Authentication, live database and maps are
              planned for the next milestone.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-field-800 pt-6 text-xs text-field-400">
          Built for Smart India Hackathon · AgriShare prototype
        </div>
      </div>
    </footer>
  );
}
