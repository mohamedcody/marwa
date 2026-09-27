import { Code2, Github, ExternalLink } from 'lucide-react';
import { siteConfig } from '../config/site';

/**
 * DeveloperBadge Component — بطاقة هوية المطور
 * مستمدة بالكامل من المصدر المركزي siteConfig.developer داخل src/config/site.ts
 * تعرض الصورة الشخصية، الاسم، الوصف الوظيفي وروابط الحسابات بشكل احترافي.
 */
export default function DeveloperBadge() {
  const { developer } = siteConfig;

  return (
    <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#C9A227]/30 bg-[#162823]/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#C9A227]/60">
      <div className="flex items-center gap-4">
        {/* صورة المطور المركزية مع صورة بديلة Fallback أنيقة لو لسه مضفتش صورتك */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#C9A227] bg-[#12211D] shadow-md">
          <img
            src={developer.avatar}
            alt={developer.avatarAlt}
            className="h-full w-full object-cover"
            onError={(e) => {
              // لو الصورة لسه مش موجودة على المسار يظهر أيقونة كود أنيقة كـ fallback
              (e.target as HTMLElement).style.display = 'none';
              const parent = (e.target as HTMLElement).parentElement;
              if (parent && !parent.querySelector('.fallback-icon')) {
                const iconContainer = document.createElement('div');
                iconContainer.className = 'fallback-icon flex h-full w-full items-center justify-center text-[#E4C566]';
                iconContainer.innerHTML = '👨‍💻';
                parent.appendChild(iconContainer);
              }
            }}
          />
        </div>

        {/* بيانات المطور */}
        <div className="flex-1 text-right">
          <div className="flex items-center justify-start gap-1.5 text-xs font-semibold text-[#E4C566]">
            <Code2 size={14} />
            <span>تطوير وبرمجة</span>
          </div>
          <h4 className="text-base font-bold text-[#F3E9D2] font-display">{developer.name}</h4>
          <p className="text-xs text-[#A9A08C] line-clamp-1">{developer.role}</p>
        </div>

        {/* رابط حساب المطور (GitHub / Portfolio) */}
        <div className="flex items-center gap-2">
          {developer.githubUrl && (
            <a
              href={developer.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2c4136] bg-[#12211D] text-[#E4C566] transition-all hover:border-[#C9A227] hover:bg-[#C9A227]/20"
            >
              <Github size={18} />
            </a>
          )}
          {developer.portfolioUrl && (
            <a
              href={developer.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2c4136] bg-[#12211D] text-[#E4C566] transition-all hover:border-[#C9A227] hover:bg-[#C9A227]/20"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
