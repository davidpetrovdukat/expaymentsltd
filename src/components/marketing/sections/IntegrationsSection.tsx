import { INTEGRATIONS } from '@/lib/marketing-data';
import { Icon } from '@/components/marketing/ui/Icon';

export function IntegrationsSection() {
    return (
        <section className="py-16 bg-background-subtle border-y border-gray-100">
            <div className="max-w-[80rem] mx-auto px-6">
                <h3 className="text-2xl font-bold text-center text-text-main mb-12">Seamless Integration with Your Platform</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-center opacity-70">
                    {INTEGRATIONS.map((integration) => (
                        <div key={integration.name} className="flex flex-col items-center justify-center gap-2 group cursor-pointer hover:opacity-100 transition-all duration-300 hover:scale-110 hover:-translate-y-2">
                            <Icon name={integration.icon} className={`w-10 h-10 ${integration.iconClass}`} />
                            <span className="font-bold text-sm text-text-main">{integration.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
