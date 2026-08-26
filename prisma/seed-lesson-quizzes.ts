import prisma from "../src/lib/prisma";
import { QuestionDifficulty } from "@prisma/client";

interface AnswerData {
  content: string;
  isCorrect: boolean;
}

interface QuestionData {
  content: string;
  type: string;
  explanation: string;
  difficulty: QuestionDifficulty;
  answers: AnswerData[];
}

const quizContentByTitle: Record<string, QuestionData[]> = {
  "Introduction to HTML5": [
    {
      content: "Which HTML5 element is used to define the main content area of a document?",
      type: "SINGLE_CHOICE",
      explanation: "The <main> element specifies the main content of a document.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "<main>", isCorrect: true },
        { content: "<body>", isCorrect: false },
        { content: "<section>", isCorrect: false },
        { content: "<content>", isCorrect: false },
      ],
    },
    {
      content: "Which of the following is NOT a valid HTML5 input type?",
      type: "SINGLE_CHOICE",
      explanation: "HTML5 introduced new input types like email, date, range, and color. request is not valid.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "request", isCorrect: true },
        { content: "email", isCorrect: false },
        { content: "date", isCorrect: false },
        { content: "range", isCorrect: false },
      ],
    },
    {
      content: "True or False: HTML5 replaced the need for plugins like Flash for multimedia content.",
      type: "TRUE_FALSE",
      explanation: "True. HTML5 introduced native <audio> and <video> elements.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The HTML5 ________ element is used to embed vector graphics directly into the document.",
      type: "FILL_IN_BLANK",
      explanation: "The <svg> element allows embedding SVG graphics inline in HTML.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "svg", isCorrect: true },
        { content: "canvas", isCorrect: false },
        { content: "vector", isCorrect: false },
      ],
    },
  ],
  "Semantic HTML Elements": [
    {
      content: "Which semantic HTML element is used to define navigation links?",
      type: "SINGLE_CHOICE",
      explanation: "The <nav> element represents a section of navigation links.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "<nav>", isCorrect: true },
        { content: "<menu>", isCorrect: false },
        { content: "<links>", isCorrect: false },
        { content: "<navigation>", isCorrect: false },
      ],
    },
    {
      content: "What is the primary benefit of using semantic HTML elements over generic <div> elements?",
      type: "SINGLE_CHOICE",
      explanation: "Semantic elements improve accessibility, SEO, and code readability.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "They improve accessibility, SEO, and code readability", isCorrect: true },
        { content: "They load faster in the browser", isCorrect: false },
        { content: "They require less CSS styling", isCorrect: false },
        { content: "They are automatically responsive", isCorrect: false },
      ],
    },
    {
      content: "True or False: The <article> element should only be used for blog posts.",
      type: "TRUE_FALSE",
      explanation: "False. The <article> element represents self-contained content that could be distributed independently.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ element represents self-contained content that is independently distributable.",
      type: "FILL_IN_BLANK",
      explanation: "The <article> element represents content that makes sense on its own.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "article", isCorrect: true },
        { content: "section", isCorrect: false },
        { content: "div", isCorrect: false },
      ],
    },
  ],
  "CSS Flexbox & Grid Layout": [
    {
      content: "Which CSS property is used to define the main axis direction in Flexbox?",
      type: "SINGLE_CHOICE",
      explanation: "The flex-direction property defines the main axis along which flex items are placed.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "flex-direction", isCorrect: true },
        { content: "flex-axis", isCorrect: false },
        { content: "direction", isCorrect: false },
        { content: "flex-flow", isCorrect: false },
      ],
    },
    {
      content: "Which CSS Grid property is used to define the number and size of columns?",
      type: "SINGLE_CHOICE",
      explanation: "The grid-template-columns property defines the number and width of columns in a CSS Grid container.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "grid-template-columns", isCorrect: true },
        { content: "grid-columns", isCorrect: false },
        { content: "grid-layout", isCorrect: false },
        { content: "column-template", isCorrect: false },
      ],
    },
    {
      content: "True or False: Flexbox is a one-dimensional layout system while CSS Grid is two-dimensional.",
      type: "TRUE_FALSE",
      explanation: "True. Flexbox handles layout in one dimension, while CSS Grid controls both rows and columns.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The CSS property ________ is used to align items along the cross axis in Flexbox.",
      type: "FILL_IN_BLANK",
      explanation: "The align-items property aligns flex items along the cross axis.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "align-items", isCorrect: true },
        { content: "justify-content", isCorrect: false },
        { content: "cross-align", isCorrect: false },
      ],
    },
  ],
  "Variables, Types & Functions": [
    {
      content: "Which keyword creates a block-scoped variable in JavaScript that can be reassigned?",
      type: "SINGLE_CHOICE",
      explanation: "The let keyword creates a block-scoped variable that can be reassigned.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "let", isCorrect: true },
        { content: "var", isCorrect: false },
        { content: "define", isCorrect: false },
        { content: "set", isCorrect: false },
      ],
    },
    {
      content: "What does the typeof operator return for an array in JavaScript?",
      type: "SINGLE_CHOICE",
      explanation: "typeof [] returns object. Arrays are technically objects in JavaScript.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "object", isCorrect: true },
        { content: "array", isCorrect: false },
        { content: "list", isCorrect: false },
        { content: "undefined", isCorrect: false },
      ],
    },
    {
      content: "True or False: In JavaScript, functions are first-class objects and can be passed as arguments.",
      type: "TRUE_FALSE",
      explanation: "True. JavaScript treats functions as first-class objects.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The JavaScript ________ operator safely accesses nested object properties without throwing an error.",
      type: "FILL_IN_BLANK",
      explanation: "The optional chaining operator (?.) returns undefined if a property is null or undefined.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "?.", isCorrect: true },
        { content: "??", isCorrect: false },
        { content: "||", isCorrect: false },
      ],
    },
  ],
  "DOM Manipulation": [
    {
      content: "Which method selects a single element by its CSS selector?",
      type: "SINGLE_CHOICE",
      explanation: "document.querySelector() accepts any CSS selector.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "document.querySelector()", isCorrect: true },
        { content: "document.getElementByClass()", isCorrect: false },
        { content: "document.selectClass()", isCorrect: false },
        { content: "document.findByClass()", isCorrect: false },
      ],
    },
    {
      content: "What is the correct way to change the text content of an element using vanilla JavaScript?",
      type: "SINGLE_CHOICE",
      explanation: "The textContent property directly sets or returns the text content of a node.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "element.textContent = 'New text'", isCorrect: true },
        { content: "element.setText('New text')", isCorrect: false },
        { content: "element.text = 'New text'", isCorrect: false },
        { content: "element.innerText = 'New text'", isCorrect: false },
      ],
    },
    {
      content: "True or False: querySelector() returns a live NodeList that automatically updates when the DOM changes.",
      type: "TRUE_FALSE",
      explanation: "False. querySelector() returns a static NodeList.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: To create a new HTML element and add it to the DOM, you use document.createElement() followed by ________.",
      type: "FILL_IN_BLANK",
      explanation: "After creating an element, use appendChild(), prepend(), or insertBefore() to add it to the DOM.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "appendChild()", isCorrect: true },
        { content: "addNode()", isCorrect: false },
        { content: "insert()", isCorrect: false },
      ],
    },
  ],
  "ES6+ Features & Arrow Functions": [
    {
      content: "What is the correct syntax for an arrow function that takes one parameter and returns a value?",
      type: "SINGLE_CHOICE",
      explanation: "Arrow functions with a single parameter do not need parentheses.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "const fn = x => x * 2", isCorrect: true },
        { content: "const fn = -> x * 2", isCorrect: false },
        { content: "const fn = (x) -> x * 2", isCorrect: false },
        { content: "const fn = => x * 2", isCorrect: false },
      ],
    },
    {
      content: "What does the spread operator (...) do in JavaScript?",
      type: "SINGLE_CHOICE",
      explanation: "The spread operator expands an iterable into individual elements.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Expands an iterable into individual elements", isCorrect: true },
        { content: "Compresses multiple values into an array", isCorrect: false },
        { content: "Creates a new variable reference", isCorrect: false },
        { content: "Removes properties from an object", isCorrect: false },
      ],
    },
    {
      content: "True or False: Template literals in JavaScript use single quotes for interpolation.",
      type: "TRUE_FALSE",
      explanation: "False. Template literals use backticks for string interpolation.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Destructuring assignment in JavaScript allows you to extract values from objects using ________.",
      type: "FILL_IN_BLANK",
      explanation: "Destructuring uses curly braces or square brackets to extract values.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "curly braces or square brackets", isCorrect: true },
        { content: "parentheses", isCorrect: false },
        { content: "dot notation", isCorrect: false },
      ],
    },
  ],
  "Components & JSX": [
    {
      content: "What must a React component return to render content?",
      type: "SINGLE_CHOICE",
      explanation: "React components must return JSX or null/false to render nothing.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "JSX markup", isCorrect: true },
        { content: "A CSS class", isCorrect: false },
        { content: "An HTML string", isCorrect: false },
        { content: "A DOM element", isCorrect: false },
      ],
    },
    {
      content: "How do you embed a JavaScript expression inside JSX?",
      type: "SINGLE_CHOICE",
      explanation: "Curly braces {} inside JSX allow embedding any valid JavaScript expression.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Using curly braces {}", isCorrect: true },
        { content: "Using double brackets [[]]", isCorrect: false },
        { content: "Using parentheses (())", isCorrect: false },
        { content: "Using percent signs %%", isCorrect: false },
      ],
    },
    {
      content: "True or False: React components must always start with an uppercase letter.",
      type: "TRUE_FALSE",
      explanation: "True. React treats lowercase tags as native HTML elements and uppercase tags as custom components.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In React, ________ is the entry point for rendering a React app into the DOM.",
      type: "FILL_IN_BLANK",
      explanation: "ReactDOM.createRoot() in React 18+ is used to render a React component tree.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "ReactDOM.createRoot()", isCorrect: true },
        { content: "React.mount()", isCorrect: false },
        { content: "React.render()", isCorrect: false },
      ],
    },
  ],
  "State & Props Management": [
    {
      content: "What is the correct way to update state in React using the useState hook?",
      type: "SINGLE_CHOICE",
      explanation: "Always use the setter function returned by useState to update state.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "setCount(count + 1)", isCorrect: true },
        { content: "this.state.count = count + 1", isCorrect: false },
        { content: "count = count + 1", isCorrect: false },
        { content: "state.count++", isCorrect: false },
      ],
    },
    {
      content: "What problem does the Context API solve in React?",
      type: "SINGLE_CHOICE",
      explanation: "Context API eliminates prop drilling through deeply nested components.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "It eliminates prop drilling through deeply nested components", isCorrect: true },
        { content: "It replaces the need for useState", isCorrect: false },
        { content: "It manages CSS styles globally", isCorrect: false },
        { content: "It handles HTTP requests", isCorrect: false },
      ],
    },
    {
      content: "True or False: State in React should always be treated as immutable.",
      type: "TRUE_FALSE",
      explanation: "True. React detects state changes by comparing references. Always create new objects when updating state.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ hook is used when state logic is complex and involves multiple sub-values.",
      type: "FILL_IN_BLANK",
      explanation: "useReducer is an alternative to useState for complex state logic.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "useReducer", isCorrect: true },
        { content: "useState", isCorrect: false },
        { content: "useContext", isCorrect: false },
      ],
    },
  ],
  "React Hooks Deep Dive": [
    {
      content: "What does the useEffect hook do in React?",
      type: "SINGLE_CHOICE",
      explanation: "useEffect lets you perform side effects in functional components.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Performs side effects like data fetching and subscriptions", isCorrect: true },
        { content: "Manages component state", isCorrect: false },
        { content: "Creates ref objects", isCorrect: false },
        { content: "Memoizes expensive calculations", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of the dependency array in useEffect?",
      type: "SINGLE_CHOICE",
      explanation: "The dependency array tells useEffect when to re-run the effect.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Controls when the effect re-runs based on value changes", isCorrect: true },
        { content: "Stores the effect local variables", isCorrect: false },
        { content: "Defines which props to receive", isCorrect: false },
        { content: "Sets the effect priority level", isCorrect: false },
      ],
    },
    {
      content: "True or False: Custom hooks in React must start with the word use.",
      type: "TRUE_FALSE",
      explanation: "True. The naming convention ensures React can check for rules of hooks violations.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ hook creates a mutable ref object whose .current property persists across renders.",
      type: "FILL_IN_BLANK",
      explanation: "useRef returns a mutable ref object that persists for the life of the component.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "useRef", isCorrect: true },
        { content: "useState", isCorrect: false },
        { content: "useMemo", isCorrect: false },
      ],
    },
  ],
  "Express.js Fundamentals": [
    {
      content: "What is the correct way to define a GET route in Express.js?",
      type: "SINGLE_CHOICE",
      explanation: "Express uses app.METHOD() to define routes.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "app.get('/path', (req, res) => {})", isCorrect: true },
        { content: "app.route('GET', '/path', handler)", isCorrect: false },
        { content: "app.define('GET', '/path', handler)", isCorrect: false },
        { content: "app.create('GET', '/path', handler)", isCorrect: false },
      ],
    },
    {
      content: "What does the next parameter do in Express middleware?",
      type: "SINGLE_CHOICE",
      explanation: "Calling next() passes control to the next middleware function in the stack.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Passes control to the next middleware function", isCorrect: true },
        { content: "Goes to the next route in the router", isCorrect: false },
        { content: "Sends the response to the client", isCorrect: false },
        { content: "Logs the request to the console", isCorrect: false },
      ],
    },
    {
      content: "True or False: Express middleware functions are executed in the order they are defined.",
      type: "TRUE_FALSE",
      explanation: "True. Express executes middleware in the order they are added via app.use().",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In Express, ________ is used to parse incoming request bodies in JSON format.",
      type: "FILL_IN_BLANK",
      explanation: "express.json() is middleware that parses incoming JSON request bodies.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "express.json()", isCorrect: true },
        { content: "express.parse()", isCorrect: false },
        { content: "express.body()", isCorrect: false },
      ],
    },
  ],
  "RESTful API Design": [
    {
      content: "Which HTTP status code indicates that a resource was successfully created?",
      type: "SINGLE_CHOICE",
      explanation: "201 Created is returned when a request results in a new resource being created.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "201", isCorrect: true },
        { content: "200", isCorrect: false },
        { content: "204", isCorrect: false },
        { content: "301", isCorrect: false },
      ],
    },
    {
      content: "Which HTTP method should be used to update an existing resource in a RESTful API?",
      type: "SINGLE_CHOICE",
      explanation: "PUT replaces an entire resource, while PATCH partially updates it.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "PUT or PATCH", isCorrect: true },
        { content: "POST", isCorrect: false },
        { content: "GET", isCorrect: false },
        { content: "DELETE", isCorrect: false },
      ],
    },
    {
      content: "True or False: RESTful APIs should always use versioning in the URL path.",
      type: "TRUE_FALSE",
      explanation: "True. URL versioning allows backward compatibility.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The HTTP status code ________ indicates that the requested resource could not be found.",
      type: "FILL_IN_BLANK",
      explanation: "404 Not Found is returned when the server cannot find the requested resource.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "404", isCorrect: true },
        { content: "500", isCorrect: false },
        { content: "403", isCorrect: false },
      ],
    },
  ],
  "Database Integration with MongoDB": [
    {
      content: "What type of database is MongoDB?",
      type: "SINGLE_CHOICE",
      explanation: "MongoDB is a document-oriented NoSQL database that stores data in BSON documents.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Document-oriented NoSQL database", isCorrect: true },
        { content: "Relational SQL database", isCorrect: false },
        { content: "Key-value store", isCorrect: false },
        { content: "Graph database", isCorrect: false },
      ],
    },
    {
      content: "Which MongoDB method is used to insert a single document into a collection?",
      type: "SINGLE_CHOICE",
      explanation: "insertOne() inserts a single document into a collection.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "insertOne()", isCorrect: true },
        { content: "create()", isCorrect: false },
        { content: "add()", isCorrect: false },
        { content: "save()", isCorrect: false },
      ],
    },
    {
      content: "True or False: MongoDB automatically creates indexes on the _id field.",
      type: "TRUE_FALSE",
      explanation: "True. MongoDB automatically creates a unique index on the _id field.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In MongoDB, ________ is used to query documents based on pattern matching with regular expressions.",
      type: "FILL_IN_BLANK",
      explanation: "MongoDB supports regular expressions for pattern matching using the  operator.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "", isCorrect: true },
        { content: "", isCorrect: false },
        { content: "", isCorrect: false },
      ],
    },
  ],
  "What is Machine Learning?": [
    {
      content: "Which type of machine learning involves training models on labeled data?",
      type: "SINGLE_CHOICE",
      explanation: "Supervised learning uses labeled input-output pairs to train models.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Supervised Learning", isCorrect: true },
        { content: "Unsupervised Learning", isCorrect: false },
        { content: "Reinforcement Learning", isCorrect: false },
        { content: "Self-Supervised Learning", isCorrect: false },
      ],
    },
    {
      content: "What is the primary goal of a classification algorithm?",
      type: "SINGLE_CHOICE",
      explanation: "Classification predicts discrete labels or categories for input data.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To assign input data to predefined categories or classes", isCorrect: true },
        { content: "To predict continuous numerical values", isCorrect: false },
        { content: "To group similar data points together", isCorrect: false },
        { content: "To reduce the dimensionality of data", isCorrect: false },
      ],
    },
    {
      content: "True or False: Machine learning models improve their performance without being explicitly programmed.",
      type: "TRUE_FALSE",
      explanation: "True. ML systems learn and improve from experience (data).",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The process of dividing data into training and ________ sets is essential for evaluating model performance.",
      type: "FILL_IN_BLANK",
      explanation: "Train-test split divides data so the model is evaluated on unseen data.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "test", isCorrect: true },
        { content: "validation", isCorrect: false },
        { content: "training", isCorrect: false },
      ],
    },
  ],
  "Linear Algebra for ML": [
    {
      content: "What does the dot product of two vectors represent geometrically?",
      type: "SINGLE_CHOICE",
      explanation: "The dot product equals the product of the vectors magnitudes and the cosine of the angle between them.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "The projection of one vector onto another scaled by magnitude", isCorrect: true },
        { content: "The angle between two vectors", isCorrect: false },
        { content: "The cross product of two vectors", isCorrect: false },
        { content: "The distance between two vectors", isCorrect: false },
      ],
    },
    {
      content: "In NumPy, what does np.dot(a, b) compute for two 1D arrays?",
      type: "SINGLE_CHOICE",
      explanation: "For 1D arrays, np.dot() computes the inner product (dot product).",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "The inner product (scalar result)", isCorrect: true },
        { content: "The outer product (matrix result)", isCorrect: false },
        { content: "Element-wise multiplication", isCorrect: false },
        { content: "Matrix multiplication", isCorrect: false },
      ],
    },
    {
      content: "True or False: An eigenvector of a matrix remains parallel to itself after the matrix transformation.",
      type: "TRUE_FALSE",
      explanation: "True. Eigenvectors only get scaled (not rotated) by a matrix transformation.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In machine learning, matrix ________ is used to transform input features into a new feature space.",
      type: "FILL_IN_BLANK",
      explanation: "Matrix multiplication is fundamental to ML feature transformations.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "multiplication", isCorrect: true },
        { content: "addition", isCorrect: false },
        { content: "division", isCorrect: false },
      ],
    },
  ],
  "Probability & Statistics Review": [
    {
      content: "What is Bayes theorem used for in machine learning?",
      type: "SINGLE_CHOICE",
      explanation: "Bayes theorem calculates the probability of a hypothesis given observed evidence.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Calculating posterior probability from prior probability and likelihood", isCorrect: true },
        { content: "Measuring the variance of a dataset", isCorrect: false },
        { content: "Performing linear regression on data", isCorrect: false },
        { content: "Clustering unlabeled data points", isCorrect: false },
      ],
    },
    {
      content: "Which measure of central tendency is most affected by outliers?",
      type: "SINGLE_CHOICE",
      explanation: "The mean is highly sensitive to outliers because it sums all values.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Mean", isCorrect: true },
        { content: "Median", isCorrect: false },
        { content: "Mode", isCorrect: false },
        { content: "Range", isCorrect: false },
      ],
    },
    {
      content: "True or False: The standard deviation measures the average distance of data points from the mean.",
      type: "TRUE_FALSE",
      explanation: "True. Standard deviation is the square root of variance and quantifies dispersion.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ distribution is commonly used as an approximation of the binomial distribution for large sample sizes.",
      type: "FILL_IN_BLANK",
      explanation: "The normal (Gaussian) distribution approximates the binomial when np and n(1-p) are both large.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Normal", isCorrect: true },
        { content: "Poisson", isCorrect: false },
        { content: "Exponential", isCorrect: false },
      ],
    },
  ],
  "Linear & Logistic Regression": [
    {
      content: "What type of problem is logistic regression used to solve?",
      type: "SINGLE_CHOICE",
      explanation: "Despite its name, logistic regression is a classification algorithm.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Binary classification", isCorrect: true },
        { content: "Regression (continuous values)", isCorrect: false },
        { content: "Clustering", isCorrect: false },
        { content: "Dimensionality reduction", isCorrect: false },
      ],
    },
    {
      content: "What loss function is typically used for training linear regression models?",
      type: "SINGLE_CHOICE",
      explanation: "Mean Squared Error (MSE) measures the average squared difference between predicted and actual values.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Mean Squared Error (MSE)", isCorrect: true },
        { content: "Cross-Entropy Loss", isCorrect: false },
        { content: "Hinge Loss", isCorrect: false },
        { content: "Mean Absolute Error", isCorrect: false },
      ],
    },
    {
      content: "True or False: Logistic regression can handle multi-class problems directly.",
      type: "TRUE_FALSE",
      explanation: "False. Basic logistic regression handles binary classification. For multi-class use One-vs-Rest or softmax.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function maps any real-valued number to a value between 0 and 1 in logistic regression.",
      type: "FILL_IN_BLANK",
      explanation: "The sigmoid function squashes inputs to the 0 to 1 range.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "sigmoid", isCorrect: true },
        { content: "ReLU", isCorrect: false },
        { content: "softmax", isCorrect: false },
      ],
    },
  ],
  "Decision Trees & Random Forests": [
    {
      content: "What criterion does a decision tree use to choose the best split?",
      type: "SINGLE_CHOICE",
      explanation: "Decision trees select splits that maximize information gain or minimize impurity.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Gini impurity or information gain (entropy)", isCorrect: true },
        { content: "Mean squared error", isCorrect: false },
        { content: "Cosine similarity", isCorrect: false },
        { content: "Euclidean distance", isCorrect: false },
      ],
    },
    {
      content: "What is the main advantage of random forests over individual decision trees?",
      type: "SINGLE_CHOICE",
      explanation: "Random forests ensemble multiple trees, reducing overfitting through bagging.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Reduced overfitting through ensemble averaging", isCorrect: true },
        { content: "Faster training time", isCorrect: false },
        { content: "Simpler model interpretation", isCorrect: false },
        { content: "Lower memory usage", isCorrect: false },
      ],
    },
    {
      content: "True or False: A deeper decision tree always produces a more accurate model.",
      type: "TRUE_FALSE",
      explanation: "False. A deeper tree can overfit. Pruning often improves generalization.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In sklearn, the ________ parameter in RandomForestClassifier controls the number of trees.",
      type: "FILL_IN_BLANK",
      explanation: "n_estimators specifies how many trees to build in the forest.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "n_estimators", isCorrect: true },
        { content: "max_depth", isCorrect: false },
        { content: "n_components", isCorrect: false },
      ],
    },
  ],
  "Model Evaluation & Cross-Validation": [
    {
      content: "Which metric is most appropriate for evaluating an imbalanced binary classifier?",
      type: "SINGLE_CHOICE",
      explanation: "F1-score or AUC-ROC are better than accuracy for imbalanced data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "F1-Score", isCorrect: true },
        { content: "Accuracy", isCorrect: false },
        { content: "Mean Squared Error", isCorrect: false },
        { content: "R-squared", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of k-fold cross-validation?",
      type: "SINGLE_CHOICE",
      explanation: "K-fold CV provides a more robust estimate of model performance than a single train-test split.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To get a more reliable estimate of model performance across different data splits", isCorrect: true },
        { content: "To train the model faster", isCorrect: false },
        { content: "To increase the training data size", isCorrect: false },
        { content: "To reduce the model memory usage", isCorrect: false },
      ],
    },
    {
      content: "True or False: A high precision score means the model has few false positives.",
      type: "TRUE_FALSE",
      explanation: "True. Precision = TP/(TP+FP). High precision means fewer false positives.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ measures the proportion of actual positive cases that the model correctly identified.",
      type: "FILL_IN_BLANK",
      explanation: "Recall (sensitivity) = TP/(TP+FN). It measures how well the model finds all positive cases.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "recall", isCorrect: true },
        { content: "precision", isCorrect: false },
        { content: "specificity", isCorrect: false },
      ],
    },
  ],
  "K-Means & Hierarchical Clustering": [
    {
      content: "How does the K-Means algorithm assign data points to clusters?",
      type: "SINGLE_CHOICE",
      explanation: "K-Means assigns each point to the nearest centroid using distance metrics.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "By assigning points to the nearest centroid", isCorrect: true },
        { content: "By building a tree hierarchy of clusters", isCorrect: false },
        { content: "By finding dense regions separated by sparse areas", isCorrect: false },
        { content: "By maximizing the silhouette score", isCorrect: false },
      ],
    },
    {
      content: "What is a major limitation of the K-Means algorithm?",
      type: "SINGLE_CHOICE",
      explanation: "K-Means requires specifying k in advance and assumes spherical clusters.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Requires the number of clusters to be specified in advance", isCorrect: true },
        { content: "Cannot handle numerical data", isCorrect: false },
        { content: "Only works with two-dimensional data", isCorrect: false },
        { content: "Is always faster than hierarchical clustering", isCorrect: false },
      ],
    },
    {
      content: "True or False: Hierarchical clustering produces a tree-like structure called a dendrogram.",
      type: "TRUE_FALSE",
      explanation: "True. Agglomerative hierarchical clustering builds a dendrogram.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ metric measures how similar a data point is to its own cluster compared to other clusters.",
      type: "FILL_IN_BLANK",
      explanation: "The silhouette score ranges from -1 to 1. A high score indicates well-matched clustering.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "silhouette score", isCorrect: true },
        { content: "elbow score", isCorrect: false },
        { content: "calinski score", isCorrect: false },
      ],
    },
  ],
  "Principal Component Analysis (PCA)": [
    {
      content: "What is the primary purpose of PCA in machine learning?",
      type: "SINGLE_CHOICE",
      explanation: "PCA reduces dimensionality while preserving as much variance as possible.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Dimensionality reduction while preserving variance", isCorrect: true },
        { content: "Increasing the number of features", isCorrect: false },
        { content: "Clustering similar data points", isCorrect: false },
        { content: "Training classification models", isCorrect: false },
      ],
    },
    {
      content: "What do the principal components represent?",
      type: "SINGLE_CHOICE",
      explanation: "Principal components are orthogonal axes of maximum variance in the data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Orthogonal axes of maximum variance", isCorrect: true },
        { content: "The mean of each feature", isCorrect: false },
        { content: "The most frequent data points", isCorrect: false },
        { content: "Random projections of the data", isCorrect: false },
      ],
    },
    {
      content: "True or False: PCA transforms correlated features into uncorrelated principal components.",
      type: "TRUE_FALSE",
      explanation: "True. PCA creates orthogonal (uncorrelated) components.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In sklearn, the ________ attribute of a fitted PCA object shows how much variance each component explains.",
      type: "FILL_IN_BLANK",
      explanation: "explained_variance_ratio_ shows the proportion of variance explained by each component.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "explained_variance_ratio_", isCorrect: true },
        { content: "components_", isCorrect: false },
        { content: "singular_values_", isCorrect: false },
      ],
    },
  ],
  "Anomaly Detection Techniques": [
    {
      content: "Which algorithm is commonly used for anomaly detection based on isolation?",
      type: "SINGLE_CHOICE",
      explanation: "Isolation Forest isolates anomalies by randomly partitioning data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Isolation Forest", isCorrect: true },
        { content: "K-Means", isCorrect: false },
        { content: "Linear Regression", isCorrect: false },
        { content: "Naive Bayes", isCorrect: false },
      ],
    },
    {
      content: "What makes an anomaly detection problem different from standard classification?",
      type: "SINGLE_CHOICE",
      explanation: "Anomaly detection deals with heavily imbalanced datasets where anomalies are rare.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Anomalies are rare compared to normal instances", isCorrect: true },
        { content: "Anomalies are always larger", isCorrect: false },
        { content: "Anomalies have more features", isCorrect: false },
        { content: "Anomaly detection uses more training data", isCorrect: false },
      ],
    },
    {
      content: "True or False: The Z-score method flags data points more than 3 standard deviations from the mean as anomalies.",
      type: "TRUE_FALSE",
      explanation: "True. 99.7% of data falls within 3 standard deviations in a normal distribution.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ is a density-based algorithm that detects anomalies as points in low-density regions.",
      type: "FILL_IN_BLANK",
      explanation: "DBSCAN labels points in low-density regions as noise/outliers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "DBSCAN", isCorrect: true },
        { content: "KNN", isCorrect: false },
        { content: "SVM", isCorrect: false },
      ],
    },
  ],
  "Neural Network Architecture": [
    {
      content: "What is the role of an activation function in a neural network?",
      type: "SINGLE_CHOICE",
      explanation: "Activation functions introduce non-linearity, allowing the network to learn complex patterns.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To introduce non-linearity into the network", isCorrect: true },
        { content: "To initialize the weights", isCorrect: false },
        { content: "To reduce the learning rate", isCorrect: false },
        { content: "To increase the number of layers", isCorrect: false },
      ],
    },
    {
      content: "What is a hidden layer in a neural network?",
      type: "SINGLE_CHOICE",
      explanation: "Hidden layers are layers between input and output that perform computations.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A layer between input and output that processes features", isCorrect: true },
        { content: "The first layer that receives raw input", isCorrect: false },
        { content: "The final layer that produces predictions", isCorrect: false },
        { content: "A layer that stores training data", isCorrect: false },
      ],
    },
    {
      content: "True or False: A neural network with a single hidden layer can theoretically approximate any continuous function.",
      type: "TRUE_FALSE",
      explanation: "True. This is the Universal Approximation Theorem.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function is the most commonly used activation function in hidden layers.",
      type: "FILL_IN_BLANK",
      explanation: "ReLU (Rectified Linear Unit) is the default choice for hidden layers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "ReLU", isCorrect: true },
        { content: "sigmoid", isCorrect: false },
        { content: "tanh", isCorrect: false },
      ],
    },
  ],
  "Training with Backpropagation": [
    {
      content: "What does backpropagation compute?",
      type: "SINGLE_CHOICE",
      explanation: "Backpropagation computes gradients of the loss with respect to each weight using the chain rule.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Gradients of the loss function with respect to each weight", isCorrect: true },
        { content: "The final output of the network", isCorrect: false },
        { content: "The optimal learning rate", isCorrect: false },
        { content: "The number of epochs needed", isCorrect: false },
      ],
    },
    {
      content: "Which optimizer is most commonly used in deep learning?",
      type: "SINGLE_CHOICE",
      explanation: "Adam combines the benefits of AdaGrad and RMSProp.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Adam", isCorrect: true },
        { content: "SGD with fixed learning rate", isCorrect: false },
        { content: "Batch Gradient Descent", isCorrect: false },
        { content: "Random search", isCorrect: false },
      ],
    },
    {
      content: "True or False: A lower learning rate always leads to better model training.",
      type: "TRUE_FALSE",
      explanation: "False. Too low a learning rate leads to slow convergence.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ measures the difference between the predicted and actual output of the network.",
      type: "FILL_IN_BLANK",
      explanation: "The loss function quantifies the error between predictions and actual values.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "loss function", isCorrect: true },
        { content: "activation function", isCorrect: false },
        { content: "weight matrix", isCorrect: false },
      ],
    },
  ],
  "CNNs for Image Recognition": [
    {
      content: "What type of layer is most important for extracting spatial features from images?",
      type: "SINGLE_CHOICE",
      explanation: "Convolutional layers apply filters to detect patterns like edges and textures.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Convolutional layer", isCorrect: true },
        { content: "Dense layer", isCorrect: false },
        { content: "Dropout layer", isCorrect: false },
        { content: "Flatten layer", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of pooling layers in a CNN?",
      type: "SINGLE_CHOICE",
      explanation: "Pooling reduces spatial dimensions and computation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To reduce spatial dimensions and computation", isCorrect: true },
        { content: "To increase the number of filters", isCorrect: false },
        { content: "To add more parameters", isCorrect: false },
        { content: "To normalize the input", isCorrect: false },
      ],
    },
    {
      content: "True or False: CNNs automatically learn hierarchical features from images.",
      type: "TRUE_FALSE",
      explanation: "True. Early layers detect edges, middle layers detect textures, deeper layers detect complex objects.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ layer in a CNN converts 2D feature maps into a 1D vector for classification.",
      type: "FILL_IN_BLANK",
      explanation: "The flatten layer reshapes 2D output into a 1D vector.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "flatten", isCorrect: true },
        { content: "convolution", isCorrect: false },
        { content: "pooling", isCorrect: false },
      ],
    },
  ],
  "How Search Engines Work": [
    {
      content: "What is the primary purpose of a search engine crawler?",
      type: "SINGLE_CHOICE",
      explanation: "Crawlers discover and fetch web pages by following links.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To discover and fetch web pages", isCorrect: true },
        { content: "To rank websites by popularity", isCorrect: false },
        { content: "To sell advertising space", isCorrect: false },
        { content: "To block spam websites", isCorrect: false },
      ],
    },
    {
      content: "What is indexing in the context of search engines?",
      type: "SINGLE_CHOICE",
      explanation: "Indexing stores and organizes crawled content for quick retrieval.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Storing and organizing crawled content for quick retrieval", isCorrect: true },
        { content: "Deleting old web pages", isCorrect: false },
        { content: "Paying for higher rankings", isCorrect: false },
        { content: "Sending emails to website owners", isCorrect: false },
      ],
    },
    {
      content: "True or False: Search engines use hundreds of ranking factors to determine page order.",
      type: "TRUE_FALSE",
      explanation: "True. Google alone uses over 200 ranking signals.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ is the list of all pages a search engine has discovered and stored.",
      type: "FILL_IN_BLANK",
      explanation: "The search index is a massive database used to quickly retrieve relevant results.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "index", isCorrect: true },
        { content: "cache", isCorrect: false },
        { content: "sitemap", isCorrect: false },
      ],
    },
  ],
  "Keyword Research Methods": [
    {
      content: "What type of keywords are more specific and typically have lower competition?",
      type: "SINGLE_CHOICE",
      explanation: "Long-tail keywords are more specific phrases with lower competition.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Long-tail keywords", isCorrect: true },
        { content: "Short-tail keywords", isCorrect: false },
        { content: "Broad match keywords", isCorrect: false },
        { content: "Negative keywords", isCorrect: false },
      ],
    },
    {
      content: "What does search volume indicate in keyword research?",
      type: "SINGLE_CHOICE",
      explanation: "Search volume shows how many times a keyword is searched per month.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "How many times a keyword is searched per month", isCorrect: true },
        { content: "How many websites use the keyword", isCorrect: false },
        { content: "How much the keyword costs to bid on", isCorrect: false },
        { content: "How old the keyword is", isCorrect: false },
      ],
    },
    {
      content: "True or False: User intent should be considered when selecting keywords for content.",
      type: "TRUE_FALSE",
      explanation: "True. Matching content to user intent improves rankings and engagement.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ keywords are used to exclude your ads from showing for certain search terms.",
      type: "FILL_IN_BLANK",
      explanation: "Negative keywords prevent content from appearing for irrelevant queries.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Negative", isCorrect: true },
        { content: "Positive", isCorrect: false },
        { content: "Broad match", isCorrect: false },
      ],
    },
  ],
  "On-Page SEO Best Practices": [
    {
      content: "Where should your primary keyword appear for on-page SEO?",
      type: "SINGLE_CHOICE",
      explanation: "Keywords should appear in the title tag, meta description, H1, and body content.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Title tag, meta description, H1, and body content", isCorrect: true },
        { content: "Only in the URL", isCorrect: false },
        { content: "Only in image alt text", isCorrect: false },
        { content: "Only in the footer", isCorrect: false },
      ],
    },
    {
      content: "What is the recommended length for a meta description?",
      type: "SINGLE_CHOICE",
      explanation: "Meta descriptions should be 150-160 characters to avoid truncation.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "150-160 characters", isCorrect: true },
        { content: "50-60 characters", isCorrect: false },
        { content: "300-400 characters", isCorrect: false },
        { content: "No limit", isCorrect: false },
      ],
    },
    {
      content: "True or False: Internal linking helps search engines understand your website structure.",
      type: "TRUE_FALSE",
      explanation: "True. Internal links distribute authority and help crawlers discover content.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ tag defines the main heading of a page and should include your primary keyword.",
      type: "FILL_IN_BLANK",
      explanation: "The H1 tag is the most important heading for SEO.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "H1", isCorrect: true },
        { content: "H3", isCorrect: false },
        { content: "H6", isCorrect: false },
      ],
    },
  ],
  "Platform Strategy: Instagram, LinkedIn & TikTok": [
    {
      content: "Which platform is most effective for B2B marketing?",
      type: "SINGLE_CHOICE",
      explanation: "LinkedIn is the primary platform for B2B marketing.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "LinkedIn", isCorrect: true },
        { content: "TikTok", isCorrect: false },
        { content: "Instagram", isCorrect: false },
        { content: "Snapchat", isCorrect: false },
      ],
    },
    {
      content: "What type of content performs best on TikTok?",
      type: "SINGLE_CHOICE",
      explanation: "Short-form video content with entertainment value performs best on TikTok.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Short-form video content with entertainment value", isCorrect: true },
        { content: "Long-form articles", isCorrect: false },
        { content: "Professional case studies", isCorrect: false },
        { content: "PDF documents", isCorrect: false },
      ],
    },
    {
      content: "True or False: The best posting frequency is the same across all social media platforms.",
      type: "TRUE_FALSE",
      explanation: "False. Each platform has different optimal posting frequencies.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ rate measures the percentage of people who engaged with your post out of those who saw it.",
      type: "FILL_IN_BLANK",
      explanation: "Engagement rate is calculated by dividing total engagements by impressions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Engagement", isCorrect: true },
        { content: "Click-through", isCorrect: false },
        { content: "Conversion", isCorrect: false },
      ],
    },
  ],
  "Content Calendar Planning": [
    {
      content: "What is the recommended content mix ratio for social media?",
      type: "SINGLE_CHOICE",
      explanation: "The 40-30-20-10 rule provides a balanced content mix.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "40% educational, 30% entertaining, 20% promotional, 10% user-generated", isCorrect: true },
        { content: "50% promotional, 30% educational, 20% entertaining", isCorrect: false },
        { content: "100% promotional content", isCorrect: false },
        { content: "50% entertaining, 50% educational", isCorrect: false },
      ],
    },
    {
      content: "How far in advance should you plan a content calendar?",
      type: "SINGLE_CHOICE",
      explanation: "Planning 4 weeks ahead ensures consistent posting.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "4 weeks", isCorrect: true },
        { content: "1 day", isCorrect: false },
        { content: "6 months", isCorrect: false },
        { content: "1 year", isCorrect: false },
      ],
    },
    {
      content: "True or False: Batch-creating content weekly saves time compared to creating content daily.",
      type: "TRUE_FALSE",
      explanation: "True. Batch creation improves efficiency by reducing context switching.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ helps ensure you have a balanced mix of content types across platforms.",
      type: "FILL_IN_BLANK",
      explanation: "A content calendar maps out what content to publish and when.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "content calendar", isCorrect: true },
        { content: "budget spreadsheet", isCorrect: false },
        { content: "analytics report", isCorrect: false },
      ],
    },
  ],
  "Social Media Advertising": [
    {
      content: "What is the main advantage of paid social media advertising over organic reach?",
      type: "SINGLE_CHOICE",
      explanation: "Paid advertising allows precise audience targeting and guaranteed reach.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Precise audience targeting and guaranteed reach", isCorrect: true },
        { content: "It is completely free", isCorrect: false },
        { content: "It does not require any strategy", isCorrect: false },
        { content: "It works without content", isCorrect: false },
      ],
    },
    {
      content: "What does CPM stand for in social media advertising?",
      type: "SINGLE_CHOICE",
      explanation: "CPM stands for Cost Per Mille (cost per 1,000 impressions).",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Cost Per Mille (cost per 1,000 impressions)", isCorrect: true },
        { content: "Clicks Per Minute", isCorrect: false },
        { content: "Content Per Month", isCorrect: false },
        { content: "Campaign Performance Metric", isCorrect: false },
      ],
    },
    {
      content: "True or False: A/B testing ad creatives helps optimize campaign performance.",
      type: "TRUE_FALSE",
      explanation: "True. A/B testing compares versions to determine which performs better.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ is the percentage of people who clicked your ad after seeing it.",
      type: "FILL_IN_BLANK",
      explanation: "CTR (Click-Through Rate) indicates how effective ad creative is.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Click-Through Rate (CTR)", isCorrect: true },
        { content: "Conversion Rate", isCorrect: false },
        { content: "Bounce Rate", isCorrect: false },
      ],
    },
  ],
  "Building an Email List": [
    {
      content: "What is the most effective way to grow an email list?",
      type: "SINGLE_CHOICE",
      explanation: "Lead magnets encourage signups by offering something useful for an email address.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Offering a lead magnet (free valuable content)", isCorrect: true },
        { content: "Buying email lists from third parties", isCorrect: false },
        { content: "Sending unsolicited emails", isCorrect: false },
        { content: "Posting on social media only", isCorrect: false },
      ],
    },
    {
      content: "What is a double opt-in email process?",
      type: "SINGLE_CHOICE",
      explanation: "Double opt-in requires subscribers to confirm their email after signup.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Subscriber confirms email address after initial signup", isCorrect: true },
        { content: "Sending two emails per week", isCorrect: false },
        { content: "Requiring two form fields", isCorrect: false },
        { content: "Using two email providers", isCorrect: false },
      ],
    },
    {
      content: "True or False: Purchased email lists are a compliant way to grow your audience.",
      type: "TRUE_FALSE",
      explanation: "False. Purchased lists violate anti-spam laws and damage sender reputation.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ is a free resource offered in exchange for a visitor email address.",
      type: "FILL_IN_BLANK",
      explanation: "Lead magnets like ebooks, checklists, or templates provide value and incentivize signups.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "lead magnet", isCorrect: true },
        { content: "landing page", isCorrect: false },
        { content: "CTA button", isCorrect: false },
      ],
    },
  ],
  "Email Campaign Design": [
    {
      content: "What is the recommended length for an email subject line?",
      type: "SINGLE_CHOICE",
      explanation: "Subject lines of 40-60 characters get the best open rates.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "40-60 characters", isCorrect: true },
        { content: "100-150 characters", isCorrect: false },
        { content: "10-15 characters", isCorrect: false },
        { content: "No limit", isCorrect: false },
      ],
    },
    {
      content: "What is the average email open rate benchmark?",
      type: "SINGLE_CHOICE",
      explanation: "The average email open rate is approximately 20-25%.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "20-25%", isCorrect: true },
        { content: "50-60%", isCorrect: false },
        { content: "5-10%", isCorrect: false },
        { content: "80-90%", isCorrect: false },
      ],
    },
    {
      content: "True or False: A/B testing subject lines can improve email open rates.",
      type: "TRUE_FALSE",
      explanation: "True. Testing different subject lines helps identify what resonates with your audience.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ rate measures the percentage of recipients who clicked a link in your email.",
      type: "FILL_IN_BLANK",
      explanation: "Click-Through Rate (CTR) indicates how engaging your email content is.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "click-through", isCorrect: true },
        { content: "open", isCorrect: false },
        { content: "bounce", isCorrect: false },
      ],
    },
  ],
  "Google Analytics Setup & Reports": [
    {
      content: "What does the bounce rate metric indicate in Google Analytics?",
      type: "SINGLE_CHOICE",
      explanation: "Bounce rate is the percentage of single-page sessions.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Percentage of visitors who left after viewing only one page", isCorrect: true },
        { content: "Number of new visitors", isCorrect: false },
        { content: "Total number of page views", isCorrect: false },
        { content: "Average session duration", isCorrect: false },
      ],
    },
    {
      content: "What is a conversion goal in Google Analytics?",
      type: "SINGLE_CHOICE",
      explanation: "A goal tracks a specific action you want users to take.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A specific user action you want to track", isCorrect: true },
        { content: "The total revenue generated", isCorrect: false },
        { content: "The number of page views", isCorrect: false },
        { content: "The average time on site", isCorrect: false },
      ],
    },
    {
      content: "True or False: Google Analytics 4 uses session-based tracking by default.",
      type: "TRUE_FALSE",
      explanation: "False. GA4 uses event-based tracking instead of session-based tracking.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ metric shows the average amount of time users spend on your site per session.",
      type: "FILL_IN_BLANK",
      explanation: "Average session duration indicates how engaged visitors are.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "average session duration", isCorrect: true },
        { content: "bounce rate", isCorrect: false },
        { content: "page load time", isCorrect: false },
      ],
    },
  ],
  "Decorators & Closures": [
    {
      content: "What is a decorator in Python?",
      type: "SINGLE_CHOICE",
      explanation: "A decorator is a function that takes another function and extends its behavior.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A function that modifies another functions behavior", isCorrect: true },
        { content: "A class that inherits from another class", isCorrect: false },
        { content: "A special type of variable", isCorrect: false },
        { content: "A comment syntax for documentation", isCorrect: false },
      ],
    },
    {
      content: "What does the @ symbol do when placed before a function definition?",
      type: "SINGLE_CHOICE",
      explanation: "The @ syntax is syntactic sugar for applying a decorator to a function.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Applies a decorator to the function", isCorrect: true },
        { content: "Creates a static variable", isCorrect: false },
        { content: "Imports a module", isCorrect: false },
        { content: "Defines a class attribute", isCorrect: false },
      ],
    },
    {
      content: "True or False: A closure captures variables from its enclosing scope.",
      type: "TRUE_FALSE",
      explanation: "True. Closures remember the values of variables from the scope in which they were defined.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Python decorators often use the ________ module for convenience.",
      type: "FILL_IN_BLANK",
      explanation: "functools.wraps preserves the metadata of the original function.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "functools", isCorrect: true },
        { content: "itertools", isCorrect: false },
        { content: "collections", isCorrect: false },
      ],
    },
  ],
  "Generators & Itertools": [
    {
      content: "What keyword is used to define a generator function in Python?",
      type: "SINGLE_CHOICE",
      explanation: "The yield keyword makes a function a generator.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "yield", isCorrect: true },
        { content: "return", isCorrect: false },
        { content: "generate", isCorrect: false },
        { content: "async", isCorrect: false },
      ],
    },
    {
      content: "What is the main advantage of generators over lists?",
      type: "SINGLE_CHOICE",
      explanation: "Generators are memory-efficient through lazy evaluation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Memory efficiency through lazy evaluation", isCorrect: true },
        { content: "Faster execution speed", isCorrect: false },
        { content: "Better type safety", isCorrect: false },
        { content: "Simpler syntax", isCorrect: false },
      ],
    },
    {
      content: "True or False: Generator expressions use square brackets like list comprehensions.",
      type: "TRUE_FALSE",
      explanation: "False. Generator expressions use parentheses () while list comprehensions use square brackets.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The itertools.chain() function is used to ________ multiple iterables into a single sequence.",
      type: "FILL_IN_BLANK",
      explanation: "itertools.chain() concatenates iterables end-to-end.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "concatenate", isCorrect: true },
        { content: "filter", isCorrect: false },
        { content: "sort", isCorrect: false },
      ],
    },
  ],
  "Context Managers & the 'with' Statement": [
    {
      content: "What does the 'with' statement do in Python?",
      type: "SINGLE_CHOICE",
      explanation: "The 'with' statement ensures proper acquisition and release of resources.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Automatically manages resource lifecycle (acquire and release)", isCorrect: true },
        { content: "Creates a new scope for variables", isCorrect: false },
        { content: "Imports a module conditionally", isCorrect: false },
        { content: "Defines a loop construct", isCorrect: false },
      ],
    },
    {
      content: "Which methods must a context manager class implement?",
      type: "SINGLE_CHOICE",
      explanation: "A context manager must implement __enter__ and __exit__ methods.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "__enter__ and __exit__", isCorrect: true },
        { content: "__init__ and __del__", isCorrect: false },
        { content: "__start__ and __stop__", isCorrect: false },
        { content: "__open__ and __close__", isCorrect: false },
      ],
    },
    {
      content: "True or False: The contextlib module provides a simpler way to create context managers using decorators.",
      type: "TRUE_FALSE",
      explanation: "True. The @contextmanager decorator simplifies creating context managers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ method is called when exiting the with block, handling cleanup and exceptions.",
      type: "FILL_IN_BLANK",
      explanation: "The __exit__ method handles cleanup when leaving the with block.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "__exit__", isCorrect: true },
        { content: "__enter__", isCorrect: false },
        { content: "__init__", isCorrect: false },
      ],
    },
  ],
  "Metaclasses Explained": [
    {
      content: "What is a metaclass in Python?",
      type: "SINGLE_CHOICE",
      explanation: "A metaclass is the class of a class that defines how other classes behave.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "A class that defines how other classes behave", isCorrect: true },
        { content: "A class with no methods", isCorrect: false },
        { content: "A private class", isCorrect: false },
        { content: "An abstract class", isCorrect: false },
      ],
    },
    {
      content: "What is the default metaclass in Python?",
      type: "SINGLE_CHOICE",
      explanation: "type() is Python's default metaclass.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "type", isCorrect: true },
        { content: "class", isCorrect: false },
        { content: "meta", isCorrect: false },
        { content: "object", isCorrect: false },
      ],
    },
    {
      content: "True or False: Metaclasses allow you to modify class creation at runtime.",
      type: "TRUE_FALSE",
      explanation: "True. Metaclasses intercept class creation and can modify the class.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: To specify a metaclass, you use the ________ parameter in the class definition.",
      type: "FILL_IN_BLANK",
      explanation: "The metaclass keyword argument tells Python which metaclass to use.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "metaclass", isCorrect: true },
        { content: "class", isCorrect: false },
        { content: "type", isCorrect: false },
      ],
    },
  ],
  "Descriptors & Properties": [
    {
      content: "Which methods must a descriptor class implement?",
      type: "SINGLE_CHOICE",
      explanation: "A descriptor must implement at least one of __get__, __set__, or __delete__.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "__get__ (or __set__ / __delete__)", isCorrect: true },
        { content: "__init__", isCorrect: false },
        { content: "__repr__", isCorrect: false },
        { content: "__call__", isCorrect: false },
      ],
    },
    {
      content: "What does the @property decorator provide in Python?",
      type: "SINGLE_CHOICE",
      explanation: "@property is syntactic sugar for descriptors, allowing getter/setter/deleter methods.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Getter, setter, and deleter methods as attributes", isCorrect: true },
        { content: "Thread safety for attributes", isCorrect: false },
        { content: "Automatic serialization", isCorrect: false },
        { content: "Memory optimization", isCorrect: false },
      ],
    },
    {
      content: "True or False: __slots__ restricts attribute creation for memory efficiency.",
      type: "TRUE_FALSE",
      explanation: "True. __slots__ prevents the creation of __dict__ and saves memory.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The __set_name__ method is automatically called when a descriptor is defined in a class body.",
      type: "FILL_IN_BLANK",
      explanation: "__set_name__ allows descriptors to know the name they were assigned to.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "__set_name__", isCorrect: true },
        { content: "__init__", isCorrect: false },
        { content: "__get__", isCorrect: false },
      ],
    },
  ],
  "Dynamic Code Execution": [
    {
      content: "What does the exec() function do in Python?",
      type: "SINGLE_CHOICE",
      explanation: "exec() dynamically executes Python code from a string.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "Dynamically executes Python code from a string", isCorrect: true },
        { content: "Exits the current program", isCorrect: false },
        { content: "Executes system commands only", isCorrect: false },
        { content: "Runs tests in parallel", isCorrect: false },
      ],
    },
    {
      content: "What is the difference between eval() and exec()?",
      type: "SINGLE_CHOICE",
      explanation: "eval() evaluates a single expression and returns a value. exec() executes statements.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "eval() returns a value; exec() executes statements", isCorrect: true },
        { content: "They are identical", isCorrect: false },
        { content: "eval() is faster", isCorrect: false },
        { content: "exec() returns a value; eval() does not", isCorrect: false },
      ],
    },
    {
      content: "True or False: Using exec() and eval() is generally considered a security risk.",
      type: "TRUE_FALSE",
      explanation: "True. exec() and eval() can execute arbitrary code.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function compiles a string into a code object that can be executed later.",
      type: "FILL_IN_BLANK",
      explanation: "compile() converts Python code into a code object for later execution.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "compile", isCorrect: true },
        { content: "parse", isCorrect: false },
        { content: "interpret", isCorrect: false },
      ],
    },
  ],
  "asyncio Fundamentals": [
    {
      content: "What keyword defines a coroutine function in Python?",
      type: "SINGLE_CHOICE",
      explanation: "The async keyword before def creates a coroutine function.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "async", isCorrect: true },
        { content: "coroutine", isCorrect: false },
        { content: "await", isCorrect: false },
        { content: "deferred", isCorrect: false },
      ],
    },
    {
      content: "What does the await keyword do?",
      type: "SINGLE_CHOICE",
      explanation: "await suspends coroutine execution until the awaited object completes.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Suspends coroutine until the awaited object completes", isCorrect: true },
        { content: "Creates a new thread", isCorrect: false },
        { content: "Blocks the entire program", isCorrect: false },
        { content: "Raises an exception", isCorrect: false },
      ],
    },
    {
      content: "True or False: asyncio is suitable for CPU-bound tasks.",
      type: "TRUE_FALSE",
      explanation: "False. asyncio is designed for I/O-bound tasks.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function runs multiple coroutines concurrently and returns their results.",
      type: "FILL_IN_BLANK",
      explanation: "asyncio.gather() takes multiple awaitables and runs them concurrently.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "asyncio.gather()", isCorrect: true },
        { content: "asyncio.run()", isCorrect: false },
        { content: "asyncio.wait()", isCorrect: false },
      ],
    },
  ],
  "Coroutines & Tasks": [
    {
      content: "What is the difference between a coroutine and a task in asyncio?",
      type: "SINGLE_CHOICE",
      explanation: "A Task wraps a coroutine and schedules it for concurrent execution.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A Task wraps a coroutine for concurrent execution", isCorrect: true },
        { content: "They are exactly the same thing", isCorrect: false },
        { content: "A Task is slower than a coroutine", isCorrect: false },
        { content: "A coroutine runs faster than a Task", isCorrect: false },
      ],
    },
    {
      content: "How do you create a Task from a coroutine?",
      type: "SINGLE_CHOICE",
      explanation: "asyncio.create_task() wraps a coroutine into a Task.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "asyncio.create_task(coro())", isCorrect: true },
        { content: "asyncio.new_task(coro())", isCorrect: false },
        { content: "Task(coro())", isCorrect: false },
        { content: "asyncio.start(coro())", isCorrect: false },
      ],
    },
    {
      content: "True or False: asyncio.Queue is useful for implementing producer-consumer patterns.",
      type: "TRUE_FALSE",
      explanation: "True. asyncio.Queue provides coroutine-based put() and get() methods.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The asyncio ________ runs the event loop until the given coroutine completes.",
      type: "FILL_IN_BLANK",
      explanation: "asyncio.run() is the main entry point for running asyncio programs.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "run()", isCorrect: true },
        { content: "start()", isCorrect: false },
        { content: "execute()", isCorrect: false },
      ],
    },
  ],
  "Building Async Web Scrapers": [
    {
      content: "Which library is commonly used for async HTTP requests in Python?",
      type: "SINGLE_CHOICE",
      explanation: "aiohttp is a popular library for asynchronous HTTP requests.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "aiohttp", isCorrect: true },
        { content: "requests", isCorrect: false },
        { content: "urllib", isCorrect: false },
        { content: "httpx (sync only)", isCorrect: false },
      ],
    },
    {
      content: "What is the benefit of async scraping over synchronous scraping?",
      type: "SINGLE_CHOICE",
      explanation: "Async scraping handles many concurrent requests, reducing total time.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Handles many concurrent requests, reducing total time", isCorrect: true },
        { content: "Uses less memory", isCorrect: false },
        { content: "Is simpler to implement", isCorrect: false },
        { content: "Requires no dependencies", isCorrect: false },
      ],
    },
    {
      content: "True or False: asyncio.Semaphore can limit the number of concurrent requests.",
      type: "TRUE_FALSE",
      explanation: "True. Semaphore limits concurrent coroutines to prevent overload.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: An async ________ manages connection pooling for HTTP requests.",
      type: "FILL_IN_BLANK",
      explanation: "aiohttp.ClientSession manages connection pooling and provides async request context.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "ClientSession", isCorrect: true },
        { content: "ThreadPool", isCorrect: false },
        { content: "ConnectionPool", isCorrect: false },
      ],
    },
  ],
  "Singleton & Factory Patterns": [
    {
      content: "What problem does the Singleton pattern solve?",
      type: "SINGLE_CHOICE",
      explanation: "Singleton ensures only one instance of a class exists.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Ensures only one instance of a class exists", isCorrect: true },
        { content: "Creates objects without specifying the exact class", isCorrect: false },
        { content: "Defines a family of algorithms", isCorrect: false },
        { content: "Provides a simplified interface to complex subsystems", isCorrect: false },
      ],
    },
    {
      content: "What is the main purpose of the Factory pattern?",
      type: "SINGLE_CHOICE",
      explanation: "The Factory pattern creates objects without specifying the exact class.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To create objects without specifying the exact class", isCorrect: true },
        { content: "To destroy objects efficiently", isCorrect: false },
        { content: "To cache object instances", isCorrect: false },
        { content: "To serialize objects to JSON", isCorrect: false },
      ],
    },
    {
      content: "True or False: Python duck typing makes many Gang of Four patterns simpler or unnecessary.",
      type: "TRUE_FALSE",
      explanation: "True. Pythons dynamic typing reduces the need for many structural patterns.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In Python, a common Singleton implementation uses __new__ to control ________ creation.",
      type: "FILL_IN_BLANK",
      explanation: "Overriding __new__ allows intercepting instance creation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "instance", isCorrect: true },
        { content: "class", isCorrect: false },
        { content: "module", isCorrect: false },
      ],
    },
  ],
  "Observer & Strategy Patterns": [
    {
      content: "What does the Observer pattern define?",
      type: "SINGLE_CHOICE",
      explanation: "The Observer pattern defines a one-to-many dependency for state change notifications.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A one-to-many dependency for state change notifications", isCorrect: true },
        { content: "A way to traverse collections", isCorrect: false },
        { content: "A template for creating objects", isCorrect: false },
        { content: "A way to add responsibilities dynamically", isCorrect: false },
      ],
    },
    {
      content: "What is the Strategy pattern used for?",
      type: "SINGLE_CHOICE",
      explanation: "Strategy defines a family of algorithms and makes them interchangeable.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Defining a family of algorithms and making them interchangeable", isCorrect: true },
        { content: "Creating objects with a common interface", isCorrect: false },
        { content: "Adding behavior to objects dynamically", isCorrect: false },
        { content: "Traversing a collection sequentially", isCorrect: false },
      ],
    },
    {
      content: "True or False: Composition is generally preferred over inheritance in Python design patterns.",
      type: "TRUE_FALSE",
      explanation: "True. Composition provides more flexibility.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Python uses ________ functions or events to implement the Observer pattern.",
      type: "FILL_IN_BLANK",
      explanation: "Python often uses callback functions for observer-like behavior.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "callback", isCorrect: true },
        { content: "lambda", isCorrect: false },
        { content: "decorator", isCorrect: false },
      ],
    },
  ],
  "Building a REST API with FastAPI": [
    {
      content: "What is the main advantage of FastAPI over Flask?",
      type: "SINGLE_CHOICE",
      explanation: "FastAPI provides automatic API docs, type validation, and native async support.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Automatic docs, type validation, and native async support", isCorrect: true },
        { content: "It has no dependencies", isCorrect: false },
        { content: "It uses XML instead of JSON", isCorrect: false },
        { content: "It only supports GET requests", isCorrect: false },
      ],
    },
    {
      content: "What does Pydantic do in FastAPI?",
      type: "SINGLE_CHOICE",
      explanation: "Pydantic validates request and response data using type hints.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Validates request and response data using type hints", isCorrect: true },
        { content: "Manages database connections", isCorrect: false },
        { content: "Handles authentication only", isCorrect: false },
        { content: "Generates HTML templates", isCorrect: false },
      ],
    },
    {
      content: "True or False: FastAPI is built on top of Starlette and Pydantic.",
      type: "TRUE_FALSE",
      explanation: "True. FastAPI uses Starlette for web parts and Pydantic for data validation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: FastAPI provides automatic interactive API documentation at ________ and ________.",
      type: "FILL_IN_BLANK",
      explanation: "FastAPI serves Swagger UI at /docs and ReDoc at /redoc.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "/docs and /redoc", isCorrect: true },
        { content: "/api and /test", isCorrect: false },
        { content: "/help and /info", isCorrect: false },
      ],
    },
  ],
  "Color Theory & Typography": [
    {
      content: "What is the complementary color of blue on the color wheel?",
      type: "SINGLE_CHOICE",
      explanation: "Complementary colors are opposite on the color wheel.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Orange", isCorrect: true },
        { content: "Green", isCorrect: false },
        { content: "Purple", isCorrect: false },
        { content: "Red", isCorrect: false },
      ],
    },
    {
      content: "What does font weight refer to in typography?",
      type: "SINGLE_CHOICE",
      explanation: "Font weight refers to the thickness or boldness of characters.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "The thickness or boldness of characters", isCorrect: true },
        { content: "The size of the font", isCorrect: false },
        { content: "The spacing between letters", isCorrect: false },
        { content: "The line height", isCorrect: false },
      ],
    },
    {
      content: "True or False: Using more than 3 fonts on a single page is a best practice in design.",
      type: "TRUE_FALSE",
      explanation: "False. Using too many fonts creates visual chaos. Stick to 2-3 fonts maximum.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ color scheme uses colors that are adjacent on the color wheel.",
      type: "FILL_IN_BLANK",
      explanation: "Analogous color schemes use colors next to each other on the color wheel.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "analogous", isCorrect: true },
        { content: "complementary", isCorrect: false },
        { content: "triadic", isCorrect: false },
      ],
    },
  ],
  "Visual Hierarchy & Layout": [
    {
      content: "What Gestalt principle states that elements close together are perceived as a group?",
      type: "SINGLE_CHOICE",
      explanation: "Proximity states that objects near each other tend to be grouped together.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Proximity", isCorrect: true },
        { content: "Similarity", isCorrect: false },
        { content: "Closure", isCorrect: false },
        { content: "Continuity", isCorrect: false },
      ],
    },
    {
      content: "What is the Z-pattern in web design?",
      type: "SINGLE_CHOICE",
      explanation: "The Z-pattern describes how users scan pages with little text.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A scanning path for pages with minimal text content", isCorrect: true },
        { content: "A grid layout system", isCorrect: false },
        { content: "A color matching technique", isCorrect: false },
        { content: "A typography style", isCorrect: false },
      ],
    },
    {
      content: "True or False: The 8px grid system helps maintain consistent spacing in design.",
      type: "TRUE_FALSE",
      explanation: "True. Using multiples of 8px creates visual rhythm and consistency.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ principle states that humans tend to see complete figures even when parts are missing.",
      type: "FILL_IN_BLANK",
      explanation: "The closure principle describes how the brain fills in gaps.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "closure", isCorrect: true },
        { content: "proximity", isCorrect: false },
        { content: "similarity", isCorrect: false },
      ],
    },
  ],
  "Accessibility in Design (WCAG)": [
    {
      content: "What is the recommended contrast ratio for normal text under WCAG AA?",
      type: "SINGLE_CHOICE",
      explanation: "WCAG AA requires at least 4.5:1 contrast ratio for normal text.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "4.5:1", isCorrect: true },
        { content: "2:1", isCorrect: false },
        { content: "7:1", isCorrect: false },
        { content: "1:1", isCorrect: false },
      ],
    },
    {
      content: "What does the alt attribute on images provide?",
      type: "SINGLE_CHOICE",
      explanation: "Alt text provides a text description for screen readers.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Text description for screen readers", isCorrect: true },
        { content: "Image file size reduction", isCorrect: false },
        { content: "Higher image resolution", isCorrect: false },
        { content: "Faster image loading", isCorrect: false },
      ],
    },
    {
      content: "True or False: Keyboard navigation is essential for web accessibility.",
      type: "TRUE_FALSE",
      explanation: "True. Many users with motor disabilities rely on keyboard navigation.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The WCAG standard has three levels of conformance: A, AA, and ________.",
      type: "FILL_IN_BLANK",
      explanation: "WCAG defines A (minimum), AA (standard), and AAA (highest) levels.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "AAA", isCorrect: true },
        { content: "AB", isCorrect: false },
        { content: "B", isCorrect: false },
      ],
    },
  ],
  "User Personas & Journey Maps": [
    {
      content: "What is a user persona?",
      type: "SINGLE_CHOICE",
      explanation: "A user persona is a fictional character representing a target user segment.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A fictional character representing a target user segment", isCorrect: true },
        { content: "A real customer testimonial", isCorrect: false },
        { content: "A company profile", isCorrect: false },
        { content: "A technical specification", isCorrect: false },
      ],
    },
    {
      content: "What does a user journey map visualize?",
      type: "SINGLE_CHOICE",
      explanation: "A journey map shows the complete user experience including actions, thoughts, and emotions.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "The complete user experience including actions, thoughts, and emotions", isCorrect: true },
        { content: "Only the technical architecture", isCorrect: false },
        { content: "Only the purchase process", isCorrect: false },
        { content: "Only the onboarding flow", isCorrect: false },
      ],
    },
    {
      content: "True or False: Personas should be based on real user research, not assumptions.",
      type: "TRUE_FALSE",
      explanation: "True. Effective personas are grounded in real data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ is the moment of highest frustration in a user journey.",
      type: "FILL_IN_BLANK",
      explanation: "The pain point is where users experience the most friction.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "pain point", isCorrect: true },
        { content: "touchpoint", isCorrect: false },
        { content: "milestone", isCorrect: false },
      ],
    },
  ],
  "Low-Fidelity Wireframing": [
    {
      content: "What is the primary purpose of a wireframe?",
      type: "SINGLE_CHOICE",
      explanation: "Wireframes show page structure and layout without visual design.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To show page structure and layout without visual design", isCorrect: true },
        { content: "To show final colors and typography", isCorrect: false },
        { content: "To implement responsive CSS", isCorrect: false },
        { content: "To write backend code", isCorrect: false },
      ],
    },
    {
      content: "Why should wireframing start with paper sketches?",
      type: "SINGLE_CHOICE",
      explanation: "Paper sketches allow rapid ideation and are cheap to change.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "They enable rapid ideation and are cheap to change", isCorrect: true },
        { content: "They look more professional", isCorrect: false },
        { content: "They are required by law", isCorrect: false },
        { content: "They are faster to code", isCorrect: false },
      ],
    },
    {
      content: "True or False: Wireframes should include detailed colors and images.",
      type: "TRUE_FALSE",
      explanation: "False. Wireframes are intentionally low-fidelity.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ wireframe uses simple shapes and placeholder text.",
      type: "FILL_IN_BLANK",
      explanation: "Low-fidelity wireframes use grayscale and simple shapes.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "low-fidelity", isCorrect: true },
        { content: "high-fidelity", isCorrect: false },
        { content: "interactive", isCorrect: false },
      ],
    },
  ],
  "Competitive Analysis Techniques": [
    {
      content: "What is the purpose of a competitive analysis in UX design?",
      type: "SINGLE_CHOICE",
      explanation: "Competitive analysis identifies industry standards, gaps, and opportunities.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To identify industry standards, gaps, and opportunities", isCorrect: true },
        { content: "To copy competitors exactly", isCorrect: false },
        { content: "To avoid doing any research", isCorrect: false },
        { content: "To make the design more complex", isCorrect: false },
      ],
    },
    {
      content: "What is a SWOT analysis?",
      type: "SINGLE_CHOICE",
      explanation: "SWOT evaluates Strengths, Weaknesses, Opportunities, and Threats.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "An evaluation of Strengths, Weaknesses, Opportunities, and Threats", isCorrect: true },
        { content: "A type of user survey", isCorrect: false },
        { content: "A coding methodology", isCorrect: false },
        { content: "A project management framework", isCorrect: false },
      ],
    },
    {
      content: "True or False: You should only analyze direct competitors in a competitive analysis.",
      type: "TRUE_FALSE",
      explanation: "False. Analyzing indirect competitors can reveal innovative solutions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ matrix compares competitors across multiple feature categories.",
      type: "FILL_IN_BLANK",
      explanation: "A feature comparison matrix maps competitor features.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "comparison", isCorrect: true },
        { content: "scatter", isCorrect: false },
        { content: "Venn", isCorrect: false },
      ],
    },
  ],
  "Interactive Prototyping in Figma": [
    {
      content: "What is an interactive prototype?",
      type: "SINGLE_CHOICE",
      explanation: "An interactive prototype simulates user experience with clickable interactions.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A simulation of the user experience with clickable interactions", isCorrect: true },
        { content: "A static screenshot", isCorrect: false },
        { content: "A fully coded application", isCorrect: false },
        { content: "A database schema", isCorrect: false },
      ],
    },
    {
      content: "What feature in Figma connects screens for prototype flows?",
      type: "SINGLE_CHOICE",
      explanation: "Prototyping connections (noodles) let you create flows between frames.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Prototyping connections (noodles)", isCorrect: true },
        { content: "Auto-layout", isCorrect: false },
        { content: "Components", isCorrect: false },
        { content: "Grids", isCorrect: false },
      ],
    },
    {
      content: "True or False: Prototypes should be tested with real users before development.",
      type: "TRUE_FALSE",
      explanation: "True. User testing on prototypes catches usability issues early.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ prototype shows only the key interactions needed to validate the design concept.",
      type: "FILL_IN_BLANK",
      explanation: "A concept prototype focuses on core flows for validation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "concept", isCorrect: true },
        { content: "production", isCorrect: false },
        { content: "code", isCorrect: false },
      ],
    },
  ],
  "Design System Components": [
    {
      content: "What is a design system?",
      type: "SINGLE_CHOICE",
      explanation: "A design system is a collection of reusable components, patterns, and guidelines.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A collection of reusable components, patterns, and guidelines", isCorrect: true },
        { content: "A single Figma file", isCorrect: false },
        { content: "A CSS framework", isCorrect: false },
        { content: "A testing tool", isCorrect: false },
      ],
    },
    {
      content: "What are variants in Figma components?",
      type: "SINGLE_CHOICE",
      explanation: "Variants allow multiple versions of a component within one component set.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Multiple versions of a component within one component set", isCorrect: true },
        { content: "Copied versions of files", isCorrect: false },
        { content: "Deleted components", isCorrect: false },
        { content: "Export settings", isCorrect: false },
      ],
    },
    {
      content: "True or False: Auto-layout in Figma helps create responsive components.",
      type: "TRUE_FALSE",
      explanation: "True. Auto-layout dynamically adjusts component size and spacing.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A well-built design system reduces ________ and speeds up development.",
      type: "FILL_IN_BLANK",
      explanation: "A design system reduces design debt and improves efficiency.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "design debt", isCorrect: true },
        { content: "code size", isCorrect: false },
        { content: "file storage", isCorrect: false },
      ],
    },
  ],
  "Developer Handoff Best Practices": [
    {
      content: "What is the purpose of developer handoff?",
      type: "SINGLE_CHOICE",
      explanation: "Developer handoff communicates design specs to engineers.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To communicate design specs and assets to engineers", isCorrect: true },
        { content: "To launch the product", isCorrect: false },
        { content: "To gather user feedback", isCorrect: false },
        { content: "To create marketing materials", isCorrect: false },
      ],
    },
    {
      content: "What tool is commonly used for developer handoff in Figma?",
      type: "SINGLE_CHOICE",
      explanation: "Figma Dev Mode provides detailed specs directly in the design tool.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Figma Dev Mode", isCorrect: true },
        { content: "Google Sheets", isCorrect: false },
        { content: "Microsoft Word", isCorrect: false },
        { content: "Photoshop", isCorrect: false },
      ],
    },
    {
      content: "True or False: Design tokens are important for maintaining consistency between design and code.",
      type: "TRUE_FALSE",
      explanation: "True. Design tokens ensure design decisions translate to code.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Design specifications should include measurements for spacing, ________, and color values.",
      type: "FILL_IN_BLANK",
      explanation: "Complete specs include spacing, typography, and color values.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "typography", isCorrect: true },
        { content: "animations", isCorrect: false },
        { content: "server logs", isCorrect: false },
      ],
    },
  ],
  "CIA Triad & Security Principles": [
    {
      content: "What does the C in the CIA triad stand for?",
      type: "SINGLE_CHOICE",
      explanation: "The CIA triad: Confidentiality, Integrity, Availability.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Confidentiality", isCorrect: true },
        { content: "Compliance", isCorrect: false },
        { content: "Control", isCorrect: false },
        { content: "Countermeasure", isCorrect: false },
      ],
    },
    {
      content: "What does the Availability principle ensure?",
      type: "SINGLE_CHOICE",
      explanation: "Availability ensures systems and data are accessible when needed.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Systems and data are accessible when needed", isCorrect: true },
        { content: "Data is encrypted", isCorrect: false },
        { content: "Only admins can access data", isCorrect: false },
        { content: "Logs are maintained", isCorrect: false },
      ],
    },
    {
      content: "True or False: The CIA triad is the foundation of information security.",
      type: "TRUE_FALSE",
      explanation: "True. The CIA triad guides all security policies and controls.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The I in the CIA triad stands for ________.",
      type: "FILL_IN_BLANK",
      explanation: "Integrity ensures data has not been tampered with.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Integrity", isCorrect: true },
        { content: "Identity", isCorrect: false },
        { content: "Isolation", isCorrect: false },
      ],
    },
  ],
  "Common Attack Vectors": [
    {
      content: "What is SQL injection?",
      type: "SINGLE_CHOICE",
      explanation: "SQL injection inserts malicious SQL code into input fields.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Inserting malicious SQL code into input fields", isCorrect: true },
        { content: "Injecting malware via email", isCorrect: false },
        { content: "Brute-forcing passwords", isCorrect: false },
        { content: "Sniffing network traffic", isCorrect: false },
      ],
    },
    {
      content: "What is phishing?",
      type: "SINGLE_CHOICE",
      explanation: "Phishing uses social engineering via email to steal credentials.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Social engineering via email to steal credentials", isCorrect: true },
        { content: "Physical theft of hardware", isCorrect: false },
        { content: "Denial of service attacks", isCorrect: false },
        { content: "Network packet sniffing", isCorrect: false },
      ],
    },
    {
      content: "True or False: The OWASP Top 10 lists the most critical web application security risks.",
      type: "TRUE_FALSE",
      explanation: "True. OWASP Top 10 is the standard awareness document for web security.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ attacks inject malicious scripts into trusted websites.",
      type: "FILL_IN_BLANK",
      explanation: "XSS (Cross-Site Scripting) injects malicious scripts into web pages.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Cross-Site Scripting (XSS)", isCorrect: true },
        { content: "DDoS", isCorrect: false },
        { content: "Brute force", isCorrect: false },
      ],
    },
  ],
  "Security Frameworks (NIST, ISO 27001)": [
    {
      content: "What is the NIST Cybersecurity Framework?",
      type: "SINGLE_CHOICE",
      explanation: "NIST CSF provides a structured approach to managing cybersecurity risk.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A structured approach to managing cybersecurity risk", isCorrect: true },
        { content: "A programming language", isCorrect: false },
        { content: "An antivirus software", isCorrect: false },
        { content: "A firewall configuration", isCorrect: false },
      ],
    },
    {
      content: "What are the five core functions of the NIST CSF?",
      type: "SINGLE_CHOICE",
      explanation: "Identify, Protect, Detect, Respond, and Recover.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Identify, Protect, Detect, Respond, Recover", isCorrect: true },
        { content: "Plan, Build, Run, Monitor", isCorrect: false },
        { content: "Assess, Design, Implement, Test", isCorrect: false },
        { content: "Scan, Patch, Update, Report", isCorrect: false },
      ],
    },
    {
      content: "True or False: ISO 27001 is a mandatory certification for all organizations.",
      type: "TRUE_FALSE",
      explanation: "False. ISO 27001 is a voluntary standard.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ is an international standard for information security management systems.",
      type: "FILL_IN_BLANK",
      explanation: "ISO 27001 specifies requirements for an ISMS.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "ISO 27001", isCorrect: true },
        { content: "NIST 800-53", isCorrect: false },
        { content: "PCI DSS", isCorrect: false },
      ],
    },
  ],
  "Firewalls & Intrusion Detection": [
    {
      content: "What is the primary function of a firewall?",
      type: "SINGLE_CHOICE",
      explanation: "Firewalls monitor and filter network traffic based on security rules.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Monitor and filter network traffic based on security rules", isCorrect: true },
        { content: "Encrypt all network traffic", isCorrect: false },
        { content: "Store backup data", isCorrect: false },
        { content: "Run antivirus scans", isCorrect: false },
      ],
    },
    {
      content: "What does an IDS (Intrusion Detection System) do?",
      type: "SINGLE_CHOICE",
      explanation: "An IDS monitors network traffic and alerts on suspicious activity.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Monitors traffic and alerts on suspicious activity", isCorrect: true },
        { content: "Blocks all incoming traffic", isCorrect: false },
        { content: "Encrypts database contents", isCorrect: false },
        { content: "Manages user passwords", isCorrect: false },
      ],
    },
    {
      content: "True or False: An IPS (Intrusion Prevention System) can actively block detected threats.",
      type: "TRUE_FALSE",
      explanation: "True. Unlike IDS, IPS can automatically block threats.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ firewall inspects traffic at the application layer of the OSI model.",
      type: "FILL_IN_BLANK",
      explanation: "A WAF (Web Application Firewall) operates at the application layer.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "WAF", isCorrect: true },
        { content: "Packet-filtering", isCorrect: false },
        { content: "Stateless", isCorrect: false },
      ],
    },
  ],
  "VPNs & Encryption Protocols": [
    {
      content: "What does a VPN create for secure communication?",
      type: "SINGLE_CHOICE",
      explanation: "VPNs create encrypted tunnels for secure remote access.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Encrypted tunnels for secure remote access", isCorrect: true },
        { content: "Faster internet connections", isCorrect: false },
        { content: "New IP addresses only", isCorrect: false },
        { content: "Antivirus protection", isCorrect: false },
      ],
    },
    {
      content: "Which VPN protocol is considered modern and fast?",
      type: "SINGLE_CHOICE",
      explanation: "WireGuard is a modern VPN protocol known for speed and simplicity.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "WireGuard", isCorrect: true },
        { content: "PPTP", isCorrect: false },
        { content: "L2TP (alone)", isCorrect: false },
        { content: "HTTP", isCorrect: false },
      ],
    },
    {
      content: "True or False: You should always use strong encryption like AES-256 for VPN connections.",
      type: "TRUE_FALSE",
      explanation: "True. AES-256 is the industry standard for strong encryption.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: TLS/SSL secures web traffic, making the protocol ________.",
      type: "FILL_IN_BLANK",
      explanation: "TLS/SSL encrypts HTTP traffic, creating HTTPS.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "HTTPS", isCorrect: true },
        { content: "HTTP", isCorrect: false },
        { content: "FTP", isCorrect: false },
      ],
    },
  ],
  "Wireless Network Security (WPA3)": [
    {
      content: "What is the latest Wi-Fi security protocol?",
      type: "SINGLE_CHOICE",
      explanation: "WPA3 is the latest and most secure Wi-Fi protocol.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "WPA3", isCorrect: true },
        { content: "WEP", isCorrect: false },
        { content: "WPA", isCorrect: false },
        { content: "WPA2", isCorrect: false },
      ],
    },
    {
      content: "Why is WEP considered insecure?",
      type: "SINGLE_CHOICE",
      explanation: "WEP uses weak encryption that can be cracked in minutes.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "It uses weak encryption that can be easily cracked", isCorrect: true },
        { content: "It is too slow", isCorrect: false },
        { content: "It does not support WPA3", isCorrect: false },
        { content: "It requires too much bandwidth", isCorrect: false },
      ],
    },
    {
      content: "True or False: Disabling SSID broadcast makes a Wi-Fi network secure.",
      type: "TRUE_FALSE",
      explanation: "False. SSID hiding provides no real security.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: WPA3 uses ________ for stronger authentication.",
      type: "FILL_IN_BLANK",
      explanation: "WPA3 uses Simultaneous Authentication of Equals (SAE).",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "SAE", isCorrect: true },
        { content: "PSK", isCorrect: false },
        { content: "WEP", isCorrect: false },
      ],
    },
  ],
  "Symmetric vs Asymmetric Encryption": [
    {
      content: "Which type of encryption uses the same key for both encryption and decryption?",
      type: "SINGLE_CHOICE",
      explanation: "Symmetric encryption uses a single shared key.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Symmetric Encryption", isCorrect: true },
        { content: "Asymmetric Encryption", isCorrect: false },
        { content: "Hashing", isCorrect: false },
        { content: "Tokenization", isCorrect: false },
      ],
    },
    {
      content: "What is the main advantage of asymmetric encryption?",
      type: "SINGLE_CHOICE",
      explanation: "Asymmetric encryption solves the key distribution problem using public/private key pairs.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Solves the key distribution problem with public/private key pairs", isCorrect: true },
        { content: "Is much faster than symmetric encryption", isCorrect: false },
        { content: "Requires no keys at all", isCorrect: false },
        { content: "Can only be used for hashing", isCorrect: false },
      ],
    },
    {
      content: "True or False: RSA is an example of asymmetric encryption.",
      type: "TRUE_FALSE",
      explanation: "True. RSA uses a public key for encryption and a private key for decryption.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: AES is a widely used ________ encryption algorithm.",
      type: "FILL_IN_BLANK",
      explanation: "AES (Advanced Encryption Standard) is a symmetric block cipher.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "symmetric", isCorrect: true },
        { content: "asymmetric", isCorrect: false },
        { content: "hashing", isCorrect: false },
      ],
    },
  ],
  "Hashing & Digital Signatures": [
    {
      content: "What is a hash function?",
      type: "SINGLE_CHOICE",
      explanation: "A hash function produces a fixed-size digest from input data and is one-way.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A one-way function that produces a fixed-size digest from input data", isCorrect: true },
        { content: "An encryption function that can be reversed", isCorrect: false },
        { content: "A function that compresses files", isCorrect: false },
        { content: "A function that generates random passwords", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of salting passwords before hashing?",
      type: "SINGLE_CHOICE",
      explanation: "Salting ensures identical passwords produce different hashes, defeating rainbow tables.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To prevent rainbow table attacks", isCorrect: true },
        { content: "To make passwords shorter", isCorrect: false },
        { content: "To encrypt the database", isCorrect: false },
        { content: "To speed up verification", isCorrect: false },
      ],
    },
    {
      content: "True or False: Digital signatures use the private key to sign and the public key to verify.",
      type: "TRUE_FALSE",
      explanation: "True. The signer uses their private key; anyone with the public key can verify.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: SHA-256 produces a ________-bit hash value.",
      type: "FILL_IN_BLANK",
      explanation: "SHA-256 produces a 256-bit (32-byte) hash digest.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "256", isCorrect: true },
        { content: "128", isCorrect: false },
        { content: "512", isCorrect: false },
      ],
    },
  ],
  "Public Key Infrastructure (PKI)": [
    {
      content: "What does PKI provide?",
      type: "SINGLE_CHOICE",
      explanation: "PKI binds public keys to identities through digital certificates.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Binding public keys to identities through digital certificates", isCorrect: true },
        { content: "Encrypting all network traffic", isCorrect: false },
        { content: "Managing firewall rules", isCorrect: false },
        { content: "Storing passwords securely", isCorrect: false },
      ],
    },
    {
      content: "What is a Certificate Authority (CA)?",
      type: "SINGLE_CHOICE",
      explanation: "A CA is a trusted entity that issues and manages digital certificates.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A trusted entity that issues digital certificates", isCorrect: true },
        { content: "A type of encryption algorithm", isCorrect: false },
        { content: "A firewall configuration", isCorrect: false },
        { content: "A password manager", isCorrect: false },
      ],
    },
    {
      content: "True or False: X.509 is the standard format for public key certificates.",
      type: "TRUE_FALSE",
      explanation: "True. X.509 defines the format of public key certificates used in TLS/SSL.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ Protocol is the foundation of TLS/SSL encryption.",
      type: "FILL_IN_BLANK",
      explanation: "TLS (Transport Layer Security) secures communications over networks.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "TLS", isCorrect: true },
        { content: "HTTP", isCorrect: false },
        { content: "FTP", isCorrect: false },
      ],
    },
  ],
  "Penetration Testing Methodology": [
    {
      content: "What is the first phase of a penetration test?",
      type: "SINGLE_CHOICE",
      explanation: "Reconnaissance (information gathering) is the first phase.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Reconnaissance (information gathering)", isCorrect: true },
        { content: "Exploitation", isCorrect: false },
        { content: "Reporting", isCorrect: false },
        { content: "Scanning", isCorrect: false },
      ],
    },
    {
      content: "What is the difference between black-box and white-box testing?",
      type: "SINGLE_CHOICE",
      explanation: "Black-box: no prior knowledge. White-box: full knowledge of the system.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Black-box has no prior knowledge; white-box has full knowledge", isCorrect: true },
        { content: "Black-box is faster", isCorrect: false },
        { content: "White-box is less thorough", isCorrect: false },
        { content: "They are the same thing", isCorrect: false },
      ],
    },
    {
      content: "True or False: You should always get written authorization before performing a penetration test.",
      type: "TRUE_FALSE",
      explanation: "True. Unauthorized testing is illegal regardless of intent.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ phase involves documenting findings and providing remediation recommendations.",
      type: "FILL_IN_BLANK",
      explanation: "The reporting phase documents all findings and provides actionable recommendations.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "reporting", isCorrect: true },
        { content: "scanning", isCorrect: false },
        { content: "exploitation", isCorrect: false },
      ],
    },
  ],
  "Vulnerability Scanning with Nmap": [
    {
      content: "What does Nmap stand for?",
      type: "SINGLE_CHOICE",
      explanation: "Nmap stands for Network Mapper.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Network Mapper", isCorrect: true },
        { content: "Network Monitor", isCorrect: false },
        { content: "Node Manager", isCorrect: false },
        { content: "Net Mapping", isCorrect: false },
      ],
    },
    {
      content: "Which Nmap flag enables service version detection?",
      type: "SINGLE_CHOICE",
      explanation: "The -sV flag enables service version detection on open ports.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "-sV", isCorrect: true },
        { content: "-sS", isCorrect: false },
        { content: "-sT", isCorrect: false },
        { content: "-sU", isCorrect: false },
      ],
    },
    {
      content: "True or False: Nmap should only be used on networks you own or have authorization to scan.",
      type: "TRUE_FALSE",
      explanation: "True. Scanning networks without authorization is illegal.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The Nmap ________ flag runs vulnerability detection scripts.",
      type: "FILL_IN_BLANK",
      explanation: "The --script vuln flag runs Nmap's vulnerability detection scripts.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "--script vuln", isCorrect: true },
        { content: "--script auth", isCorrect: false },
        { content: "--script brute", isCorrect: false },
      ],
    },
  ],
  "Incident Response Playbook": [
    {
      content: "What is the first step in incident response?",
      type: "SINGLE_CHOICE",
      explanation: "Preparation is the first step - having plans and tools ready before an incident.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Preparation", isCorrect: true },
        { content: "Detection", isCorrect: false },
        { content: "Containment", isCorrect: false },
        { content: "Recovery", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of containment in incident response?",
      type: "SINGLE_CHOICE",
      explanation: "Containment limits the damage and prevents the incident from spreading.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "To limit damage and prevent the incident from spreading", isCorrect: true },
        { content: "To delete all logs", isCorrect: false },
        { content: "To restart all servers", isCorrect: false },
        { content: "To pay the attacker", isCorrect: false },
      ],
    },
    {
      content: "True or False: Evidence preservation is critical during incident response.",
      type: "TRUE_FALSE",
      explanation: "True. Preserving evidence is essential for forensic analysis and legal proceedings.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ phase involves restoring systems to normal operations after an incident.",
      type: "FILL_IN_BLANK",
      explanation: "The recovery phase restores affected systems and validates they are secure.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "recovery", isCorrect: true },
        { content: "detection", isCorrect: false },
        { content: "preparation", isCorrect: false },
      ],
    },
  ],
  "EC2 Instances & Security Groups": [
    {
      content: "What is Amazon EC2?",
      type: "SINGLE_CHOICE",
      explanation: "EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Resizable virtual servers in the cloud", isCorrect: true },
        { content: "A database service", isCorrect: false },
        { content: "A file storage service", isCorrect: false },
        { content: "A content delivery network", isCorrect: false },
      ],
    },
    {
      content: "What is the purpose of a Security Group in AWS?",
      type: "SINGLE_CHOICE",
      explanation: "Security Groups act as virtual firewalls controlling inbound and outbound traffic.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Virtual firewalls controlling inbound and outbound traffic", isCorrect: true },
        { content: "User access management", isCorrect: false },
        { content: "Cost management", isCorrect: false },
        { content: "Database configuration", isCorrect: false },
      ],
    },
    {
      content: "True or False: EC2 instances are billed by the second with a one-minute minimum.",
      type: "TRUE_FALSE",
      explanation: "True. AWS bills per second with a one-minute minimum for EC2 instances.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: An AMI (________ Machine Image) provides the software configuration for an EC2 instance.",
      type: "FILL_IN_BLANK",
      explanation: "An AMI includes the operating system, application server, and applications.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Amazon", isCorrect: true },
        { content: "Amazon Web", isCorrect: false },
        { content: "Advanced", isCorrect: false },
      ],
    },
  ],
  "S3 Bucket Management": [
    {
      content: "What does S3 stand for in AWS?",
      type: "SINGLE_CHOICE",
      explanation: "S3 stands for Simple Storage Service.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Simple Storage Service", isCorrect: true },
        { content: "Secure Storage System", isCorrect: false },
        { content: "Scalable Storage Solution", isCorrect: false },
        { content: "Server Storage Service", isCorrect: false },
      ],
    },
    {
      content: "What durability does Amazon S3 provide?",
      type: "SINGLE_CHOICE",
      explanation: "S3 provides 99.999999999% (11 nines) durability for objects.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "99.999999999% (11 nines)", isCorrect: true },
        { content: "99.99%", isCorrect: false },
        { content: "99.9%", isCorrect: false },
        { content: "100%", isCorrect: false },
      ],
    },
    {
      content: "True or False: S3 supports server-side encryption for data at rest.",
      type: "TRUE_FALSE",
      explanation: "True. S3 supports SSE-S3, SSE-KMS, and SSE-C for encrypting data at rest.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: S3 ________ allow automatic migration of objects between storage classes.",
      type: "FILL_IN_BLANK",
      explanation: "Lifecycle policies automatically transition objects between storage classes.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "lifecycle policies", isCorrect: true },
        { content: "access logs", isCorrect: false },
        { content: "versioning rules", isCorrect: false },
      ],
    },
  ],
  "VPC & Networking Basics": [
    {
      content: "What does VPC stand for in AWS?",
      type: "SINGLE_CHOICE",
      explanation: "VPC stands for Virtual Private Cloud.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Virtual Private Cloud", isCorrect: true },
        { content: "Virtual Public Connection", isCorrect: false },
        { content: "Verified Private Channel", isCorrect: false },
        { content: "Virtual Protocol Control", isCorrect: false },
      ],
    },
    {
      content: "What is a subnet in AWS VPC?",
      type: "SINGLE_CHOICE",
      explanation: "A subnet is a range of IP addresses within a VPC where you can place resources.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A range of IP addresses within a VPC", isCorrect: true },
        { content: "A type of EC2 instance", isCorrect: false },
        { content: "A security rule", isCorrect: false },
        { content: "A billing category", isCorrect: false },
      ],
    },
    {
      content: "True or False: Public subnets have a route to an Internet Gateway.",
      type: "TRUE_FALSE",
      explanation: "True. Public subnets have a route table entry pointing to an Internet Gateway.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ Gateway enables communication between your VPC and the internet.",
      type: "FILL_IN_BLANK",
      explanation: "An Internet Gateway allows VPC resources to communicate with the internet.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Internet", isCorrect: true },
        { content: "Virtual Private", isCorrect: false },
        { content: "NAT", isCorrect: false },
      ],
    },
  ],
  "AWS Lambda & API Gateway": [
    {
      content: "What is AWS Lambda?",
      type: "SINGLE_CHOICE",
      explanation: "Lambda is a serverless compute service that runs code without provisioning servers.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Serverless compute service that runs code without provisioning servers", isCorrect: true },
        { content: "A virtual machine service", isCorrect: false },
        { content: "A container orchestration service", isCorrect: false },
        { content: "A database service", isCorrect: false },
      ],
    },
    {
      content: "What is the primary benefit of Lambda's serverless model?",
      type: "SINGLE_CHOICE",
      explanation: "No server management required and pay-per-use pricing.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "No server management required and pay-per-use pricing", isCorrect: true },
        { content: "Unlimited storage capacity", isCorrect: false },
        { content: "Guaranteed 100% uptime", isCorrect: false },
        { content: "Full control over operating system", isCorrect: false },
      ],
    },
    {
      content: "True or False: Lambda functions automatically scale based on incoming request traffic.",
      type: "TRUE_FALSE",
      explanation: "True. Lambda automatically scales from zero to thousands of concurrent requests.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Amazon ________ creates, publishes, and secures APIs at any scale.",
      type: "FILL_IN_BLANK",
      explanation: "API Gateway handles API requests, throttling, and authentication for Lambda functions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "API Gateway", isCorrect: true },
        { content: "CloudFront", isCorrect: false },
        { content: "Route 53", isCorrect: false },
      ],
    },
  ],
  "RDS & DynamoDB": [
    {
      content: "What type of database is Amazon RDS?",
      type: "SINGLE_CHOICE",
      explanation: "RDS is a managed relational database service supporting MySQL, PostgreSQL, Aurora, etc.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Managed relational database service", isCorrect: true },
        { content: "NoSQL key-value store", isCorrect: false },
        { content: "Object storage service", isCorrect: false },
        { content: "In-memory cache", isCorrect: false },
      ],
    },
    {
      content: "What feature provides high availability for RDS?",
      type: "SINGLE_CHOICE",
      explanation: "Multi-AZ deployments provide automatic failover to a standby replica.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Multi-AZ deployments", isCorrect: true },
        { content: "Read Replicas", isCorrect: false },
        { content: "Storage encryption", isCorrect: false },
        { content: "Automated backups", isCorrect: false },
      ],
    },
    {
      content: "True or False: DynamoDB is a serverless NoSQL database service offered by AWS.",
      type: "TRUE_FALSE",
      explanation: "True. DynamoDB is a fully managed NoSQL database with single-digit millisecond latency.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: DynamoDB uses ________ keys for even data distribution across partitions.",
      type: "FILL_IN_BLANK",
      explanation: "Partition keys determine how data is distributed across DynamoDB partitions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "partition", isCorrect: true },
        { content: "sort", isCorrect: false },
        { content: "global", isCorrect: false },
      ],
    },
  ],
  "Building Serverless APIs": [
    {
      content: "What is a serverless architecture?",
      type: "SINGLE_CHOICE",
      explanation: "Serverless architecture lets you build applications without managing servers.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Building applications without managing servers", isCorrect: true },
        { content: "Using only physical servers", isCorrect: false },
        { content: "Running applications on your own PC", isCorrect: false },
        { content: "Using only database services", isCorrect: false },
      ],
    },
    {
      content: "Which AWS services are commonly combined for serverless APIs?",
      type: "SINGLE_CHOICE",
      explanation: "Lambda + API Gateway + DynamoDB is the standard serverless API stack.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Lambda, API Gateway, and DynamoDB", isCorrect: true },
        { content: "EC2, S3, and RDS", isCorrect: false },
        { content: "ECS, ECR, and ElastiCache", isCorrect: false },
        { content: "LightSail, Route53, and CloudWatch", isCorrect: false },
      ],
    },
    {
      content: "True or False: Serverless applications can still have cold start latency issues.",
      type: "TRUE_FALSE",
      explanation: "True. Lambda functions may experience cold starts when invoked after being idle.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: AWS ________ provides a fully managed NoSQL database for serverless applications.",
      type: "FILL_IN_BLANK",
      explanation: "DynamoDB is the standard NoSQL choice for serverless architectures on AWS.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "DynamoDB", isCorrect: true },
        { content: "RDS", isCorrect: false },
        { content: "Aurora", isCorrect: false },
      ],
    },
  ],
  "CloudFormation & Infrastructure as Code": [
    {
      content: "What is Infrastructure as Code (IaC)?",
      type: "SINGLE_CHOICE",
      explanation: "IaC manages infrastructure through machine-readable configuration files.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Managing infrastructure through configuration files", isCorrect: true },
        { content: "Writing documentation for infrastructure", isCorrect: false },
        { content: "Manually configuring servers", isCorrect: false },
        { content: "Using a GUI to create resources", isCorrect: false },
      ],
    },
    {
      content: "What language does CloudFormation use for templates?",
      type: "SINGLE_CHOICE",
      explanation: "CloudFormation templates are written in JSON or YAML.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "JSON or YAML", isCorrect: true },
        { content: "Python", isCorrect: false },
        { content: "Terraform HCL", isCorrect: false },
        { content: "XML", isCorrect: false },
      ],
    },
    {
      content: "True or False: CloudFormation can automatically roll back changes if deployment fails.",
      type: "TRUE_FALSE",
      explanation: "True. CloudFormation automatically rolls back to the previous state on failure.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A CloudFormation ________ defines the AWS resources to be created and their configurations.",
      type: "FILL_IN_BLANK",
      explanation: "A template defines all resources, parameters, and outputs for a stack.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "template", isCorrect: true },
        { content: "script", isCorrect: false },
        { content: "manifest", isCorrect: false },
      ],
    },
  ],
  "CI/CD with CodePipeline": [
    {
      content: "What does CI/CD stand for?",
      type: "SINGLE_CHOICE",
      explanation: "CI = Continuous Integration, CD = Continuous Delivery/Deployment.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Continuous Integration / Continuous Delivery", isCorrect: true },
        { content: "Code Integration / Code Deployment", isCorrect: false },
        { content: "Cloud Infrastructure / Cloud Distribution", isCorrect: false },
        { content: "Central Integration / Central Delivery", isCorrect: false },
      ],
    },
    {
      content: "What are the stages in AWS CodePipeline?",
      type: "SINGLE_CHOICE",
      explanation: "Source, Build, and Deploy are the core stages.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Source, Build, Deploy", isCorrect: true },
        { content: "Plan, Execute, Monitor", isCorrect: false },
        { content: "Design, Develop, Test", isCorrect: false },
        { content: "Create, Configure, Commit", isCorrect: false },
      ],
    },
    {
      content: "True or False: AWS CodePipeline can integrate with GitHub as a source.",
      type: "TRUE_FALSE",
      explanation: "True. CodePipeline supports CodeCommit, GitHub, and S3 as source providers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: AWS ________ automates code deployments to EC2, Lambda, and on-premises servers.",
      type: "FILL_IN_BLANK",
      explanation: "CodeDeploy automates application deployments across compute services.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "CodeDeploy", isCorrect: true },
        { content: "CodeCommit", isCorrect: false },
        { content: "CodeBuild", isCorrect: false },
      ],
    },
  ],
  "Monitoring with CloudWatch": [
    {
      content: "What is Amazon CloudWatch?",
      type: "SINGLE_CHOICE",
      explanation: "CloudWatch monitors AWS resources and applications with metrics, logs, and alarms.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Monitoring service for metrics, logs, and alarms", isCorrect: true },
        { content: "A deployment tool", isCorrect: false },
        { content: "A database service", isCorrect: false },
        { content: "A networking service", isCorrect: false },
      ],
    },
    {
      content: "What is a CloudWatch alarm?",
      type: "SINGLE_CHOICE",
      explanation: "Alarms watch metrics and trigger actions when thresholds are breached.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Watches metrics and triggers actions when thresholds are breached", isCorrect: true },
        { content: "Sends emails to administrators", isCorrect: false },
        { content: "Creates new EC2 instances", isCorrect: false },
        { content: "Deletes old log files", isCorrect: false },
      ],
    },
    {
      content: "True or False: CloudWatch Logs can be used to store and analyze application logs.",
      type: "TRUE_FALSE",
      explanation: "True. CloudWatch Logs provides centralized storage and analysis of log data.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: CloudWatch ________ provides real-time monitoring of AWS resources with visual dashboards.",
      type: "FILL_IN_BLANK",
      explanation: "CloudWatch Dashboards provide customizable visualizations of metrics and logs.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Dashboards", isCorrect: true },
        { content: "Alarms", isCorrect: false },
        { content: "Metrics", isCorrect: false },
      ],
    },
  ],
  "How Blockchain Works": [
    {
      content: "What is the primary purpose of a blockchain?",
      type: "SINGLE_CHOICE",
      explanation: "A blockchain is a distributed, immutable ledger for transactions.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To create a distributed, immutable ledger for transactions", isCorrect: true },
        { content: "To store files in the cloud", isCorrect: false },
        { content: "To replace traditional databases entirely", isCorrect: false },
        { content: "To mine cryptocurrencies automatically", isCorrect: false },
      ],
    },
    {
      content: "What is a block in a blockchain?",
      type: "SINGLE_CHOICE",
      explanation: "A block contains a batch of transactions, a timestamp, and a hash of the previous block.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A batch of transactions with a hash linking to the previous block", isCorrect: true },
        { content: "A single transaction record", isCorrect: false },
        { content: "A type of cryptocurrency", isCorrect: false },
        { content: "A mining algorithm", isCorrect: false },
      ],
    },
    {
      content: "True or False: Blockchain technology is decentralized, meaning no single entity controls it.",
      type: "TRUE_FALSE",
      explanation: "True. Blockchain distributes data across a network of nodes.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Each block in a blockchain contains a ________ that links it to the previous block.",
      type: "FILL_IN_BLANK",
      explanation: "The hash creates a chain by linking each block to the previous one.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "hash", isCorrect: true },
        { content: "password", isCorrect: false },
        { content: "key", isCorrect: false },
      ],
    },
  ],
  "Consensus Mechanisms": [
    {
      content: "What is Proof of Work (PoW)?",
      type: "SINGLE_CHOICE",
      explanation: "PoW requires miners to solve cryptographic puzzles to validate transactions.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Miners solve cryptographic puzzles to validate transactions", isCorrect: true },
        { content: "Validators stake tokens to validate", isCorrect: false },
        { content: "A voting system among nodes", isCorrect: false },
        { content: "Random selection of validators", isCorrect: false },
      ],
    },
    {
      content: "Which consensus mechanism does Ethereum use after The Merge?",
      type: "SINGLE_CHOICE",
      explanation: "Ethereum transitioned from PoW to Proof of Stake in September 2022.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Proof of Stake (PoS)", isCorrect: true },
        { content: "Proof of Work (PoW)", isCorrect: false },
        { content: "Proof of Authority (PoA)", isCorrect: false },
        { content: "Delegated Proof of Stake (DPoS)", isCorrect: false },
      ],
    },
    {
      content: "True or False: Proof of Stake is more energy-efficient than Proof of Work.",
      type: "TRUE_FALSE",
      explanation: "True. PoS reduces energy consumption by ~99.95% compared to PoW.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: In Proof of Stake, validators are chosen based on the amount of ________ they stake.",
      type: "FILL_IN_BLANK",
      explanation: "Validators lock up cryptocurrency as collateral to participate in block validation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "cryptocurrency", isCorrect: true },
        { content: "computation", isCorrect: false },
        { content: "bandwidth", isCorrect: false },
      ],
    },
  ],
  "Bitcoin vs Ethereum": [
    {
      content: "What is the primary purpose of Bitcoin?",
      type: "SINGLE_CHOICE",
      explanation: "Bitcoin was designed as a peer-to-peer digital currency.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A peer-to-peer digital currency", isCorrect: true },
        { content: "A smart contract platform", isCorrect: false },
        { content: "A social media network", isCorrect: false },
        { content: "A cloud storage service", isCorrect: false },
      ],
    },
    {
      content: "What makes Ethereum different from Bitcoin?",
      type: "SINGLE_CHOICE",
      explanation: "Ethereum supports smart contracts and decentralized applications (DApps).",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Supports smart contracts and DApps", isCorrect: true },
        { content: "Uses Proof of Work exclusively", isCorrect: false },
        { content: "Has faster block times but lower security", isCorrect: false },
        { content: "Is only used for payments", isCorrect: false },
      ],
    },
    {
      content: "True or False: Bitcoin has a maximum supply cap of 21 million coins.",
      type: "TRUE_FALSE",
      explanation: "True. Bitcoin has a hard cap of 21 million coins, making it deflationary.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ is the reward miners receive for adding a new block to the Bitcoin blockchain.",
      type: "FILL_IN_BLANK",
      explanation: "The block reward (currently 6.25 BTC) incentivizes miners to secure the network.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "block reward", isCorrect: true },
        { content: "transaction fee", isCorrect: false },
        { content: "gas fee", isCorrect: false },
      ],
    },
  ],
  "Introduction to Solidity": [
    {
      content: "What is Solidity?",
      type: "SINGLE_CHOICE",
      explanation: "Solidity is a programming language for writing smart contracts on Ethereum.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A language for writing smart contracts on Ethereum", isCorrect: true },
        { content: "A database query language", isCorrect: false },
        { content: "A web development framework", isCorrect: false },
        { content: "A mobile app language", isCorrect: false },
      ],
    },
    {
      content: "What is a smart contract?",
      type: "SINGLE_CHOICE",
      explanation: "A smart contract is self-executing code deployed on a blockchain that runs when conditions are met.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Self-executing code deployed on a blockchain", isCorrect: true },
        { content: "A legal document stored online", isCorrect: false },
        { content: "A type of cryptocurrency wallet", isCorrect: false },
        { content: "A mining algorithm", isCorrect: false },
      ],
    },
    {
      content: "True or False: Once deployed, a smart contract cannot be modified.",
      type: "TRUE_FALSE",
      explanation: "True. Smart contracts are immutable once deployed, which is both a feature and a limitation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Solidity files have the ________ file extension.",
      type: "FILL_IN_BLANK",
      explanation: "Solidity source files use the .sol extension.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: ".sol", isCorrect: true },
        { content: ".eth", isCorrect: false },
        { content: ".solc", isCorrect: false },
      ],
    },
  ],
  "ERC-20 Token Standard": [
    {
      content: "What is the ERC-20 standard used for?",
      type: "SINGLE_CHOICE",
      explanation: "ERC-20 defines a standard interface for fungible tokens on Ethereum.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Creating fungible tokens on Ethereum", isCorrect: true },
        { content: "Creating non-fungible tokens (NFTs)", isCorrect: false },
        { content: "Mining new blocks", isCorrect: false },
        { content: "Running smart contract tests", isCorrect: false },
      ],
    },
    {
      content: "Which function in ERC-20 returns the total supply of tokens?",
      type: "SINGLE_CHOICE",
      explanation: "The totalSupply() function returns the total number of tokens in existence.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "totalSupply()", isCorrect: true },
        { content: "getSupply()", isCorrect: false },
        { content: "maxSupply()", isCorrect: false },
        { content: "currentSupply()", isCorrect: false },
      ],
    },
    {
      content: "True or False: OpenZeppelin provides battle-tested implementations of ERC-20.",
      type: "TRUE_FALSE",
      explanation: "True. OpenZeppelin Contracts is a widely used library for secure smart contract development.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function allows a third party to spend tokens on behalf of the token holder.",
      type: "FILL_IN_BLANK",
      explanation: "The approve() function sets a spending allowance for a designated address.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "approve", isCorrect: true },
        { content: "transfer", isCorrect: false },
        { content: "mint", isCorrect: false },
      ],
    },
  ],
  "Building DApps with Web3.js": [
    {
      content: "What is Web3.js?",
      type: "SINGLE_CHOICE",
      explanation: "Web3.js is a JavaScript library for interacting with Ethereum blockchain.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A JavaScript library for interacting with Ethereum", isCorrect: true },
        { content: "A web development framework", isCorrect: false },
        { content: "A database driver", isCorrect: false },
        { content: "A CSS framework", isCorrect: false },
      ],
    },
    {
      content: "What is MetaMask?",
      type: "SINGLE_CHOICE",
      explanation: "MetaMask is a browser extension wallet for interacting with Ethereum DApps.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A browser extension wallet for Ethereum DApps", isCorrect: true },
        { content: "A mining software", isCorrect: false },
        { content: "A blockchain explorer", isCorrect: false },
        { content: "A programming language", isCorrect: false },
      ],
    },
    {
      content: "True or False: DApps run on a decentralized peer-to-peer network.",
      type: "TRUE_FALSE",
      explanation: "True. DApps are not controlled by any single entity and run on blockchain networks.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ are fees paid to process transactions on the Ethereum network.",
      type: "FILL_IN_BLANK",
      explanation: "Gas fees compensate miners/validators for computing resources used to process transactions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Gas fees", isCorrect: true },
        { content: "Transaction taxes", isCorrect: false },
        { content: "Network dues", isCorrect: false },
      ],
    },
  ],
  "DeFi Protocols Explained": [
    {
      content: "What is DeFi (Decentralized Finance)?",
      type: "SINGLE_CHOICE",
      explanation: "DeFi recreates traditional financial services using blockchain and smart contracts.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Financial services built on blockchain using smart contracts", isCorrect: true },
        { content: "A type of cryptocurrency mining", isCorrect: false },
        { content: "Traditional banking services", isCorrect: false },
        { content: "A stock trading platform", isCorrect: false },
      ],
    },
    {
      content: "What is an AMM (Automated Market Maker)?",
      type: "SINGLE_CHOICE",
      explanation: "AMMs use liquidity pools and algorithms to enable decentralized token trading.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Uses liquidity pools and algorithms for decentralized trading", isCorrect: true },
        { content: "A type of mining hardware", isCorrect: false },
        { content: "A wallet for storing tokens", isCorrect: false },
        { content: "A governance token", isCorrect: false },
      ],
    },
    {
      content: "True or False: Uniswap is one of the most popular DEX (Decentralized Exchange) protocols.",
      type: "TRUE_FALSE",
      explanation: "True. Uniswap pioneered the AMM model and is a leading DEX on Ethereum.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: TVL stands for ________ Value Locked, a key metric in DeFi.",
      type: "FILL_IN_BLANK",
      explanation: "TVL measures the total assets deposited in DeFi protocols.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Total", isCorrect: true },
        { content: "Token", isCorrect: false },
        { content: "Transaction", isCorrect: false },
      ],
    },
  ],
  "Yield Farming & Liquidity Pools": [
    {
      content: "What is yield farming?",
      type: "SINGLE_CHOICE",
      explanation: "Yield farming involves moving assets between protocols to maximize returns.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Moving assets between protocols to maximize returns", isCorrect: true },
        { content: "Growing crops on a farm using blockchain", isCorrect: false },
        { content: "Mining Bitcoin with agricultural energy", isCorrect: false },
        { content: "Trading tokens on a DEX", isCorrect: false },
      ],
    },
    {
      content: "What is impermanent loss?",
      type: "SINGLE_CHOICE",
      explanation: "Impermanent loss occurs when pool price diverges from market price for LPs.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "Loss when pool price diverges from market price", isCorrect: true },
        { content: "A permanent loss of cryptocurrency", isCorrect: false },
        { content: "Loss from a 51% attack", isCorrect: false },
        { content: "Loss from smart contract bugs", isCorrect: false },
      ],
    },
    {
      content: "True or False: Liquidity providers earn trading fees proportional to their share of the pool.",
      type: "TRUE_FALSE",
      explanation: "True. LPs earn a portion of trading fees based on their contribution to the liquidity pool.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Always check a DeFi protocol's ________ status before depositing funds.",
      type: "FILL_IN_BLANK",
      explanation: "Smart contract audits assess security and identify vulnerabilities.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "audit", isCorrect: true },
        { content: "price", isCorrect: false },
        { content: "social media", isCorrect: false },
      ],
    },
  ],
  "Tokenomics Design Principles": [
    {
      content: "What is tokenomics?",
      type: "SINGLE_CHOICE",
      explanation: "Tokenomics studies the economic design of cryptocurrency tokens.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "The economic design and incentive structure of tokens", isCorrect: true },
        { content: "The technology behind blockchain", isCorrect: false },
        { content: "A type of mining algorithm", isCorrect: false },
        { content: "A wallet feature", isCorrect: false },
      ],
    },
    {
      content: "What is token burning?",
      type: "SINGLE_CHOICE",
      explanation: "Token burning permanently removes tokens from circulation to reduce supply.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Permanently removing tokens from circulation", isCorrect: true },
        { content: "Sending tokens to a wrong address", isCorrect: false },
        { content: "Staking tokens for rewards", isCorrect: false },
        { content: "Swapping tokens on an exchange", isCorrect: false },
      ],
    },
    {
      content: "True or False: A fixed token supply creates deflationary pressure.",
      type: "TRUE_FALSE",
      explanation: "True. A fixed supply combined with demand creates scarcity and deflationary pressure.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ ratio determines the rate at which new tokens are released.",
      type: "FILL_IN_BLANK",
      explanation: "Emission or release rate controls how quickly tokens enter circulation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "emission", isCorrect: true },
        { content: "exchange", isCorrect: false },
        { content: "encryption", isCorrect: false },
      ],
    },
  ],
  "React Native vs Native: When to Choose What": [
    {
      content: "What is React Native?",
      type: "SINGLE_CHOICE",
      explanation: "React Native is a framework for building cross-platform mobile apps using JavaScript and React.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A framework for building cross-platform mobile apps", isCorrect: true },
        { content: "A native iOS development language", isCorrect: false },
        { content: "An Android-only SDK", isCorrect: false },
        { content: "A web development framework", isCorrect: false },
      ],
    },
    {
      content: "When should you choose native development over React Native?",
      type: "SINGLE_CHOICE",
      explanation: "Native development is preferred for performance-critical apps or when platform-specific APIs are needed.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "For performance-critical apps requiring platform-specific APIs", isCorrect: true },
        { content: "For simple CRUD applications", isCorrect: false },
        { content: "When budget is the primary concern", isCorrect: false },
        { content: "When targeting only one platform", isCorrect: false },
      ],
    },
    {
      content: "True or False: React Native renders using native UI components, not web views.",
      type: "TRUE_FALSE",
      explanation: "True. React Native maps JavaScript components to actual native platform widgets.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: React Native uses a ________ thread to run JavaScript code separately from the UI thread.",
      type: "FILL_IN_BLANK",
      explanation: "The JavaScript thread runs your app logic while the UI thread handles rendering.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "JavaScript", isCorrect: true },
        { content: "native", isCorrect: false },
        { content: "render", isCorrect: false },
      ],
    },
  ],
  "Core Components & Styling": [
    {
      content: "Which React Native component is equivalent to an HTML div?",
      type: "SINGLE_CHOICE",
      explanation: "The View component is the fundamental building block, equivalent to a div.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "View", isCorrect: true },
        { content: "Text", isCorrect: false },
        { content: "Container", isCorrect: false },
        { content: "Section", isCorrect: false },
      ],
    },
    {
      content: "What is the default flexDirection in React Native?",
      type: "SINGLE_CHOICE",
      explanation: "React Native defaults flexDirection to column, unlike CSS which defaults to row.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "column", isCorrect: true },
        { content: "row", isCorrect: false },
        { content: "column-reverse", isCorrect: false },
        { content: "row-reverse", isCorrect: false },
      ],
    },
    {
      content: "True or False: StyleSheet.create() provides performance optimization over inline styles.",
      type: "TRUE_FALSE",
      explanation: "True. StyleSheet.create() validates styles and sends them over the bridge only once.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ component is used to display text in React Native.",
      type: "FILL_IN_BLANK",
      explanation: "Text is a core component for displaying strings and nested text elements.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Text", isCorrect: true },
        { content: "Label", isCorrect: false },
        { content: "Span", isCorrect: false },
      ],
    },
  ],
  "Expo CLI & Project Setup": [
    {
      content: "What is Expo?",
      type: "SINGLE_CHOICE",
      explanation: "Expo is a framework and toolchain for React Native that simplifies development.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A framework and toolchain for React Native", isCorrect: true },
        { content: "A testing framework", isCorrect: false },
        { content: "A database service", isCorrect: false },
        { content: "A state management library", isCorrect: false },
      ],
    },
    {
      content: "What command creates a new Expo project?",
      type: "SINGLE_CHOICE",
      explanation: "npx create-expo-app is the recommended way to start a new Expo project.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "npx create-expo-app", isCorrect: true },
        { content: "npm init react-native", isCorrect: false },
        { content: "expo new project", isCorrect: false },
        { content: "npx react-native init", isCorrect: false },
      ],
    },
    {
      content: "True or False: Expo supports over-the-air updates without app store submission.",
      type: "TRUE_FALSE",
      explanation: "True. Expo OTA updates allow pushing JavaScript updates without going through app stores.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Expo provides access to native APIs through ________ without ejecting.",
      type: "FILL_IN_BLANK",
      explanation: "Expo SDK provides JavaScript wrappers for native device features.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Expo SDK", isCorrect: true },
        { content: "React Native CLI", isCorrect: false },
        { content: "Node modules", isCorrect: false },
      ],
    },
  ],
  "React Navigation Stack & Tabs": [
    {
      content: "What is React Navigation?",
      type: "SINGLE_CHOICE",
      explanation: "React Navigation is a library for screen navigation in React Native apps.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A library for screen navigation in React Native", isCorrect: true },
        { content: "A state management library", isCorrect: false },
        { content: "A styling framework", isCorrect: false },
        { content: "A testing library", isCorrect: false },
      ],
    },
    {
      content: "What is the difference between Stack and Tab navigators?",
      type: "SINGLE_CHOICE",
      explanation: "Stack uses push/pop transitions; Tab uses bottom/top tab bar navigation.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Stack uses push/pop transitions; Tab uses tab bar navigation", isCorrect: true },
        { content: "They are identical", isCorrect: false },
        { content: "Stack is for iOS; Tab is for Android", isCorrect: false },
        { content: "Tab is faster than Stack", isCorrect: false },
      ],
    },
    {
      content: "True or False: React Navigation supports deep linking for direct screen access.",
      type: "TRUE_FALSE",
      explanation: "True. Deep linking allows users to navigate directly to specific screens from external links.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ method navigates to a new screen and pushes it onto the stack.",
      type: "FILL_IN_BLANK",
      explanation: "navigation.push() adds a new screen to the navigation stack.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "push", isCorrect: true },
        { content: "pop", isCorrect: false },
        { content: "navigate", isCorrect: false },
      ],
    },
  ],
  "State Management with Context & Zustand": [
    {
      content: "What is Zustand?",
      type: "SINGLE_CHOICE",
      explanation: "Zustand is a minimal state management library that requires no providers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A minimal state management library without providers", isCorrect: true },
        { content: "A routing library", isCorrect: false },
        { content: "A styling framework", isCorrect: false },
        { content: "A testing utility", isCorrect: false },
      ],
    },
    {
      content: "What problem does Context API solve in React Native?",
      type: "SINGLE_CHOICE",
      explanation: "Context API avoids prop drilling by passing data through the component tree.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Avoids prop drilling through deeply nested components", isCorrect: true },
        { content: "Provides database access", isCorrect: false },
        { content: "Manages navigation", isCorrect: false },
        { content: "Handles push notifications", isCorrect: false },
      ],
    },
    {
      content: "True or False: Zustand requires wrapping your app in a Provider component.",
      type: "TRUE_FALSE",
      explanation: "False. Unlike Redux, Zustand works outside React components and needs no providers.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: For async state, combine Zustand with React ________ for caching and refetching.",
      type: "FILL_IN_BLANK",
      explanation: "React Query (TanStack Query) handles server state, caching, and refetching.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Query", isCorrect: true },
        { content: "Router", isCorrect: false },
        { content: "Form", isCorrect: false },
      ],
    },
  ],
  "Passing Data Between Screens": [
    {
      content: "How do you pass data between screens in React Navigation?",
      type: "SINGLE_CHOICE",
      explanation: "Data is passed through route params when navigating between screens.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Through route params when navigating", isCorrect: true },
        { content: "Using global variables", isCorrect: false },
        { content: "Through localStorage", isCorrect: false },
        { content: "Via URL query strings only", isCorrect: false },
      ],
    },
    {
      content: "What is the useRoute hook used for?",
      type: "SINGLE_CHOICE",
      explanation: "useRoute provides access to the current route's params and configuration.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Accessing the current route's params and configuration", isCorrect: true },
        { content: "Creating new routes", isCorrect: false },
        { content: "Deleting screens", isCorrect: false },
        { content: "Managing authentication state", isCorrect: false },
      ],
    },
    {
      content: "True or False: You can pass complex objects as route params in React Navigation.",
      type: "TRUE_FALSE",
      explanation: "True. Route params can contain any serializable data including objects and arrays.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The route.params object contains ________ passed from the previous screen.",
      type: "FILL_IN_BLANK",
      explanation: "route.params holds all the data passed via navigation.navigate() params.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "parameters", isCorrect: true },
        { content: "styles", isCorrect: false },
        { content: "components", isCorrect: false },
      ],
    },
  ],
  "AsyncStorage & Secure Storage": [
    {
      content: "What is AsyncStorage used for in React Native?",
      type: "SINGLE_CHOICE",
      explanation: "AsyncStorage is used for persisting non-sensitive key-value data locally.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Persisting non-sensitive key-value data locally", isCorrect: true },
        { content: "Storing sensitive authentication tokens", isCorrect: false },
        { content: "Managing server-side databases", isCorrect: false },
        { content: "Handling push notifications", isCorrect: false },
      ],
    },
    {
      content: "What should be used for sensitive data like authentication tokens?",
      type: "SINGLE_CHOICE",
      explanation: "expo-secure-store uses platform-native secure storage (Keychain/EncryptedSharedPreferences).",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "expo-secure-store", isCorrect: true },
        { content: "AsyncStorage", isCorrect: false },
        { content: "localStorage", isCorrect: false },
        { content: "SQLite", isCorrect: false },
      ],
    },
    {
      content: "True or False: AsyncStorage is encrypted by default.",
      type: "TRUE_FALSE",
      explanation: "False. AsyncStorage is not encrypted and should only be used for non-sensitive data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: expo-secure-store uses ________ on iOS and EncryptedSharedPreferences on Android.",
      type: "FILL_IN_BLANK",
      explanation: "Keychain is iOS's secure storage mechanism for sensitive data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Keychain", isCorrect: true },
        { content: "iCloud", isCorrect: false },
        { content: "Core Data", isCorrect: false },
      ],
    },
  ],
  "Camera, Location & Permissions": [
    {
      content: "How do you request camera permissions in Expo?",
      type: "SINGLE_CHOICE",
      explanation: "Use ImagePicker.requestCameraPermissionsAsync() to request camera access.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "ImagePicker.requestCameraPermissionsAsync()", isCorrect: true },
        { content: "Camera.requestPermission()", isCorrect: false },
        { content: "Permissions.get('camera')", isCorrect: false },
        { content: "navigator.camera.request()", isCorrect: false },
      ],
    },
    {
      content: "What should you do when a user denies a permission?",
      type: "SINGLE_CHOICE",
      explanation: "Handle denied permissions gracefully with fallback UI to maintain good UX.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Handle gracefully with fallback UI", isCorrect: true },
        { content: "Crash the app", isCorrect: false },
        { content: "Ignore the denial", isCorrect: false },
        { content: "Request the same permission again immediately", isCorrect: false },
      ],
    },
    {
      content: "True or False: You should always check if permissions are already granted before requesting them.",
      type: "TRUE_FALSE",
      explanation: "True. Checking first avoids unnecessary permission dialogs that frustrate users.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: expo-location provides APIs for GPS ________ and geocoding.",
      type: "FILL_IN_BLANK",
      explanation: "expo-location handles foreground and background location access with proper permissions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "tracking", isCorrect: true },
        { content: "mapping", isCorrect: false },
        { content: "forecasting", isCorrect: false },
      ],
    },
  ],
  "Push Notifications Setup": [
    {
      content: "What service does Expo use for push notifications?",
      type: "SINGLE_CHOICE",
      explanation: "Expo uses its own push notification service that handles APNs and FCM integration.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Expo Push Notification Service (handles APNs and FCM)", isCorrect: true },
        { content: "Firebase directly", isCorrect: false },
        { content: "Apple Push Notification service only", isCorrect: false },
        { content: "Google Cloud Messaging", isCorrect: false },
      ],
    },
    {
      content: "What is required to send push notifications to a user's device?",
      type: "SINGLE_CHOICE",
      explanation: "You need the device's push token, which is obtained after the user grants notification permissions.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "The device push token obtained after permission grant", isCorrect: true },
        { content: "The user's email address", isCorrect: false },
        { content: "The device serial number", isCorrect: false },
        { content: "The app bundle ID only", isCorrect: false },
      ],
    },
    {
      content: "True or False: Push notifications require user permission on both iOS and Android.",
      type: "TRUE_FALSE",
      explanation: "True. Both platforms require explicit user consent before sending push notifications.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ notifications are delivered in real-time when the app is in the foreground.",
      type: "FILL_IN_BLANK",
      explanation: "Foreground notifications require special handling since they don't show a system notification by default.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Foreground", isCorrect: true },
        { content: "Background", isCorrect: false },
        { content: "Scheduled", isCorrect: false },
      ],
    },
  ],
  "Testing with Jest & React Native Testing Library": [
    {
      content: "What is Jest?",
      type: "SINGLE_CHOICE",
      explanation: "Jest is a JavaScript testing framework used for unit and integration tests.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A JavaScript testing framework for unit and integration tests", isCorrect: true },
        { content: "A deployment tool", isCorrect: false },
        { content: "A build system", isCorrect: false },
        { content: "A linter", isCorrect: false },
      ],
    },
    {
      content: "What does React Native Testing Library provide?",
      type: "SINGLE_CHOICE",
      explanation: "It provides React Native-specific queries and utilities for testing components.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "React Native-specific testing queries and utilities", isCorrect: true },
        { content: "End-to-end browser testing", isCorrect: false },
        { content: "Performance benchmarking tools", isCorrect: false },
        { content: "Code coverage reporting only", isCorrect: false },
      ],
    },
    {
      content: "True or False: You should test implementation details rather than user behavior.",
      type: "TRUE_FALSE",
      explanation: "False. Testing Library encourages testing behavior, not implementation details.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function renders a component for testing purposes.",
      type: "FILL_IN_BLANK",
      explanation: "render() from Testing Library mounts a component and provides query methods.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "render", isCorrect: true },
        { content: "mount", isCorrect: false },
        { content: "create", isCorrect: false },
      ],
    },
  ],
  "App Store Submission Guide": [
    {
      content: "What tool is used to build and submit Expo apps to app stores?",
      type: "SINGLE_CHOICE",
      explanation: "EAS (Expo Application Services) Build and Submit streamline the process.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "EAS Build and EAS Submit", isCorrect: true },
        { content: "Xcode only", isCorrect: false },
        { content: "Android Studio only", isCorrect: false },
        { content: "npm publish", isCorrect: false },
      ],
    },
    {
      content: "What is required for both iOS and Android app store submissions?",
      type: "SINGLE_CHOICE",
      explanation: "Screenshots, description, privacy policy, and age rating are required for both stores.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Screenshots, description, privacy policy, and age rating", isCorrect: true },
        { content: "Only the source code", isCorrect: false },
        { content: "A paid developer account only", isCorrect: false },
        { content: "A marketing video", isCorrect: false },
      ],
    },
    {
      content: "True or False: You need a paid Apple Developer account to submit to the App Store.",
      type: "TRUE_FALSE",
      explanation: "True. Apple requires a /year developer membership to distribute apps.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: For Android, you generate a signed ________ or AAB for Play Console submission.",
      type: "FILL_IN_BLANK",
      explanation: "An APK or Android App Bundle (AAB) is the packaged file uploaded to Play Console.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "APK", isCorrect: true },
        { content: "ZIP", isCorrect: false },
        { content: "EXE", isCorrect: false },
      ],
    },
  ],
  "Performance Optimization Tips": [
    {
      content: "What is the main cause of poor performance in React Native apps?",
      type: "SINGLE_CHOICE",
      explanation: "Unnecessary re-renders and heavy JavaScript computations on the JS thread are common causes.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Unnecessary re-renders and heavy JS thread computations", isCorrect: true },
        { content: "Using too many colors", isCorrect: false },
        { content: "Having too many screens", isCorrect: false },
        { content: "Using TypeScript instead of JavaScript", isCorrect: false },
      ],
    },
    {
      content: "What does React.memo() do?",
      type: "SINGLE_CHOICE",
      explanation: "React.memo() prevents unnecessary re-renders by memoizing components.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Prevents unnecessary re-renders by memoizing components", isCorrect: true },
        { content: "Creates new components dynamically", isCorrect: false },
        { content: "Deletes unused components", isCorrect: false },
        { content: "Converts class components to functions", isCorrect: false },
      ],
    },
    {
      content: "True or False: FlatList is preferred over ScrollView for long lists of data.",
      type: "TRUE_FALSE",
      explanation: "True. FlatList lazily renders items, while ScrollView renders all items at once.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ prop in FlatList controls how many items are rendered ahead of time.",
      type: "FILL_IN_BLANK",
      explanation: "windowSize controls the number of items rendered ahead and behind the visible area.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "windowSize", isCorrect: true },
        { content: "initialNumToRender", isCorrect: false },
        { content: "maxToRenderPerBatch", isCorrect: false },
      ],
    },
  ],
  "Essential Excel Formulas": [
    {
      content: "Which function is used to sum values based on a condition in Excel?",
      type: "SINGLE_CHOICE",
      explanation: "SUMIF adds cells that meet a specified condition.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "SUMIF", isCorrect: true },
        { content: "SUM", isCorrect: false },
        { content: "COUNTIF", isCorrect: false },
        { content: "AVERAGEIF", isCorrect: false },
      ],
    },
    {
      content: "What does VLOOKUP stand for?",
      type: "SINGLE_CHOICE",
      explanation: "VLOOKUP stands for Vertical Lookup and searches for values in the first column of a range.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Vertical Lookup", isCorrect: true },
        { content: "Value Lookup", isCorrect: false },
        { content: "Variable Lookup", isCorrect: false },
        { content: "Virtual Lookup", isCorrect: false },
      ],
    },
    {
      content: "True or False: The IF function can return different values based on a logical condition.",
      type: "TRUE_FALSE",
      explanation: "True. IF(logical_test, value_if_true, value_if_false) returns different values.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function combines text from multiple cells into one.",
      type: "FILL_IN_BLANK",
      explanation: "CONCATENATE or the & operator joins text strings together.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "CONCATENATE", isCorrect: true },
        { content: "MERGE", isCorrect: false },
        { content: "JOIN", isCorrect: false },
      ],
    },
  ],
  "Pivot Tables & Data Summarization": [
    {
      content: "What is a pivot table?",
      type: "SINGLE_CHOICE",
      explanation: "A pivot table summarizes large datasets into meaningful reports.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "A tool that summarizes large datasets into meaningful reports", isCorrect: true },
        { content: "A type of chart", isCorrect: false },
        { content: "A database query", isCorrect: false },
        { content: "A formatting style", isCorrect: false },
      ],
    },
    {
      content: "True or False: A pivot table in Excel can automatically group dates by month or year.",
      type: "TRUE_FALSE",
      explanation: "True. Right-click a date field and select Group to configure date grouping.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "What are slicers in Excel?",
      type: "SINGLE_CHOICE",
      explanation: "Slicers are visual filters that make pivot tables interactive.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Visual filters for interactive pivot table filtering", isCorrect: true },
        { content: "A type of chart element", isCorrect: false },
        { content: "Data validation tools", isCorrect: false },
        { content: "Formula auditing tools", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: You should use Excel ________ for structured data that pivot tables can reference.",
      type: "FILL_IN_BLANK",
      explanation: "Excel Tables provide structured references that automatically expand with new data.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Tables", isCorrect: true },
        { content: "Ranges", isCorrect: false },
        { content: "Matrices", isCorrect: false },
      ],
    },
  ],
  "Data Visualization with Charts": [
    {
      content: "What chart type is best for showing trends over time?",
      type: "SINGLE_CHOICE",
      explanation: "Line charts are ideal for displaying continuous data over time periods.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Line chart", isCorrect: true },
        { content: "Pie chart", isCorrect: false },
        { content: "Bar chart", isCorrect: false },
        { content: "Scatter plot", isCorrect: false },
      ],
    },
    {
      content: "When should you use a pie chart?",
      type: "SINGLE_CHOICE",
      explanation: "Pie charts show proportions of a whole. Keep to 5-6 slices maximum.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "To show proportions of a whole (limited slices)", isCorrect: true },
        { content: "To show trends over time", isCorrect: false },
        { content: "To compare values across categories", isCorrect: false },
        { content: "To show correlations", isCorrect: false },
      ],
    },
    {
      content: "True or False: A dashboard combines multiple charts into a single interactive view.",
      type: "TRUE_FALSE",
      explanation: "True. Dashboards provide a consolidated view of key metrics and KPIs.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: A ________ chart shows the relationship between two numerical variables.",
      type: "FILL_IN_BLANK",
      explanation: "Scatter plots display individual data points to show correlations between variables.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "scatter", isCorrect: true },
        { content: "pie", isCorrect: false },
        { content: "bar", isCorrect: false },
      ],
    },
  ],
  "SELECT, WHERE & ORDER BY": [
    {
      content: "What does the SELECT statement do in SQL?",
      type: "SINGLE_CHOICE",
      explanation: "SELECT specifies which columns to retrieve from a database table.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Specifies which columns to retrieve from a table", isCorrect: true },
        { content: "Deletes data from a table", isCorrect: false },
        { content: "Creates new tables", isCorrect: false },
        { content: "Updates existing records", isCorrect: false },
      ],
    },
    {
      content: "What is the correct order of SQL clauses?",
      type: "SINGLE_CHOICE",
      explanation: "SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY is the standard order.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY", isCorrect: true },
        { content: "FROM, SELECT, WHERE, ORDER BY, GROUP BY", isCorrect: false },
        { content: "WHERE, SELECT, FROM, GROUP BY, ORDER BY", isCorrect: false },
        { content: "ORDER BY, SELECT, FROM, WHERE", isCorrect: false },
      ],
    },
    {
      content: "True or False: The WHERE clause filters rows before aggregation.",
      type: "TRUE_FALSE",
      explanation: "True. WHERE filters individual rows before GROUP BY and HAVING apply.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ clause is used to sort the result set in ascending or descending order.",
      type: "FILL_IN_BLANK",
      explanation: "ORDER BY sorts results. Use ASC (default) or DESC for descending order.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "ORDER BY", isCorrect: true },
        { content: "SORT BY", isCorrect: false },
        { content: "GROUP BY", isCorrect: false },
      ],
    },
  ],
  "JOIN Operations": [
    {
      content: "Which SQL JOIN returns only rows with matching values in both tables?",
      type: "SINGLE_CHOICE",
      explanation: "INNER JOIN returns only rows where the join condition is met in both tables.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "INNER JOIN", isCorrect: true },
        { content: "LEFT JOIN", isCorrect: false },
        { content: "RIGHT JOIN", isCorrect: false },
        { content: "CROSS JOIN", isCorrect: false },
      ],
    },
    {
      content: "What does a LEFT JOIN return?",
      type: "SINGLE_CHOICE",
      explanation: "LEFT JOIN returns all rows from the left table and matching rows from the right.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "All rows from the left table and matching rows from the right", isCorrect: true },
        { content: "Only matching rows from both tables", isCorrect: false },
        { content: "All rows from the right table only", isCorrect: false },
        { content: "A Cartesian product of both tables", isCorrect: false },
      ],
    },
    {
      content: "True or False: A CROSS JOIN returns the Cartesian product of two tables.",
      type: "TRUE_FALSE",
      explanation: "True. CROSS JOIN combines every row from the first table with every row from the second.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: Use ________ aliases (like o, c) to make JOIN queries more readable.",
      type: "FILL_IN_BLANK",
      explanation: "Table aliases shorten table names in queries, especially with JOINs.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "table", isCorrect: true },
        { content: "column", isCorrect: false },
        { content: "database", isCorrect: false },
      ],
    },
  ],
  "GROUP BY & Aggregate Functions": [
    {
      content: "What does the COUNT() aggregate function return?",
      type: "SINGLE_CHOICE",
      explanation: "COUNT() returns the number of rows matching a condition.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "The number of rows matching a condition", isCorrect: true },
        { content: "The sum of all values", isCorrect: false },
        { content: "The average of all values", isCorrect: false },
        { content: "The maximum value", isCorrect: false },
      ],
    },
    {
      content: "Which SQL clause is used to filter groups created by GROUP BY?",
      type: "SINGLE_CHOICE",
      explanation: "HAVING filters groups after aggregation, unlike WHERE which filters rows.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "HAVING", isCorrect: true },
        { content: "WHERE", isCorrect: false },
        { content: "FILTER", isCorrect: false },
        { content: "GROUP", isCorrect: false },
      ],
    },
    {
      content: "True or False: You can use WHERE with aggregate functions like SUM().",
      type: "TRUE_FALSE",
      explanation: "False. Use HAVING to filter on aggregate function results, not WHERE.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ function returns the average value of a numeric column.",
      type: "FILL_IN_BLANK",
      explanation: "AVG() calculates the mean of all values in a numeric column.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "AVG", isCorrect: true },
        { content: "SUM", isCorrect: false },
        { content: "MEAN", isCorrect: false },
      ],
    },
  ],
  "Subqueries & CTEs": [
    {
      content: "What is a subquery in SQL?",
      type: "SINGLE_CHOICE",
      explanation: "A subquery is a query nested inside another query, often in WHERE or FROM clauses.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "A query nested inside another query", isCorrect: true },
        { content: "A backup copy of a table", isCorrect: false },
        { content: "A type of JOIN", isCorrect: false },
        { content: "An index on a table", isCorrect: false },
      ],
    },
    {
      content: "What does CTE stand for in SQL?",
      type: "SINGLE_CHOICE",
      explanation: "CTE stands for Common Table Expression, defined with the WITH keyword.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Common Table Expression", isCorrect: true },
        { content: "Cached Table Entity", isCorrect: false },
        { content: "Central Table Extension", isCorrect: false },
        { content: "Compiled Table Expression", isCorrect: false },
      ],
    },
    {
      content: "True or False: CTEs improve readability compared to nested subqueries.",
      type: "TRUE_FALSE",
      explanation: "True. CTEs provide named, reusable temporary result sets that make complex queries clearer.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The WITH keyword is used to define a ________ before the main SELECT statement.",
      type: "FILL_IN_BLANK",
      explanation: "WITH creates a CTE that can be referenced by the main query and other CTEs.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "CTE", isCorrect: true },
        { content: "INDEX", isCorrect: false },
        { content: "VIEW", isCorrect: false },
      ],
    },
  ],
  "Window Functions": [
    {
      content: "What does ROW_NUMBER() do in SQL?",
      type: "SINGLE_CHOICE",
      explanation: "ROW_NUMBER() assigns sequential integers to rows within a partition.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Assigns sequential integers to rows within a partition", isCorrect: true },
        { content: "Counts the total number of rows", isCorrect: false },
        { content: "Ranks rows with gaps for ties", isCorrect: false },
        { content: "Returns the first row of each group", isCorrect: false },
      ],
    },
    {
      content: "What is the difference between RANK() and DENSE_RANK()?",
      type: "SINGLE_CHOICE",
      explanation: "RANK() leaves gaps after ties; DENSE_RANK() does not leave gaps.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "RANK() leaves gaps after ties; DENSE_RANK() does not", isCorrect: true },
        { content: "They are identical", isCorrect: false },
        { content: "RANK() is faster than DENSE_RANK()", isCorrect: false },
        { content: "DENSE_RANK() leaves gaps; RANK() does not", isCorrect: false },
      ],
    },
    {
      content: "True or False: Window functions are processed after WHERE but before LIMIT.",
      type: "TRUE_FALSE",
      explanation: "True. Window functions execute after WHERE and GROUP BY but before LIMIT.",
      difficulty: QuestionDifficulty.HARD,
      answers: [
        { content: "True", isCorrect: true },
        { content: "False", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: The ________ clause defines how rows are divided for window function calculations.",
      type: "FILL_IN_BLANK",
      explanation: "PARTITION BY divides the result set into partitions for the window function to operate on.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "PARTITION BY", isCorrect: true },
        { content: "GROUP BY", isCorrect: false },
        { content: "ORDER BY", isCorrect: false },
      ],
    },
  ],
  "Data Cleaning Techniques": [
    {
      content: "What is the first step in data cleaning?",
      type: "SINGLE_CHOICE",
      explanation: "Exploring the data to understand its structure, types, and quality issues.",
      difficulty: QuestionDifficulty.EASY,
      answers: [
        { content: "Exploring the data to understand structure and quality", isCorrect: true },
        { content: "Deleting duplicate rows immediately", isCorrect: false },
        { content: "Converting all data to text", isCorrect: false },
        { content: "Sorting the data alphabetically", isCorrect: false },
      ],
    },
    {
      content: "How do you handle missing values in a dataset?",
      type: "SINGLE_CHOICE",
      explanation: "Common approaches include removing, imputing (mean/median/mode), or flagging missing values.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Remove, impute, or flag missing values based on context", isCorrect: true },
        { content: "Always replace with zero", isCorrect: false },
        { content: "Delete the entire column", isCorrect: false },
        { content: "Ignore them completely", isCorrect: false },
      ],
    },
    {
      content: "True or False: Outliers should always be removed from a dataset.",
      type: "TRUE_FALSE",
      explanation: "False. Outliers may represent valid data points. Investigate before removing.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "False", isCorrect: true },
        { content: "True", isCorrect: false },
      ],
    },
    {
      content: "Fill in the blank: ________ validation ensures data conforms to expected formats and ranges.",
      type: "FILL_IN_BLANK",
      explanation: "Data validation checks that values meet business rules and format requirements.",
      difficulty: QuestionDifficulty.MEDIUM,
      answers: [
        { content: "Data", isCorrect: true },
        { content: "Input", isCorrect: false },
        { content: "Output", isCorrect: false },
      ],
    },
  ],
};

