import { useEffect, useRef, useState } from "react";
import { Mail, Menu, X } from "lucide-react";
import { SiDiscord, SiGithub, SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";

const ASSET = "/assets/images/";
const LIVE_LOGO = "/assets/images/cesa-logo.png";
const MEMBERSHIP_URL = "https://discreet-allosaurus-2fd.notion.site/ebd//005fac95c93245a787532d156abfc2ec";
const WORKSPACE_URL = "https://app.notion.com/p/d4027c58b0a68211addd817db08d6771?pvs=204";
const NAV_LINKS = [["About", "/about/"], ["Membership", "/membership/"], ["Projects", "/projects/"], ["Publications", "/publications/"], ["Announcements", "/announcements/"], ["Contact", "/contact/"]] as const;

const projects = [
  ["Sustainability", "Modeling Pollution in the Seattle-Puget Sound Area", "pollution-3075857_1280.jpg", "Pollution over a city skyline", "Model pollution exposure across the Seattle-Puget Sound region to better understand local environmental risks."],
  ["Tackling Unethical and Unsafe Software", 'Performing Automated Audits of Software to Create More "Ethical" Code', "ethicalaudit.jpg", "Ethical software audit", "Develop repeatable audits that identify harmful patterns and encourage safer, more responsible software."],
  ["Increasing Digital Awareness", "Creating Equitable Computer Science Syllabi for K-12 Students", "courseplan.jpg", "Computer science course planning", "Create accessible computer science learning materials that serve K-12 students from a wider range of backgrounds."],
  ["Sustainability", "Creating a State-of-the-Art ML-Based Weather Forecaster", "mlforecast.jpg", "Machine learning weather forecaster", "Explore modern machine-learning methods for producing useful, accurate forecasts from environmental data."],
  ["Sustainability", "Integrating ML into Conservation-Related Data Collection and Insight Generation", "conservation.jpg", "Conservation field research", "Apply machine learning to conservation data collection and turn field observations into actionable insight."],
  ["Sustainability", "Studying How Attention Mechanisms in LLMs can Lead to Innovative Climate Change Solutions", "attentionmechanisms.jpg", "Attention mechanism research", "Study how attention-based models can support new approaches to climate research and decision-making."],
  ["Bridging the Digital Divide", "Accessible Software Evaluation", "accessibility-audit.jpg", "Hands typing on a laptop keyboard", "Audit software against accessibility standards and assistive-technology workflows, then publish barriers, severity, and recommended fixes."],
  ["Bridging the Digital Divide", "Survey/Analysis of Technology Access in Communities", "technology-access-community.jpg", "A mentor helping adults learn to use laptops", "Study local barriers to devices, broadband, skills, trust, and language, then translate the findings into actionable recommendations."],
  ["Sustainability", "Compressing Large Language Models", "llm-compression.jpg", "Close-up of a circuit board and processor", "Investigate quantization, pruning, distillation, and other compression methods that make large language models smaller, faster, and less energy-intensive to run."],
  ["Sustainability", "More Efficient ML Chips", "efficient-ml-chips.jpg", "Close-up of a microprocessor on a circuit board", "Explore more sustainable GPU and machine-learning accelerator designs that reduce power use, heat, and material costs without sacrificing useful performance."],
] as const;

const homeProjects = [projects[0], projects[1], projects[2], projects[9]];

const pillars = [
  ["01", "Tackling Unethical and Unsafe Software", "Designing, auditing, and fixing software that is malicious, biased, or insecure, while pursuing robust cybersecurity.", "icon-design.svg"],
  ["02", "Increasing Digital Awareness", "Exploring technology's benefits and drawbacks, and helping bridge the digital divide so more people can participate.", "icon-dev.svg"],
  ["03", "Sustainability", "Creating software that helps track environmental health and encourages more sustainable decisions and practices.", "icon-leaf.png"],
] as const;

type Page = "home" | "about" | "membership" | "projects" | "publications" | "announcements" | "contact";
type Announcement = { id: string; title: string; date: string; displayDate: string; category: string; summary: string; image?: string };
type TypingTitleProps = { as: "h1" | "h2"; before: string; accent: string; after?: string; className?: string };

function TextWithBreaks({ text }: { text: string }) {
  return <>{text.split("\n").map((line, index) => <span key={`${line}-${index}`}>{index > 0 && <br />}{line}</span>)}</>;
}

function TypingTitle({ as, before, accent, after = "", className = "" }: TypingTitleProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fullLength = before.length + accent.length + after.length;
  const [visibleChars, setVisibleChars] = useState(as === "h1" ? 0 : fullLength);
  const [complete, setComplete] = useState(as !== "h1");
  useEffect(() => {
    if (as !== "h1") return;
    const heading = headingRef.current;
    if (!heading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisibleChars(fullLength); setComplete(true); return; }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const duration = Math.min(1800, Math.max(850, fullLength * 28));
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setVisibleChars(Math.floor(progress * fullLength));
        if (progress < 1) frame = requestAnimationFrame(animate); else setComplete(true);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(heading);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [as, fullLength]);
  const beforeCount = Math.min(visibleChars, before.length);
  const accentCount = Math.min(Math.max(visibleChars - before.length, 0), accent.length);
  const afterCount = Math.min(Math.max(visibleChars - before.length - accent.length, 0), after.length);
  const label = `${before}${accent}${after}`.replaceAll("\n", " ");
  const content = <><span aria-hidden="true" className="invisible"><TextWithBreaks text={before} /><em className="text-primary"><TextWithBreaks text={accent} /></em><TextWithBreaks text={after} /></span><span aria-hidden="true" className="absolute inset-0"><TextWithBreaks text={before.slice(0, beforeCount)} /><em className="text-primary"><TextWithBreaks text={accent.slice(0, accentCount)} /></em><TextWithBreaks text={after.slice(0, afterCount)} />{!complete && <span className="typing-cursor" />}</span></>;
  return as === "h1" ? <h1 ref={headingRef} aria-label={label} className={`relative ${className}`}>{content}</h1> : <h2 ref={headingRef} aria-label={label} className={`relative ${className}`}>{content}</h2>;
}

function Arrow() { return <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-1">↗</span>; }

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setDisplayValue(value); return; }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const startedAt = performance.now();
      const animate = (now: number) => { const progress = Math.min((now - startedAt) / 1100, 1); setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(animate); };
      frame = requestAnimationFrame(animate); observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(element);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={elementRef}>{displayValue}{suffix}</span>;
}

function ProgressTracker({ items }: { items: Array<{ label: string; value: number }> }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const element = elementRef.current; if (!element) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.25 }); observer.observe(element); return () => observer.disconnect(); }, []);
  return <div ref={elementRef} className="grid gap-x-10 gap-y-7 md:grid-cols-2">{items.map((item) => <div key={item.label}><div className="mb-3 flex items-end justify-between gap-4"><span className="font-display text-xl">{item.label}</span><span className="font-mono-label text-xs text-primary"><AnimatedNumber value={item.value} suffix="%" /></span></div><div className="h-1.5 overflow-hidden bg-muted"><div className="h-full bg-primary transition-[width] duration-1000 ease-out" style={{ width: visible ? `${item.value}%` : "0%" }} /></div></div>)}</div>;
}

