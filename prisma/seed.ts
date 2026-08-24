import { PrismaClient, UserRole, CourseStatus, EnrollmentStatus, QuestionDifficulty, CertificateStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { enrichedLessons, lessonQuizzes } from "./enriched-lessons";

const prisma = new PrismaClient();

function generateRandomPassword(): string {
  return crypto.randomBytes(24).toString("base64url");
}

// ─── Users ───────────────────────────────────────────────────────────────────

async function createUsers() {
  const passwords: Record<string, string> = {};

  async function makeHash(email: string): Promise<string> {
    const pw = generateRandomPassword();
    passwords[email] = pw;
    return bcrypt.hash(pw, 12);
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@smartlms.com" },
    update: {},
    create: {
      email: "admin@smartlms.com",
      name: "Admin User",
      password: await makeHash("admin@smartlms.com"),
      role: UserRole.ADMIN,
      bio: "Platform administrator managing SmartLMS operations.",
      phone: "+1-555-0100",
    },
  });

  const instructor1 = await prisma.user.upsert({
    where: { email: "instructor1@smartlms.com" },
    update: {},
    create: {
      email: "instructor1@smartlms.com",
      name: "Dr. Sarah Johnson",
      password: await makeHash("instructor1@smartlms.com"),
      role: UserRole.INSTRUCTOR,
      bio: "Senior software engineer and educator with 12+ years of experience in web development, data science, and cloud computing.",
      phone: "+1-555-0101",
    },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: "instructor2@smartlms.com" },
    update: {},
    create: {
      email: "instructor2@smartlms.com",
      name: "Prof. Michael Chen",
      password: await makeHash("instructor2@smartlms.com"),
      role: UserRole.INSTRUCTOR,
      bio: "Cybersecurity expert and mobile developer. Former tech lead at Fortune 500 companies.",
      phone: "+1-555-0102",
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "student1@smartlms.com" },
    update: {},
    create: {
      email: "student1@smartlms.com",
      name: "Emily Rodriguez",
      password: await makeHash("student1@smartlms.com"),
      role: UserRole.STUDENT,
      bio: "Aspiring full-stack developer passionate about creating impactful web applications.",
      phone: "+1-555-0201",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "student2@smartlms.com" },
    update: {},
    create: {
      email: "student2@smartlms.com",
      name: "James Wilson",
      password: await makeHash("student2@smartlms.com"),
      role: UserRole.STUDENT,
      bio: "Data enthusiast exploring machine learning and analytics.",
      phone: "+1-555-0202",
    },
  });

  console.log("\n=== Demo User Passwords ===");
  for (const [email, pw] of Object.entries(passwords)) {
    console.log(`${email}: ${pw}`);
  }
  console.log("===========================\n");

  return { admin, instructor1, instructor2, student1, student2 };
}

// ─── Course Definitions ──────────────────────────────────────────────────────

interface CourseSectionData {
  title: string;
  description: string;
  lessons: { title: string; type: string; content?: string; videoUrl?: string; videoType?: string; duration: number; isPreview?: boolean }[];
}

interface QuizQuestionData {
  content: string;
  type: string;
  points: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  answers: { content: string; isCorrect: boolean; points: number }[];
}

interface CourseData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  level: string;
  category: string;
  tags: string[];
  duration: number;
  isFeatured: boolean;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  thumbnail?: string;
  sections: CourseSectionData[];
  quiz: {
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    difficulty: QuestionDifficulty;
    questions: QuizQuestionData[];
  };
  assignment: {
    title: string;
    description: string;
    maxScore: number;
  };
}

