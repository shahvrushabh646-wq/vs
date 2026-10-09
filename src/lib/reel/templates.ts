import { PALETTES } from "./look";
import type { Beat, Category, LayoutId, MotionId, PaletteId, Template, TransitionId } from "./types";

const cinema: Beat[] = [
  { role: "OPEN", label: "Atmosphere" },
  { role: "HERO", label: "Hero" },
  { role: "DETAIL", label: "Detail" },
  { role: "MOVE", label: "Movement" },
  { role: "END", label: "Meaning" },
];
const edit: Beat[] = [
  { role: "HOOK", label: "Hook" },
  { role: "HERO", label: "Feature" },
  { role: "DETAIL", label: "Detail" },
  { role: "NOTE", label: "Context" },
  { role: "END", label: "Close" },
];
const fest: Beat[] = [
  { role: "HOOK", label: "Hook" },
  { role: "CUT", label: "Cut" },
  { role: "PEAK", label: "Peak" },
  { role: "END", label: "Release" },
];
const story: Beat[] = [
  { role: "OPEN", label: "Opening" },
  { role: "HERO", label: "Hero" },
  { role: "DETAIL", label: "Detail" },
  { role: "MEAN", label: "Meaning" },
  { role: "END", label: "Close" },
];
const doc: Beat[] = [
  { role: "OPEN", label: "Establish" },
  { role: "HERO", label: "Record" },
  { role: "DETAIL", label: "Evidence" },
  { role: "NOTE", label: "Context" },
  { role: "END", label: "Close" },
];

const BEATS = { cinema, edit, fest, story, doc };

type BeatKey = keyof typeof BEATS;

type Look = {
  id: string;
  name: string;
  palette: PaletteId;
  layout: LayoutId;
  motion: MotionId;
  transition: TransitionId;
  duration: number;
  beats: BeatKey;
  category: Category;
  description: string;
};