function Header({ page }: { page: Page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl"><div className="page-grid mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 md:px-9"><a href="/" className="flex items-center gap-3" aria-label="CESA home"><img src={LIVE_LOGO} alt="CESA logo" className="h-9 w-11 shrink-0 object-contain" /><span className="font-mono-label text-[11px] uppercase">CESA <span className="hidden text-muted-foreground sm:inline">/ UW Seattle</span></span></a><nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">{NAV_LINKS.map(([label, href]) => <a key={href} href={href} aria-current={page === label.toLowerCase() ? "page" : undefined} className={`nav-link ${page === label.toLowerCase() ? "text-primary" : ""}`}>{label}</a>)}</nav><div className="flex items-center gap-3"><a href={MEMBERSHIP_URL} className="button-primary hidden sm:inline-flex">Join CESA <Arrow /></a><Button variant="outline" size="icon" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)} className="h-9 w-9 rounded-none border-border bg-transparent text-primary lg:hidden">{menuOpen ? <X /> : <Menu />}</Button></div></div>{menuOpen && <nav className="border-t border-border bg-card px-5 py-5 lg:hidden" aria-label="Mobile navigation">{NAV_LINKS.map(([label, href]) => <a key={href} href={href} className="block border-b border-border py-3 font-mono-label text-xs uppercase">{label}</a>)}<a href={MEMBERSHIP_URL} className="button-primary mt-5 inline-flex">Join CESA <Arrow /></a></nav>}</header>;
}