const coursesData: CourseData[] = [
  // ── Course 1: Complete Web Development Bootcamp ──
  {
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    description:
      "Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer. This comprehensive bootcamp takes you from zero to hero in web development with hands-on projects and expert instruction.",
    shortDescription:
      "Learn web development from scratch. HTML, CSS, JavaScript, React, Node.js and more.",
    price: 45000,
    level: "BEGINNER",
    category: "Web Development",
    tags: ["javascript", "react", "nodejs", "html", "css", "web development"],
    duration: 1200,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 1250,
    totalStudents: 5430,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    sections: [
      {
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of every website",
        lessons: [
          { title: "Introduction to HTML5", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE", videoType: "youtube", duration: 25, isPreview: true },
          { title: "Semantic HTML Elements", type: "TEXT", content: "HTML5 introduced semantic elements like <header>, <nav>, <main>, <article>, and <footer>. These elements give meaning to your markup, making it easier for browsers, screen readers, and search engines to understand the structure of your page. Instead of using generic <div> tags everywhere, use semantic elements to improve accessibility and SEO.", duration: 15 },
          { title: "CSS Flexbox & Grid Layout", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=fYq5pzgRUdw", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "JavaScript Essentials",
        description: "Master the programming language of the web",
        lessons: [
          { title: "Variables, Types & Functions", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", videoType: "youtube", duration: 35 },
          { title: "DOM Manipulation", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=0ik6X_hDfCk", videoType: "youtube", duration: 40 },
          { title: "ES6+ Features & Arrow Functions", type: "TEXT", content: "ES6 introduced arrow functions, template literals, destructuring, spread/rest operators, and modules. Arrow functions provide a shorter syntax: const add = (a, b) => a + b. Destructuring lets you extract values from objects: const { name, age } = person. Spread operator (...) expands arrays and objects: const newArr = [...arr1, ...arr2].", duration: 20 },
        ],
      },
      {
        title: "React Framework",
        description: "Build modern user interfaces with React",
        lessons: [
          { title: "Components & JSX", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0", videoType: "youtube", duration: 30 },
          { title: "State & Props Management", type: "TEXT", content: "React components use state to manage internal data and props to receive data from parents. Use useState hook for state: const [count, setCount] = useState(0). Props are read-only and flow down the component tree. For complex state, use useReducer. Context API helps avoid prop drilling for deeply nested data.", duration: 25 },
          { title: "React Hooks Deep Dive", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=dpw9EHDh2bM", videoType: "youtube", duration: 45 },
        ],
      },
      {
        title: "Node.js & Backend",
        description: "Server-side JavaScript development",
        lessons: [
          { title: "Express.js Fundamentals", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=CnH3kAXSrmU", videoType: "youtube", duration: 35 },
          { title: "RESTful API Design", type: "TEXT", content: "REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations. Resources are identified by URLs like /api/users/:id. Status codes indicate results: 200 OK, 201 Created, 404 Not Found, 500 Server Error. Use proper naming conventions, versioning (/api/v1/), and pagination for large datasets.", duration: 20 },
          { title: "Database Integration with MongoDB", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=-0X8kHTtRZ0", videoType: "youtube", duration: 40 },
        ],
      },
    ],
    quiz: {
      title: "Web Development Knowledge Check",
      description: "Test your understanding of HTML, CSS, JavaScript, and React",
      timeLimit: 30,
      passingScore: 70,
      difficulty: QuestionDifficulty.EASY,
      questions: [
        {
          content: "Which HTML element is used to define the largest heading?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The <h1> element defines the largest heading. HTML headings range from <h1> (most important) to <h6> (least important).",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "<h1>", isCorrect: true, points: 10 },
            { content: "<heading>", isCorrect: false, points: 0 },
            { content: "<h6>", isCorrect: false, points: 0 },
            { content: "<head>", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which CSS property is used to change the text color?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The 'color' property sets the text color in CSS. 'background-color' sets the background, 'font-color' is not a valid property.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "color", isCorrect: true, points: 10 },
            { content: "text-color", isCorrect: false, points: 0 },
            { content: "font-color", isCorrect: false, points: 0 },
            { content: "foreground", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "In JavaScript, which method is used to select an element by its ID?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "document.getElementById() selects a single element by its ID attribute. querySelector('#id') also works but getElementById is specifically designed for this purpose.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "document.getElementById()", isCorrect: true, points: 10 },
            { content: "document.getElement()", isCorrect: false, points: 0 },
            { content: "document.findElement()", isCorrect: false, points: 0 },
            { content: "document.selectById()", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: In React, props are mutable and can be changed by the receiving component.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "Props are read-only in React. A component must never modify the props it receives from its parent. This is a core principle of React's unidirectional data flow.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "False", isCorrect: true, points: 10 },
            { content: "True", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Fill in the blank: In React, the ________ hook is used to add state to functional components.",
          type: "FILL_BLANK",
          points: 10,
          explanation: "The useState hook is the primary way to add state to functional components in React. It returns a stateful value and a function to update it.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "useState", isCorrect: true, points: 10 },
            { content: "useReducer", isCorrect: false, points: 0 },
            { content: "useEffect", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Build a Portfolio Website",
      description: "Create a personal portfolio website using HTML, CSS, and JavaScript. Include at least 3 sections: About Me, Projects, and Contact. The site must be responsive and use semantic HTML elements. Deploy your portfolio using GitHub Pages or Netlify.",
      maxScore: 100,
    },
  },

  // ── Course 2: Machine Learning & AI Masterclass ──
  {
    title: "Machine Learning & AI Masterclass",
    slug: "machine-learning-ai-masterclass",
    description:
      "Deep dive into machine learning algorithms, neural networks, and AI applications using Python and TensorFlow. From linear regression to deep learning, master the techniques powering the AI revolution.",
    shortDescription:
      "Learn ML and AI from fundamentals to advanced topics with hands-on projects.",
    price: 75000,
    salePrice: 55000,
    level: "INTERMEDIATE",
    category: "Data Science",
    tags: ["machine learning", "AI", "python", "tensorflow", "neural networks"],
    duration: 900,
    isFeatured: true,
    rating: 4.9,
    totalRatings: 890,
    totalStudents: 3210,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Foundations of Machine Learning",
        description: "Understanding core ML concepts and mathematics",
        lessons: [
          { title: "What is Machine Learning?", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=GwIo3gDZCVQ", videoType: "youtube", duration: 20, isPreview: true },
          { title: "Linear Algebra for ML", type: "TEXT", content: "Linear algebra is the backbone of machine learning. Vectors represent data points, matrices represent datasets, and matrix multiplication is used in transformations. Key concepts include dot products, eigenvalues, and matrix decomposition. NumPy provides efficient implementations: np.dot(a, b) for dot products, np.linalg.eig() for eigenvalues.", duration: 30 },
          { title: "Probability & Statistics Review", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=uzkcQnRs8KA", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Supervised Learning",
        description: "Regression, classification, and model evaluation",
        lessons: [
          { title: "Linear & Logistic Regression", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=7eh4d6sabA0", videoType: "youtube", duration: 40 },
          { title: "Decision Trees & Random Forests", type: "TEXT", content: "Decision trees split data using feature thresholds to minimize impurity (Gini or entropy). Random forests ensemble multiple trees, reducing overfitting through bagging. In sklearn: from sklearn.ensemble import RandomForestClassifier; model = RandomForestClassifier(n_estimators=100); model.fit(X_train, y_train). Key metrics: accuracy, precision, recall, F1-score.", duration: 25 },
          { title: "Model Evaluation & Cross-Validation", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=fSxE35O0fNQ", videoType: "youtube", duration: 35 },
        ],
      },
      {
        title: "Unsupervised Learning",
        description: "Clustering, dimensionality reduction, and anomaly detection",
        lessons: [
          { title: "K-Means & Hierarchical Clustering", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=4b5d3muPQmA", videoType: "youtube", duration: 30 },
          { title: "Principal Component Analysis (PCA)", type: "TEXT", content: "PCA reduces dimensionality by projecting data onto principal components — orthogonal axes of maximum variance. Use sklearn: from sklearn.decomposition import PCA; pca = PCA(n_components=2); X_reduced = pca.fit_transform(X). Explained variance ratio shows how much information each component retains. PCA is useful for visualization and reducing computational cost.", duration: 20 },
          { title: "Anomaly Detection Techniques", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=9hE4sQV2LqU", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Deep Learning & Neural Networks",
        description: "Build and train neural networks with TensorFlow",
        lessons: [
          { title: "Neural Network Architecture", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", videoType: "youtube", duration: 45 },
          { title: "Training with Backpropagation", type: "TEXT", content: "Backpropagation computes gradients of the loss function with respect to each weight using the chain rule. The optimizer (SGD, Adam, RMSprop) updates weights: w = w - lr * gradient. TensorFlow/Keras: model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy']); model.fit(X_train, y_train, epochs=50, batch_size=32).", duration: 30 },
          { title: "CNNs for Image Recognition", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=2-Ol7G_BbeY", videoType: "youtube", duration: 40 },
        ],
      },
    ],
    quiz: {
      title: "Machine Learning & AI Assessment",
      description: "Evaluate your understanding of ML algorithms and neural networks",
      timeLimit: 40,
      passingScore: 70,
      difficulty: QuestionDifficulty.MEDIUM,
      questions: [
        {
          content: "Which type of learning uses labeled data to train models?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Supervised learning uses labeled input-output pairs to learn a mapping function. The model learns from examples where the correct answer is known.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Supervised Learning", isCorrect: true, points: 10 },
            { content: "Unsupervised Learning", isCorrect: false, points: 0 },
            { content: "Reinforcement Learning", isCorrect: false, points: 0 },
            { content: "Semi-supervised Learning", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the purpose of a loss function in machine learning?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "A loss function quantifies the difference between predicted and actual values. The goal of training is to minimize this loss. Common loss functions include MSE for regression and cross-entropy for classification.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "To measure the difference between predictions and actual values", isCorrect: true, points: 10 },
            { content: "To increase model complexity", isCorrect: false, points: 0 },
            { content: "To select features", isCorrect: false, points: 0 },
            { content: "To normalize input data", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: Overfitting occurs when a model performs well on training data but poorly on unseen data.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "Overfitting happens when a model learns noise in the training data rather than the underlying pattern. It memorizes training examples but fails to generalize. Techniques like regularization, dropout, and cross-validation help prevent overfitting.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which algorithm is commonly used for dimensionality reduction?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Principal Component Analysis (PCA) is the most widely used dimensionality reduction technique. It projects data onto orthogonal axes of maximum variance while preserving as much information as possible.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "Principal Component Analysis (PCA)", isCorrect: true, points: 10 },
            { content: "Linear Regression", isCorrect: false, points: 0 },
            { content: "K-Nearest Neighbors", isCorrect: false, points: 0 },
            { content: "Naive Bayes", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Fill in the blank: The ________ activation function outputs values between 0 and 1, making it popular for binary classification.",
          type: "FILL_BLANK",
          points: 10,
          explanation: "The sigmoid function σ(x) = 1/(1+e^(-x)) squashes any input to a value between 0 and 1, which can be interpreted as a probability for binary classification.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "sigmoid", isCorrect: true, points: 10 },
            { content: "relu", isCorrect: false, points: 0 },
            { content: "tanh", isCorrect: false, points: 0 },
            { content: "softmax", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Train Your First Model",
      description: "Using the Titanic dataset from Kaggle, build a classification model to predict passenger survival. Use scikit-learn to implement at least two different algorithms (e.g., Logistic Regression and Random Forest). Perform data preprocessing, feature engineering, and model evaluation. Submit your Jupyter notebook with analysis and conclusions.",
      maxScore: 100,
    },
  },

  // ── Course 3: Digital Marketing Mastery ──
  {
    title: "Digital Marketing Mastery",
    slug: "digital-marketing-mastery",
    description:
      "Learn SEO, social media marketing, content marketing, email marketing, and paid advertising strategies. Master the tools and techniques that drive real business results in the digital landscape.",
    shortDescription:
      "Master digital marketing strategies to grow your business online.",
    price: 38000,

    level: "BEGINNER",
    category: "Marketing",
    tags: ["SEO", "social media", "content marketing", "advertising", "email marketing"],
    duration: 600,
    isFeatured: true,
    rating: 4.7,
    totalRatings: 650,
    totalStudents: 2890,
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    sections: [
      {
        title: "SEO & Content Strategy",
        description: "Rank higher on search engines with proven techniques",
        lessons: [
          { title: "How Search Engines Work", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=hPjkGfzBj3I", videoType: "youtube", duration: 20, isPreview: true },
          { title: "Keyword Research Methods", type: "TEXT", content: "Keyword research identifies the terms your audience searches for. Use tools like Google Keyword Planner, Ahrefs, or SEMrush. Focus on search volume, keyword difficulty, and user intent. Long-tail keywords (e.g., 'best running shoes for flat feet') have lower competition and higher conversion rates. Map keywords to content: informational -> blog posts, transactional -> product pages.", duration: 25 },
          { title: "On-Page SEO Best Practices", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=GFO_starW9fU", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Social Media Marketing",
        description: "Build and engage audiences across platforms",
        lessons: [
          { title: "Platform Strategy: Instagram, LinkedIn & TikTok", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=AQ8WrNhEfXQ", videoType: "youtube", duration: 35 },
          { title: "Content Calendar Planning", type: "TEXT", content: "A content calendar ensures consistent posting and strategic content mix. Plan 4 weeks ahead with categories: educational (40%), entertaining (30%), promotional (20%), user-generated (10%). Use tools like Buffer, Hootsuite, or Notion. Batch-create content weekly. Track best posting times using platform analytics. Include hashtags, captions, and visual assets in your calendar.", duration: 20 },
          { title: "Social Media Advertising", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=JQ9fZ3h8Zb0", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Email Marketing & Analytics",
        description: "Convert leads with email campaigns and measure ROI",
        lessons: [
          { title: "Building an Email List", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=Oj8nJEcJVNM", videoType: "youtube", duration: 25 },
          { title: "Email Campaign Design", type: "TEXT", content: "Effective emails have four key elements: compelling subject lines (40-60 characters), personalized content, clear CTAs, and mobile-responsive design. Segment your list by behavior, demographics, and engagement level. A/B test subject lines, send times, and content. Key metrics: open rate (20-25% average), click-through rate (2-5%), conversion rate.", duration: 20 },
          { title: "Google Analytics Setup & Reports", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=6wf8pDQ1mGI", videoType: "youtube", duration: 35 },
        ],
      },
    ],
    quiz: {
      title: "Digital Marketing Knowledge Check",
      description: "Test your understanding of SEO, social media, and email marketing",
      timeLimit: 25,
      passingScore: 70,
      difficulty: QuestionDifficulty.EASY,
      questions: [
        {
          content: "What does SEO stand for?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "SEO stands for Search Engine Optimization — the practice of optimizing content to rank higher in search engine results pages (SERPs).",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Search Engine Optimization", isCorrect: true, points: 10 },
            { content: "Social Engagement Online", isCorrect: false, points: 0 },
            { content: "Sales Enhancement Operations", isCorrect: false, points: 0 },
            { content: "Site Enhancement Organization", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which metric measures the percentage of email recipients who opened your email?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Open rate is the percentage of delivered emails that were opened by recipients. It indicates how effective your subject lines and sender reputation are.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Open Rate", isCorrect: true, points: 10 },
            { content: "Click-Through Rate", isCorrect: false, points: 0 },
            { content: "Bounce Rate", isCorrect: false, points: 0 },
            { content: "Conversion Rate", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: Long-tail keywords typically have higher search volume than short-tail keywords.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "False. Long-tail keywords are more specific and have lower individual search volume, but they collectively make up the majority of searches and have higher conversion rates due to their specificity.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "False", isCorrect: true, points: 10 },
            { content: "True", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the recommended content mix for social media posting?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The 40-30-20-10 rule suggests: 40% educational content, 30% entertaining content, 20% promotional content, and 10% user-generated content. This balance keeps audiences engaged without feeling oversold.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "40% educational, 30% entertaining, 20% promotional, 10% user-generated", isCorrect: true, points: 10 },
            { content: "50% promotional, 30% educational, 20% entertaining", isCorrect: false, points: 0 },
            { content: "100% promotional content", isCorrect: false, points: 0 },
            { content: "50% entertaining, 50% educational", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Create a Marketing Plan",
      description: "Develop a comprehensive digital marketing plan for a fictional e-commerce business selling sustainable products. Include: target audience personas, SEO keyword strategy, social media content calendar (4 weeks), email marketing sequence (3 emails), and KPI targets. Present your plan in a structured document or presentation.",
      maxScore: 100,
    },
  },

  // ── Course 4: Advanced Python Programming ──
  {
    title: "Advanced Python Programming",
    slug: "advanced-python-programming",
    description:
      "Master advanced Python concepts including decorators, generators, async programming, metaclasses, and design patterns. Write production-ready, clean, and efficient Python code.",
    shortDescription:
      "Take your Python skills to the next level with advanced concepts.",
    price: 55000,

    level: "ADVANCED",
    category: "Programming",
    tags: ["python", "programming", "advanced", "design patterns", "async"],
    duration: 750,
    isFeatured: false,
    rating: 4.6,
    totalRatings: 420,
    totalStudents: 1850,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Functional Programming & Iterators",
        description: "Master closures, decorators, and generator patterns",
        lessons: [
          { title: "Decorators & Closures", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=FsAPt_9Bf3U", videoType: "youtube", duration: 35, isPreview: true },
          { title: "Generators & Itertools", type: "TEXT", content: "Generators produce values lazily using yield: def fibonacci(): a, b = 0, 1; while True: yield a; a, b = b, a + b. This is memory-efficient for large sequences. itertools provides powerful iteration tools: chain, product, permutations, combinations, groupby. Use generator expressions for memory-efficient list operations: sum(x**2 for x in range(1000000)).", duration: 30 },
          { title: "Context Managers & the 'with' Statement", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=DbK3GMYYQbY", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Metaprogramming",
        description: "Dynamic classes, descriptors, and metaclasses",
        lessons: [
          { title: "Metaclasses Explained", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=UmfkVQ5z3yo", videoType: "youtube", duration: 40 },
          { title: "Descriptors & Properties", type: "TEXT", content: "Descriptors implement __get__, __set__, or __delete__ to customize attribute access. @property is syntactic sugar for descriptors: class Circle: @property; def area(self): return 3.14 * self._radius ** 2. Custom descriptors enable validation, caching, and computed attributes. __slots__ restricts attribute creation for memory efficiency.", duration: 25 },
          { title: "Dynamic Code Execution", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=GQfJpRZ3a5E", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Async Programming & Concurrency",
        description: "Write non-blocking code with asyncio",
        lessons: [
          { title: "asyncio Fundamentals", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=2IW-ZEui4h4", videoType: "youtube", duration: 35 },
          { title: "Coroutines & Tasks", type: "TEXT", content: "Coroutines are defined with async def and awaited with await. asyncio.gather() runs multiple coroutines concurrently: await asyncio.gather(fetch(url1), fetch(url2)). Tasks wrap coroutines for concurrent execution: task = asyncio.create_task(coro()). Event loops manage scheduling. Use asyncio.Queue for producer-consumer patterns.", duration: 30 },
          { title: "Building Async Web Scrapers", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=867HnM01kGI", videoType: "youtube", duration: 40 },
        ],
      },
      {
        title: "Design Patterns in Python",
        description: "Implementing Gang of Four patterns Pythonically",
        lessons: [
          { title: "Singleton & Factory Patterns", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=hOnfUjv0hBs", videoType: "youtube", duration: 30 },
          { title: "Observer & Strategy Patterns", type: "TEXT", content: "The Observer pattern defines a one-to-many dependency: when one object changes state, all dependents are notified. Python uses callback functions or events. The Strategy pattern defines a family of algorithms and makes them interchangeable: class SortStrategy: def sort(data). Use composition over inheritance. Python's duck typing makes many GoF patterns simpler or unnecessary.", duration: 25 },
          { title: "Building a REST API with FastAPI", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=0sOvBWFbOH8", videoType: "youtube", duration: 45 },
        ],
      },
    ],
    quiz: {
      title: "Advanced Python Assessment",
      description: "Test your mastery of advanced Python concepts",
      timeLimit: 35,
      passingScore: 70,
      difficulty: QuestionDifficulty.HARD,
      questions: [
        {
          content: "What keyword is used to define a generator function in Python?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The 'yield' keyword is used in generator functions. When a function contains 'yield', it becomes a generator function that returns an iterator producing values lazily.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "yield", isCorrect: true, points: 10 },
            { content: "return", isCorrect: false, points: 0 },
            { content: "generate", isCorrect: false, points: 0 },
            { content: "async", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What does the 'await' keyword do in Python?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "'await' suspends execution of the coroutine until the awaited object (typically a coroutine or Future) completes, allowing the event loop to run other tasks in the meantime.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "Suspends coroutine execution until the awaited object completes", isCorrect: true, points: 10 },
            { content: "Creates a new thread", isCorrect: false, points: 0 },
            { content: "Blocks the entire program", isCorrect: false, points: 0 },
            { content: "Raises an exception", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: Python metaclasses are classes that create other classes.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. A metaclass is the 'class of a class'. Just as a class defines how instances behave, a metaclass defines how classes behave. type() is Python's default metaclass.",
          difficulty: QuestionDifficulty.HARD,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which method must a descriptor class implement to customize attribute access?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "A descriptor must implement at least one of __get__, __set__, or __delete__. The __get__ method is called when the attribute is accessed, __set__ when it's assigned, and __delete__ when it's deleted.",
          difficulty: QuestionDifficulty.HARD,
          answers: [
            { content: "__get__ (or __set__ / __delete__)", isCorrect: true, points: 10 },
            { content: "__init__", isCorrect: false, points: 0 },
            { content: "__repr__", isCorrect: false, points: 0 },
            { content: "__call__", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Fill in the blank: In Python, ________ is a built-in function that returns an iterator that produces items from an iterable until it is exhausted.",
          type: "FILL_BLANK",
          points: 10,
          explanation: "iter() returns an iterator from an iterable object. Combined with next(), it allows step-by-step iteration. itertools provides extended iteration utilities like chain, islice, and cycle.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "iter", isCorrect: true, points: 10 },
            { content: "next", isCorrect: false, points: 0 },
            { content: "map", isCorrect: false, points: 0 },
            { content: "zip", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Build a REST API",
      description: "Build a RESTful API using FastAPI that manages a library system with books, authors, and borrowers. Implement CRUD operations, pagination, filtering, authentication (JWT tokens), and proper error handling. Include OpenAPI documentation (automatic with FastAPI). Deploy to a cloud service and submit the live URL along with your source code.",
      maxScore: 100,
    },
  },

  // ── Course 5: UI/UX Design Fundamentals ──
  {
    title: "UI/UX Design Fundamentals",
    slug: "ui-ux-design-fundamentals",
    description:
      "Learn the principles of user interface and user experience design. Create stunning designs with Figma. From color theory to interactive prototypes, master the art of designing for humans.",
    shortDescription:
      "Design beautiful, user-friendly interfaces with modern tools and techniques.",
    price: 42000,

    level: "BEGINNER",
    category: "Design",
    tags: ["UI", "UX", "figma", "design", "prototyping"],
    duration: 500,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 780,
    totalStudents: 3560,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Design Principles",
        description: "Core principles of effective visual design",
        lessons: [
          { title: "Color Theory & Typography", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=YqQx75OPRa0", videoType: "youtube", duration: 30, isPreview: true },
          { title: "Visual Hierarchy & Layout", type: "TEXT", content: "Visual hierarchy guides users through content using size, color, contrast, and spacing. The F-pattern and Z-pattern are common reading patterns for web pages. Use the 8px grid system for consistent spacing. Gestalt principles (proximity, similarity, closure, continuity) explain how humans perceive visual elements as organized groups.", duration: 20 },
          { title: "Accessibility in Design (WCAG)", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=Gm7B3rE7EEo", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "User Research & Wireframing",
        description: "Understand users and create effective wireframes",
        lessons: [
          { title: "User Personas & Journey Maps", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=Ovj4hFxQ7vg", videoType: "youtube", duration: 25 },
          { title: "Low-Fidelity Wireframing", type: "TEXT", content: "Wireframes are skeletal layouts showing page structure without visual design. Low-fidelity wireframes use simple shapes and placeholder text. Start with paper sketches for rapid ideation. Key elements: navigation, content blocks, CTAs, and footer. Tools: paper, Balsamiq, Figma (wireframe kit). Iterate quickly — wireframes are cheap to change compared to high-fidelity mockups.", duration: 20 },
          { title: "Competitive Analysis Techniques", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=dB4bDvjj9HQ", videoType: "youtube", duration: 20 },
        ],
      },
      {
        title: "Prototyping & Handoff",
        description: "Create interactive prototypes and prepare for development",
        lessons: [
          { title: "Interactive Prototyping in Figma", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", videoType: "youtube", duration: 35 },
          { title: "Design System Components", type: "TEXT", content: "A design system is a collection of reusable components, patterns, and guidelines. Build a component library with variants in Figma: buttons (primary, secondary, ghost), input fields, cards, and modals. Use auto-layout for responsive components. Document spacing, colors (with semantic names), and typography scales. A well-built design system reduces design debt and speeds up development.", duration: 25 },
          { title: "Developer Handoff Best Practices", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=ci4BAX9h4uo", videoType: "youtube", duration: 20 },
        ],
      },
    ],
    quiz: {
      title: "UI/UX Design Assessment",
      description: "Test your understanding of design principles and processes",
      timeLimit: 25,
      passingScore: 70,
      difficulty: QuestionDifficulty.EASY,
      questions: [
        {
          content: "Which Gestalt principle states that elements placed close together are perceived as a group?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The principle of proximity states that objects near each other tend to be grouped together. This helps create visual organization and hierarchy in layouts.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Proximity", isCorrect: true, points: 10 },
            { content: "Similarity", isCorrect: false, points: 0 },
            { content: "Closure", isCorrect: false, points: 0 },
            { content: "Continuity", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the recommended contrast ratio for normal text to meet WCAG AA accessibility standards?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt or 14pt bold). This ensures text is readable for people with moderately low vision.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "4.5:1", isCorrect: true, points: 10 },
            { content: "2:1", isCorrect: false, points: 0 },
            { content: "7:1", isCorrect: false, points: 0 },
            { content: "1:1", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: A wireframe should include detailed colors, images, and typography.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "False. Wireframes are intentionally low-fidelity and focus on layout, structure, and content hierarchy. Adding visual details too early can distract from usability discussions.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "False", isCorrect: true, points: 10 },
            { content: "True", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the primary purpose of a user journey map?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "A user journey map visualizes the complete experience a user has with a product, showing their actions, thoughts, and emotions at each step. It identifies pain points and opportunities for improvement.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "To visualize the complete user experience and identify pain points", isCorrect: true, points: 10 },
            { content: "To create color palettes", isCorrect: false, points: 0 },
            { content: "To write code for the interface", isCorrect: false, points: 0 },
            { content: "To manage project timelines", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Design a Mobile App Mockup",
      description: "Design a complete mobile app for a food delivery service in Figma. Include: onboarding screens, home screen with restaurant listings, menu page, cart, checkout, and order tracking. Apply visual hierarchy, consistent typography, and accessible color contrast. Create an interactive prototype with navigation flows. Submit your Figma file link.",
      maxScore: 100,
    },
  },

  // ── Course 6: Cybersecurity Essentials ──
  {
    title: "Cybersecurity Essentials",
    slug: "cybersecurity-essentials",
    description:
      "Learn ethical hacking, network security, cryptography, and incident response. Prepare for security certifications and protect organizations from cyber threats with hands-on labs.",
    shortDescription:
      "Protect systems and networks from cyber threats with hands-on labs.",
    price: 65000,

    level: "INTERMEDIATE",
    category: "Security",
    tags: ["cybersecurity", "ethical hacking", "network security", "cryptography", "penetration testing"],
    duration: 800,
    isFeatured: false,
    rating: 4.7,
    totalRatings: 540,
    totalStudents: 2100,
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Security Fundamentals",
        description: "Core concepts of information security",
        lessons: [
          { title: "CIA Triad & Security Principles", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=U_gy1W3t0z4", videoType: "youtube", duration: 20, isPreview: true },
          { title: "Common Attack Vectors", type: "TEXT", content: "Attack vectors include phishing (social engineering via email), SQL injection (malicious database queries), XSS (injecting scripts into web pages), man-in-the-middle (intercepting communications), and brute force (automated password guessing). Understanding these vectors is essential for building defenses. The OWASP Top 10 lists the most critical web application security risks.", duration: 25 },
          { title: "Security Frameworks (NIST, ISO 27001)", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=2W1gPgMNYyQ", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Network Security",
        description: "Protecting network infrastructure and communications",
        lessons: [
          { title: "Firewalls & Intrusion Detection", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=nS_4p1p1b7U", videoType: "youtube", duration: 35 },
          { title: "VPNs & Encryption Protocols", type: "TEXT", content: "VPNs create encrypted tunnels for secure remote access. IPSec operates at the network layer with two modes: Transport (encrypts payload) and Tunnel (encrypts entire packet). TLS/SSL secures web traffic (HTTPS). VPN protocols include WireGuard (modern, fast), OpenVPN (flexible), and IPSec (enterprise). Always use strong encryption: AES-256, RSA-2048+.", duration: 25 },
          { title: "Wireless Network Security (WPA3)", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=8yIMnVHkKQA", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Cryptography",
        description: "Mathematical foundations of data protection",
        lessons: [
          { title: "Symmetric vs Asymmetric Encryption", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=AQ8WrNhEfXQ", videoType: "youtube", duration: 30 },
          { title: "Hashing & Digital Signatures", type: "TEXT", content: "Hash functions (SHA-256, SHA-3) produce fixed-size digests from input data. They are one-way and collision-resistant. Use cases: password storage (with salt + bcrypt), file integrity (checksums), blockchain. Digital signatures combine hashing with asymmetric encryption: sign with private key, verify with public key. Certificates (X.509) bind public keys to identities, forming the backbone of PKI/TLS.", duration: 30 },
          { title: "Public Key Infrastructure (PKI)", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=UxVfLkGmMkA", videoType: "youtube", duration: 35 },
        ],
      },
      {
        title: "Ethical Hacking & Incident Response",
        description: "Hands-on penetration testing and breach response",
        lessons: [
          { title: "Penetration Testing Methodology", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=fM1RnW0tVqc", videoType: "youtube", duration: 40 },
          { title: "Vulnerability Scanning with Nmap", type: "TEXT", content: "Nmap (Network Mapper) discovers hosts and services on a network. Basic scan: nmap -sV target.com. Service version detection: nmap -sV -sC target.com. OS detection: nmap -O target.com. Vulnerability scripts: nmap --script vuln target.com. Combine with Nessus or OpenVAS for comprehensive vulnerability assessment. Always get written authorization before scanning.", duration: 30 },
          { title: "Incident Response Playbook", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=CdFZ1w8VjSs", videoType: "youtube", duration: 35 },
        ],
      },
    ],
    quiz: {
      title: "Cybersecurity Knowledge Assessment",
      description: "Test your understanding of security concepts and practices",
      timeLimit: 35,
      passingScore: 70,
      difficulty: QuestionDifficulty.MEDIUM,
      questions: [
        {
          content: "What does the 'C' in the CIA triad stand for?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The CIA triad consists of Confidentiality (keeping data secret), Integrity (ensuring data hasn't been tampered with), and Availability (ensuring data is accessible when needed).",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Confidentiality", isCorrect: true, points: 10 },
            { content: "Compliance", isCorrect: false, points: 0 },
            { content: "Control", isCorrect: false, points: 0 },
            { content: "Countermeasure", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which type of encryption uses the same key for both encryption and decryption?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Symmetric encryption uses a single shared key for both operations. Examples include AES and DES. It's faster than asymmetric encryption but requires secure key distribution.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "Symmetric Encryption", isCorrect: true, points: 10 },
            { content: "Asymmetric Encryption", isCorrect: false, points: 0 },
            { content: "Hashing", isCorrect: false, points: 0 },
            { content: "Tokenization", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: SQL injection is a type of attack where malicious SQL code is inserted into input fields to manipulate the database.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. SQL injection exploits vulnerabilities in applications that concatenate user input directly into SQL queries. It can allow attackers to read, modify, or delete data. Prevention: use parameterized queries and ORM frameworks.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the purpose of salting passwords before hashing?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Salting adds random data to each password before hashing, ensuring that identical passwords produce different hashes. This defeats rainbow table attacks where precomputed hash databases are used to crack passwords.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "To prevent rainbow table attacks by ensuring identical passwords have different hashes", isCorrect: true, points: 10 },
            { content: "To make passwords shorter", isCorrect: false, points: 0 },
            { content: "To encrypt the database", isCorrect: false, points: 0 },
            { content: "To speed up password verification", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Fill in the blank: The ________ is a network scanning tool used to discover hosts, services, and vulnerabilities on a network.",
          type: "FILL_BLANK",
          points: 10,
          explanation: "Nmap (Network Mapper) is the industry-standard tool for network discovery and security auditing. It supports port scanning, service detection, OS fingerprinting, and vulnerability scripting.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "Nmap", isCorrect: true, points: 10 },
            { content: "Wireshark", isCorrect: false, points: 0 },
            { content: "Metasploit", isCorrect: false, points: 0 },
            { content: "Burp Suite", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Vulnerability Assessment Report",
      description: "Conduct a vulnerability assessment on a provided vulnerable web application (DVWA or similar). Document at least 5 vulnerabilities found, including: vulnerability type, affected component, risk level (CVSS score), proof of concept, and remediation recommendations. Present your findings in a professional assessment report format.",
      maxScore: 100,
    },
  },

  // ── Course 7: Cloud Computing with AWS ──
  {
    title: "Cloud Computing with AWS",
    slug: "cloud-computing-with-aws",
    description:
      "Master Amazon Web Services: EC2, S3, Lambda, RDS, and more. Deploy scalable, highly available applications on the world's leading cloud platform. Prepare for the AWS Solutions Architect certification.",
    shortDescription:
      "Learn AWS cloud services and deploy scalable applications.",
    price: 70000,

    level: "INTERMEDIATE",
    category: "Cloud",
    tags: ["AWS", "cloud", "EC2", "S3", "Lambda", "DevOps"],
    duration: 850,
    isFeatured: true,
    rating: 4.8,
    totalRatings: 620,
    totalStudents: 2450,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop",
    sections: [
      {
        title: "AWS Core Services",
        description: "Compute, storage, and networking fundamentals",
        lessons: [
          { title: "EC2 Instances & Security Groups", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=tlhrehUdAdo", videoType: "youtube", duration: 30, isPreview: true },
          { title: "S3 Bucket Management", type: "TEXT", content: "Amazon S3 provides object storage with 11 9's of durability. Create buckets: aws s3 mb s3://my-bucket. Upload files: aws s3 cp file.txt s3://my-bucket/. S3 supports versioning, lifecycle policies (auto-archive to Glacier), and cross-region replication. Bucket policies use IAM-like JSON to control access. Server-side encryption (SSE-S3, SSE-KMS) protects data at rest.", duration: 25 },
          { title: "VPC & Networking Basics", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=s2MFyHNvzGs", videoType: "youtube", duration: 35 },
        ],
      },
      {
        title: "Serverless & Databases",
        description: "Build without managing servers",
        lessons: [
          { title: "AWS Lambda & API Gateway", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=eOBqPHhHICg", videoType: "youtube", duration: 35 },
          { title: "RDS & DynamoDB", type: "TEXT", content: "RDS provides managed relational databases (MySQL, PostgreSQL, Aurora). Enable Multi-AZ for high availability and Read Replicas for scaling reads. DynamoDB is a serverless NoSQL database with single-digit millisecond latency. Use partition keys for even distribution and sort keys for range queries. DynamoDB Streams enable event-driven architectures.", duration: 30 },
          { title: "Building Serverless APIs", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=3LHERpFPXeU", videoType: "youtube", duration: 40 },
        ],
      },
      {
        title: "DevOps & Deployment",
        description: "CI/CD, infrastructure as code, and monitoring",
        lessons: [
          { title: "CloudFormation & Infrastructure as Code", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=8Z9oVQaHQ5Y", videoType: "youtube", duration: 30 },
          { title: "CI/CD with CodePipeline", type: "TEXT", content: "AWS CodePipeline automates your release process with stages: Source (CodeCommit/GitHub), Build (CodeBuild), Deploy (CodeDeploy/CloudFormation). Each stage contains actions that run in parallel or sequence. Use artifacts to pass data between stages. Integrate with SNS for notifications. Pipeline triggers: CloudWatch events, manual approval, or webhook from source.", duration: 25 },
          { title: "Monitoring with CloudWatch", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=i65UMFPBzEI", videoType: "youtube", duration: 25 },
        ],
      },
    ],
    quiz: {
      title: "AWS Cloud Computing Assessment",
      description: "Test your knowledge of AWS services and cloud architecture",
      timeLimit: 30,
      passingScore: 70,
      difficulty: QuestionDifficulty.MEDIUM,
      questions: [
        {
          content: "Which AWS service provides scalable object storage with high durability?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "Amazon S3 (Simple Storage Service) provides 99.999999999% (11 9's) durability for objects. It's designed for 99.99% availability and supports versioning, encryption, and lifecycle policies.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Amazon S3", isCorrect: true, points: 10 },
            { content: "Amazon EBS", isCorrect: false, points: 0 },
            { content: "Amazon EFS", isCorrect: false, points: 0 },
            { content: "Amazon Glacier", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the primary benefit of AWS Lambda's serverless model?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "AWS Lambda lets you run code without provisioning or managing servers. You only pay for compute time consumed (per 1ms), and it automatically scales from zero to thousands of concurrent requests.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "No server management required and pay-per-use pricing", isCorrect: true, points: 10 },
            { content: "Unlimited storage capacity", isCorrect: false, points: 0 },
            { content: "Guaranteed 100% uptime", isCorrect: false, points: 0 },
            { content: "Full control over operating system", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: DynamoDB is a serverless NoSQL database service offered by AWS.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. DynamoDB is a fully managed NoSQL key-value and document database. It delivers single-digit millisecond performance at any scale and requires no server provisioning.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What does VPC stand for in AWS networking?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "VPC stands for Virtual Private Cloud. It lets you provision a logically isolated section of the AWS Cloud where you can launch resources in a virtual network you define.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Virtual Private Cloud", isCorrect: true, points: 10 },
            { content: "Virtual Public Connection", isCorrect: false, points: 0 },
            { content: "Verified Private Channel", isCorrect: false, points: 0 },
            { content: "Virtual Protocol Control", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Deploy a Scalable Application",
      description: "Deploy a three-tier web application on AWS: a React frontend on S3 with CloudFront, a Node.js API on Lambda with API Gateway, and a DynamoDB table for data storage. Implement auto-scaling, logging with CloudWatch, and set up a CI/CD pipeline with CodePipeline. Document your architecture and submit screenshots of the working application.",
      maxScore: 100,
    },
  },

  // ── Course 8: Blockchain & Cryptocurrency ──
  {
    title: "Blockchain & Cryptocurrency",
    slug: "blockchain-cryptocurrency",
    description:
      "Understand blockchain technology, cryptocurrency economics, smart contracts, and decentralized applications. From Bitcoin to DeFi, explore the future of finance and decentralized systems.",
    shortDescription:
      "Explore blockchain technology, smart contracts, and decentralized finance.",
    price: 52000,

    level: "BEGINNER",
    category: "Finance",
    tags: ["blockchain", "cryptocurrency", "bitcoin", "ethereum", "DeFi", "smart contracts"],
    duration: 550,
    isFeatured: false,
    rating: 4.5,
    totalRatings: 380,
    totalStudents: 1650,
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Blockchain Fundamentals",
        description: "Understanding distributed ledger technology",
        lessons: [
          { title: "How Blockchain Works", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=SSo_EIwHSd4", videoType: "youtube", duration: 25, isPreview: true },
          { title: "Consensus Mechanisms", type: "TEXT", content: "Consensus mechanisms ensure all nodes agree on the blockchain state. Proof of Work (PoW) requires miners to solve cryptographic puzzles — energy-intensive but secure. Proof of Stake (PoS) selects validators based on staked tokens — more energy-efficient. Other mechanisms: Delegated PoS, Proof of Authority, Proof of History. Ethereum transitioned from PoW to PoS in 'The Merge' (2022).", duration: 25 },
          { title: "Bitcoin vs Ethereum", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=K8Y44fNn7Fw", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Smart Contracts & DApps",
        description: "Building decentralized applications on Ethereum",
        lessons: [
          { title: "Introduction to Solidity", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", videoType: "youtube", duration: 35 },
          { title: "ERC-20 Token Standard", type: "TEXT", content: "ERC-20 is the standard interface for fungible tokens on Ethereum. Key functions: totalSupply(), balanceOf(address), transfer(to, amount), approve(spender, amount), transferFrom(from, to, amount). Events: Transfer, Approval. Use OpenZeppelin's battle-tested implementations. Deploying an ERC-20 token requires gas fees and should be tested on testnets (Goerli, Sepolia) first.", duration: 30 },
          { title: "Building DApps with Web3.js", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=gyMwXuJrbJQ", videoType: "youtube", duration: 40 },
        ],
      },
      {
        title: "DeFi & Token Economics",
        description: "Decentralized finance protocols and tokenomics",
        lessons: [
          { title: "DeFi Protocols Explained", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=k9ZoUpxkEbY", videoType: "youtube", duration: 30 },
          { title: "Yield Farming & Liquidity Pools", type: "TEXT", content: "Liquidity pools are smart contracts holding token pairs that enable decentralized trading (AMMs like Uniswap). Liquidity providers (LPs) earn trading fees proportional to their share. Yield farming involves moving assets between protocols to maximize returns. Risks: impermanent loss (when pool price diverges from market price), smart contract exploits, and rug pulls. Always assess TVL (Total Value Locked) and audit status.", duration: 25 },
          { title: "Tokenomics Design Principles", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=K9ZoUpxkEbY", videoType: "youtube", duration: 25 },
        ],
      },
    ],
    quiz: {
      title: "Blockchain & Cryptocurrency Assessment",
      description: "Test your understanding of blockchain and DeFi concepts",
      timeLimit: 25,
      passingScore: 70,
      difficulty: QuestionDifficulty.EASY,
      questions: [
        {
          content: "What is the primary purpose of a blockchain?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "A blockchain is a distributed, immutable ledger that records transactions across a network of computers. Its primary purpose is to provide a trustless, transparent way to record and verify transactions without a central authority.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "To create a distributed, immutable ledger for transactions", isCorrect: true, points: 10 },
            { content: "To store files in the cloud", isCorrect: false, points: 0 },
            { content: "To replace traditional databases entirely", isCorrect: false, points: 0 },
            { content: "To mine cryptocurrencies automatically", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which consensus mechanism does Ethereum use after 'The Merge'?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "After 'The Merge' in September 2022, Ethereum transitioned from Proof of Work to Proof of Stake, reducing energy consumption by ~99.95%. Validators are chosen based on the amount of ETH they stake.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Proof of Stake (PoS)", isCorrect: true, points: 10 },
            { content: "Proof of Work (PoW)", isCorrect: false, points: 0 },
            { content: "Proof of Authority (PoA)", isCorrect: false, points: 0 },
            { content: "Delegated Proof of Stake (DPoS)", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: Impermanent loss is a risk faced by liquidity providers in DeFi pools.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when they were deposited. It's 'impermanent' because the loss only becomes permanent upon withdrawal.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the ERC-20 standard used for?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "ERC-20 defines a standard interface for fungible tokens on Ethereum. It specifies functions like transfer, balanceOf, and approve, allowing tokens to be compatible with wallets and exchanges.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "Creating fungible tokens on Ethereum", isCorrect: true, points: 10 },
            { content: "Creating non-fungible tokens (NFTs)", isCorrect: false, points: 0 },
            { content: "Mining new blocks", isCorrect: false, points: 0 },
            { content: "Running smart contract tests", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Analyze a Cryptocurrency Project",
      description: "Choose a cryptocurrency project (not Bitcoin or Ethereum) and perform a comprehensive analysis covering: technology (blockchain, consensus, smart contracts), tokenomics (supply, distribution, utility), team and governance, market position, and risk factors. Present your findings in a research report format with data-driven conclusions.",
      maxScore: 100,
    },
  },

  // ── Course 9: Mobile App Development with React Native ──
  {
    title: "Mobile App Development with React Native",
    slug: "mobile-app-development-react-native",
    description:
      "Build cross-platform mobile applications for iOS and Android using React Native and Expo. Learn navigation, state management, native APIs, and app store deployment from concept to launch.",
    shortDescription:
      "Build cross-platform mobile apps for iOS and Android with React Native.",
    price: 60000,

    level: "INTERMEDIATE",
    category: "Mobile",
    tags: ["react native", "mobile", "iOS", "Android", "Expo", "cross-platform"],
    duration: 750,
    isFeatured: true,
    rating: 4.7,
    totalRatings: 520,
    totalStudents: 2300,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
    sections: [
      {
        title: "React Native Fundamentals",
        description: "Core concepts and project setup",
        lessons: [
          { title: "React Native vs Native: When to Choose What", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=NcM7TtUphhY", videoType: "youtube", duration: 20, isPreview: true },
          { title: "Core Components & Styling", type: "TEXT", content: "React Native components map to native UI elements: View (div), Text (p), ScrollView, FlatList, TextInput, TouchableOpacity. Styles use a subset of CSS with camelCase: { backgroundColor: '#fff', padding: 16, borderRadius: 8 }. Flexbox is the default layout system with flexDirection defaulting to 'column'. Use StyleSheet.create() for performance optimization.", duration: 25 },
          { title: "Expo CLI & Project Setup", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=0Y2J0JDPWqM", videoType: "youtube", duration: 30 },
        ],
      },
      {
        title: "Navigation & State",
        description: "React Navigation and state management patterns",
        lessons: [
          { title: "React Navigation Stack & Tabs", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=nKlGR-aJfbg", videoType: "youtube", duration: 35 },
          { title: "State Management with Context & Zustand", type: "TEXT", content: "For simple state, use React's useState/useReducer with Context. For complex apps, Zustand provides a minimal API: import { create } from 'zustand'; const useStore = create(set => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) })). Zustand requires no providers and works outside components. For async state, combine with React Query or SWR for caching and refetching.", duration: 30 },
          { title: "Passing Data Between Screens", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=B6wfbqRMkFY", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Native APIs & Storage",
        description: "Access device features and persist data",
        lessons: [
          { title: "AsyncStorage & Secure Storage", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=RppL1m5kFJQ", videoType: "youtube", duration: 25 },
          { title: "Camera, Location & Permissions", type: "TEXT", content: "Expo provides APIs for device features: expo-camera for photos/video, expo-location for GPS, expo-notifications for push notifications. Always request permissions: const { status } = await ImagePicker.requestCameraPermissionsAsync(). Handle denied permissions gracefully with fallback UI. Use expo-secure-store for sensitive data (tokens, passwords) — it uses Keychain (iOS) and EncryptedSharedPreferences (Android).", duration: 30 },
          { title: "Push Notifications Setup", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=QIrbbrdM-3k", videoType: "youtube", duration: 35 },
        ],
      },
      {
        title: "Testing & Deployment",
        description: "Prepare your app for production",
        lessons: [
          { title: "Testing with Jest & React Native Testing Library", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=MY_Sggg8T7M", videoType: "youtube", duration: 30 },
          { title: "App Store Submission Guide", type: "TEXT", content: "iOS: Create an App Store Connect listing, configure provisioning profiles in Xcode, run `eas build --platform ios`, then submit via Transporter or EAS Submit. Android: Create a Play Console listing, generate a signed APK/AAB with `eas build --platform android`, upload to Play Console. Both stores require: screenshots, description, privacy policy, and age rating. Use EAS Build and EAS Submit for streamlined CI/CD.", duration: 25 },
          { title: "Performance Optimization Tips", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=B6wfbqRMkFY", videoType: "youtube", duration: 35 },
        ],
      },
    ],
    quiz: {
      title: "React Native Development Assessment",
      description: "Test your knowledge of mobile app development with React Native",
      timeLimit: 30,
      passingScore: 70,
      difficulty: QuestionDifficulty.MEDIUM,
      questions: [
        {
          content: "Which React Native component is equivalent to an HTML <div>?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "The View component is the fundamental building block in React Native, equivalent to a <div> in web development. It supports layout with flexbox and styling.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "View", isCorrect: true, points: 10 },
            { content: "Text", isCorrect: false, points: 0 },
            { content: "Container", isCorrect: false, points: 0 },
            { content: "Section", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What is the default flexDirection in React Native's flexbox layout?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "React Native defaults flexDirection to 'column', unlike CSS which defaults to 'row'. This means child elements stack vertically by default, which matches mobile UI patterns.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "column", isCorrect: true, points: 10 },
            { content: "row", isCorrect: false, points: 0 },
            { content: "column-reverse", isCorrect: false, points: 0 },
            { content: "row-reverse", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: Expo is a framework and toolchain for React Native that simplifies development and deployment.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. Expo provides a set of tools, libraries, and services built around React Native. It simplifies setup, adds access to native APIs without ejecting, and provides EAS Build/Submit for CI/CD.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which storage solution should be used for sensitive data like authentication tokens?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "expo-secure-store uses platform-native secure storage (Keychain on iOS, EncryptedSharedPreferences on Android) and should be used for sensitive data. AsyncStorage is not encrypted and should only be used for non-sensitive data.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "expo-secure-store", isCorrect: true, points: 10 },
            { content: "AsyncStorage", isCorrect: false, points: 0 },
            { content: "localStorage", isCorrect: false, points: 0 },
            { content: "SQLite", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Fill in the blank: ________ is a state management library for React Native that provides a minimal API without requiring providers.",
          type: "FILL_BLANK",
          points: 10,
          explanation: "Zustand is a lightweight state management library that works outside React components, requires no Context providers, and has a simple API using create() with selectors for efficient re-renders.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "Zustand", isCorrect: true, points: 10 },
            { content: "Redux", isCorrect: false, points: 0 },
            { content: "MobX", isCorrect: false, points: 0 },
            { content: "Recoil", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Build a Todo App",
      description: "Build a feature-complete Todo application with React Native and Expo. Requirements: add/edit/delete todos, mark as complete, filter by status (all/active/completed), persistent storage with AsyncStorage, smooth animations, and a polished UI. Include at least 3 screens. Deploy using EAS Build and submit screenshots of the working app on a simulator or device.",
      maxScore: 100,
    },
  },

  // ── Course 10: Data Analytics with Excel & SQL ──
  {
    title: "Data Analytics with Excel & SQL",
    slug: "data-analytics-excel-sql",
    description:
      "Master data analysis with Excel and SQL. Learn pivot tables, VLOOKUP, advanced formulas, SQL queries, joins, and data visualization. Turn raw data into actionable business insights.",
    shortDescription:
      "Analyze data effectively with Excel and SQL skills.",
    price: 33000,

    level: "BEGINNER",
    category: "Data",
    tags: ["data analytics", "Excel", "SQL", "database", "pivot tables", "visualization"],
    duration: 480,
    isFeatured: false,
    rating: 4.6,
    totalRatings: 410,
    totalStudents: 1900,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    sections: [
      {
        title: "Excel for Data Analysis",
        description: "Master Excel's powerful data analysis features",
        lessons: [
          { title: "Essential Excel Formulas", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=IrRhy8jDl0w", videoType: "youtube", duration: 25, isPreview: true },
          { title: "Pivot Tables & Data Summarization", type: "TEXT", content: "Pivot tables aggregate large datasets into summary reports. Create one: select your data range > Insert > Pivot Table. Drag fields to Rows, Columns, Values, and Filters areas. Use Value Field Settings to change from SUM to COUNT, AVERAGE, etc. Group dates by month/year. Add slicers for interactive filtering. Refresh pivot tables when source data changes. Recommended: use structured references with Excel Tables.", duration: 30 },
          { title: "Data Visualization with Charts", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=4R6mPcNnbV0", videoType: "youtube", duration: 20 },
        ],
      },
      {
        title: "SQL Fundamentals",
        description: "Query databases to extract insights",
        lessons: [
          { title: "SELECT, WHERE & ORDER BY", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=HXV3zeQKqGY", videoType: "youtube", duration: 30 },
          { title: "JOIN Operations", type: "TEXT", content: "JOINs combine rows from multiple tables. INNER JOIN returns matching rows in both tables. LEFT JOIN returns all rows from the left table and matching from the right. RIGHT JOIN is the opposite. FULL OUTER JOIN returns all rows from both. CROSS JOIN creates a Cartesian product. Example: SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id. Use aliases (o, c) for readability.", duration: 25 },
          { title: "GROUP BY & Aggregate Functions", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=Q2IjOzgUkQI", videoType: "youtube", duration: 25 },
        ],
      },
      {
        title: "Advanced Analytics",
        description: "Complex queries and data transformation",
        lessons: [
          { title: "Subqueries & CTEs", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=BsuZGfCzMOs", videoType: "youtube", duration: 30 },
          { title: "Window Functions", type: "TEXT", content: "Window functions perform calculations across sets of rows without collapsing them. ROW_NUMBER() assigns sequential integers. RANK() handles ties with gaps. DENSE_RANK() handles ties without gaps. SUM() OVER (PARTITION BY region ORDER BY date) creates running totals. LAG() and LEAD() access previous/next rows. Window functions are processed after WHERE but before LIMIT.", duration: 30 },
          { title: "Data Cleaning Techniques", type: "VIDEO", videoUrl: "https://www.youtube.com/watch?v=BsuZGfCzMOs", videoType: "youtube", duration: 25 },
        ],
      },
    ],
    quiz: {
      title: "Data Analytics Assessment",
      description: "Test your Excel and SQL knowledge",
      timeLimit: 25,
      passingScore: 70,
      difficulty: QuestionDifficulty.EASY,
      questions: [
        {
          content: "Which SQL JOIN returns only rows that have matching values in both tables?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "INNER JOIN returns only the rows where the join condition is met in both tables. Non-matching rows from either table are excluded from the result.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "INNER JOIN", isCorrect: true, points: 10 },
            { content: "LEFT JOIN", isCorrect: false, points: 0 },
            { content: "RIGHT JOIN", isCorrect: false, points: 0 },
            { content: "CROSS JOIN", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "What does the COUNT() aggregate function return?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "COUNT() returns the number of rows that match a specified criteria. COUNT(*) counts all rows including NULLs, COUNT(column) counts non-NULL values in that column.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "The number of rows matching a condition", isCorrect: true, points: 10 },
            { content: "The sum of all values", isCorrect: false, points: 0 },
            { content: "The average of all values", isCorrect: false, points: 0 },
            { content: "The maximum value", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "True or False: A pivot table in Excel can automatically group dates by month or year.",
          type: "TRUE_FALSE",
          points: 10,
          explanation: "True. Excel pivot tables can automatically group date fields by seconds, minutes, hours, days, months, quarters, and years. Right-click a date field in the pivot table and select 'Group' to configure.",
          difficulty: QuestionDifficulty.EASY,
          answers: [
            { content: "True", isCorrect: true, points: 10 },
            { content: "False", isCorrect: false, points: 0 },
          ],
        },
        {
          content: "Which SQL clause is used to filter groups created by GROUP BY?",
          type: "SINGLE_CHOICE",
          points: 10,
          explanation: "HAVING filters groups after aggregation (unlike WHERE which filters rows before aggregation). Example: SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 50000.",
          difficulty: QuestionDifficulty.MEDIUM,
          answers: [
            { content: "HAVING", isCorrect: true, points: 10 },
            { content: "WHERE", isCorrect: false, points: 0 },
            { content: "FILTER", isCorrect: false, points: 0 },
            { content: "GROUP", isCorrect: false, points: 0 },
          ],
        },
      ],
    },
    assignment: {
      title: "Analyze Sales Data",
      description: "Using a provided sales dataset (CSV), perform a comprehensive analysis using both Excel and SQL. In Excel: create pivot tables showing sales by region and product, build charts for trends over time, and calculate key metrics (total revenue, average order value, top products). In SQL: write queries to find top customers, monthly revenue trends, and product performance. Submit an analysis report with visualizations and key insights.",
      maxScore: 100,
    },
  },
];

// ─── Seed Logic ──────────────────────────────────────────────────────────────

async function createCourseWithContent(
  courseData: CourseData,
  instructorId: string
) {
  const course = await prisma.course.upsert({
    where: { slug: courseData.slug },
    update: {
      thumbnail: courseData.thumbnail,
    },
    create: {
      title: courseData.title,
      slug: courseData.slug,
      description: courseData.description,
      shortDescription: courseData.shortDescription,
      thumbnail: courseData.thumbnail,
      price: courseData.price,
      salePrice: courseData.salePrice,
      level: courseData.level,
      category: courseData.category,
      tags: courseData.tags,
      duration: courseData.duration,
      isFeatured: courseData.isFeatured,
      rating: courseData.rating,
      totalRatings: courseData.totalRatings,
      totalStudents: courseData.totalStudents,
      status: CourseStatus.PUBLISHED,
      instructorId,
    },
  });
  console.log(`  Course: ${course.title}`);

  // Delete existing sections, lessons, and quizzes to prevent duplicates on re-seed
  await prisma.quiz.deleteMany({ where: { courseId: course.id, lessonId: { not: null } } });
  await prisma.lesson.deleteMany({ where: { courseId: course.id } });
  await prisma.courseSection.deleteMany({ where: { courseId: course.id } });

  // Sections & Lessons
  for (let sIdx = 0; sIdx < courseData.sections.length; sIdx++) {
    const secData = courseData.sections[sIdx];
    const section = await prisma.courseSection.create({
      data: {
        title: secData.title,
        description: secData.description,
        order: sIdx,
        courseId: course.id,
      },
    });

    for (let lIdx = 0; lIdx < secData.lessons.length; lIdx++) {
      const l = secData.lessons[lIdx];
      const enrichedContent = enrichedLessons[l.title as keyof typeof enrichedLessons];
      const lesson = await prisma.lesson.create({
        data: {
          title: l.title,
          type: l.type,
          content: enrichedContent ?? l.content,
          videoUrl: l.videoUrl,
          videoType: l.videoType,
          duration: l.duration,
          isPreview: l.isPreview ?? false,
          order: lIdx,
          sectionId: section.id,
          courseId: course.id,
        },
      });

      // Create per-lesson quiz if enriched quiz data exists
      const quizData = lessonQuizzes[l.title as keyof typeof lessonQuizzes];
      if (quizData && l.type === "TEXT") {
        const lessonQuiz = await prisma.quiz.create({
          data: {
            title: quizData.title,
            description: quizData.description,
            timeLimit: quizData.timeLimit,
            passingScore: quizData.passingScore,
            maxAttempts: 3,
            isPublished: true,
            difficulty: QuestionDifficulty.MEDIUM,
            courseId: course.id,
            lessonId: lesson.id,
            points: quizData.questions.reduce((a, q) => a + q.points, 0),
          },
        });

        for (let qIdx = 0; qIdx < quizData.questions.length; qIdx++) {
          const q = quizData.questions[qIdx];
          const question = await prisma.question.create({
            data: {
              content: q.content,
              type: q.type,
              points: q.points,
              explanation: q.explanation,
              difficulty: q.difficulty.toUpperCase() as QuestionDifficulty,
              order: qIdx,
              quizId: lessonQuiz.id,
            },
          });

          await prisma.answer.createMany({
            data: q.answers.map((a, aIdx) => ({
              content: a.content,
              isCorrect: a.isCorrect,
              points: a.isCorrect ? q.points : 0,
              order: aIdx,
              questionId: question.id,
            })),
          });
        }
      }
    }
  }
  console.log(
    `    ${courseData.sections.length} sections, ${courseData.sections.reduce((a, s) => a + s.lessons.length, 0)} lessons`
  );

  // Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: courseData.quiz.title,
      description: courseData.quiz.description,
      timeLimit: courseData.quiz.timeLimit,
      passingScore: courseData.quiz.passingScore,
      maxAttempts: 3,
      isPublished: true,
      difficulty: courseData.quiz.difficulty,
      courseId: course.id,
      points: courseData.quiz.questions.reduce((a, q) => a + q.points, 0),
    },
  });

  for (let qIdx = 0; qIdx < courseData.quiz.questions.length; qIdx++) {
    const qData = courseData.quiz.questions[qIdx];
    const question = await prisma.question.create({
      data: {
        content: qData.content,
        type: qData.type,
        points: qData.points,
        explanation: qData.explanation,
        difficulty: qData.difficulty,
        order: qIdx,
        quizId: quiz.id,
      },
    });

    await prisma.answer.createMany({
      data: qData.answers.map((a, aIdx) => ({
        content: a.content,
        isCorrect: a.isCorrect,
        points: a.isCorrect ? a.points : 0,
        order: aIdx,
        questionId: question.id,
      })),
    });
  }
  console.log(
    `    Quiz: ${courseData.quiz.questions.length} questions`
  );

  return course;
}

async function createLiveClasses(instructors: any[], courses: any[]) {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  threeDaysFromNow.setHours(14, 0, 0, 0);

  const instructor = instructors[0];
  const course = courses[0];

  await prisma.liveClass.upsert({
    where: { id: "demo-live-class-1" },
    update: {},
    create: {
      id: "demo-live-class-1",
      title: "Advanced Web Development Masterclass",
      description: "Join this interactive live session covering advanced React patterns, performance optimization, and real-world architecture decisions. Perfect for intermediate to advanced developers looking to level up their skills.",
      platform: "GOOGLE_MEET",
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      scheduledAt: threeDaysFromNow,
      duration: 90,
      isRecorded: true,
      instructorId: instructor.id,
      courseId: course.id,
    },
  });

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  sevenDaysFromNow.setHours(10, 0, 0, 0);

  await prisma.liveClass.upsert({
    where: { id: "demo-live-class-2" },
    update: {},
    create: {
      id: "demo-live-class-2",
      title: "Data Science Workshop: Hands-on with Python",
      description: "A practical workshop on data analysis using Python, Pandas, and Matplotlib. Bring your laptop and follow along with real datasets!",
      platform: "GOOGLE_MEET",
      meetingUrl: "https://meet.google.com/xyz-uvwx-rst",
      scheduledAt: sevenDaysFromNow,
      duration: 120,
      isRecorded: true,
      instructorId: instructors.length > 1 ? instructors[1].id : instructor.id,
      courseId: courses.length > 1 ? courses[1].id : course.id,
    },
  });

  console.log("  Created 2 live classes");
}

async function main() {
  console.log("=== SmartLMS Database Seed ===\n");

  // 1. Create Users
  console.log("--- Creating Users ---");
  const users = await createUsers();
  const { admin, instructor1, instructor2, student1, student2 } = users;

  // 2. Create Courses
  console.log("\n--- Creating Courses ---");
  const instructor1Courses: string[] = [];
  const instructor2Courses: string[] = [];

  for (let i = 0; i < coursesData.length; i++) {
    const instructor = i < 5 ? instructor1 : instructor2;
    const course = await createCourseWithContent(coursesData[i], instructor.id);
    if (i < 5) {
      instructor1Courses.push(course.id);
    } else {
      instructor2Courses.push(course.id);
    }
  }

  // 3. Enrollments
  console.log("\n--- Creating Enrollments ---");
  const allCourses = await prisma.course.findMany();
  const courseMap = new Map(allCourses.map(c => [c.slug, c]));

  // 2b. Live Classes
  console.log("\n--- Creating Live Classes ---");
  await createLiveClasses([instructor1, instructor2], allCourses);

  const enrollments = [
    // student1 enrolled in courses 1-5
    { userId: student1.id, slug: "complete-web-development-bootcamp", progress: 75, status: EnrollmentStatus.ACTIVE },
    { userId: student1.id, slug: "machine-learning-ai-masterclass", progress: 45, status: EnrollmentStatus.ACTIVE },
    { userId: student1.id, slug: "digital-marketing-mastery", progress: 100, status: EnrollmentStatus.COMPLETED },
    { userId: student1.id, slug: "advanced-python-programming", progress: 30, status: EnrollmentStatus.ACTIVE },
    { userId: student1.id, slug: "ui-ux-design-fundamentals", progress: 60, status: EnrollmentStatus.ACTIVE },
    // student2 enrolled in courses 6-10
    { userId: student2.id, slug: "cybersecurity-essentials", progress: 80, status: EnrollmentStatus.ACTIVE },
    { userId: student2.id, slug: "cloud-computing-with-aws", progress: 55, status: EnrollmentStatus.ACTIVE },
    { userId: student2.id, slug: "blockchain-cryptocurrency", progress: 100, status: EnrollmentStatus.COMPLETED },
    { userId: student2.id, slug: "mobile-app-development-react-native", progress: 40, status: EnrollmentStatus.ACTIVE },
    { userId: student2.id, slug: "data-analytics-excel-sql", progress: 90, status: EnrollmentStatus.ACTIVE },
    // cross-enrollments
    { userId: student1.id, slug: "cybersecurity-essentials", progress: 20, status: EnrollmentStatus.ACTIVE },
    { userId: student2.id, slug: "complete-web-development-bootcamp", progress: 35, status: EnrollmentStatus.ACTIVE },
  ];

  for (const e of enrollments) {
    const course = courseMap.get(e.slug);
    if (!course) continue;
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: e.userId, courseId: course.id } },
      update: { progress: e.progress, status: e.status },
      create: {
        userId: e.userId,
        courseId: course.id,
        progress: e.progress,
        status: e.status,
        completedAt: e.status === EnrollmentStatus.COMPLETED ? new Date() : null,
      },
    });
  }
  console.log(`  Created ${enrollments.length} enrollments`);

  // 3b. Assignment Submissions
  console.log("\n--- Creating Assignment Submissions ---");
  const assignmentData = [
    { userId: student1.id, slug: "complete-web-development-bootcamp", title: "Build a Portfolio Website", description: "Create a personal portfolio website using HTML, CSS, and JavaScript", maxScore: 100, score: 92, feedback: "Excellent work on the responsive design!" },
    { userId: student1.id, slug: "digital-marketing-mastery", title: "Create a Marketing Plan", description: "Develop a comprehensive digital marketing plan for a small business", maxScore: 100, score: 88, feedback: "Great analysis and strategy." },
    { userId: student2.id, slug: "cybersecurity-essentials", title: "Vulnerability Assessment Report", description: "Conduct a vulnerability assessment and write a detailed report", maxScore: 100, score: 95, feedback: "Thorough and professional report." },
    { userId: student2.id, slug: "blockchain-cryptocurrency", title: "Analyze a Cryptocurrency Project", description: "Write an analysis of a cryptocurrency project including team, technology, and market potential", maxScore: 100, score: 85, feedback: "Good research and insights." },
  ];

  for (const a of assignmentData) {
    const course = courseMap.get(a.slug);
    if (!course) continue;
    await prisma.assignment.create({
      data: {
        userId: a.userId,
        title: a.title,
        description: a.description,
        maxScore: a.maxScore,
        score: a.score,
        feedback: a.feedback,
        status: "GRADED",
        gradedAt: new Date(),
      },
    });
  }
  console.log(`  Created ${assignmentData.length} assignment submissions`);

  // 4. Quiz Attempts
  console.log("\n--- Creating Quiz Attempts ---");
  const quizzes = await prisma.quiz.findMany();
  const quizAttempts = [
    { userId: student1.id, quizSlug: "complete-web-development-bootcamp", score: 40, totalPoints: 50, passed: true, timeTaken: 1200 },
    { userId: student1.id, quizSlug: "digital-marketing-mastery", score: 35, totalPoints: 40, passed: true, timeTaken: 900 },
    { userId: student2.id, quizSlug: "cybersecurity-essentials", score: 45, totalPoints: 50, passed: true, timeTaken: 1500 },
    { userId: student2.id, quizSlug: "blockchain-cryptocurrency", score: 30, totalPoints: 40, passed: true, timeTaken: 800 },
    { userId: student1.id, quizSlug: "ui-ux-design-fundamentals", score: 25, totalPoints: 40, passed: false, timeTaken: 1400 },
    { userId: student2.id, quizSlug: "data-analytics-excel-sql", score: 38, totalPoints: 40, passed: true, timeTaken: 750 },
  ];

  for (const attempt of quizAttempts) {
    const quiz = quizzes.find(q =>
      coursesData.some(c => c.slug === attempt.quizSlug && c.quiz.title === q.title)
    );
    if (!quiz) continue;

    await prisma.quizAttempt.create({
      data: {
        userId: attempt.userId,
        quizId: quiz.id,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        passed: attempt.passed,
        timeTaken: attempt.timeTaken,
        startedAt: new Date(Date.now() - 86400000 * 7),
        completedAt: new Date(Date.now() - 86400000 * 6),
        answers: {
          responses: Array.from({ length: 5 }, (_, i) => ({
            questionIndex: i,
            selectedAnswer: i < 4 ? 0 : 1,
            isCorrect: i < 4,
          })),
        },
      },
    });
  }
  console.log(`  Created ${quizAttempts.length} quiz attempts`);

  // 5. Certificates
  console.log("\n--- Creating Certificates ---");
  const certificates = [
    { userId: student1.id, slug: "digital-marketing-mastery", title: "Certificate of Completion - Digital Marketing Mastery", certId: "SLMS-DMA-2024-001" },
    { userId: student2.id, slug: "blockchain-cryptocurrency", title: "Certificate of Completion - Blockchain & Cryptocurrency", certId: "SLMS-BLK-2024-002" },
    { userId: student1.id, slug: "complete-web-development-bootcamp", title: "Certificate of Completion - Web Development Bootcamp", certId: "SLMS-WDB-2024-003" },
  ];

  for (const cert of certificates) {
    const course = courseMap.get(cert.slug);
    if (!course) continue;

    await prisma.certificate.upsert({
      where: { certificateId: cert.certId },
      update: {},
      create: {
        userId: cert.userId,
        courseId: course.id,
        title: cert.title,
        certificateId: cert.certId,
        status: CertificateStatus.ACTIVE,
        issuedAt: new Date(Date.now() - 86400000 * 30),
        qrCode: `https://smartlms.com/verify/${cert.certId}`,
      },
    });
  }
  console.log(`  Created ${certificates.length} certificates`);

  // 6. Reviews
  console.log("\n--- Creating Reviews ---");
  const reviews = [
    { userId: student1.id, slug: "complete-web-development-bootcamp", rating: 5, comment: "Excellent course! Dr. Johnson explains complex concepts clearly. The hands-on projects really solidified my understanding of full-stack development." },
    { userId: student1.id, slug: "digital-marketing-mastery", rating: 5, comment: "Very practical and actionable. I implemented the SEO strategies and saw a 40% increase in organic traffic within a month." },
    { userId: student1.id, slug: "advanced-python-programming", rating: 4, comment: "Great deep dive into advanced Python. The metaclasses section was challenging but incredibly informative." },
    { userId: student2.id, slug: "cybersecurity-essentials", rating: 5, comment: "The hands-on labs with Nmap and vulnerability scanning were fantastic. Real-world skills you can apply immediately." },
    { userId: student2.id, slug: "cloud-computing-with-aws", rating: 4, comment: "Comprehensive coverage of AWS services. Would love more coverage of serverless patterns in future updates." },
    { userId: student2.id, slug: "blockchain-cryptocurrency", rating: 4, comment: "Great introduction to blockchain and DeFi. The smart contracts section was particularly well-structured." },
    { userId: student1.id, slug: "ui-ux-design-fundamentals", rating: 5, comment: "Transformed how I think about design. The Figma prototyping lessons were incredibly practical." },
    { userId: student2.id, slug: "data-analytics-excel-sql", rating: 5, comment: "Perfect for beginners. The SQL JOIN explanations finally made everything click for me." },
  ];

  for (const review of reviews) {
    const course = courseMap.get(review.slug);
    if (!course) continue;

    await prisma.review.upsert({
      where: { userId_courseId: { userId: review.userId, courseId: course.id } },
      update: {},
      create: {
        userId: review.userId,
        courseId: course.id,
        rating: review.rating,
        comment: review.comment,
      },
    });
  }
  console.log(`  Created ${reviews.length} reviews`);

  // 7. Assignments (student submissions)
  console.log("\n--- Creating Assignment Submissions ---");
  const assignmentSubmissions = [
    { userId: student1.id, slug: "complete-web-development-bootcamp", title: "Build a Portfolio Website", score: 92, feedback: "Excellent work! Great responsive design and semantic HTML usage. Minor CSS improvements suggested." },
    { userId: student1.id, slug: "digital-marketing-mastery", title: "Create a Marketing Plan", score: 88, feedback: "Solid marketing plan with clear KPIs. The SEO section could use more keyword research depth." },
    { userId: student2.id, slug: "cybersecurity-essentials", title: "Vulnerability Assessment Report", score: 95, feedback: "Thorough and professional report. Good use of CVSS scoring and clear remediation steps." },
    { userId: student2.id, slug: "blockchain-cryptocurrency", title: "Analyze a Cryptocurrency Project", score: 85, feedback: "Well-researched analysis. Good tokenomics breakdown but could include more risk assessment." },
    { userId: student1.id, slug: "advanced-python-programming", title: "Build a REST API", score: 90, feedback: "Clean, well-documented API with proper error handling. Great use of FastAPI and async patterns." },
    { userId: student2.id, slug: "data-analytics-excel-sql", title: "Analyze Sales Data", score: 87, feedback: "Strong SQL queries and insightful Excel visualizations. Good summary of key business insights." },
  ];

  for (const sub of assignmentSubmissions) {
    const course = courseMap.get(sub.slug);
    if (!course) continue;

    const lastLesson = await prisma.lesson.findFirst({
      where: { courseId: course.id },
      orderBy: { order: "desc" },
    });

    await prisma.assignment.create({
      data: {
        userId: sub.userId,
        title: sub.title,
        description: `${sub.title} submission for ${course.title}`,
        content: `Submitted work for: ${sub.title}`,
        score: sub.score,
        maxScore: 100,
        feedback: sub.feedback,
        status: "GRADED",
        submittedAt: new Date(Date.now() - 86400000 * 14),
        gradedAt: new Date(Date.now() - 86400000 * 12),
        lessonId: lastLesson?.id,
      },
    });
  }
  console.log(`  Created ${assignmentSubmissions.length} assignment submissions`);

  // 8. Grades
  console.log("\n--- Creating Grades ---");
  const gradeData = [
    { userId: student1.id, score: 40, totalPoints: 50, percentage: 80, letterGrade: "B+", type: "QUIZ" },
    { userId: student1.id, score: 92, totalPoints: 100, percentage: 92, letterGrade: "A-", type: "ASSIGNMENT" },
    { userId: student1.id, score: 35, totalPoints: 40, percentage: 87.5, letterGrade: "B+", type: "QUIZ" },
    { userId: student2.id, score: 45, totalPoints: 50, percentage: 90, letterGrade: "A-", type: "QUIZ" },
    { userId: student2.id, score: 95, totalPoints: 100, percentage: 95, letterGrade: "A", type: "ASSIGNMENT" },
    { userId: student2.id, score: 30, totalPoints: 40, percentage: 75, letterGrade: "B", type: "QUIZ" },
    { userId: student2.id, score: 87, totalPoints: 100, percentage: 87, letterGrade: "B+", type: "ASSIGNMENT" },
  ];

  for (const g of gradeData) {
    await prisma.grade.create({
      data: {
        userId: g.userId,
        score: g.score,
        totalPoints: g.totalPoints,
        percentage: g.percentage,
        letterGrade: g.letterGrade,
        type: g.type,
      },
    });
  }
  console.log(`  Created ${gradeData.length} grades`);

  // 9. Purchases
  console.log("\n--- Creating Purchases ---");
  const purchaseData = [
    { userId: student1.id, slug: "complete-web-development-bootcamp", amount: 45000 },
    { userId: student1.id, slug: "machine-learning-ai-masterclass", amount: 55000 },
    { userId: student1.id, slug: "digital-marketing-mastery", amount: 38000 },
    { userId: student1.id, slug: "advanced-python-programming", amount: 55000 },
    { userId: student1.id, slug: "ui-ux-design-fundamentals", amount: 42000 },
    { userId: student2.id, slug: "cybersecurity-essentials", amount: 65000 },
    { userId: student2.id, slug: "cloud-computing-with-aws", amount: 72000 },
    { userId: student2.id, slug: "blockchain-cryptocurrency", amount: 52000 },
    { userId: student2.id, slug: "mobile-app-development-react-native", amount: 62000 },
    { userId: student2.id, slug: "data-analytics-excel-sql", amount: 32000 },
  ];

  for (const p of purchaseData) {
    const course = courseMap.get(p.slug);
    if (!course) continue;

    await prisma.purchase.create({
      data: {
        userId: p.userId,
        courseId: course.id,
        amount: p.amount,
        currency: "NGN",
        status: PaymentStatus.COMPLETED,
        paymentMethod: "card",
        stripePaymentId: `pi_demo_${Math.random().toString(36).substring(2, 15)}`,
      },
    });
  }
  console.log(`  Created ${purchaseData.length} purchases`);

  // Summary
  console.log("\n=== Seed Summary ===");
  console.log(`Users:         5 (admin, 2 instructors, 2 students)`);
  console.log(`Courses:       ${coursesData.length}`);
  console.log(`Sections:      ${coursesData.reduce((a, c) => a + c.sections.length, 0)}`);
  console.log(`Lessons:       ${coursesData.reduce((a, c) => a + c.sections.reduce((b, s) => b + s.lessons.length, 0), 0)}`);
  console.log(`Quizzes:       ${coursesData.length}`);
  console.log(`Questions:     ${coursesData.reduce((a, c) => a + c.quiz.questions.length, 0)}`);
  console.log(`Enrollments:   ${enrollments.length}`);
  console.log(`Quiz Attempts: ${quizAttempts.length}`);
  console.log(`Certificates:  ${certificates.length}`);
  console.log(`Reviews:       ${reviews.length}`);
  console.log(`Assignments:   ${assignmentSubmissions.length}`);
  console.log(`Grades:        ${gradeData.length}`);
  console.log(`Purchases:     ${purchaseData.length}`);
  console.log("\n--- Demo Credentials ---");
  console.log("Admin:       admin@smartlms.com / password123");
  console.log("Instructor1: instructor1@smartlms.com / password123");
  console.log("Instructor2: instructor2@smartlms.com / password123");
  console.log("Student1:    student1@smartlms.com / password123");
  console.log("Student2:    student2@smartlms.com / password123");
  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