const LOOKS: Look[] = [
  { id: "gold-cinema", name: "Gold and Black Cinematic", palette: "gold", layout: "dawn", motion: "slow-push", transition: "fade", duration: 24, beats: "cinema", category: "Cinematic", description: "Letterbox, slow push, and a low title." },
  { id: "night-focus", name: "Black Focus", palette: "night", layout: "focus", motion: "slow-pull", transition: "mask", duration: 24, beats: "cinema", category: "Cinematic", description: "Spotlight circle holding one subject." },
  { id: "forest-journey", name: "Green Journey", palette: "forest", layout: "journey", motion: "pan-right", transition: "crossfade", duration: 26, beats: "cinema", category: "Travel & Places", description: "Hero window with a detail strip." },
  { id: "night-meaning", name: "Quiet Meaning", palette: "night", layout: "meaning", motion: "drift", transition: "fade", duration: 22, beats: "story", category: "Minimal & Aesthetic", description: "Almost no chrome. Title sits low." },
  { id: "teal-editorial", name: "Blue and White Editorial", palette: "teal", layout: "split", motion: "pan-left", transition: "slide", duration: 20, beats: "edit", category: "Fashion & Lifestyle", description: "Type column beside a tall picture." },
  { id: "indigo-column", name: "Indigo Column", palette: "indigo", layout: "column", motion: "pan-right", transition: "slide", duration: 20, beats: "edit", category: "Education", description: "Narrow headline beside the photograph." },
  { id: "cream-frame", name: "Cream Framed Print", palette: "cream", layout: "eframe", motion: "reveal", transition: "fade", duration: 18, beats: "edit", category: "Product Showcase", description: "Caption sitting under a framed print." },
  { id: "marigold-story", name: "Yellow Story Plate", palette: "marigold", layout: "estory", motion: "reveal", transition: "wipe", duration: 20, beats: "edit", category: "Fashion & Lifestyle", description: "Picture, stacked headline, then a close." },
  { id: "sandal-cover", name: "Beige Magazine Cover", palette: "sandal", layout: "cover", motion: "slow-push", transition: "wipe", duration: 18, beats: "edit", category: "Luxury & Premium", description: "Masthead, cover image, issue headline." },
  { id: "teal-feature", name: "Teal Feature", palette: "teal", layout: "feature", motion: "slow-pull", transition: "crossfade", duration: 18, beats: "edit", category: "Food & Restaurants", description: "Top photograph and a short deck." },
  { id: "vermilion-bold", name: "Red and White Bold", palette: "vermilion", layout: "mbold", motion: "crop-punch", transition: "flash", duration: 14, beats: "fest", category: "Fast-Paced & Trending", description: "Oversized type over a full-bleed photo." },
  { id: "ivory-polaroid", name: "Vintage Polaroid", palette: "ivory", layout: "polaroid", motion: "drift", transition: "fade", duration: 20, beats: "story", category: "Memories & Stories", description: "Tilted print, white border, caption foot." },
  { id: "rose-diary", name: "Blush Diary", palette: "rose", layout: "diary", motion: "drift", transition: "fade", duration: 22, beats: "story", category: "Memories & Stories", description: "Paper page with a taped photograph." },
  { id: "forest-scrap", name: "Colorful Scrapbook", palette: "forest", layout: "scrapbook", motion: "pan-left", transition: "wipe", duration: 18, beats: "story", category: "Photo Slideshow", description: "Prints placed like a travel page." },
  { id: "gold-grid", name: "Gold Photo Collage", palette: "gold", layout: "grid", motion: "reveal", transition: "hard", duration: 14, beats: "fest", category: "Photo Slideshow", description: "A separate cell for every selected photo." },
  { id: "ivory-dgrid", name: "Neutral Dynamic Grid", palette: "ivory", layout: "dgrid", motion: "reveal", transition: "slide", duration: 16, beats: "fest", category: "Photo Slideshow", description: "One large plate and supporting crops." },
  { id: "brass-wall", name: "Warm Photo Wall", palette: "brass", layout: "wall", motion: "diagonal", transition: "slide", duration: 16, beats: "fest", category: "Real Estate", description: "Overlapping prints at different angles." },
  { id: "teal-multi", name: "White Blue Multi Frame", palette: "teal", layout: "mframe", motion: "pan-left", transition: "crossfade", duration: 16, beats: "edit", category: "Before & After", description: "Main frame with smaller frames under it." },
  { id: "gold-sacred", name: "Arched Window", palette: "gold", layout: "sacred", motion: "slow-push", transition: "reveal", duration: 26, beats: "story", category: "Festivals & Culture", description: "Arched picture, brass rule, quiet title." },
  { id: "brass-temple", name: "Cream and Brass Elegant", palette: "brass", layout: "temple", motion: "slow-pull", transition: "reveal", duration: 26, beats: "cinema", category: "Festivals & Culture", description: "Warm light from above, title held low." },
  { id: "sandal-devotion", name: "Sandal Devotional", palette: "sandal", layout: "devotional", motion: "slow-push", transition: "fade", duration: 24, beats: "story", category: "Festivals & Culture", description: "Centered portrait with a line beneath." },
  { id: "marigold-fest", name: "Yellow Festival", palette: "marigold", layout: "energy", motion: "crop-punch", transition: "flash", duration: 12, beats: "fest", category: "Fast-Paced & Trending", description: "Full-bleed cuts and a strong title." },
  { id: "marigold-burst", name: "Marigold Burst", palette: "marigold", layout: "burst", motion: "crop-punch", transition: "flash", duration: 12, beats: "fest", category: "Fast-Paced & Trending", description: "Tilted picture window and a large word." },
  { id: "vermilion-crowd", name: "Red Crowd Motion", palette: "vermilion", layout: "crowd", motion: "diagonal", transition: "hard", duration: 12, beats: "fest", category: "Fitness & Sports", description: "Tight moving crop, almost no type." },
  { id: "slate-doc", name: "Grey Documentary", palette: "slate", layout: "doc", motion: "pan-up", transition: "film-cut", duration: 20, beats: "doc", category: "Documentary", description: "Film edges and a source line." },
  { id: "copper-time", name: "Copper Timeline", palette: "copper", layout: "timeline", motion: "pan-right", transition: "film-cut", duration: 20, beats: "doc", category: "Education", description: "A ruled timeline beside the picture." },
  { id: "slate-journal", name: "Slate Journal", palette: "slate", layout: "journal", motion: "drift", transition: "crossfade", duration: 20, beats: "doc", category: "Documentary", description: "Margin notes, picture held to the right." },
  { id: "forest-heritage", name: "Green Heritage Frame", palette: "forest", layout: "hframe", motion: "slow-pull", transition: "film-cut", duration: 22, beats: "doc", category: "Documentary", description: "Double frame and an archival caption." },
  { id: "ivory-minimal", name: "Beige Minimalist", palette: "ivory", layout: "minimal", motion: "drift", transition: "crossfade", duration: 16, beats: "story", category: "Minimal & Aesthetic", description: "Wide margin and one quiet photograph." },
  { id: "cream-quote", name: "Neutral Quote", palette: "cream", layout: "quote", motion: "drift", transition: "fade", duration: 16, beats: "story", category: "Typography", description: "The line is the scene. The picture recedes." },
  { id: "charcoal-mono", name: "Black and White Mono", palette: "charcoal", layout: "mono", motion: "pan-up", transition: "film-cut", duration: 18, beats: "doc", category: "Luxury & Premium", description: "Monochrome picture, vertical side title." },
  { id: "indigo-kinetic", name: "Blue Kinetic Type", palette: "indigo", layout: "kinetic", motion: "diagonal", transition: "hard", duration: 12, beats: "fest", category: "Typography", description: "The headline moves over the picture." },
  { id: "rose-crop", name: "Pink Dynamic Crop", palette: "rose", layout: "dcrop", motion: "diagonal", transition: "mask", duration: 14, beats: "fest", category: "Creative & Experimental", description: "The window changes crop scene to scene." },
  { id: "copper-news", name: "Copper News Desk", palette: "copper", layout: "news", motion: "pan-left", transition: "wipe", duration: 12, beats: "fest", category: "Business & Brand", description: "Desk bar, headline block, bottom line." },
  { id: "charcoal-label", name: "Black Vertical Label", palette: "charcoal", layout: "vlabel", motion: "pan-up", transition: "wipe", duration: 16, beats: "edit", category: "Typography", description: "Side-set type over a full photograph." },
  { id: "indigo-sacred", name: "Indigo Sacred Record", palette: "indigo", layout: "sacredoc", motion: "slow-push", transition: "fade", duration: 22, beats: "doc", category: "Festivals & Culture", description: "Arched picture with a caption block." },
  { id: "rose-card", name: "Pink Story Card", palette: "rose", layout: "cards", motion: "slow-push", transition: "fade", duration: 16, beats: "story", category: "Events & Celebrations", description: "One poster card: picture, title, footer." },
  { id: "night-finale", name: "Night Finale", palette: "night", layout: "finale", motion: "slow-push", transition: "mask", duration: 12, beats: "story", category: "Cinematic", description: "Closing poster. Picture, then a large name." },
];