function Footer() {
  return <footer className="border-t border-border"><div className="page-grid mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-5 py-10 text-xs text-muted-foreground md:flex-row md:px-9"><div className="flex items-center gap-3"><img src={LIVE_LOGO} alt="CESA logo" className="h-9 w-11 object-contain" /><p>© 2026 CESA / Computing for Environmental and Social Advocacy</p></div><div className="flex flex-wrap gap-x-5 gap-y-3"><a href="https://www.instagram.com/cesauw/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><SiInstagram size={17} />Instagram</a><a href="https://github.com/UW-CESA" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><SiGithub size={17} />GitHub</a><a href="https://discord.gg/tMTDRqCK" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><SiDiscord size={17} />Discord</a><a href="mailto:cesa@uw.edu" className="flex items-center gap-2 hover:text-primary"><Mail size={17} />Email</a></div></div></footer>;
}

function PageHero({ eyebrow, before, accent, copy }: { eyebrow: string; before: string; accent: string; copy: string }) {
  return <section className="page-hero"><div className="hero-grid absolute inset-0 opacity-60" /><div className="relative mx-auto max-w-[1440px] px-5 md:px-9"><p className="eyebrow text-primary">{eyebrow}</p><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end"><TypingTitle as="h1" before={before} accent={accent} className="font-display text-[clamp(3.4rem,7vw,7.5rem)] font-light leading-[.9]" /><p className="max-w-md border-l border-primary/40 pl-6 text-lg font-light leading-relaxed text-foreground/75">{copy}</p></div></div></section>;
}

function ScatterCards({ children }: { children: React.ReactNode }) { return <div className="scatter-grid">{children}</div>; }

function Home({ announcements }: { announcements: Announcement[] }) {
  return <><section className="relative isolate flex min-h-[min(860px,100vh)] items-end overflow-hidden border-b border-border pt-24"><img src={ASSET + "conservation.jpg"} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover opacity-30 saturate-50" /><div className="absolute inset-0 -z-20 bg-background/65" /><div className="hero-grid absolute inset-0 -z-10 opacity-70" /><div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-9 md:pb-20"><p className="eyebrow mb-8 text-primary">University of Washington / Seattle / Est. 2023</p><div className="grid gap-10 lg:grid-cols-12 lg:items-end"><TypingTitle as="h1" before={"Computing\nfor "} accent="environmental" after={"\n& social advocacy."} className="font-display text-[clamp(3.4rem,7.6vw,8.5rem)] font-light leading-[.88] lg:col-span-9" /><div className="lg:col-span-3 lg:border-l lg:border-primary/40 lg:pb-2 lg:pl-8"><p className="max-w-sm text-lg font-light leading-relaxed text-foreground/80">A multidisciplinary student organization harnessing computer science to solve societal problems.</p><a className="button-primary mt-7 inline-flex" href="/projects/">Explore our work <Arrow /></a></div></div><div className="mt-16 grid max-w-4xl grid-cols-2 border-l border-t border-border bg-background/75 backdrop-blur-sm sm:grid-cols-4">{[{ value: 70, suffix: "+", label: "members" }, { value: 4, suffix: "+", label: "majors" }, { value: 6, suffix: "", label: "active projects" }, { value: 2023, suffix: "", label: "founded" }].map(({ value, suffix, label }) => <div key={label} className="border-b border-r border-border px-4 py-5 md:px-6"><div className="font-display text-3xl font-light text-primary"><AnimatedNumber value={value} suffix={suffix} /></div><div className="eyebrow mt-2 text-muted-foreground">{label}</div></div>)}</div></div></section><section className="section-shell"><div className="section-heading"><p className="eyebrow text-primary">What guides us</p><TypingTitle as="h2" before="Three ways to make " accent="technology matter." /><p>CESA brings students together around practical work in ethical computing, digital access, and environmental sustainability.</p></div><ScatterCards>{pillars.map(([id, title, copy, icon]) => <article key={id} className="scatter-card"><div className="flex items-center justify-between"><p className="eyebrow text-primary">{id}</p><img src={ASSET + icon} alt="" className="h-11 w-11 object-contain" /></div><h3>{title}</h3><p>{copy}</p></article>)}</ScatterCards><a href="/about/" className="button-outline mt-10 inline-flex">Learn about CESA <Arrow /></a></section><section className="section-shell border-t border-border"><div className="section-heading"><p className="eyebrow text-primary">Selected work</p><TypingTitle as="h2" before="Ideas moving into " accent="the field." /><p>Member-led projects turn technical curiosity into useful tools, research, and resources.</p></div><div className="grid gap-5 md:grid-cols-2">{homeProjects.map(([category, title, image, alt]) => <article key={title} className="project-card"><img src={ASSET + image} alt={alt} /><div><p className="eyebrow text-primary">{category}</p><h3>{title}</h3></div></article>)}</div><a href="/projects/" className="button-outline mt-10 inline-flex">See all projects <Arrow /></a></section><section className="section-shell border-t border-border"><div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><p className="eyebrow text-primary">Join the work</p><h2 className="mt-5 max-w-3xl font-display text-5xl font-light leading-none md:text-7xl">Bring your skills. <em className="text-primary">Build something useful.</em></h2></div><a href="/membership/" className="button-primary inline-flex w-fit">Explore membership <Arrow /></a></div>{announcements.length > 0 && <a href={`/announcements/${announcements[0].id}/`} className="mt-16 block border-t border-border pt-7"><p className="eyebrow text-primary">Latest / {announcements[0].displayDate}</p><h3 className="mt-3 max-w-3xl font-display text-3xl">{announcements[0].title}</h3></a>}</section></>;
}

