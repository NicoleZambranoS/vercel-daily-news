import { subscribe } from "@/actions/subscription";
import SubmitButton from "@/components/ui/subscription/submit-button";

export default function SubscribeCTA() {
    return (
        <div className="relative overflow-hidden bg-linear-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl p-12 sm:p-16 mb-16">
            <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Enjoying this article?</h3>
                <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
                    Subscribe to Vercel Daily Pro for unlimited access to all premium content, early releases, and exclusive insights.
                </p>
                <SubmitButton action={subscribe} className="inline-flex items-center gap-2 btn-inverse">
                    Upgrade to Pro
                </SubmitButton>
            </div>
        </div>
    );
}
