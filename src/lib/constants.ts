export const SITE_CONFIG = {
  name: "SmartLMS",
  tagline: "AI-Powered Learning Management System",
  url: "https://smartlms-bay.vercel.app",
  stats: {
    students: "100K+",
    courses: "500+",
    countries: "50+",
    rating: "4.9",
  },
  contact: {
    email: "support@smartlms.com",
    phone: "+234 800 SMART LMS",
    address: "Lagos, Nigeria",
  },
  social: {
    twitter: "https://twitter.com/smartlms",
    linkedin: "https://linkedin.com/company/smartlms",
    github: "https://github.com/smartlms",
    youtube: "https://youtube.com/smartlms",
  },
};

export const HOME_TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Senior Instructor, Tech Academy",
    rating: 5,
    content:
      "SmartLMS transformed how I create courses. The AI builder cut my preparation time from weeks to hours. The analytics help me understand exactly what my students need.",
  },
  {
    name: "Michael Chen",
    role: "CEO, LearnPro",
    rating: 5,
    content:
      "We migrated 500+ courses to SmartLMS. The SCORM support made it seamless, and our students love the live class feature. Best LMS we have ever used.",
  },
  {
    name: "Elena Rodriguez",
    role: "University Professor",
    rating: 5,
    content:
      "The 14 question types and certificate builder are game-changers. My students are more engaged, and completion rates jumped 40% since switching to SmartLMS.",
  },
  {
    name: "David Kim",
    role: "Corporate Training Lead",
    rating: 5,
    content:
      "We onboard 200 employees monthly. SmartLMS automated our entire training pipeline. The analytics dashboard gives us insights we never had before.",
  },
  {
    name: "Aisha Patel",
    role: "Founder, SkillUp Academy",
    rating: 5,
    content:
      "From zero to 10,000 students in 6 months. SmartLMS scaled with us beautifully. The certificate builder adds such a professional touch to our courses.",
  },
];

export const LOGIN_TESTIMONIALS = [
  {
    name: "David Okafor",
    text: "SmartLMS changed my life. I went from zero coding knowledge to building full-stack apps in 4 months.",
    avatar: "DO",
    color: "from-green-400 to-emerald-500",
  },
  {
    name: "Maria Santos",
    text: "The AI learning paths are incredible. It adapts perfectly to my pace and keeps me motivated every day.",
    avatar: "MS",
    color: "from-orange-400 to-pink-500",
  },
];

export const ABOUT_TEAM = [
  { name: "Sarah Johnson", role: "CEO & Founder", avatar: "https://i.pravatar.cc/150?img=47", color: "from-indigo-500 to-purple-600" },
  { name: "Michael Chen", role: "CTO", avatar: "https://i.pravatar.cc/150?img=11", color: "from-blue-500 to-cyan-500" },
  { name: "Emily Rodriguez", role: "Head of Design", avatar: "https://i.pravatar.cc/150?img=23", color: "from-pink-500 to-rose-500" },
  { name: "Alex Kim", role: "Lead Engineer", avatar: "https://i.pravatar.cc/150?img=33", color: "from-green-400 to-emerald-500" },
];

export const ABOUT_STATS = [
  { label: "Students Worldwide", value: 100000, suffix: "+", color: "from-blue-500 to-indigo-600" },
  { label: "Courses Available", value: 500, suffix: "+", color: "from-green-400 to-blue-500" },
  { label: "Expert Instructors", value: 200, suffix: "+", color: "from-orange-400 to-pink-500" },
  { label: "Countries Reached", value: 50, suffix: "+", color: "from-purple-500 to-indigo-600" },
];

export const HOME_STATS = [
  { label: "Students", target: 100, suffix: "K+", key: "students" as const },
  { label: "Courses", target: 500, suffix: "+", key: "courses" as const },
  { label: "Countries", target: 50, suffix: "+", key: "countries" as const },
  { label: "Rating", target: 4.9, suffix: "", key: "rating" as const, isDecimal: true },
];

export const TRUSTED_LOGOS = [
  { name: "Google", letter: "G" },
  { name: "Microsoft", letter: "M" },
  { name: "Stanford", letter: "S" },
  { name: "MIT", letter: "M" },
  { name: "Meta", letter: "F" },
  { name: "Apple", letter: "A" },
];