const LOOK = Object.fromEntries(LOOKS.map((look) => [look.id, look])) as Record<string, Look>;

export type TemplateTabId =
  | "for-you"
  | "social"
  | "video"
  | "marketing"
  | "print"
  | "events"
  | "business"
  | "education"
  | "personal"
  | "professional";

export type TemplateTab = { id: TemplateTabId; label: string };

/** Top tabs. Switching one replaces the shelf headings underneath, the way Canva's template browser does. */
export const TEMPLATE_TABS: TemplateTab[] = [
  { id: "professional", label: "Professional" },
  { id: "for-you", label: "For you" },
  { id: "social", label: "Social media" },
  { id: "video", label: "Video" },
  { id: "marketing", label: "Marketing" },
  { id: "print", label: "Print" },
  { id: "events", label: "Events" },
  { id: "business", label: "Business" },
  { id: "education", label: "Education" },
  { id: "personal", label: "Personal" },
];

export type TemplateSection = {
  id: string;
  heading: string;
  tab: TemplateTabId;
  /** Also shown on the For you tab. */
  featured?: boolean;
  noun: string;
  looks: string[];
};

const social = ["gold-cinema", "ivory-minimal", "vermilion-bold", "teal-editorial", "rose-card", "gold-grid", "cream-quote", "indigo-kinetic"] as const;
const storyLooks = ["night-focus", "rose-card", "ivory-polaroid", "marigold-fest", "cream-quote", "brass-temple", "rose-diary", "night-meaning"] as const;
const reelLooks = ["gold-cinema", "forest-journey", "marigold-fest", "indigo-kinetic", "vermilion-crowd", "rose-crop", "marigold-burst", "night-finale"] as const;
const posterLooks = ["vermilion-bold", "sandal-cover", "gold-sacred", "charcoal-label", "cream-frame", "marigold-burst", "night-finale", "teal-feature"] as const;
const collageLooks = ["gold-grid", "ivory-dgrid", "brass-wall", "teal-multi", "forest-scrap", "ivory-polaroid", "rose-crop", "cream-frame"] as const;
const quoteLooks = ["cream-quote", "ivory-minimal", "night-meaning", "charcoal-mono", "indigo-kinetic", "rose-card", "slate-journal", "gold-sacred"] as const;
const festLooks = ["marigold-fest", "marigold-burst", "brass-temple", "gold-sacred", "vermilion-crowd", "sandal-devotion", "gold-cinema", "rose-card"] as const;
const bizLooks = ["indigo-column", "teal-editorial", "slate-doc", "copper-news", "cream-quote", "sandal-cover", "charcoal-mono", "teal-feature"] as const;
const eduLooks = ["slate-journal", "cream-quote", "ivory-minimal", "copper-time", "teal-editorial", "indigo-column", "slate-doc", "cream-frame"] as const;
const memoryLooks = ["ivory-polaroid", "rose-diary", "forest-scrap", "forest-journey", "night-meaning", "brass-wall", "cream-frame", "gold-grid"] as const;
const inviteLooks = ["brass-temple", "rose-card", "gold-sacred", "ivory-minimal", "sandal-cover", "cream-quote", "rose-diary", "night-finale"] as const;

