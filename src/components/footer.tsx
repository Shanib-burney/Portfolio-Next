import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col items-center justify-between gap-3 py-8 font-mono text-[12.5px] text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name} · {profile.title}
        </p>
        <p className="flex gap-5">
          <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-fg">
            Email
          </a>
          <a href="#top" className="hover:text-fg">
            Back to top ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