function About() {
  const advisers = [["Dr. Nathan Brunelle", "Ethical computing & digital awareness", "brunelle@cs.washington.edu", "my-avatar.png"], ["Dr. Kurtis Heimerl", "Sustainable computing & partnerships", "kheimerl@cs.washington.edu", "avatar-1.png"], ["Dr. Lisa Graumlich", "Conservation & social impact", "graumlic@uw.edu", "avatar-2.png"]];
  return <><PageHero eyebrow="About CESA" before="Technology for the " accent="global good." copy="CESA is a student organization at the University of Washington Allen School of Computer Science & Engineering." /><section className="section-shell"><div className="section-heading"><p className="eyebrow text-primary">Our pillars</p><TypingTitle as="h2" before="A mission with " accent="three lenses." /><p>We believe software is a civic act, and that engineers carry responsibility for what they build and who it impacts.</p></div><ScatterCards>{pillars.map(([id, title, copy, icon]) => <article key={id} className="scatter-card"><div className="flex items-center justify-between"><p className="eyebrow text-primary">{id}</p><img src={ASSET + icon} alt="" className="h-12 w-12 object-contain" /></div><h3>{title}</h3><p>{copy}</p></article>)}</ScatterCards></section><section className="section-shell border-t border-border"><div className="section-heading"><p className="eyebrow text-primary">Faculty advisers</p><TypingTitle as="h2" before="Guidance from " accent="across UW." /><p>Our advisers help guide the club and lend their expertise and experience to member projects.</p></div><ScatterCards>{advisers.map(([name, focus, email, avatar]) => <a key={name} href={`mailto:${email}`} className="scatter-card group"><img src={ASSET + avatar} alt="" className="h-16 w-16 object-contain" /><h3>{name}</h3><p>{focus}</p><span className="mt-5 block font-mono-label text-[11px] text-primary">{email} <Arrow /></span></a>)}</ScatterCards></section><section className="section-shell border-t border-border"><div className="section-heading"><p className="eyebrow text-primary">Meet the officers</p><TypingTitle as="h2" before="Leadership with " accent="purpose." /><p>CESA's officers guide the organization and keep its work focused on meaningful outcomes.</p></div><div className="grid gap-9 md:grid-cols-[minmax(240px,360px)_minmax(0,1fr)] md:items-center md:gap-14"><div className="overflow-hidden bg-card"><img src={ASSET + "shreyan-mitra-president.jpeg"} alt="Shreyan Mitra, President and Founder of CESA" className="aspect-[4/5] w-full object-cover object-[center_35%]" /></div><div><p className="eyebrow text-primary">President & founder</p><h3 className="mt-4 font-display text-5xl font-light md:text-6xl">Shreyan Mitra</h3><p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">Shreyan founded CESA in 2023 and leads its mission to connect computing with meaningful environmental and social outcomes. He brings experience as a software development engineer at AWS and as a teaching assistant for UW CSE 311.</p><a href="mailto:cesa@uw.edu" className="button-outline mt-7 inline-flex">Contact CESA <Arrow /></a></div></div><div className="mt-20 border-t border-border pt-8"><p className="eyebrow text-primary">Sponsors & partners</p><div className="mt-8 flex flex-wrap items-center gap-12"><a href="https://www.cs.washington.edu/" target="_blank" rel="noreferrer"><img src={ASSET + "UWLogo1.png"} alt="University of Washington" className="h-14 max-w-[240px] object-contain" /></a><a href="https://allenai.org/" target="_blank" rel="noreferrer"><img src={ASSET + "AI2.png"} alt="Allen Institute for AI" className="h-12 max-w-[220px] object-contain" /></a></div></div></section></>;
}