// ─── Main Script ──────────────────────────────────────────────────────────────

function getDifficultyForLesson(lessonTitle: string): QuestionDifficulty {
  const hardTopics = ["Neural Network", "CNN", "Backpropagation", "Metaclass", "Descriptor", "asyncio", "Coroutines", "Web Scraping", "Dynamic Code", "Design Pattern", "Window Function", "CTE", "Subquery", "PCA", "Anomaly Detection"];
  const mediumTopics = ["REST", "API", "MongoDB", "Flexbox", "Grid", "Hooks", "State", "Props", "ES6", "DOM", "Express", "Regression", "Decision Tree", "Random Forest", "Cross-Validation", "K-Means", "Hierarchical", "Clustering", "SEO", "Keyword", "Email", "Analytics", "Decorator", "Generator", "Context Manager", "Firewall", "VPN", "Encryption", "Hashing", "PKI", "Penetration", "Nmap", "WPA3", "Lambda", "RDS", "DynamoDB", "CloudFormation", "CodePipeline", "CloudWatch", "Blockchain", "Consensus", "Solidity", "ERC-20", "DeFi", "Yield", "Tokenomics", "Navigation", "Zustand", "AsyncStorage", "Camera", "Push Notification", "Testing", "App Store", "Performance", "Pivot", "VLOOKUP", "JOIN", "GROUP BY"];

  if (hardTopics.some(t => lessonTitle.includes(t))) return QuestionDifficulty.HARD;
  if (mediumTopics.some(t => lessonTitle.includes(t))) return QuestionDifficulty.MEDIUM;
  return QuestionDifficulty.EASY;
}

