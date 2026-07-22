import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { teamMembers, type TeamMember } from '../data/team';

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div className="px-4 pb-4">
      <div className="pt-20" />
      <h2 className="mb-2 text-2xl text-ivory">فريق <span className="text-gold-bright">العمل</span></h2>
      <p className="mb-6 text-sm text-muted">تعرف على أبطال مطعم المروة</p>

      {/* 3 member cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {teamMembers.map((member) => (
          <button
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="group overflow-hidden rounded-2xl border border-surface bg-surface/50 text-right transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12211d] via-transparent to-transparent" />
              <div className="absolute bottom-3 right-3">
                <p className="text-lg text-ivory">{member.name}</p>
                <p className="text-xs text-gold-bright">{member.role}</p>
              </div>
            </div>
            <p className="p-4 text-xs text-muted">{member.bio}</p>
            <div className="px-4 pb-4 text-xs font-semibold text-[var(--color-gold-bright)]">
              شوف الجاليري ({member.gallery.length} صور) ←
            </div>
          </button>
        ))}
      </div>

      {/* Member gallery modal */}
      {selectedMember && (
        <MemberGallery
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}

function MemberGallery({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const next = () => setLightboxIdx((prev) =>
    prev === null ? null : (prev + 1) % member.gallery.length,
  );
  const prev = () => setLightboxIdx((prev) =>
    prev === null ? null : (prev - 1 + member.gallery.length) % member.gallery.length,
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#12211d]/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface px-4 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          aria-label="إغلاق"
        >
          <X size={22} className="text-ivory" />
        </button>
        <div className="text-center">
          <p className="font-display text-xl text-gold-bright">{member.name}</p>
          <p className="text-xs text-muted">{member.role}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Bio */}
      <p className="px-6 py-4 text-center text-sm text-muted">{member.bio}</p>

      {/* Gallery grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {member.gallery.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setLightboxIdx(idx)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-surface"
              aria-label={`صورة ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${member.name} - ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black"
          onClick={() => setLightboxIdx(null)}
        >
          <img
            src={member.gallery[lightboxIdx]}
            alt={`${member.name} - ${lightboxIdx + 1}`}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="السابق"
          >
            <ChevronRight size={28} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="التالي"
          >
            <ChevronLeft size={28} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="إغلاق"
          >
            <X size={22} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