function Membership() {
  const steps = [["01", "Propose", "Define the problem, final product, connection to a CESA pillar, team, and expected expenses."], ["02", "Review", "Officers and advisers check alignment, feasibility, ethics, and available support."], ["03", "Build", "Teams receive a mentor, regular check-ins, tools, expertise, and outreach support."], ["04", "Share", "Teams present completed work and prepare useful outcomes for partners or the public."]];
  const activities = [["01", "Member meetings", "Organization updates and approachable conversations about computing and impact."], ["02", "Literature reviews", "Group discussions around research connected to CESA's mission and active projects."], ["03", "Project labs", "Dedicated time for teams and mentors to collaborate, solve problems, and share progress."], ["04", "Guest speakers", "Conversations with people working in sustainable and ethical computing."], ["05", "Socials", "Informal ways to exchange ideas, meet fellow members, and build community."]];
  return <><PageHero eyebrow="Membership" before="Learn, build, and " accent="work together." copy="Membership is more than attending meetings. It is a path from shared curiosity to useful, public-facing work." /><section className="section-shell"><div className="section-heading"><p className="eyebrow text-primary">How CESA works</p><TypingTitle as="h2" before="From an idea to " accent="measurable impact." /><p>Member-led projects follow a clear path with officer, adviser, and mentor support.</p></div><ScatterCards>{steps.map(([id, title, copy]) => <article key={id} className="scatter-card"><p className="eyebrow text-primary">{id}</p><h3>{title}</h3><p>{copy}</p></article>)}</ScatterCards></section><section className="section-shell border-t border-border"><div className="section-heading"><p className="eyebrow text-primary">What members do</p><TypingTitle as="h2" before="Many ways to " accent="take part." /><p>Build experience, meet collaborators, hear expert perspectives, and become part of a welcoming technical community.</p></div><ScatterCards>{activities.map(([id, title, copy]) => <article key={id} className="scatter-card scatter-card-small"><p className="eyebrow text-primary">{id}</p><h3>{title}</h3><p>{copy}</p></article>)}</ScatterCards></section><section className="section-shell border-t border-border"><div className="grid gap-12 lg:grid-cols-2"><div><p className="eyebrow text-primary">Join us today</p><h2 className="mt-5 font-display text-5xl font-light leading-none">Ready to make a <em className="text-primary">material difference?</em></h2><p className="mt-6 max-w-xl text-lg text-muted-foreground">Bring technical expertise, a passion to create change, or simply the curiosity to learn alongside us.</p><a href={MEMBERSHIP_URL} className="button-primary mt-8 inline-flex">CESA membership form <Arrow /></a></div><div className="border-border lg:border-l lg:pl-10"><p className="eyebrow text-primary">Be a leader</p><h3 className="mt-5 font-display text-4xl">Help shape what CESA does next.</h3><p className="mt-5 max-w-xl text-muted-foreground">Officer opportunities let members guide projects, programming, partnerships, communications, and club operations.</p><a href="mailto:cesa@uw.edu?subject=CESA%20Officer%20Opportunities" className="button-outline mt-8 inline-flex">Ask about leadership <Arrow /></a></div></div></section></>;
}