async function main() {
  console.log("=== SmartLMS Lesson Quiz Seeder ===\n");

  const lessons = await prisma.lesson.findMany({
    include: {
      quizzes: true,
    },
  });

  console.log(`Found ${lessons.length} lessons in the database\n`);

  let created = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    if (lesson.quizzes.length > 0) {
      console.log(`  [SKIP] "${lesson.title}" - quiz already exists`);
      skipped++;
      continue;
    }

    const questions = quizContentByTitle[lesson.title];
    if (!questions) {
      console.log(`  [SKIP] "${lesson.title}" - no quiz content available`);
      skipped++;
      continue;
    }

    const difficulty = getDifficultyForLesson(lesson.title);

    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz: ${lesson.title}`,
        passingScore: 70,
        maxAttempts: 3,
        isPublished: true,
        difficulty,
        lessonId: lesson.id,
        courseId: lesson.courseId,
        points: 40,
        questions: {
          create: questions.map((q, idx) => ({
            content: q.content,
            type: q.type,
            points: 10,
            explanation: q.explanation,
            difficulty: q.difficulty,
            order: idx,
            answers: {
              create: q.answers.map((a, aIdx) => ({
                content: a.content,
                isCorrect: a.isCorrect,
                points: a.isCorrect ? 10 : 0,
                order: aIdx,
              })),
            },
          })),
        },
      },
    });

    console.log(`  [CREATED] "${lesson.title}" -> Quiz with ${questions.length} questions`);
    created++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total lessons: ${lessons.length}`);
  console.log(`Quizzes created: ${created}`);
  console.log(`Lessons skipped: ${skipped}`);
  console.log(`Done!`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