export const SECTIONS: TemplateSection[] = [
  { id: "trending", heading: "Trending now", tab: "for-you", featured: true, noun: "Template", looks: ["gold-cinema", "vermilion-bold", "marigold-fest", "ivory-polaroid", "indigo-kinetic", "rose-card", "gold-grid", "cream-quote"] },

  { id: "ig-post", heading: "Instagram Posts", tab: "social", noun: "Instagram Post", looks: ["sandal-cover", "teal-feature", "vermilion-bold", "ivory-minimal", "cream-quote", "gold-grid", "teal-editorial", "copper-news"] },
  { id: "ig-story", heading: "Instagram Stories", tab: "social", featured: true, noun: "Instagram Story", looks: [...storyLooks] },
  { id: "ig-reel", heading: "Instagram Reels", tab: "social", featured: true, noun: "Instagram Reel", looks: [...reelLooks] },
  { id: "fb-post", heading: "Facebook Posts", tab: "social", noun: "Facebook Post", looks: ["teal-editorial", "indigo-column", "copper-news", "teal-feature", "marigold-story", "vermilion-bold", "sandal-cover", "cream-quote"] },
  { id: "fb-story", heading: "Facebook Stories", tab: "social", noun: "Facebook Story", looks: ["night-focus", "marigold-fest", "rose-card", "marigold-burst", "indigo-kinetic", "gold-cinema", "ivory-polaroid", "cream-quote"] },
  { id: "tiktok", heading: "TikTok Videos", tab: "social", noun: "TikTok Video", looks: ["indigo-kinetic", "marigold-fest", "marigold-burst", "vermilion-crowd", "rose-crop", "vermilion-bold", "copper-news", "night-finale"] },
  { id: "yt-thumb", heading: "YouTube Thumbnails", tab: "social", featured: true, noun: "YouTube Thumbnail", looks: ["vermilion-bold", "copper-news", "sandal-cover", "indigo-kinetic", "marigold-burst", "charcoal-label", "teal-feature", "charcoal-mono"] },
  { id: "yt-short", heading: "YouTube Shorts", tab: "social", noun: "YouTube Short", looks: ["gold-cinema", "indigo-kinetic", "marigold-fest", "night-focus", "rose-crop", "vermilion-crowd", "forest-journey", "night-finale"] },
  { id: "pin", heading: "Pinterest Pins", tab: "social", noun: "Pinterest Pin", looks: ["sandal-cover", "rose-diary", "forest-scrap", "cream-quote", "ivory-minimal", "teal-feature", "ivory-polaroid", "marigold-story"] },
  { id: "li-post", heading: "LinkedIn Posts", tab: "social", noun: "LinkedIn Post", looks: ["indigo-column", "teal-editorial", "copper-news", "ivory-minimal", "slate-doc", "copper-time", "cream-quote", "teal-feature"] },
  { id: "wa-status", heading: "WhatsApp Status", tab: "social", noun: "WhatsApp Status", looks: ["rose-card", "marigold-fest", "cream-quote", "ivory-polaroid", "marigold-burst", "ivory-minimal", "gold-sacred", "vermilion-bold"] },
  { id: "x-post", heading: "X Posts", tab: "social", noun: "X Post", looks: ["copper-news", "vermilion-bold", "cream-quote", "ivory-minimal", "indigo-kinetic", "charcoal-mono", "indigo-column", "charcoal-label"] },
  { id: "snap", heading: "Snapchat Stories", tab: "social", noun: "Snapchat Story", looks: ["marigold-burst", "rose-crop", "indigo-kinetic", "vermilion-crowd", "rose-card", "gold-grid", "night-focus", "marigold-fest"] },

  { id: "reels", heading: "Reels", tab: "video", noun: "Reel", looks: [...reelLooks] },
  { id: "stories", heading: "Stories", tab: "video", noun: "Story", looks: [...storyLooks] },
  { id: "landscape", heading: "Landscape Videos", tab: "video", noun: "Landscape Video", looks: ["forest-journey", "teal-editorial", "copper-time", "slate-doc", "night-meaning", "teal-feature", "slate-journal", "gold-cinema"] },
  { id: "promo-video", heading: "Promo Videos", tab: "video", noun: "Promo Video", looks: ["vermilion-bold", "indigo-kinetic", "marigold-burst", "copper-news", "sandal-cover", "night-finale", "gold-cinema", "rose-card"] },
  { id: "yt-intro", heading: "YouTube Intros", tab: "video", noun: "YouTube Intro", looks: ["gold-cinema", "night-focus", "night-meaning", "forest-journey", "brass-temple", "night-finale", "charcoal-mono", "indigo-kinetic"] },
  { id: "cinematic", heading: "Cinematic", tab: "video", noun: "Cinematic Cut", looks: ["gold-cinema", "night-focus", "forest-journey", "night-meaning", "brass-temple", "charcoal-mono", "slate-doc", "night-finale"] },
  { id: "documentary", heading: "Documentary", tab: "video", noun: "Documentary", looks: ["slate-doc", "copper-time", "forest-heritage", "slate-journal", "indigo-sacred", "charcoal-mono", "cream-frame", "night-meaning"] },
  { id: "kinetic", heading: "Kinetic Type", tab: "video", noun: "Kinetic Video", looks: ["indigo-kinetic", "vermilion-bold", "charcoal-label", "rose-crop", "marigold-burst", "copper-news", "cream-quote", "night-finale"] },

  { id: "sale", heading: "Sale & Promo", tab: "marketing", noun: "Sale Post", looks: ["vermilion-bold", "marigold-burst", "copper-news", "marigold-fest", "sandal-cover", "indigo-kinetic", "rose-card", "gold-grid"] },
  { id: "product", heading: "Product Highlights", tab: "marketing", noun: "Product Highlight", looks: ["night-focus", "teal-feature", "cream-frame", "sandal-cover", "ivory-minimal", "gold-cinema", "rose-card", "charcoal-label"] },
  { id: "announce", heading: "Announcements", tab: "marketing", noun: "Announcement", looks: ["copper-news", "vermilion-bold", "teal-editorial", "rose-card", "indigo-column", "marigold-fest", "cream-quote", "sandal-cover"] },
  { id: "ads", heading: "Ads", tab: "marketing", noun: "Ad", looks: ["vermilion-bold", "indigo-kinetic", "night-focus", "marigold-burst", "copper-news", "gold-cinema", "charcoal-mono", "rose-crop"] },
  { id: "flyers", heading: "Flyers", tab: "marketing", featured: true, noun: "Flyer", looks: ["sandal-cover", "vermilion-bold", "teal-feature", "marigold-story", "gold-sacred", "cream-frame", "indigo-column", "rose-card"] },
  { id: "posters", heading: "Posters", tab: "marketing", featured: true, noun: "Poster", looks: [...posterLooks] },
  { id: "brand", heading: "Brand Stories", tab: "marketing", noun: "Brand Story", looks: ["gold-cinema", "ivory-minimal", "teal-editorial", "night-meaning", "sandal-cover", "charcoal-mono", "forest-journey", "cream-quote"] },
  { id: "logos", heading: "Logos", tab: "marketing", noun: "Logo", looks: ["charcoal-mono", "gold-sacred", "ivory-minimal", "vermilion-bold", "brass-temple", "cream-quote", "night-finale", "charcoal-label"] },

  { id: "print-posters", heading: "Posters", tab: "print", noun: "Print Poster", looks: [...posterLooks] },
  { id: "print-flyers", heading: "Flyers", tab: "print", noun: "Print Flyer", looks: ["teal-feature", "marigold-story", "sandal-cover", "cream-frame", "indigo-column", "vermilion-bold", "rose-diary", "slate-journal"] },
  { id: "print-invite", heading: "Invitations", tab: "print", featured: true, noun: "Invitation", looks: [...inviteLooks] },
  { id: "cards", heading: "Cards", tab: "print", noun: "Card", looks: ["rose-card", "ivory-polaroid", "gold-sacred", "cream-quote", "brass-temple", "night-finale", "rose-diary", "ivory-minimal"] },
  { id: "biz-cards", heading: "Business Cards", tab: "print", noun: "Business Card", looks: ["charcoal-mono", "ivory-minimal", "indigo-column", "gold-sacred", "teal-editorial", "cream-quote", "vermilion-bold", "slate-journal"] },
  { id: "certificates", heading: "Certificates", tab: "print", noun: "Certificate", looks: ["gold-sacred", "brass-temple", "cream-frame", "forest-heritage", "ivory-minimal", "sandal-cover", "indigo-sacred", "slate-journal"] },
  { id: "calendars", heading: "Calendars", tab: "print", noun: "Calendar", looks: ["ivory-dgrid", "gold-grid", "slate-journal", "cream-frame", "teal-multi", "indigo-column", "ivory-minimal", "marigold-story"] },
  { id: "collages", heading: "Photo Collages", tab: "print", featured: true, noun: "Photo Collage", looks: [...collageLooks] },
  { id: "resumes", heading: "Resumes", tab: "print", noun: "Resume", looks: ["indigo-column", "teal-editorial", "ivory-minimal", "slate-journal", "cream-frame", "charcoal-mono", "copper-time", "slate-doc"] },
  { id: "invoices", heading: "Invoices", tab: "print", noun: "Invoice", looks: ["slate-journal", "indigo-column", "ivory-minimal", "cream-frame", "teal-editorial", "charcoal-mono", "copper-time", "slate-doc"] },
  { id: "worksheets", heading: "Worksheets", tab: "print", noun: "Worksheet", looks: ["slate-journal", "ivory-minimal", "cream-frame", "indigo-column", "teal-editorial", "ivory-dgrid", "copper-time", "cream-quote"] },
  { id: "wallpapers", heading: "Desktop Wallpapers", tab: "print", noun: "Wallpaper", looks: ["gold-cinema", "night-focus", "forest-journey", "charcoal-mono", "brass-temple", "rose-crop", "night-meaning", "vermilion-crowd"] },
  { id: "tshirts", heading: "T-Shirts", tab: "print", noun: "T-Shirt Graphic", looks: ["vermilion-bold", "charcoal-label", "gold-sacred", "marigold-burst", "charcoal-mono", "cream-quote", "indigo-kinetic", "night-finale"] },

  { id: "festival", heading: "Festival", tab: "events", featured: true, noun: "Festival Template", looks: [...festLooks] },
  { id: "birthday", heading: "Birthday", tab: "events", noun: "Birthday", looks: ["rose-card", "marigold-burst", "ivory-polaroid", "gold-grid", "marigold-fest", "rose-diary", "vermilion-bold", "cream-quote"] },
  { id: "wedding", heading: "Wedding", tab: "events", noun: "Wedding", looks: ["brass-temple", "ivory-minimal", "gold-sacred", "rose-card", "cream-quote", "sandal-cover", "rose-diary", "night-meaning"] },
  { id: "event-invite", heading: "Invitations", tab: "events", noun: "Event Invitation", looks: [...inviteLooks] },
  { id: "save-date", heading: "Save the Date", tab: "events", noun: "Save the Date", looks: ["rose-card", "gold-sacred", "ivory-minimal", "brass-temple", "sandal-cover", "cream-quote", "ivory-polaroid", "night-finale"] },
  { id: "thanks", heading: "Thank You", tab: "events", noun: "Thank You", looks: ["cream-quote", "rose-card", "ivory-minimal", "rose-diary", "gold-sacred", "brass-temple", "night-meaning", "cream-frame"] },
  { id: "celebration", heading: "Celebration", tab: "events", noun: "Celebration", looks: ["marigold-fest", "marigold-burst", "vermilion-crowd", "gold-grid", "rose-card", "indigo-kinetic", "vermilion-bold", "night-finale"] },

  { id: "presentations", heading: "Presentations", tab: "business", featured: true, noun: "Presentation", looks: ["teal-editorial", "sandal-cover", "indigo-column", "night-meaning", "slate-doc", "cream-quote", "teal-feature", "gold-cinema"] },
  { id: "pitch", heading: "Pitch Decks", tab: "business", noun: "Pitch Deck", looks: ["indigo-column", "vermilion-bold", "teal-editorial", "copper-news", "charcoal-mono", "sandal-cover", "night-focus", "cream-quote"] },
  { id: "company", heading: "Company Intros", tab: "business", noun: "Company Intro", looks: ["gold-cinema", "teal-editorial", "ivory-minimal", "sandal-cover", "slate-doc", "night-meaning", "indigo-column", "charcoal-mono"] },
  { id: "testimonials", heading: "Testimonials", tab: "business", noun: "Testimonial", looks: ["cream-quote", "rose-card", "ivory-minimal", "teal-feature", "night-focus", "slate-journal", "charcoal-mono", "rose-diary"] },
  { id: "hiring", heading: "Hiring", tab: "business", noun: "Hiring Post", looks: ["copper-news", "vermilion-bold", "indigo-column", "teal-editorial", "charcoal-label", "sandal-cover", "cream-quote", "indigo-kinetic"] },
  { id: "proposals", heading: "Proposals", tab: "business", noun: "Proposal", looks: ["indigo-column", "slate-journal", "teal-editorial", "cream-frame", "slate-doc", "ivory-minimal", "copper-time", "sandal-cover"] },
  { id: "docs", heading: "Docs", tab: "business", noun: "Doc", looks: ["slate-journal", "ivory-minimal", "indigo-column", "cream-frame", "teal-editorial", "slate-doc", "copper-time", "cream-quote"] },
  { id: "websites", heading: "Websites", tab: "business", noun: "Website Hero", looks: ["gold-cinema", "ivory-minimal", "teal-editorial", "vermilion-bold", "night-focus", "sandal-cover", "forest-journey", "cream-quote"] },

  { id: "lessons", heading: "Lesson Covers", tab: "education", noun: "Lesson Cover", looks: ["slate-journal", "teal-feature", "ivory-minimal", "sandal-cover", "indigo-column", "cream-frame", "gold-sacred", "copper-time"] },
  { id: "quotes", heading: "Quotes", tab: "education", featured: true, noun: "Quote", looks: [...quoteLooks] },
  { id: "edu-sheets", heading: "Worksheets", tab: "education", noun: "Worksheet", looks: [...eduLooks] },
  { id: "class-note", heading: "Class Announcements", tab: "education", noun: "Class Announcement", looks: ["copper-news", "marigold-fest", "teal-editorial", "rose-card", "ivory-minimal", "indigo-column", "cream-quote", "vermilion-bold"] },
  { id: "infographics", heading: "Infographics", tab: "education", noun: "Infographic", looks: ["ivory-dgrid", "teal-multi", "copper-time", "indigo-column", "gold-grid", "slate-doc", "teal-editorial", "copper-news"] },
  { id: "edu-certs", heading: "Certificates", tab: "education", noun: "Certificate", looks: ["gold-sacred", "brass-temple", "forest-heritage", "cream-frame", "indigo-sacred", "ivory-minimal", "sandal-cover", "slate-journal"] },


  { id: "reel-cinematic", heading: "Cinematic Storytelling", tab: "professional", featured: true, noun: "Cinematic Reel", looks: ["gold-cinema","night-focus","forest-journey","night-meaning","brass-temple","charcoal-mono","slate-doc","night-finale"] },
  { id: "reel-photo-slideshow", heading: "Photo & Video Slideshow", tab: "professional", featured: true, noun: "Photo Slideshow Reel", looks: ["gold-grid","ivory-dgrid","brass-wall","teal-multi","forest-scrap","ivory-polaroid","rose-crop","cream-frame"] },
  { id: "reel-travel", heading: "Travel & Destination Reels", tab: "professional", featured: true, noun: "Travel Reel", looks: ["forest-journey","forest-scrap","gold-cinema","ivory-polaroid","slate-journal","brass-wall","night-meaning","teal-feature"] },
  { id: "reel-festivals", heading: "Festivals & Indian Culture", tab: "professional", featured: true, noun: "Festival Reel", looks: ["gold-sacred","brass-temple","sandal-devotion","marigold-fest","marigold-burst","vermilion-crowd","gold-cinema","rose-card"] },
  { id: "reel-fashion", heading: "Fashion & Lifestyle", tab: "professional", noun: "Lifestyle Reel", looks: ["teal-editorial","indigo-column","cream-frame","marigold-story","sandal-cover","teal-feature","vermilion-bold","rose-diary"] },
  { id: "reel-food", heading: "Food & Restaurant Reels", tab: "professional", noun: "Food Reel", looks: ["teal-feature","night-focus","gold-cinema","cream-frame","marigold-fest","copper-news","sandal-cover","rose-card"] },
  { id: "reel-product", heading: "Product Showcase Reels", tab: "professional", noun: "Product Reel", looks: ["night-focus","teal-feature","cream-frame","sandal-cover","ivory-minimal","gold-cinema","charcoal-label","vermilion-bold"] },
  { id: "reel-brand", heading: "Brand Story & Promotion", tab: "professional", noun: "Brand Story Reel", looks: ["gold-cinema","ivory-minimal","teal-editorial","night-meaning","sandal-cover","charcoal-mono","forest-journey","cream-quote"] },
  { id: "reel-property", heading: "Real Estate & Architecture", tab: "professional", noun: "Property Reel", looks: ["gold-cinema","forest-journey","teal-feature","sandal-cover","ivory-minimal","slate-doc","brass-wall","cream-frame"] },
  { id: "reel-fitness", heading: "Fitness & Sports Edits", tab: "professional", noun: "Fitness Reel", looks: ["vermilion-crowd","marigold-fest","marigold-burst","indigo-kinetic","rose-crop","vermilion-bold","night-focus","night-finale"] },
  { id: "reel-education", heading: "Education & Explainers", tab: "professional", noun: "Explainer Reel", looks: ["slate-journal","cream-quote","ivory-minimal","copper-time","teal-editorial","indigo-column","slate-doc","cream-frame"] },
  { id: "reel-events", heading: "Events & Celebrations", tab: "professional", noun: "Event Reel", looks: ["brass-temple","rose-card","gold-sacred","ivory-minimal","sandal-cover","cream-quote","rose-diary","night-finale"] },
  { id: "reel-memories", heading: "Memories & Personal Stories", tab: "professional", noun: "Memory Reel", looks: ["ivory-polaroid","rose-diary","forest-scrap","forest-journey","night-meaning","brass-wall","cream-frame","gold-grid"] },
  { id: "reel-minimal", heading: "Minimal & Aesthetic Reels", tab: "professional", noun: "Aesthetic Reel", looks: ["ivory-minimal","cream-quote","night-meaning","charcoal-mono","cream-frame","slate-journal","night-focus","gold-sacred"] },
  { id: "reel-fast", heading: "Fast-Paced & Beat Cuts", tab: "professional", noun: "Fast Cut Reel", looks: ["indigo-kinetic","marigold-fest","marigold-burst","vermilion-crowd","rose-crop","vermilion-bold","copper-news","night-finale"] },
  { id: "reel-documentary", heading: "Documentary & Heritage", tab: "professional", noun: "Documentary Reel", looks: ["slate-doc","copper-time","forest-heritage","slate-journal","indigo-sacred","charcoal-mono","cream-frame","night-meaning"] },
  { id: "reel-before-after", heading: "Before & After Transformations", tab: "professional", noun: "Transformation Reel", looks: ["rose-crop","teal-multi","gold-grid","ivory-dgrid","teal-feature","forest-journey","vermilion-crowd","night-finale"] },
  { id: "reel-typography", heading: "Kinetic Typography", tab: "professional", noun: "Typography Reel", looks: ["indigo-kinetic","vermilion-bold","charcoal-label","copper-news","cream-quote","rose-card","marigold-burst","night-finale"] },
  { id: "reel-luxury", heading: "Luxury & Premium Edits", tab: "professional", noun: "Luxury Reel", looks: ["gold-cinema","night-focus","sandal-cover","ivory-minimal","brass-temple","charcoal-mono","forest-journey","cream-frame"] },
  { id: "reel-creative", heading: "Creative & Experimental", tab: "professional", noun: "Creative Reel", looks: ["rose-crop","brass-wall","ivory-dgrid","teal-multi","forest-scrap","indigo-kinetic","marigold-burst","charcoal-label"] },
  { id: "reel-wedding", heading: "Wedding & Ceremony Stories", tab: "professional", noun: "Wedding Reel", looks: ["brass-temple","ivory-minimal","gold-sacred","rose-card","cream-quote","sandal-cover","rose-diary","night-meaning"] },
  { id: "reel-food-recipe", heading: "Recipe & Cooking Sequences", tab: "professional", noun: "Recipe Reel", looks: ["teal-feature","copper-news","marigold-fest","night-focus","cream-frame","vermilion-bold","sandal-cover","gold-grid"] },
  { id: "reel-creator-intro", heading: "Creator Intro & Personal Brand", tab: "professional", noun: "Creator Intro Reel", looks: ["gold-cinema","indigo-kinetic","teal-editorial","charcoal-label","night-finale","cream-quote","forest-journey","rose-card"] },
  { id: "reel-event-recap", heading: "Event Recap & Highlights", tab: "professional", noun: "Event Recap Reel", looks: ["marigold-fest","vermilion-crowd","gold-grid","forest-journey","rose-card","brass-wall","night-finale","copper-news"] },
  { id: "reel-destination", heading: "Travel Diary & Scenic Cuts", tab: "professional", noun: "Travel Diary Reel", looks: ["forest-journey","forest-scrap","gold-cinema","brass-wall","ivory-polaroid","teal-feature","night-meaning","slate-journal"] },
  { id: "reel-tutorial", heading: "Tutorials & Step-by-Step", tab: "professional", noun: "Tutorial Reel", looks: ["slate-journal","copper-time","teal-editorial","indigo-column","cream-quote","ivory-minimal","teal-feature","charcoal-label"] },
  { id: "reel-unboxing", heading: "Unboxing & First Impressions", tab: "professional", noun: "Unboxing Reel", looks: ["night-focus","teal-feature","cream-frame","gold-cinema","charcoal-label","vermilion-bold","sandal-cover","ivory-minimal"] },
  { id: "reel-review", heading: "Reviews & Recommendations", tab: "professional", noun: "Review Reel", looks: ["cream-quote","teal-feature","sandal-cover","slate-journal","ivory-minimal","gold-cinema","rose-card","copper-news"] },
  { id: "reel-launch", heading: "Launch & Announcement Reels", tab: "professional", noun: "Launch Reel", looks: ["gold-cinema","teal-feature","vermilion-bold","night-focus","sandal-cover","copper-news","ivory-minimal","rose-card"] },
  { id: "reel-quote", heading: "Quotes & Short Stories", tab: "professional", noun: "Quote Reel", looks: ["cream-quote","ivory-minimal","night-meaning","charcoal-mono","indigo-kinetic","rose-card","slate-journal","gold-sacred"] },
  { id: "reel-seasonal", heading: "Seasonal & Celebration Edits", tab: "professional", noun: "Seasonal Reel", looks: ["marigold-fest","marigold-burst","brass-temple","gold-sacred","vermilion-crowd","sandal-devotion","gold-cinema","rose-card"] },
  { id: "reel-memory-film", heading: "Memory Film & Photo Diary", tab: "professional", noun: "Memory Film Reel", looks: ["ivory-polaroid","rose-diary","forest-scrap","forest-journey","night-meaning","brass-wall","cream-frame","gold-grid"] },

  { id: "memory", heading: "Memory", tab: "personal", noun: "Memory", looks: [...memoryLooks] },
  { id: "travel", heading: "Travel", tab: "personal", noun: "Travel", looks: ["forest-journey", "forest-scrap", "gold-cinema", "ivory-polaroid", "slate-journal", "brass-wall", "night-meaning", "teal-feature"] },
  { id: "diary", heading: "Diary", tab: "personal", noun: "Diary", looks: ["rose-diary", "slate-journal", "ivory-polaroid", "cream-quote", "forest-scrap", "night-meaning", "cream-frame", "indigo-sacred"] },
  { id: "scrapbook", heading: "Scrapbook", tab: "personal", noun: "Scrapbook", looks: ["forest-scrap", "ivory-polaroid", "brass-wall", "gold-grid", "rose-diary", "ivory-dgrid", "teal-multi", "cream-frame"] },
  { id: "polaroids", heading: "Polaroids", tab: "personal", noun: "Polaroid", looks: ["ivory-polaroid", "rose-diary", "brass-wall", "forest-scrap", "cream-frame", "gold-grid", "night-focus", "sandal-cover"] },
  { id: "mood", heading: "Mood Boards", tab: "personal", noun: "Mood Board", looks: ["ivory-dgrid", "brass-wall", "gold-grid", "teal-multi", "rose-crop", "forest-scrap", "charcoal-mono", "cream-frame"] },
  { id: "minimal", heading: "Minimal", tab: "personal", noun: "Minimal", looks: ["ivory-minimal", "cream-quote", "charcoal-mono", "night-meaning", "cream-frame", "slate-journal", "night-focus", "gold-sacred"] },
  { id: "whiteboard", heading: "Whiteboard", tab: "personal", noun: "Whiteboard", looks: ["ivory-minimal", "slate-journal", "ivory-dgrid", "cream-quote", "teal-multi", "indigo-column", "cream-frame", "copper-time"] },
];