function Projects() {
  const [filter, setFilter] = useState("All");
  const visibleProjects = filter === "All" ? projects : projects.filter(([category]) => category === filter);
  return <><PageHero eyebrow="Projects" before="Work in " accent="the field." copy="Members can join existing work or propose their own response to an environmental or social challenge." /><section className="section-shell"><div className="mb-10 flex flex-wrap gap-2">{["All", "Sustainability", "Tackling Unethical and Unsafe Software", "Increasing Digital Awareness", "Bridging the Digital Divide"].map((name) => <button key={name} onClick={() => setFilter(name)} aria-pressed={filter === name} className={`filter-chip ${filter === name ? "filter-chip-active" : ""}`}>{name}</button>)}</div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleProjects.map(([category, title, image, alt, description]) => <article key={title} className="project-card"><img src={ASSET + image} alt={alt} /><div><p className="eyebrow text-primary">{category}</p><h3>{title}</h3><p className="project-description">{description}</p></div></article>)}</div><div className="mt-16 flex flex-col justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-end"><div><p className="eyebrow text-primary">Start something</p><h2 className="mt-4 max-w-2xl font-display text-4xl">Have an idea that belongs here?</h2></div><a href="/membership/" className="button-outline inline-flex w-fit">See how projects work <Arrow /></a></div></section></>;
}

function Publications() {
  const docs = [["Quarterly Report", "Membership growth, our first published project, and our first partnership.", "https://app.notion.com/p/3cd27c58b0a6802f99c1e875c0f5296c?pvs=204"], ["Amendments", "Amendments to the constitution, proposed and ratified by members.", "https://app.notion.com/p/3cc27c58b0a6801c93b1ec76bfcaf055?pvs=204"], ["Constitution", "Our bylaws, vision, goals, and values.", "https://app.notion.com/p/3cc27c58b0a68049a750d2c237e24674?pvs=204"]];
  return <><PageHero eyebrow="Publications" before="Progress and " accent="transparency." copy="CESA keeps its administrative work open to the public and shares project progress with its community." /><section className="section-shell"><div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-4">{docs.map(([title, copy, href]) => <a key={title} href={href} target="_blank" rel="noreferrer" className="document-link group"><div><h2>{title}</h2><p>{copy}</p></div><Arrow /></a>)}</div><aside className="self-start border border-border bg-card p-7"><p className="eyebrow text-primary">Members only</p><h2 className="mt-4 font-display text-3xl">Meeting minutes, resources, and announcements.</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Verify your membership to access internal meeting files and the CESA event calendar.</p><a href={WORKSPACE_URL} target="_blank" rel="noreferrer" className="button-outline mt-7 inline-flex">Open CESA workspace <Arrow /></a></aside></div></section><section className="section-shell border-t border-border"><div className="section-heading"><p className="eyebrow text-primary">Annual tracker</p><TypingTitle as="h2" before="Making progress " accent="visible." /><p>Progress reflects completed work against planned work and resets at the end of each membership cycle.</p></div><div className="border border-border bg-card p-6 md:p-8"><ProgressTracker items={[{ label: "Making Impact", value: 20 }, { label: "Driving Innovation", value: 70 }, { label: "Building Partnerships", value: 10 }, { label: "Fostering Community", value: 50 }]} /></div></section></>;
}

