// Enriched lesson content for TEXT lessons
// This file is loaded at seed time and merged into lesson content

const enrichedLessons: Record<string, string> = {

"Semantic HTML Elements":
`<h3>Understanding Semantic HTML Elements</h3>
<p>HTML5 introduced semantic elements that provide meaning to your markup, making websites more accessible and SEO-friendly. Instead of using generic div tags everywhere, semantic elements describe their purpose to both browsers and developers.</p>
<h4>Why Semantic HTML Matters</h4>
<ul>
<li><strong>Accessibility:</strong> Screen readers use semantic elements to navigate content</li>
<li><strong>SEO:</strong> Search engines better understand content hierarchy and relevance</li>
<li><strong>Maintainability:</strong> Code is self-documenting and easier for developers to understand</li>
<li><strong>Consistency:</strong> Provides a standard structure across websites</li>
</ul>
<h4>Essential Semantic Elements</h4>
<pre><code>&lt;header&gt;  - Introductory content or navigation
&lt;nav&gt;     - Navigation links
&lt;main&gt;    - Main content of the page
&lt;article&gt; - Self-contained, independent content
&lt;section&gt; - Thematic grouping of content
&lt;aside&gt;   - Sidebar or tangential content
&lt;footer&gt;  - Footer information
&lt;figure&gt;  - Self-contained media with optional caption
&lt;figcaption&gt; - Caption for a figure element</code></pre>
<h4>Document Structure Example</h4>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;nav&gt;
      &lt;ul&gt;
        &lt;li&gt;&lt;a href="/"&gt;Home&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="/about"&gt;About&lt;/a&gt;&lt;/li&gt;
      &lt;/ul&gt;
    &lt;/nav&gt;
  &lt;/header&gt;

  &lt;main&gt;
    &lt;article&gt;
      &lt;h1&gt;Blog Post Title&lt;/h1&gt;
      &lt;section&gt;
        &lt;h2&gt;Introduction&lt;/h2&gt;
        &lt;p&gt;Content here...&lt;/p&gt;
      &lt;/section&gt;
    &lt;/article&gt;
    &lt;aside&gt;
      &lt;h3&gt;Related Posts&lt;/h3&gt;
    &lt;/aside&gt;
  &lt;/main&gt;

  &lt;footer&gt;
    &lt;p&gt;&amp;copy; 2024 My Website&lt;/p&gt;
  &lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h4>Figure and Caption</h4>
<pre><code>&lt;figure&gt;
  &lt;img src="chart.png" alt="Sales chart showing growth"&gt;
  &lt;figcaption&gt;Figure 1: Q4 2024 Sales Growth&lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Use exactly one <code>&lt;main&gt;</code> element per page</li>
<li><code>&lt;article&gt;</code> should make sense independently (like a blog post)</li>
<li>Use <code>&lt;section&gt;</code> to group related content, not as a generic container</li>
<li><code>&lt;aside&gt;</code> for content tangentially related to the main content</li>
<li>Always include <code>lang</code> attribute on <code>&lt;html&gt;</code> for accessibility</li>
<li>Nest headings hierarchically (h1, h2, h3, never skip levels)</li>
</ul>`,

"ES6+ Features & Arrow Functions":
`<h3>Mastering ES6+ Features and Arrow Functions</h3>
<p>ECMAScript 2015 (ES6) and subsequent releases introduced powerful features that fundamentally changed how we write JavaScript. These features make code shorter, more expressive, and easier to maintain.</p>
<h4>Arrow Functions</h4>
<p>Arrow functions provide a concise syntax for writing function expressions and lexically bind the <code>this</code> value (they do not have their own <code>this</code>).</p>
<pre><code>// Traditional function expression
const add = function(a, b) {
  return a + b;
};

// Arrow function equivalent
const add = (a, b) => a + b;

// Single parameter - no parentheses needed
const double = x => x * 2;

// No parameters - use empty parentheses
const greet = () => "Hello!";

// Multi-line arrow function
const processUser = (user) => {
  const fullName = \`\${user.first} \${user.last}\`;
  return { ...user, fullName, isActive: true };
};</code></pre>
<h4>Template Literals</h4>
<p>Template literals use backticks and allow embedded expressions with <code>\${}</code> syntax, replacing string concatenation.</p>
<pre><code>const name = "Alice";
const age = 28;

// Old way
const msg1 = "Hello, " + name + "! You are " + age + " years old.";

// Template literal
const msg2 = \`Hello, \${name}! You are \${age} years old.\`;

// Multi-line strings
const html = \`
  &lt;div class="card"&gt;
    &lt;h2&gt;\${name}&lt;/h2&gt;
    &lt;p&gt;Age: \${age}&lt;/p&gt;
  &lt;/div&gt;
\`;</code></pre>
<h4>Destructuring</h4>
<p>Destructuring lets you unpack values from arrays or properties from objects into distinct variables.</p>
<pre><code>// Object destructuring
const user = { name: "Bob", age: 25, city: "Lagos" };
const { name, age } = user;

// Rename variables
const { name: userName, age: userAge } = user;

// Default values
const { role = "student" } = user;

// Array destructuring
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first = 10, second = 20, rest = [30, 40, 50]</code></pre>
<h4>Spread and Rest Operators</h4>
<p>The spread operator (<code>...</code>) expands iterables, while rest parameters collect remaining arguments.</p>
<pre><code>// Spread - copying arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

// Spread - copying objects
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { ...defaults, lang: "fr" };

// Rest - in function parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10</code></pre>
<h4>Optional Chaining and Nullish Coalescing</h4>
<pre><code>const user = { profile: { address: null } };

// Optional chaining
const street = user.profile?.address?.street; // undefined (no error)

// Nullish coalescing
const zip = user.profile?.address?.zip ?? "N/A"; // "N/A"</code></pre>
<h4>Modules (import/export)</h4>
<pre><code>// Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Default export
export default class Utils {
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Importing
import { add, subtract } from "./math.js";
import Utils from "./utils.js";</code></pre>
<h4>Array Methods (map, filter, reduce)</h4>
<pre><code>const products = [
  { name: "Laptop", price: 999 },
  { name: "Phone", price: 699 },
  { name: "Tablet", price: 499 }
];

const names = products.map(p => p.name);
const expensive = products.filter(p => p.price > 500);
const total = products.reduce((sum, p) => sum + p.price, 0);

// Chaining
const result = products
  .filter(p => p.price > 300)
  .map(p => p.name);</code></pre>
<h4>Key Takeaways</h4>
<ul>
<li><strong>Arrow functions</strong> simplify syntax and capture <code>this</code> lexically</li>
<li><strong>Template literals</strong> replace concatenation with clean interpolation</li>
<li><strong>Destructuring</strong> extracts values from objects and arrays elegantly</li>
<li><strong>Spread/Rest</strong> operators handle copying, merging, and collecting data</li>
<li><strong>Optional chaining</strong> prevents null reference errors safely</li>
<li><strong>Modules</strong> enable clean code organization with import/export</li>
<li><strong>Array methods</strong> (map, filter, reduce) are essential for data transformation</li>
</ul>`,

"State & Props Management":
`<h3>State and Props Management in React</h3>
<p>React components are defined by two fundamental concepts: <strong>state</strong> (internal, mutable data) and <strong>props</strong> (external, read-only data passed from parents). Understanding how to manage these effectively is the foundation of building interactive React applications.</p>
<h4>The useState Hook</h4>
<p>The <code>useState</code> hook lets you add state to functional components. It returns a state variable and a setter function.</p>
<pre><code>import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Increment&lt;/button&gt;
      &lt;button onClick={() => setCount(prev => prev - 1)}&gt;Decrement&lt;/button&gt;
    &lt;/div&gt;
  );
}

// Functional update - always use when next state depends on previous
setCount(prev => prev + 1);</code></pre>
<h4>State Update Rules</h4>
<ul>
<li><strong>Never mutate state directly</strong> - always use the setter function</li>
<li><strong>State updates are asynchronous</strong> - React batches updates for performance</li>
<li><strong>Use functional updates</strong> when next state depends on current state</li>
<li><strong>State is isolated</strong> - each component has its own state</li>
</ul>
<pre><code>// WRONG - mutating state
const user = { name: "Alice", age: 25 };
setUser(user.age = 26); // No re-render!

// CORRECT - create new object
setUser({ ...user, age: 26 });</code></pre>
<h4>Understanding Props</h4>
<p>Props (short for properties) are how you pass data from parent to child components. They are read-only.</p>
<pre><code>// Parent component
function App() {
  return &lt;Greeting name="Alice" age={25} isAdmin={true} /&gt;;
}

// Child component receiving props
function Greeting({ name, age, isAdmin }) {
  return (
    &lt;div&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      &lt;p&gt;Age: {age}&lt;/p&gt;
      {isAdmin &amp;&amp; &lt;span&gt;Admin User&lt;/span&gt;}
    &lt;/div&gt;
  );
}

// Default props
function Greeting({ name = "Guest", age = 0 }) {
  return &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;
}</code></pre>
<h4>Props Children</h4>
<p>The <code>children</code> prop is a special prop that lets you pass components as nested content.</p>
<pre><code>function Card({ title, children }) {
  return (
    &lt;div className="card"&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      &lt;div className="card-body"&gt;
        {children}
      &lt;/div&gt;
    &lt;/div&gt;
  );
}

&lt;Card title="User Profile"&gt;
  &lt;p&gt;Name: Alice&lt;/p&gt;
  &lt;p&gt;Email: alice@example.com&lt;/p&gt;
&lt;/Card&gt;</code></pre>
<h4>useReducer for Complex State</h4>
<pre><code>import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {state.count}, Step: {state.step}&lt;/p&gt;
      &lt;button onClick={() => dispatch({ type: "increment" })}&gt;+&lt;/button&gt;
      &lt;button onClick={() => dispatch({ type: "setStep", payload: 5 })}&gt;Set Step 5&lt;/button&gt;
      &lt;button onClick={() => dispatch({ type: "reset" })}&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<h4>Context API Solution</h4>
<p>The Context API provides a way to pass data through the component tree without manually threading props at every level.</p>
<pre><code>import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: "Alice", role: "admin" });

  return (
    &lt;UserContext.Provider value={{ user, setUser }}&gt;
      {children}
    &lt;/UserContext.Provider&gt;
  );
}

// Consuming component (any depth)
function UserAvatar() {
  const { user } = useContext(UserContext);
  return &lt;img src={user.avatar} alt={user.name} /&gt;;
}

function App() {
  return (
    &lt;UserProvider&gt;
      &lt;Layout /&gt;
    &lt;/UserProvider&gt;
  );
}</code></pre>
<h4>Key Takeaways</h4>
<ul>
<li><strong>useState</strong> manages local component state with setter functions</li>
<li><strong>Never mutate state</strong> directly - always create new objects/arrays</li>
<li><strong>Props are read-only</strong> - data flows one way (parent to child)</li>
<li><strong>useReducer</strong> handles complex state logic with actions and dispatch</li>
<li><strong>Context API</strong> eliminates prop drilling for global/shared state</li>
<li><strong>Lift state up</strong> when siblings need to share data</li>
</ul>`,

"RESTful API Design":
`<h3>RESTful API Design Principles</h3>
<p>REST (Representational State Transfer) is an architectural style for designing networked applications. A well-designed REST API is intuitive, scalable, and follows established conventions.</p>
<h4>Core REST Principles</h4>
<ul>
<li><strong>Client-Server:</strong> Separation of concerns between UI and data storage</li>
<li><strong>Stateless:</strong> Each request contains all information needed to process it</li>
<li><strong>Cacheable:</strong> Responses should define themselves as cacheable or not</li>
<li><strong>Uniform Interface:</strong> Consistent way to interact with resources</li>
</ul>
<h4>HTTP Methods and Status Codes</h4>
<pre><code>GET    /api/users        → 200 OK           (List users)
GET    /api/users/123    → 200 OK           (Get user 123)
POST   /api/users        → 201 Created      (Create user)
PUT    /api/users/123    → 200 OK           (Update user 123)
PATCH  /api/users/123    → 200 OK           (Partial update)
DELETE /api/users/123    → 204 No Content   (Delete user 123)</code></pre>
<h4>Express.js Implementation</h4>
<pre><code>const express = require("express");
const router = express.Router();

// GET /api/users - List all users
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, sort = "name" } = req.query;
  const users = await User.find()
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  res.json({
    data: users,
    pagination: { page, limit, total: await User.countDocuments() }
  });
});

// GET /api/users/:id - Get single user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ data: user });
});

// POST /api/users - Create user
router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ data: user });
});</code></pre>
<h4>Error Response Format</h4>
<pre><code>{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Use plural nouns for resources: <code>/users</code> not <code>/user</code></li>
<li>Nest resources for relationships: <code>/users/123/orders</code></li>
<li>Use query parameters for filtering, not URL path segments</li>
<li>Implement rate limiting to protect your API</li>
<li>Use HTTPS always in production</li>
<li>Return meaningful HTTP status codes, not just 200</li>
</ul>`,

"Linear Algebra for ML":
`<h3>Linear Algebra for Machine Learning</h3>
<p>Linear algebra is the mathematical foundation of machine learning. Vectors, matrices, and their operations are used everywhere in ML — from data representation to model computations.</p>
<h4>Vectors</h4>
<p>A vector is an ordered list of numbers. In ML, data points are often represented as feature vectors.</p>
<pre><code>import numpy as np

v = np.array([1, 2, 3, 4, 5])  # 5-dimensional feature vector
norm = np.linalg.norm(v)         # Magnitude
dot_product = np.dot(v, v)       # Sum of element-wise products</code></pre>
<h4>Matrices</h4>
<pre><code># Dataset matrix: 100 samples, 5 features
X = np.random.randn(100, 5)

# Matrix multiplication: apply transformation
weights = np.array([0.3, 0.2, 0.1, 0.25, 0.15])
predictions = X @ weights</code></pre>
<h4>Eigenvalues and Eigenvectors</h4>
<pre><code>A = np.array([[4, 2], [1, 3]])
eigenvalues, eigenvectors = np.linalg.eig(A)</code></pre>
<h4>Applications in ML</h4>
<ul>
<li><strong>Linear Regression:</strong> y = Xw (matrix-vector multiplication)</li>
<li><strong>Neural Networks:</strong> Layer computation is matrix multiplication + activation</li>
<li><strong>PCA:</strong> Uses eigendecomposition for dimensionality reduction</li>
<li><strong>Word Embeddings:</strong> Similarity measured by cosine distance</li>
</ul>`,

"Decision Trees & Random Forests":
`<h3>Decision Trees and Random Forests</h3>
<p>Decision trees are intuitive, interpretable models that make predictions by learning simple rules from data. Random forests combine many decision trees to create a powerful ensemble model.</p>
<h4>Building a Decision Tree</h4>
<pre><code>from sklearn.tree import DecisionTreeClassifier
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
tree = DecisionTreeClassifier(max_depth=5, random_state=42)
tree.fit(X_train, y_train)
print(f"Accuracy: {tree.score(X_test, y_test):.2%}")</code></pre>
<h4>Random Forests</h4>
<pre><code>from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
  n_estimators=100,
  max_depth=10,
  min_samples_split=5,
  random_state=42
)
rf.fit(X_train, y_train)

# Feature importance
importances = rf.feature_importances_
for name, imp in zip(iris.feature_names, importances):
  print(f"  {name}: {imp:.3f}")</code></pre>
<h4>Bias-Variance Tradeoff</h4>
<ul>
<li><strong>Deep trees</strong> (high depth): Low bias, high variance (overfit)</li>
<li><strong>Shallow trees</strong> (low depth): High bias, low variance (underfit)</li>
<li><strong>Random forests:</strong> Low bias AND low variance (best of both)</li>
</ul>
<h4>Hyperparameter Tuning</h4>
<pre><code>from sklearn.model_selection import GridSearchCV

params = {
  "n_estimators": [50, 100, 200],
  "max_depth": [5, 10, 20, None],
  "min_samples_split": [2, 5, 10],
}
grid = GridSearchCV(rf, params, cv=5, scoring="accuracy")
grid.fit(X_train, y_train)</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Start with random forests — they work well with minimal tuning</li>
<li>Use <code>max_depth</code> to control overfitting</li>
<li>Check feature importances to understand your model</li>
<li>For interpretability, use single decision trees with visualization</li>
</ul>`,

"Principal Component Analysis (PCA)":
`<h3>Principal Component Analysis (PCA)</h3>
<p>PCA is a dimensionality reduction technique that transforms high-dimensional data into a lower-dimensional space while preserving as much variance as possible.</p>
<h4>How PCA Works</h4>
<ol>
<li>Standardize the data (zero mean, unit variance)</li>
<li>Compute the covariance matrix</li>
<li>Find eigenvalues and eigenvectors</li>
<li>Sort eigenvectors by decreasing eigenvalues</li>
<li>Project data onto top-k eigenvectors</li>
</ol>
<pre><code>from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X_scaled)

print(f"Explained variance: {pca.explained_variance_ratio_}")
print(f"Total: {sum(pca.explained_variance_ratio_):.2%}")</code></pre>
<h4>Choosing Number of Components</h4>
<pre><code>pca_full = PCA()
pca_full.fit(X_scaled)
cumulative_var = np.cumsum(pca_full.explained_variance_ratio_)
n_components_95 = np.argmax(cumulative_var >= 0.95) + 1</code></pre>
<h4>Applications</h4>
<ul>
<li><strong>Data visualization:</strong> Reduce to 2D/3D for plotting</li>
<li><strong>Noise reduction:</strong> Remove low-variance components</li>
<li><strong>Feature extraction:</strong> Create uncorrelated features</li>
<li><strong>Speed up training:</strong> Fewer features = faster models</li>
</ul>
<h4>Limitations</h4>
<ul>
<li>PCA finds linear projections only — use t-SNE or UMAP for non-linear data</li>
<li>Principal components may be hard to interpret</li>
<li>Sensitive to feature scaling — always standardize first</li>
</ul>`,

"Training with Backpropagation":
`<h3>Training Neural Networks with Backpropagation</h3>
<p>Backpropagation is the algorithm that trains neural networks by computing how much each weight contributed to the error and adjusting it accordingly.</p>
<h4>The Training Loop</h4>
<ol>
<li><strong>Forward pass:</strong> Input flows through the network to produce a prediction</li>
<li><strong>Compute loss:</strong> Compare prediction to the true label</li>
<li><strong>Backward pass:</strong> Compute gradients of loss with respect to each weight</li>
<li><strong>Update weights:</strong> Adjust weights in the direction that reduces loss</li>
</ol>
<pre><code>import torch
import torch.nn as nn

class Net(nn.Module):
  def __init__(self):
    super().__init__()
    self.layers = nn.Sequential(
      nn.Linear(784, 128),
      nn.ReLU(),
      nn.Linear(128, 64),
      nn.ReLU(),
      nn.Linear(64, 10)
    )

  def forward(self, x):
    return self.layers(x)

model = Net()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(10):
  for X_batch, y_batch in train_loader:
    predictions = model(X_batch)
    loss = criterion(predictions, y_batch)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()</code></pre>
<h4>Gradient Descent Variants</h4>
<pre><code>SGD(lr=0.01)                    # Basic with momentum
Adam(lr=0.001)                  # Adaptive learning rate
AdamW(lr=0.001, weight_decay=0.01)</code></pre>
<h4>Common Loss Functions</h4>
<pre><code>nn.CrossEntropyLoss()  # Multi-class classification
nn.BCELoss()           # Binary classification
nn.MSELoss()           # Regression</code></pre>
<h4>Handling Overfitting</h4>
<ul>
<li><strong>Dropout:</strong> Randomly zero neurons during training (0.2-0.5 rate)</li>
<li><strong>Weight decay:</strong> L2 regularization penalizes large weights</li>
<li><strong>Early stopping:</strong> Stop when validation loss stops improving</li>
<li><strong>Data augmentation:</strong> Increase effective training set size</li>
</ul>`,

"Keyword Research Methods":
`<h3>Keyword Research Methods for SEO</h3>
<p>Keyword research is the foundation of SEO and content marketing. It involves finding the terms and phrases your target audience uses when searching online.</p>
<h4>Search Intent Types</h4>
<ul>
<li><strong>Informational:</strong> "how to make coffee" — user wants to learn</li>
<li><strong>Navigational:</strong> "starbucks near me" — user wants a specific site</li>
<li><strong>Commercial:</strong> "best coffee makers 2024" — user is researching</li>
<li><strong>Transactional:</strong> "buy coffee maker online" — user is ready to buy</li>
</ul>
<h4>Google Research Tools</h4>
<pre><code># Google Autocomplete
Type your keyword and note suggestions

# People Also Ask (PAA)
Shows related questions users ask

# Google Related Searches
Bottom of SERP shows related queries

# Google Trends
Compare keyword popularity over time</code></pre>
<h4>Key Metrics</h4>
<pre><code>Search Volume:  Monthly searches
Keyword Difficulty (KD):  Competition level (0-100)
CPC:  Indicates commercial value
SERP Features:  Featured snippets, knowledge panels</code></pre>
<h4>Long-Tail vs Short-Tail</h4>
<ul>
<li><strong>Short-tail:</strong> "coffee maker" — high volume, high competition</li>
<li><strong>Long-tail:</strong> "best drip coffee maker under $50" — specific intent, converts better</li>
</ul>
<h4>Content Mapping</h4>
<pre><code>Informational keywords → Blog posts, guides, tutorials
Commercial keywords   → Comparison pages, reviews
Transactional keywords → Product pages, pricing pages</code></pre>`,

"Content Calendar Planning":
`<h3>Content Calendar Planning</h3>
<p>A content calendar is a strategic roadmap that plans what content to publish, when, and where.</p>
<h4>Benefits</h4>
<ul>
<li><strong>Consistency:</strong> Maintain a regular publishing schedule</li>
<li><strong>Strategy alignment:</strong> Content supports campaigns and goals</li>
<li><strong>Team coordination:</strong> Everyone knows what's happening</li>
<li><strong>Efficiency:</strong> Batch content creation for productivity</li>
</ul>
<h4>Calendar Structure</h4>
<pre><code>Week | Date    | Topic           | Format    | Channel    | Status
1    | Jan 8   | Email Marketing | Blog Post | Website    | Draft
1    | Jan 10  | Email Tips      | Thread    | Twitter    | Published
2    | Jan 15  | Case Study      | Video     | YouTube    | In Review</code></pre>
<h4>Content Pillars</h4>
<pre><code>1. Educational Content      (builds trust)
2. Product Previews         (drives signups)
3. Success Stories          (social proof)
4. Industry Trends          (thought leadership)
5. Platform Updates         (product marketing)</code></pre>
<h4>The 70-20-10 Rule</h4>
<pre><code>70% - Proven content types (blog, social)
20% - Experimenting with new formats
10% - Innovative, high-risk content</code></pre>
<h4>Monthly Planning Process</h4>
<ol>
<li>Review previous month analytics</li>
<li>Check upcoming events and holidays</li>
<li>Brainstorm content ideas</li>
<li>Assign topics to content pillars</li>
<li>Set publishing dates and deadlines</li>
</ol>`,

"Email Campaign Design":
`<h3>Email Campaign Design</h3>
<p>Email marketing remains one of the highest-ROI digital channels.</p>
<h4>Campaign Types</h4>
<ul>
<li><strong>Welcome series:</strong> Onboard new subscribers (3-5 emails)</li>
<li><strong>Nurture sequences:</strong> Build trust and educate over time</li>
<li><strong>Promotional:</strong> Drive sales with offers</li>
<li><strong>Newsletter:</strong> Regular value-driven content</li>
<li><strong>Re-engagement:</strong> Win back inactive subscribers</li>
</ul>
<h4>Email Structure</h4>
<pre><code>Subject Line:  6-10 words, curiosity + value
Preview Text:  40-90 characters
Header:        Logo + navigation (minimal)
Hero Image:    Main visual, 600px wide
Body:          Short paragraphs, 14-16px font
CTA Button:    High contrast, action-oriented
Footer:        Unsubscribe, social links</code></pre>
<h4>Best Practices</h4>
<pre><code>Mobile-first design (60%+ open on mobile)
Single, clear CTA per email
Segment your list for relevance
A/B test subject lines and CTAs
Send at optimal times (Tues-Thu, 10am-2pm)
Clean list regularly</code></pre>
<h4>Key Metrics</h4>
<pre><code>Open Rate:     Target 20-25%
Click Rate:    Target 2.5-4%
Conversion:    Target 1-5%
Unsubscribe:   Keep below 0.5%</code></pre>`,

"Generators & Itertools":
`<h3>Generators and Itertools in Python</h3>
<p>Generators are functions that yield values one at a time instead of returning a complete list. They are memory-efficient and perfect for processing large datasets.</p>
<h4>Generator Functions</h4>
<pre><code># Regular function returns entire list (memory heavy)
def get_squares_list(n):
  return [x**2 for x in range(n)]

# Generator yields one value at a time (memory efficient)
def get_squares_gen(n):
  for x in range(n):
    yield x**2

# Using generators
for square in get_squares_gen(1000000):
  if square > 100:
    break  # No need to compute all 1M values!</code></pre>
<h4>Generator Expressions</h4>
<pre><code># List comprehension (creates full list)
squares_list = [x**2 for x in range(1000000)]

# Generator expression (lazy evaluation)
squares_gen = (x**2 for x in range(1000000))

# Pass directly to functions
total = sum(x**2 for x in range(1000000))</code></pre>
<h4>itertools Module</h4>
<pre><code>import itertools

# chain - concatenate iterables
combined = itertools.chain([1, 2], [3, 4])

# groupby - group consecutive elements
data = [("A", 1), ("A", 2), ("B", 3)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
  print(key, list(group))

# combinations and permutations
items = ["A", "B", "C", "D"]
combos = list(itertools.combinations(items, 2))
perms = list(itertools.permutations(items, 3))

# islice - slice iterators
first_10 = itertools.islice(range(100), 10)</code></pre>
<h4>Real-World Example</h4>
<pre><code>import csv

def process_large_csv(filename):
  with open(filename) as f:
    reader = csv.DictReader(f)
    for row in reader:
      if int(row["sales"]) > 1000:
        yield row

# Process million-row CSV without loading into memory
for high_sale in process_large_csv("sales.csv"):
  send_notification(high_sale)</code></pre>`,

"Descriptors & Properties":
`<h3>Python Descriptors and Properties</h3>
<p>Descriptors are objects that define <code>__get__</code>, <code>__set__</code>, or <code>__delete__</code> methods to customize attribute access. They are the mechanism behind Python's <code>@property</code> decorator.</p>
<h4>The @property Decorator</h4>
<pre><code>class Circle:
  def __init__(self, radius):
    self._radius = radius

  @property
  def radius(self):
    return self._radius

  @radius.setter
  def radius(self, value):
    if value <= 0:
      raise ValueError("Radius must be positive")
    self._radius = value

  @property
  def area(self):
    return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.area)  # 78.53975
c.radius = -1  # ValueError!</code></pre>
<h4>Custom Descriptors</h4>
<pre><code>class Validated:
  def __init__(self, validator=None):
    self.validator = validator

  def __set_name__(self, owner, name):
    self.name = name

  def __get__(self, obj, objtype=None):
    if obj is None: return self
    return obj.__dict__.get(self.name)

  def __set__(self, obj, value):
    if self.validator and not self.validator(value):
      raise ValueError(f"Invalid value for {self.name}")
    obj.__dict__[self.name] = value

class User:
  name = Validated(lambda v: isinstance(v, str) and len(v) > 0)
  age = Validated(lambda v: isinstance(v, int) and 0 < v < 150)</code></pre>
<h4>Key Takeaways</h4>
<ul>
<li><strong>@property</strong> is syntactic sugar for descriptors</li>
<li>Descriptors enable validation, caching, and computed attributes</li>
<li>Use descriptors when you need custom attribute behavior across classes</li>
</ul>`,

"Coroutines & Tasks":
`<h3>Asyncio: Coroutines and Tasks</h3>
<p>Python's <code>asyncio</code> library enables concurrent programming using coroutines (async functions) and tasks.</p>
<h4>Coroutines</h4>
<pre><code>import asyncio

async def fetch_data(url):
  print(f"Starting fetch from {url}")
  await asyncio.sleep(2)  # Simulate network delay
  return {"data": "response"}

result = asyncio.run(fetch_data("https://api.example.com"))</code></pre>
<h4>Running Multiple Coroutines</h4>
<pre><code>async def main():
  results = await asyncio.gather(
    fetch_data("https://api1.com"),
    fetch_data("https://api2.com"),
    fetch_data("https://api3.com")
  )
  return results  # ~2 seconds total, not 6</code></pre>
<h4>Tasks</h4>
<pre><code>async def main():
  task1 = asyncio.create_task(fetch_data("url1"))
  task2 = asyncio.create_task(fetch_data("url2"))
  result1 = await task1
  result2 = await task2</code></pre>
<h4>Error Handling</h4>
<pre><code>async def main():
  try:
    result = await asyncio.wait_for(
      fetch_data("slow-api.com"),
      timeout=5.0
    )
  except asyncio.TimeoutError:
    print("Request timed out!")</code></pre>`,

"Observer & Strategy Patterns":
`<h3>Design Patterns: Observer and Strategy</h3>
<p>Design patterns are reusable solutions to common software design problems.</p>
<h4>Observer Pattern</h4>
<pre><code>class EventEmitter:
  def __init__(self):
    self.listeners = {}

  def on(self, event, callback):
    if event not in self.listeners:
      self.listeners[event] = []
    self.listeners[event].append(callback)

  def emit(self, event, *args, **kwargs):
    for callback in self.listeners.get(event, []):
      callback(*args, **kwargs)

# Usage
emitter = EventEmitter()
emitter.on("login", lambda user: print(f"{user} logged in"))
emitter.on("login", lambda user: send_welcome_email(user))
emitter.emit("login", "Alice")</code></pre>
<h4>Strategy Pattern</h4>
<pre><code>class Sorter:
  def __init__(self, strategy=None):
    self._strategy = strategy

  def set_strategy(self, strategy):
    self._strategy = strategy

  def sort(self, data):
    return self._strategy(data)

def bubble_sort(arr):
  return sorted(arr)

def quick_sort(arr):
  if len(arr) <= 1: return arr
  pivot = arr[len(arr)//2]
  left = [x for x in arr if x < pivot]
  mid = [x for x in arr if x == pivot]
  right = [x for x in arr if x > pivot]
  return quick_sort(left) + mid + quick_sort(right)

sorter = Sorter(bubble_sort)
sorter.set_strategy(quick_sort)</code></pre>
<h4>When to Use</h4>
<ul>
<li><strong>Observer:</strong> Event systems, UI updates, pub/sub, logging</li>
<li><strong>Strategy:</strong> Multiple algorithms, runtime behavior switching</li>
</ul>`,

"Visual Hierarchy & Layout":
`<h3>Visual Hierarchy and Layout in UI Design</h3>
<p>Visual hierarchy is the arrangement of elements to show their order of importance.</p>
<h4>Principles of Visual Hierarchy</h4>
<ul>
<li><strong>Size:</strong> Larger elements attract attention first</li>
<li><strong>Color:</strong> Bright or contrasting colors draw the eye</li>
<li><strong>Spacing:</strong> White space creates emphasis and focus</li>
<li><strong>Typography:</strong> Font weight, size, and style create levels</li>
<li><strong>Position:</strong> Top-left is noticed first (in LTR languages)</li>
<li><strong>Contrast:</strong> Stands out from surrounding elements</li>
</ul>
<h4>The F-Pattern</h4>
<pre><code>F-Pattern (text-heavy pages):
First horizontal scan across top
Second shorter scan below
Vertical scan down left side

Z-Pattern (minimal content):
Logo top-left → CTA top-right
Diagonal to bottom-left
Diagonal to bottom-right</code></pre>
<h4>Grid Systems</h4>
<pre><code>.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; }
.col-8 { grid-column: span 8; }
.col-4 { grid-column: span 4; }</code></pre>
<h4>White Space</h4>
<ul>
<li><strong>Macro whitespace:</strong> Space between major sections (40-80px)</li>
<li><strong>Micro whitespace:</strong> Space between lines, letters (8-16px)</li>
<li>More whitespace = more premium, sophisticated feel</li>
</ul>`,

"Low-Fidelity Wireframing":
`<h3>Low-Fidelity Wireframing</h3>
<p>Low-fidelity wireframes are simple, rough sketches that outline the structure and layout of a page.</p>
<h4>Why Start with Lo-Fi?</h4>
<ul>
<li><strong>Speed:</strong> Create layouts in minutes, not hours</li>
<li><strong>Focus:</strong> Concentrate on structure, not colors</li>
<li><strong>Iteration:</strong> Easy to change and experiment</li>
<li><strong>Communication:</strong> Quickly share ideas with stakeholders</li>
<li><strong>Low cost:</strong> Just pen and paper</li>
</ul>
<h4>Lo-Fi Elements</h4>
<pre><code>Boxes with X     = Image placeholders
Lines of text    = Text content
Buttons          = Interactive elements
Arrows           = User flow direction
Annotations      = Functionality notes</code></pre>
<h4>Tools</h4>
<ul>
<li><strong>Paper:</strong> Fastest, most flexible</li>
<li><strong>Balsamiq:</strong> Deliberately low-fi digital tool</li>
<li><strong>Excalidraw:</strong> Hand-drawn style wireframes</li>
</ul>
<h4>Best Practices</h4>
<ol>
<li>Start with user flows before wireframing pages</li>
<li>Use placeholders for images</li>
<li>Label interactive elements</li>
<li>Include annotations</li>
<li>Create multiple variations before deciding</li>
</ol>`,

"Design System Components":
`<h3>Design System Components</h3>
<p>A design system is a collection of reusable components, guided by clear standards, that can be assembled to build any number of applications.</p>
<h4>Core Component Categories</h4>
<pre><code>1. Primitives:    Button, Input, Checkbox, Radio, Switch, Select
2. Layout:        Container, Grid, Stack, Divider
3. Navigation:    Navbar, Tabs, Breadcrumb, Pagination
4. Data Display:  Table, Card, List, Stat, Chart
5. Feedback:      Alert, Toast, Modal, Progress, Spinner</code></pre>
<h4>Design Tokens</h4>
<pre><code>:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --radius-sm: 4px;
  --radius-md: 8px;
}</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Build from primitives up (Button, ButtonGroup, Toolbar)</li>
<li>Document every component with usage examples</li>
<li>Ensure accessibility (ARIA labels, keyboard navigation)</li>
<li>Use consistent naming: ComponentName + size + variant</li>
</ul>`,

"Common Attack Vectors":
`<h3>Common Attack Vectors in Cybersecurity</h3>
<p>Understanding how attackers target systems is the first step in building effective defenses.</p>
<h4>Social Engineering</h4>
<pre><code>1. Phishing - Fake emails requesting credentials
   - Spear phishing: Targeted attacks on individuals
   - Whaling: Targeting executives
   - Smishing: SMS-based phishing

2. Pretexting - Fabricated scenarios
   - IT support call, vendor invoice

3. Baiting - Infected USB drives in public places</code></pre>
<h4>Network Attacks</h4>
<pre><code>1. Man-in-the-Middle (MITM)
   Prevention: Use HTTPS, VPNs, certificate pinning

2. Denial of Service (DDoS)
   Prevention: Rate limiting, CDN, traffic filtering

3. DNS Spoofing
   Prevention: DNSSEC, DNS over HTTPS</code></pre>
<h4>Web Application Attacks</h4>
<pre><code>1. SQL Injection (SQLi)
   Prevention: Parameterized queries, ORM

2. Cross-Site Scripting (XSS)
   Prevention: Input sanitization, CSP

3. CSRF
   Prevention: CSRF tokens, SameSite cookies</code></pre>`,

"VPNs & Encryption Protocols":
`<h3>VPNs and Encryption Protocols</h3>
<p>VPNs create secure, encrypted tunnels between your device and a remote server.</p>
<h4>How VPNs Work</h4>
<pre><code>Without VPN:
  Your Device -> ISP -> Website (visible)

With VPN:
  Your Device -> [Encrypted Tunnel] -> VPN Server -> Website</code></pre>
<h4>VPN Protocols</h4>
<pre><code>Protocol       | Speed  | Security | Use Case
WireGuard      | Fast   | High     | Modern default
OpenVPN        | Medium | High     | Most compatible
IKEv2/IPSec    | Fast   | High     | Mobile devices</code></pre>
<h4>Use Cases</h4>
<ul>
<li><strong>Remote work:</strong> Secure access to company resources</li>
<li><strong>Public WiFi:</strong> Protect data on untrusted networks</li>
<li><strong>Privacy:</strong> Prevent ISP tracking</li>
</ul>`,

"Hashing & Digital Signatures":
`<h3>Hashing and Digital Signatures</h3>
<p>Hashing ensures data integrity while digital signatures provide authentication and non-repudiation.</p>
<h4>Hash Functions</h4>
<pre><code>import hashlib

data = b"Hello, World!"
digest = hashlib.sha256(data).hexdigest()
# dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f

# Avalanche effect
digest2 = hashlib.sha256(b"Hello, World.").hexdigest()
# Completely different hash!</code></pre>
<h4>Password Hashing</h4>
<pre><code>import bcrypt

password = b"my_secret_password"
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))
if bcrypt.checkpw(password, hashed):
  print("Password matches!")
# NEVER use MD5/SHA for passwords!</code></pre>
<h4>Digital Signatures</h4>
<pre><code>from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

message = b"Transfer $1000 to Alice"
signature = private_key.sign(message, padding.PSS(...), hashes.SHA256())
public_key.verify(signature, message, padding.PSS(...), hashes.SHA256())</code></pre>
<h4>Key Takeaways</h4>
<ul>
<li>Use SHA-256 or SHA-3 for integrity checks</li>
<li>Use bcrypt/scrypt/Argon2 for password hashing</li>
<li>Never roll your own cryptography</li>
</ul>`,

"Vulnerability Scanning with Nmap":
`<h3>Vulnerability Scanning with Nmap</h3>
<p>Nmap is the industry-standard tool for network discovery and security auditing.</p>
<h4>Basic Scanning</h4>
<pre><code>nmap 192.168.1.1           # Quick scan
nmap -p 80,443,22 target   # Specific ports
nmap -p- target             # All 65535 ports
nmap -A target              # Aggressive (OS, version, scripts)
nmap 192.168.1.0/24         # Scan subnet</code></pre>
<h4>Scan Types</h4>
<pre><code>nmap -sS target     # SYN scan (stealthy)
nmap -sT target     # TCP connect scan
nmap -sV target     # Service version detection
nmap -O target      # OS detection</code></pre>
<h4>NSE Scripts</h4>
<pre><code>nmap --script vuln target
nmap --script ssl-enum-ciphers -p 443 example.com
nmap --script http-security-headers -p 80 example.com</code></pre>`,

"S3 Bucket Management":
`<h3>AWS S3 Bucket Management</h3>
<p>Amazon S3 provides scalable object storage. Understanding bucket management is essential for cloud computing.</p>
<h4>Basic Operations</h4>
<pre><code>import boto3

s3 = boto3.client("s3")
s3.create_bucket(Bucket="my-bucket")
s3.upload_file("local.txt", "my-bucket", "remote.txt")
s3.download_file("my-bucket", "remote.txt", "downloaded.txt")

response = s3.list_objects_v2(Bucket="my-bucket")
for obj in response.get("Contents", []):
  print(f"{obj['Key']} ({obj['Size']} bytes)")</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Enable versioning for data protection</li>
<li>Use lifecycle policies to manage costs</li>
<li>Enable access logging for auditing</li>
<li>Use server-side encryption (SSE-S3, SSE-KMS)</li>
<li>Block public access by default</li>
</ul>`,

"RDS & DynamoDB":
`<h3>AWS RDS and DynamoDB</h3>
<p>AWS offers both relational (RDS) and NoSQL (DynamoDB) database services.</p>
<h4>RDS</h4>
<pre><code>import boto3
rds = boto3.client("rds")

rds.create_db_instance(
  DBInstanceIdentifier="my-db",
  DBInstanceClass="db.t3.micro",
  Engine="mysql",
  MasterUsername="admin",
  MasterUserPassword="secure_password",
  AllocatedStorage=20
)</code></pre>
<h4>DynamoDB</h4>
<pre><code>import boto3
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Users")

table.put_item(Item={"user_id": "123", "name": "Alice"})
response = table.get_item(Key={"user_id": "123"})</code></pre>
<h4>RDS vs DynamoDB</h4>
<pre><code>Feature      | RDS              | DynamoDB
Model        | Relational (SQL) | Key-Value
Scaling      | Vertical         | Horizontal
Best for     | Complex queries  | Simple lookups</code></pre>`,

"CI/CD with CodePipeline":
`<h3>CI/CD with AWS CodePipeline</h3>
<p>Continuous Integration and Continuous Deployment automate the build, test, and deployment process.</p>
<h4>Pipeline Stages</h4>
<pre><code>1. Source     -> Code is pulled from repository
2. Build     -> Code is compiled and tested
3. Deploy    -> Application is deployed</code></pre>
<h4>buildspec.yml</h4>
<pre><code>version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - npm ci
  build:
    commands:
      - npm run lint
      - npm test
      - npm run build
artifacts:
  files:
    - '**/*'</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Keep pipelines fast (under 10 minutes)</li>
<li>Run tests in parallel</li>
<li>Use automated rollbacks on failure</li>
<li>Implement feature flags for safe deployments</li>
</ul>`,

"Consensus Mechanisms":
`<h3>Consensus Mechanisms in Blockchain</h3>
<p>Consensus mechanisms allow distributed nodes to agree on the state of the blockchain without a central authority.</p>
<h4>Proof of Work (PoW)</h4>
<pre><code>def mine_block(block_data, difficulty):
  nonce = 0
  while True:
    hash_result = sha256(f"{block_data}{nonce}")
    if hash_result.startswith("0" * difficulty):
      return nonce  # Found valid nonce!
    nonce += 1</code></pre>
<h4>Proof of Stake (PoS)</h4>
<pre><code># Validators stake tokens as collateral
# Higher stake = higher chance of being selected
# Dishonesty = lose staked tokens (slashing)

# Ethereum PoS:
# - 32 ETH minimum to become validator
# - ~99.95% less energy than PoW</code></pre>
<h4>Comparison</h4>
<pre><code>Mechanism | Speed    | Energy  | Decentralization
PoW       | Slow     | High    | High
PoS       | Medium   | Low     | Medium-High
DPoS      | Fast     | Low     | Medium</code></pre>`,

"ERC-20 Token Standard":
`<h3>ERC-20 Token Standard</h3>
<p>ERC-20 is the technical standard for fungible tokens on Ethereum.</p>
<h4>ERC-20 Interface</h4>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
    _mint(msg.sender, initialSupply * 10**decimals());
  }
}</code></pre>
<h4>Required Functions</h4>
<pre><code>function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);</code></pre>`,

"Yield Farming & Liquidity Pools":
`<h3>Yield Farming and Liquidity Pools</h3>
<p>Yield farming involves providing liquidity to DeFi protocols in exchange for rewards.</p>
<h4>How Liquidity Pools Work</h4>
<pre><code># Constant product AMM: x * y = k
# Pool: 100 ETH + 200,000 USDC
# k = 100 * 200000 = 20,000,000

# Swap 1 ETH for USDC:
# (100 + 1) * (200000 - new_usdc) = 20,000,000
# new_usdc = 198,019.80
# User receives: 1,980.20 USDC</code></pre>
<h4>Risks</h4>
<ul>
<li><strong>Impermanent Loss:</strong> Price divergence reduces value vs holding</li>
<li><strong>Smart contract risk:</strong> Bugs or exploits</li>
<li><strong>Rug pulls:</strong> Developers abandon project with funds</li>
<li><strong>Gas fees:</strong> Ethereum transactions can be expensive</li>
</ul>`,

"Core Components & Styling":
`<h3>React Native Core Components and Styling</h3>
<p>React Native provides core components that map to native platform UI elements.</p>
<h4>Core Components</h4>
<pre><code>import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function App() {
  return (
    &lt;View style={styles.container}&gt;
      &lt;Text style={styles.title}&gt;Hello World&lt;/Text&gt;
      &lt;TouchableOpacity style={styles.button}&gt;
        &lt;Text style={styles.buttonText}&gt;Press Me&lt;/Text&gt;
      &lt;/TouchableOpacity&gt;
    &lt;/View&gt;
  );
}</code></pre>
<h4>Stylesheet</h4>
<pre><code>const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: { fontSize: 20, fontWeight: "bold" },
  button: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" },
});</code></pre>
<h4>Flexbox Layout</h4>
<pre><code>// flexDirection defaults to "column" (not "row")
row: { flexDirection: "row", justifyContent: "space-between" },
center: { flex: 1, justifyContent: "center", alignItems: "center" },</code></pre>`,

"State Management with Context & Zustand":
`<h3>State Management with Context API and Zustand</h3>
<p>Managing state across multiple components requires a strategy.</p>
<h4>Context API</h4>
<pre><code>import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (credentials) => setUser({ id: 1, name: "Alice" });
  const logout = () => setUser(null);

  return (
    &lt;AuthContext.Provider value={{ user, login, logout }}&gt;
      {children}
    &lt;/AuthContext.Provider&gt;
  );
}</code></pre>
<h4>Zustand</h4>
<pre><code>import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
}));

function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  return &lt;button onClick={increment}&gt;Count: {count}&lt;/button&gt;;
}</code></pre>
<h4>Context vs Zustand</h4>
<pre><code>Feature          | Context API      | Zustand
Bundle size      | 0 KB             | ~1 KB
Re-renders       | All consumers    | Only subscribed
DevTools         | Limited          | Full support</code></pre>`,

"Camera, Location & Permissions":
`<h3>Camera, Location, and Permissions</h3>
<p>React Native provides access to device hardware but requires explicit permission handling.</p>
<h4>Camera Access</h4>
<pre><code>import { CameraView, useCameraPermissions } from "expo-camera";

function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  if (!permission.granted) {
    return &lt;Button title="Grant Permission" onPress={requestPermission} /&gt;;
  }
  return (
    &lt;CameraView style={{ flex: 1 }} facing="back"&gt;
      &lt;Button title="Take Photo" onPress={takePicture} /&gt;
    &lt;/CameraView&gt;
  );
}</code></pre>
<h4>Location Access</h4>
<pre><code>import * as Location from "expo-location";

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") { alert("Permission required"); return; }
  const location = await Location.getCurrentPositionAsync();
  console.log(location.coords.latitude, location.coords.longitude);
}</code></pre>`,

"App Store Submission Guide":
`<h3>App Store Submission Guide</h3>
<p>Getting your app into the App Store and Google Play requires following specific guidelines.</p>
<h4>Pre-Submission Checklist</h4>
<pre><code>Technical:
[ ] App icon (1024x1024 iOS, 512x512 Android)
[ ] Screenshots for all device sizes
[ ] App description and keywords
[ ] Privacy policy URL
[ ] Age rating completed

Testing:
[ ] Tested on physical devices
[ ] No crashes or critical bugs
[ ] Network error handling works</code></pre>
<h4>Common Rejection Reasons</h4>
<ul>
<li>Broken links or non-functional features</li>
<li>Insufficient metadata</li>
<li>Missing privacy policy</li>
<li>Using private APIs</li>
<li>Poor UI/UX</li>
<li>App crashes</li>
</ul>`,

"Pivot Tables & Data Summarization":
`<h3>Pivot Tables and Data Summarization</h3>
<p>Pivot tables are one of the most powerful features in Excel for analyzing and summarizing large datasets.</p>
<h4>Creating a Pivot Table</h4>
<pre><code>1. Select your data range (including headers)
2. Insert > PivotTable
3. Choose placement (new or existing sheet)
4. Drag fields to Row/Column/Value areas

Example: Sales Data
- Rows: Product Category
- Columns: Month
- Values: Sum of Revenue</code></pre>
<h4>Aggregation Functions</h4>
<pre><code>SUM      - Total of all values
COUNT    - Number of items
AVERAGE  - Mean value
MAX/MIN  - Highest/Lowest
% OF     - Percentage of grand total</code></pre>
<h4>Tips</h4>
<ul>
<li>Use Slicers for visual filtering</li>
<li>Calculated Fields for custom formulas</li>
<li>Refresh data when source changes</li>
<li>Use PivotCharts for visualization</li>
</ul>`,

"JOIN Operations":
`<h3>SQL JOIN Operations</h3>
<p>JOINs combine rows from two or more tables based on a related column.</p>
<h4>Types of JOINs</h4>
<pre><code>-- INNER JOIN: Only matching rows
SELECT o.id, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;

-- LEFT JOIN: All rows from left table
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- FULL OUTER JOIN: All rows from both
SELECT c.name, o.id
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;</code></pre>
<h4>Multi-table JOIN</h4>
<pre><code>SELECT o.id, c.name, p.product_name, oi.quantity
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.date >= '2024-01-01';</code></pre>
<h4>Performance Tips</h4>
<ul>
<li>Always index JOIN columns (foreign keys)</li>
<li>Use INNER JOIN when you only need matching rows</li>
<li>Avoid SELECT * — specify only needed columns</li>
</ul>`,

"Window Functions":
`<h3>SQL Window Functions</h3>
<p>Window functions perform calculations across a set of rows related to the current row without collapsing them.</p>
<h4>Basic Syntax</h4>
<pre><code>function_name() OVER (
  PARTITION BY column
  ORDER BY column
  ROWS/RANGE ...
)</code></pre>
<h4>Common Window Functions</h4>
<pre><code>-- Row Number
SELECT name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank
FROM employees;

-- Running Total
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING) AS running_total
FROM transactions;

-- Lag/Lead
SELECT month, revenue,
  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month,
  LEAD(revenue, 1) OVER (ORDER BY month) AS next_month
FROM monthly_sales;

-- Percentage of Total
SELECT product, sales,
  ROUND(sales * 100.0 / SUM(sales) OVER (), 2) AS pct_of_total
FROM product_sales;</code></pre>
<h4>RANK vs ROW_NUMBER</h4>
<pre><code>-- ROW_NUMBER: Unique sequential (1, 2, 3, 4)
-- RANK: Gaps for ties (1, 2, 2, 4)
-- DENSE_RANK: No gaps (1, 2, 2, 3)</code></pre>`

};

export default enrichedLessons;
