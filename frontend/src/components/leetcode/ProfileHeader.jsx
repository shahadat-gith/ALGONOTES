import { User, Trophy, MapPin, Building2, School } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import Badge from "../common/Badge";

const ProfileHeader = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="h-20 w-20 rounded-full border-2 border-primary/30 bg-bg-soft overflow-hidden shrink-0 flex items-center justify-center">
          {data.avatar ? (
            <img src={data.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-text-light" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h2 className="text-xl font-bold text-text-main">{data.name || "Unknown"}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-mono text-primary">@{data.username}</span>
              {data.ranking && (
                <Badge variant="primary">
                  <Trophy size={10} className="mr-0.5" />
                  Rank #{data.ranking}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            {data.country && (
              <span className="flex items-center gap-1"><MapPin size={12} />{data.country}</span>
            )}
            {data.company && (
              <span className="flex items-center gap-1"><Building2 size={12} />{data.company}</span>
            )}
            {data.school && (
              <span className="flex items-center gap-1"><School size={12} />{data.school}</span>
            )}
          </div>

          {data.about && (
            <p className="text-sm text-text-light max-w-lg leading-relaxed">{data.about}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {data.gitHub && (
              <a href={data.gitHub} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                <FaGithub size={13} /> GitHub
              </a>
            )}
            {data.twitter && (
              <a href={data.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                <FaTwitter size={13} /> Twitter
              </a>
            )}
            {data.linkedIN && (
              <a href={data.linkedIN} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors">
                <FaLinkedin size={13} /> LinkedIn
              </a>
            )}
            {data.skillTags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {data.skillTags.slice(0, 5).map((t, i) => (
                  <Badge key={i} variant="default">{t}</Badge>
                ))}
                {data.skillTags.length > 5 && (
                  <Badge variant="default">+{data.skillTags.length - 5} more</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