function Announcements({ announcements }: { announcements: Announcement[] }) {
  return <><PageHero eyebrow="Announcements" before="Updates from " accent="CESA." copy="News about projects, events, partnerships, publications, and opportunities across the organization." /><section className="section-shell">{announcements.length > 0 ? <div className="grid gap-6 md:grid-cols-2">{announcements.map(({ id, category, displayDate, title, summary, image }) => <a key={id} href={`/announcements/${id}/`} className="announcement-card group">{image ? <img src={image} alt="" /> : <div className="hero-grid aspect-[16/8] bg-card" />}<div><p className="eyebrow text-primary">{category} / {displayDate}</p><h2>{title}</h2><p>{summary}</p><span className="mt-5 block font-mono-label text-[11px] text-primary">Read announcement <Arrow /></span></div></a>)}</div> : <div className="border-y border-border py-12"><h2 className="font-display text-3xl">No current announcements.</h2><p className="mt-2 text-muted-foreground">New CESA updates will appear here.</p></div>}</section></>;
}

function Contact() {
  return <><PageHero eyebrow="Contact" before="Let's make something " accent="useful." copy="Reach out about collaboration, funding, questions, or new ways CESA can contribute." /><section className="section-shell"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-primary">Find us</p><h2 className="mt-4 font-display text-4xl">Paul G. Allen School of Computer Science & Engineering</h2><p className="mt-4 text-muted-foreground">Seattle, Washington, USA</p><iframe title="Map of the Paul G. Allen School of Computer Science and Engineering" src="https://www.openstreetmap.org/export/embed.html?bbox=-122.3105%2C47.6506%2C-122.2995%2C47.6569&amp;layer=mapnik&amp;marker=47.6533%2C-122.3050" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-7 aspect-[4/3] w-full border border-border grayscale" /></div><div><div className="mb-10 border-b border-border pb-8"><p className="eyebrow text-primary">Collaborate</p><h2 className="mt-4 font-display text-4xl">Work with CESA.</h2><p className="mt-4 max-w-2xl text-muted-foreground">Organizations in computing or the environmental space can email us with the subject “CESA Collaboration.” To discuss funding, use “CESA Funding.”</p><a href="mailto:cesa@uw.edu" className="button-outline mt-7 inline-flex">cesa@uw.edu <Arrow /></a></div><form action="https://formspree.io/f/xqazkerg" method="POST" className="grid content-start gap-3"><label className="sr-only" htmlFor="name">Full name</label><input id="name" name="fullname" required placeholder="Full name" className="form-field" /><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" name="email" required placeholder="Email address" className="form-field" /><label className="sr-only" htmlFor="message">Your message</label><textarea id="message" name="message" required placeholder="Your message" rows={5} className="form-field resize-y" /><button className="button-primary w-fit" type="submit">Send inquiry <Arrow /></button></form></div></div></section></>;
}

export default function CesaSite({ announcements, page = "home" }: { announcements: Announcement[]; page?: Page }) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = ".scatter-card, .project-card, .document-link, .announcement-card";
    root.classList.add("card-reveal-active");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = entry.target as HTMLElement;
        group.dataset.cardGroupVisible = "true";
        group.querySelectorAll<HTMLElement>(selector).forEach((card) => card.classList.add("card-poof-visible"));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -12% 0px" });

    const observedGroups = new Set<HTMLElement>();
    const observeGroup = (card: HTMLElement) => {
      const group = card.parentElement;
      if (!group) return;
      card.style.removeProperty("--poof-delay");
      if (group.dataset.cardGroupVisible === "true") {
        group.querySelectorAll<HTMLElement>(selector).forEach((groupCard) => groupCard.classList.add("card-poof-visible"));
        return;
      }
      if (observedGroups.has(group)) return;
      observedGroups.add(group);
      observer.observe(group);
    };
    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector));
    cards.forEach(observeGroup);

    const mutations = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        const addedCards = [
          ...(node.matches(selector) ? [node] : []),
          ...node.querySelectorAll<HTMLElement>(selector),
        ];
        addedCards.forEach(observeGroup);
      }));
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.classList.remove("card-reveal-active");
    };
  }, [page, announcements.length]);

  return <main ref={mainRef} className="min-h-screen overflow-hidden bg-background text-foreground"><Header page={page} />{page === "home" && <Home announcements={announcements} />}{page === "about" && <About />}{page === "membership" && <Membership />}{page === "projects" && <Projects />}{page === "publications" && <Publications />}{page === "announcements" && <Announcements announcements={announcements} />}{page === "contact" && <Contact />}<Footer /></main>;
}