const FRAME = ["top rule", "bottom rule", "side rail", "letterbox", "vignette", "outer frame"];

const COLORWAYS: PaletteId[] = ["ivory", "vermilion", "teal", "gold", "rose", "cream", "indigo", "marigold", "charcoal", "forest", "brass", "night"];

function colorways(palette: PaletteId, index: number): PaletteId[] {
  const alt = COLORWAYS[(index + 3) % COLORWAYS.length]!;
  const third = COLORWAYS[(index * 2 + 7) % COLORWAYS.length]!;
  return [...new Set([palette, alt, third])];
}

export const TEMPLATES: Template[] = SECTIONS.flatMap((section, sectionIndex) =>
  section.looks.flatMap((lookId, lookIndex) => {
    const look = LOOK[lookId];
    if (!look) throw new Error(`Unknown look ${lookId}`);
    return colorways(look.palette, sectionIndex + lookIndex).map((palette, paletteIndex) => {
      const variant = sectionIndex * 24 + lookIndex * 3 + paletteIndex;
      const colorName = palette === look.palette ? look.name : `${look.name} · ${PALETTES[palette].name}`;
      return {
        id: `${section.id}-${look.id}-${palette}`,
        name: `${colorName} ${section.noun}`,
        category: look.category,
        format: section.heading,
        sectionId: section.id,
        description: `${look.description} ${section.noun} layout, ${PALETTES[palette].name} color, ${look.motion.replace("-", " ")} motion, ${look.transition} cut, ${FRAME[variant % FRAME.length]}. 1080×1920.`,
        layout: look.layout,
        motion: look.motion,
        transition: look.transition,
        duration: look.duration + ((lookIndex + paletteIndex) % 3),
        beats: BEATS[look.beats],
        palette,
        variant,
      };
    });
  }),
);

export const CATEGORIES: Array<"All" | Category> = ["All", ...Array.from(new Set(LOOKS.map((look) => look.category)))];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((template) => template.id === id);
}

export function sectionsFor(tab: TemplateTabId): TemplateSection[] {
  if (tab === "for-you") return SECTIONS.filter((section) => section.featured);
  return SECTIONS.filter((section) => section.tab === tab);
}

export function templatesIn(sectionId: string): Template[] {
  return TEMPLATES.filter((template) => template.sectionId === sectionId);
}
