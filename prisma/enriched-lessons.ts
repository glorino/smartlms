// Enriched lesson content for TEXT lessons
// This file is loaded at seed time and merged into lesson content

export const enrichedLessons: Record<string, string> = {

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
</ul>
<h4>Key Takeaways</h4>
<blockquote>Semantic HTML is the foundation of accessible, SEO-friendly, and maintainable web development. Every div should be reconsidered - if it represents a header, navigation, article, section, or aside, use the appropriate semantic element instead.</blockquote>`,

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
  const fullName = user.first + " " + user.last;
  return { ...user, fullName, isActive: true };
};</code></pre>
<h4>Template Literals</h4>
<pre><code>const name = "Alice";
const age = 30;
const greeting = \`Hello, \${name}! You are \${age} years old.\`;

// Multi-line strings
const html = \`
  &lt;div class="card"&gt;
    &lt;h2&gt;\${name}&lt;/h2&gt;
    &lt;p&gt;Age: \${age}&lt;/p&gt;
  &lt;/div&gt;
\`;</code></pre>
<h4>Destructuring Assignment</h4>
<pre><code>// Object destructuring
const user = { name: "Alice", age: 30 };
const { name, age } = user;

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Nested destructuring
const { address: { street } } = user;</code></pre>
<h4>Spread and Rest Operators</h4>
<pre><code>// Spread - expands arrays/objects
const arr = [...[1, 2], 3, 4];
const obj = { ...{ a: 1 }, b: 2 };

// Rest - collects remaining elements
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}</code></pre>
<h4>Optional Chaining and Nullish Coalescing</h4>
<pre><code>// Optional chaining (?.)
const street = user?.address?.street;

// Nullish coalescing (??)
const port = config.port ?? 3000;</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Use arrow functions for callbacks; regular functions for methods and constructors</li>
<li>Prefer const by default; let only when reassignment is needed</li>
<li>Use destructuring to extract values from objects and arrays</li>
<li>Use template literals instead of string concatenation</li>
<li>Use optional chaining to safely access nested properties</li>
</ul>
<h4>Key Takeaways</h4>
<blockquote>ES6+ features transformed JavaScript into a modern, expressive language. Arrow functions, destructuring, template literals, and spread operators are tools you will use every day.</blockquote>`,

"State & Props Management":
`<h3>Understanding State and Props Management in React</h3>
<p>State and props are the two fundamental data mechanisms in React. Understanding how they work, when to use each, and how they flow through your component tree is critical for building predictable, maintainable applications.</p>
<h4>What Are Props?</h4>
<p>Props are read-only data passed from parent to child components. They are the primary way to configure and customize child components.</p>
<pre><code>// Passing props
&lt;UserProfile name="Alice" age={30} onUpdate={handleUpdate} /&gt;

// Receiving props
function UserProfile({ name, age, onUpdate }) {
  return (
    &lt;div&gt;
      &lt;h2&gt;{name}&lt;/h2&gt;
      &lt;p&gt;Age: {age}&lt;/p&gt;
      &lt;button onClick={onUpdate}&gt;Update&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<h4>What Is State?</h4>
<p>State is data managed within a component that can change over time. When state changes, React re-renders the component.</p>
<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Increment&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
<h4>Updating State Correctly</h4>
<pre><code>// WRONG - Direct mutation
user.name = "Bob";

// CORRECT - Immutable update
setUser({ ...user, name: "Bob" });

// Functional updates
setCount(prev => prev + 1);</code></pre>
<h4>useReducer for Complex State</h4>
<pre><code>function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case "TOGGLE_TODO":
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case "DELETE_TODO":
      return state.filter(todo => todo.id !== action.payload);
    default:
      throw new Error("Unknown action");
  }
}</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Props flow data down from parent to child and are read-only. State is managed within a component and can change. Always update state immutably. For complex state logic, use useReducer.</blockquote>`,

"RESTful API Design":
`<h3>Designing RESTful APIs</h3>
<p>REST is an architectural style for designing networked applications. RESTful APIs use HTTP methods to perform operations on resources, following conventions that make APIs predictable and scalable.</p>
<h4>Core REST Principles</h4>
<ul>
<li><strong>Client-Server Separation:</strong> Client and server are independent</li>
<li><strong>Stateless:</strong> Each request contains all information needed</li>
<li><strong>Cacheable:</strong> Responses must define themselves as cacheable or not</li>
<li><strong>Uniform Interface:</strong> Consistent resource identification and manipulation</li>
</ul>
<h4>Resource Naming</h4>
<pre><code>GET    /api/v1/users          - List users
GET    /api/v1/users/123      - Get user 123
POST   /api/v1/users          - Create user
PUT    /api/v1/users/123      - Update user
DELETE /api/v1/users/123      - Delete user</code></pre>
<h4>HTTP Methods and Status Codes</h4>
<pre><code>GET    -> 200 OK, 404 Not Found
POST   -> 201 Created, 400 Bad Request
PUT    -> 200 OK, 404 Not Found
PATCH  -> 200 OK, 404 Not Found
DELETE -> 204 No Content, 404 Not Found</code></pre>
<h4>Authentication</h4>
<pre><code>// JWT middleware
function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}</code></pre>
<h4>Best Practices</h4>
<ul>
<li>Use plural nouns for resource names</li>
<li>Version your API from the start</li>
<li>Use HTTP status codes correctly</li>
<li>Implement pagination for list endpoints</li>
<li>Validate all incoming data</li>
</ul>
<h4>Key Takeaways</h4>
<blockquote>A well-designed REST API uses HTTP methods correctly, resources with plural nouns, includes pagination, and follows consistent error formats.</blockquote>`,

"Linear Algebra for ML":
`<h3>Linear Algebra Foundations for Machine Learning</h3>
<p>Linear algebra is the mathematical backbone of machine learning. Every data point, feature, weight, and transformation in ML is represented using vectors, matrices, and tensors.</p>
<h4>Scalars, Vectors, and Matrices</h4>
<pre><code>import numpy as np

# Scalar
scalar = 5.0

# Vector (1D array)
vector = np.array([1, 2, 3, 4, 5])
print(vector.shape)  # (5,)

# Matrix (2D array)
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(matrix.shape)  # (3, 3)

# Tensor (3D array)
tensor = np.zeros((32, 28, 28, 3))</code></pre>
<h4>Vector Operations</h4>
<pre><code>a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Dot product
dot = np.dot(a, b)  # 32

# Magnitude
magnitude = np.linalg.norm(a)  # 3.74

# Unit vector
unit = a / np.linalg.norm(a)</code></pre>
<h4>Matrix Operations</h4>
<pre><code>A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

# Matrix multiplication
C = A @ B  # [[19, 22], [43, 50]]

# Transpose, Determinant, Inverse
A_T = A.T
det = np.linalg.det(A)
A_inv = np.linalg.inv(A)

# Solving linear systems
b = np.array([5, 7])
x = np.linalg.solve(A, b)</code></pre>
<h4>Eigenvalues and SVD</h4>
<pre><code>eigenvalues, eigenvectors = np.linalg.eig(A)

# SVD for dimensionality reduction
U, S, Vt = np.linalg.svd(A)</code></pre>
<h4>Applications in ML</h4>
<ul>
<li><strong>Linear Regression:</strong> w = (X^T X)^-1 X^T y</li>
<li><strong>PCA:</strong> Eigendecomposition of covariance matrix</li>
<li><strong>Neural Networks:</strong> Matrix multiplication per layer</li>
<li><strong>Recommendations:</strong> SVD for collaborative filtering</li>
</ul>
<h4>Key Takeaways</h4>
<blockquote>Linear algebra provides the mathematical foundation for all of machine learning. Vectors, matrices, and eigenvalues are essential for understanding ML algorithms deeply.</blockquote>`,

"Decision Trees & Random Forests":
`<h3>Decision Trees and Random Forests</h3>
<p>Decision trees are interpretable models that split data based on feature values. Random forests combine many trees to reduce overfitting and improve accuracy.</p>
<h4>Splitting Criteria</h4>
<pre><code>import numpy as np

def gini_impurity(y):
    classes, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return 1 - np.sum(probs ** 2)

def entropy(y):
    classes, counts = np.unique(y, return_counts=True)
    probs = counts / len(y)
    return -np.sum(probs * np.log2(probs + 1e-10))</code></pre>
<h4>Scikit-Learn Implementation</h4>
<pre><code>from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

clf = DecisionTreeClassifier(max_depth=3)
clf.fit(X_train, y_train)

rf = RandomForestClassifier(n_estimators=100, max_features="sqrt")
rf.fit(X_train, y_train)</code></pre>
<h4>Hyperparameter Tuning</h4>
<pre><code>from sklearn.model_selection import GridSearchCV

param_grid = {"n_estimators": [50, 100, 200], "max_depth": [5, 10, None]}
grid = GridSearchCV(RandomForestClassifier(), param_grid, cv=5)
grid.fit(X_train, y_train)</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Random forests combine many trees trained on random subsets of data and features, reducing overfitting. They provide a strong baseline for tabular data problems.</blockquote>`,

"Principal Component Analysis (PCA)":
`<h3>Understanding Principal Component Analysis (PCA)</h3>
<p>PCA reduces dimensionality by projecting data onto directions of maximum variance, enabling visualization, noise reduction, and improved model performance.</p>
<h4>Mathematical Foundation</h4>
<pre><code>"""
Steps in PCA:
1. Standardize the data
2. Compute covariance matrix
3. Eigendecomposition
4. Select top k components
5. Project data
"""</code></pre>
<h4>Scikit-Learn Implementation</h4>
<pre><code>from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

pca = PCA(n_components=0.95)
X_pca = pca.fit_transform(X_scaled)
print(f"Variance captured: {pca.explained_variance_ratio_.sum():.2%}")</code></pre>
<h4>Choosing Components</h4>
<pre><code>pca_full = PCA()
pca_full.fit(X_scaled)
cumsum = np.cumsum(pca_full.explained_variance_ratio_)
n_components_95 = np.argmax(cumsum >= 0.95) + 1</code></pre>
<h4>Key Takeaways</h4>
<blockquote>PCA reduces dimensionality by projecting data onto directions of maximum variance. Always standardize data before applying PCA. Use scree plots to choose component count.</blockquote>`,

"Training with Backpropagation":
`<h3>Understanding Backpropagation in Neural Networks</h3>
<p>Backpropagation computes gradients of the loss function with respect to each weight using the chain rule, enabling neural networks to learn from data.</p>
<h4>Training Loop</h4>
<pre><code>"""
1. Forward Pass: Input flows through layers
2. Loss Calculation: Compare prediction to label
3. Backward Pass: Compute gradients
4. Weight Update: Adjust weights
"""</code></pre>
<h4>PyTorch Implementation</h4>
<pre><code>import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(784, 256), nn.ReLU(),
            nn.Linear(256, 10)
        )

    def forward(self, x):
        return self.network(x)

model = SimpleNet()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training
for epoch in range(10):
    for X_batch, y_batch in dataloader:
        outputs = model(X_batch)
        loss = criterion(outputs, y_batch)
        optimizer.zero_grad()
        loss.backward()  # Backpropagation
        optimizer.step()</code></pre>
<h4>Optimization Algorithms</h4>
<pre><code># SGD with momentum
optimizer_sgd = optim.SGD(model.parameters(), lr=0.01, momentum=0.9)

# Adam (adaptive learning rates)
optimizer_adam = optim.Adam(model.parameters(), lr=0.001)

# Learning rate scheduler
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer_adam)</code></pre>
<h4>Common Challenges</h4>
<ul>
<li><strong>Vanishing Gradients:</strong> Solutions: ReLU, batch normalization, skip connections</li>
<li><strong>Exploding Gradients:</strong> Solutions: gradient clipping, proper initialization</li>
</ul>
<h4>Key Takeaways</h4>
<blockquote>Backpropagation computes gradients efficiently using the chain rule. Modern frameworks handle this automatically. Understanding the math helps debug training issues.</blockquote>`,

"Keyword Research Methods":
`<h3>Comprehensive Keyword Research for SEO</h3>
<p>Keyword research discovers the terms your audience uses when searching. It drives content strategy, SEO, and helps you create content that matches user intent.</p>
<h4>Search Intent Types</h4>
<ul>
<li><strong>Informational:</strong> "how to train a puppy" - user wants to learn</li>
<li><strong>Navigational:</strong> "Facebook login" - user wants a specific site</li>
<li><strong>Commercial:</strong> "best laptops 2024" - researching before purchase</li>
<li><strong>Transactional:</strong> "buy iPhone 15" - ready to buy</li>
</ul>
<h4>Research Process</h4>
<pre><code>1. Brainstorm seed keywords
2. Expand with tools (Ahrefs, SEMrush, Google Keyword Planner)
3. Analyze metrics (volume, difficulty, CPC)
4. Prioritize and organize into topic clusters</code></pre>
<h4>Python Keyword Analysis</h4>
<pre><code>def analyze_keywords(keywords):
    results = []
    for kw in keywords:
        word_count = len(kw.split())
        is_question = any(w in kw.lower() for w in ["how","what","why","when","where"])
        results.append({"keyword": kw, "word_count": word_count, "is_question": is_question})
    return results</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Focus on user intent over raw search volume. Use topic clusters for content planning and prioritize long-tail keywords for quick wins.</blockquote>`,

"Content Calendar Planning":
`<h3>Creating and Managing a Content Calendar</h3>
<p>A content calendar maps what you publish, when, and where. It transforms ad-hoc content creation into a systematic, goal-driven process.</p>
<h4>Calendar Components</h4>
<pre><code>Essential fields:
1. Publication Date
2. Content Type (blog, video, social, email)
3. Title/Topic
4. Target Keyword
5. Search Intent
6. Funnel Stage (TOFU, MOFU, BOFU)
7. Status (Idea, Draft, Review, Published)
8. Owner</code></pre>
<h4>Content Mix Strategy</h4>
<pre><code>Educational Content (40%): How-tos, guides, tutorials
Engaging Content (30%): Case studies, interviews, UGC
Promotional Content (20%): Product features, testimonials
Entertaining Content (10%): Humor, interactive content</code></pre>
<h4>Generate Calendar with Python</h4>
<pre><code>import pandas as pd
from datetime import datetime, timedelta

def create_calendar(start_date, weeks):
    content_types = {"Monday": "Blog", "Tuesday": "Social", "Wednesday": "Video"}
    calendar = []
    start = datetime.strptime(start_date, "%Y-%m-%d")
    for week in range(weeks):
        for day, ctype in content_types.items():
            calendar.append({"date": start + timedelta(weeks=week), "type": ctype})
    return pd.DataFrame(calendar)</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Plan 2-4 weeks ahead, maintain a balanced content mix, and track performance metrics regularly. Repurpose content across channels.</blockquote>`,

"Email Campaign Design":
`<h3>Designing Effective Email Marketing Campaigns</h3>
<p>Email marketing generates $36 for every $1 spent. Effective campaigns combine compelling design, personalization, strategic timing, and testing.</p>
<h4>Campaign Types</h4>
<ul>
<li><strong>Welcome Series:</strong> 3-5 emails for new subscribers</li>
<li><strong>Nurture Campaigns:</strong> Educational content for leads</li>
<li><strong>Promotional:</strong> Product launches, sales</li>
<li><strong>Re-engagement:</strong> Win back inactive subscribers</li>
</ul>
<h4>Subject Line Formulas</h4>
<pre><code>1. Curiosity: "The one mistake 90% of marketers make"
2. Urgency: "Last chance: 40% off ends tonight"
3. Personalization: "John, your report is ready"
4. Value: "Free template: 2024 content calendar"
5. Social Proof: "Join 10,000+ subscribers who..."</code></pre>
<h4>A/B Testing</h4>
<pre><code>import numpy as np
from scipy import stats

def analyze_ab(control_opens, variant_opens, control_sent, variant_sent):
    control_rate = control_opens / control_sent
    variant_rate = variant_opens / variant_sent
    data = np.array([[control_opens, control_sent - control_opens],
                     [variant_opens, variant_sent - variant_opens]])
    _, pvalue, _, _ = stats.chi2_contingency(data)
    return {"lift": (variant_rate - control_rate) / control_rate, "significant": pvalue < 0.05}</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Segment your audience, test one variable at a time, and always monitor deliverability metrics. Welcome series and nurture campaigns are highest ROI.</blockquote>`,

"Generators & Itertools":
`<h3>Python Generators and Itertools</h3>
<p>Generators produce values on-the-fly without storing them in memory. The itertools module provides fast, memory-efficient tools for working with iterators.</p>
<h4>Generator Basics</h4>
<pre><code># Generator function
def countdown(n):
    while n > 0:
        yield n
        n -= 1

# Generator expression (memory efficient)
squares = (x**2 for x in range(1000000))

# Reading large files
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()</code></pre>
<h4>itertools Patterns</h4>
<pre><code>import itertools

# Chain iterables
combined = itertools.chain([1, 2], [3, 4])

# Group consecutive elements
data = [("A", 1), ("A", 2), ("B", 3)]
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))

# Combinatoric iterators
perms = list(itertools.permutations(["A", "B", "C"], 2))
combs = list(itertools.combinations(["A", "B", "C"], 2))</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Use generators for memory-efficient processing of large datasets. itertools provides composable building blocks for iterator operations.</blockquote>`,

"Descriptors & Properties":
`<h3>Python Descriptors and Properties</h3>
<p>Descriptors customize attribute access on objects. Properties, built on descriptors, provide getter/setter syntax for clean APIs.</p>
<h4>Descriptor Protocol</h4>
<pre><code>class Validator:
    def __init__(self, min_val=None, max_val=None):
        self.min_val = min_val
        self.max_val = max_val

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None: return self
        return getattr(obj, f"_{self.name}", None)

    def __set__(self, obj, value):
        if self.min_val is not None and value < self.min_val:
            raise ValueError(f"{self.name} must be >= {self.min_val}")
        setattr(obj, f"_{self.name}", value)

class Student:
    age = Validator(min_val=0, max_val=150)</code></pre>
<h4>Property Decorator</h4>
<pre><code>class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self):
        import math
        return math.pi * self._radius ** 2</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Use @property for simple computed attributes on a single class. Use descriptors when the same behavior applies to multiple classes (validation, caching).</blockquote>`,

"Coroutines & Tasks":
`<h3>Python Coroutines and Async Tasks</h3>
<p>Asynchronous programming handles concurrent I/O operations efficiently. Coroutines pause at await expressions, and Tasks schedule them on the event loop.</p>
<h4>Async/Await Basics</h4>
<pre><code>import asyncio

async def fetch_data(url, delay):
    await asyncio.sleep(delay)
    return f"Data from {url}"

async def main():
    results = await asyncio.gather(
        fetch_data("api/users", 2),
        fetch_data("api/posts", 1),
        fetch_data("api/comments", 3)
    )
    print(results)

asyncio.run(main())</code></pre>
<h4>Task Groups (Python 3.11+)</h4>
<pre><code>async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(process("X", 2))
        task2 = tg.create_task(process("Y", 1))
    print(task1.result(), task2.result())</code></pre>
<h4>Async Iteration</h4>
<pre><code>async def async_range(start, stop):
    for i in range(start, stop):
        await asyncio.sleep(0.1)
        yield i

async for num in async_range(0, 5):
    print(num)</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Coroutines pause at await, allowing other tasks to run. Tasks schedule coroutines on the event loop for concurrent execution. Use gather for parallel operations.</blockquote>`,

"Observer & Strategy Patterns":
`<h3>Observer and Strategy Design Patterns</h3>
<p>The Observer pattern defines one-to-many dependencies for automatic notifications. The Strategy pattern makes algorithms interchangeable at runtime.</p>
<h4>Observer Pattern</h4>
<pre><code>class EventEmitter:
    def __init__(self):
        self.listeners = {}

    def on(self, event, callback):
        self.listeners.setdefault(event, []).append(callback)

    def emit(self, event, *args):
        for callback in self.listeners.get(event, []):
            callback(*args)

emitter = EventEmitter()
emitter.on("data", lambda d: print(f"Received: {d}"))
emitter.emit("data", "hello")</code></pre>
<h4>Strategy Pattern</h4>
<pre><code>class SortStrategy:
    def sort(self, data):
        raise NotImplementedError

class BubbleSort(SortStrategy):
    def sort(self, data):
        return sorted(data)

class QuickSort(SortStrategy):
    def sort(self, data):
        if len(data) <= 1: return data
        pivot = data[len(data) // 2]
        left = [x for x in data if x < pivot]
        middle = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + middle + self.sort(right)

class Sorter:
    def __init__(self, strategy):
        self.strategy = strategy
    def sort(self, data):
        return self.strategy.sort(data)</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Observer decouples event producers from consumers. Strategy encapsulates algorithms, making them interchangeable at runtime.</blockquote>`,

"Visual Hierarchy & Layout":
`<h3>Visual Hierarchy and Layout Principles</h3>
<p>Visual hierarchy guides users through content in order of importance. It determines what users see first and how they navigate through information.</p>
<h4>Principles</h4>
<ul>
<li><strong>Size:</strong> Larger elements draw attention first</li>
<li><strong>Color and Contrast:</strong> High contrast elements stand out</li>
<li><strong>Typography:</strong> Font weight and spacing create importance levels</li>
<li><strong>Spacing:</strong> White space groups or separates elements</li>
<li><strong>Position:</strong> Top-left is seen first in LTR cultures</li>
</ul>
<h4>Layout Grids</h4>
<pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}
.col-4 { grid-column: span 4; }
.col-8 { grid-column: span 8; }

/* F-pattern for text-heavy pages */
.f-pattern { max-width: 800px; margin: 0 auto; }

/* Z-pattern for landing pages */
.z-pattern { display: grid; grid-template-columns: 1fr 1fr; }</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Effective visual hierarchy guides users naturally through your design. Use size, contrast, and spacing to create clear importance levels.</blockquote>`,

"Low-Fidelity Wireframing":
`<h3>Low-Fidelity Wireframing</h3>
<p>Low-fidelity wireframes are simple sketches focusing on layout, content placement, and user flow rather than visual design. They are fast to create and easy to change.</p>
<h4>Benefits</h4>
<ul>
<li><strong>Speed:</strong> Create in minutes, not hours</li>
<li><strong>Focus:</strong> Concentrate on structure, not aesthetics</li>
<li><strong>Collaboration:</strong> Easy for non-designers to understand</li>
<li><strong>Iteration:</strong> Cheap to discard and redo</li>
</ul>
<h4>Wireframe Symbols</h4>
<pre><code>Common wireframe symbols:
- Box with X = Image placeholder
- Wavy lines = Text content
- Box with label = Button
- Rectangle = Content block
- Circles = Navigation items
- Lines with arrows = User flow</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Start with low-fi wireframes to validate layout and flow before investing in visual design. They save time and encourage iteration.</blockquote>`,

"Design System Components":
`<h3>Building Design System Components</h3>
<p>A design system is a collection of reusable components, guided by clear standards, that build a unified product experience.</p>
<h4>Core Components</h4>
<ul>
<li><strong>Buttons:</strong> Primary, secondary, ghost, danger variants</li>
<li><strong>Forms:</strong> Inputs, selects, checkboxes, radio buttons</li>
<li><strong>Cards:</strong> Content containers with consistent styling</li>
<li><strong>Navigation:</strong> Headers, sidebars, tabs, breadcrumbs</li>
<li><strong>Feedback:</strong> Alerts, toasts, modals, loading indicators</li>
</ul>
<h4>Token System</h4>
<pre><code>:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-success: #10b981;
  --color-error: #ef4444;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Design systems ensure consistency and speed up development. Start with design tokens, then build reusable components with clear documentation.</blockquote>`,

"Common Attack Vectors":
`<h3>Understanding Common Cyber Attack Vectors</h3>
<p>An attack vector is a method or pathway used by hackers to gain unauthorized access. Understanding these vectors is the first step to defending against them.</p>
<h4>Major Attack Categories</h4>
<ul>
<li><strong>Phishing:</strong> Deceptive emails tricking users into revealing credentials</li>
<li><strong>Social Engineering:</strong> Manipulating people into breaking security</li>
<li><strong>Malware:</strong> Viruses, trojans, ransomware, and spyware</li>
<li><strong>SQL Injection:</strong> Inserting malicious SQL into application queries</li>
<li><strong>XSS:</strong> Injecting malicious scripts into web pages</li>
<li><strong>DDoS:</strong> Overwhelming systems with traffic</li>
</ul>
<h4>SQL Injection Example</h4>
<pre><code>-- Vulnerable query
SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "';

-- Attack: username = ' OR 1=1 --
-- Resulting query:
SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = '';

-- Prevention: Use parameterized queries</code></pre>
<h4>Key Takeaways</h4>
<blockquote>The most common attack vectors exploit human trust and coding mistakes. Defense requires both user education and secure coding practices like input validation and parameterized queries.</blockquote>`,

"VPNs & Encryption Protocols":
`<h3>VPNs and Encryption Protocols</h3>
<p>VPNs create encrypted tunnels for data transmission. Understanding encryption protocols helps you choose the right security level.</p>
<h4>VPN Protocols</h4>
<pre><code>Protocol    | Speed  | Security | Use Case
------------|--------|----------|------------------
OpenVPN     | Medium | High     | General purpose
WireGuard   | Fast   | High     | Modern alternative
IKEv2/IPSec | Fast   | High     | Mobile devices
L2TP/IPSec  | Medium | Medium   | Legacy systems
PPTP        | Fast   | Low      | Avoid (obsolete)</code></pre>
<h4>Encryption Algorithms</h4>
<pre><code>Common algorithms:
- AES-256: Symmetric encryption (data in transit)
- RSA-2048+: Asymmetric encryption (key exchange)
- SHA-256: Hashing for data integrity
- Diffie-Hellman: Key exchange protocol</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Choose VPN protocols based on speed and security needs. WireGuard is the modern choice for most use cases. Avoid PPTP due to known vulnerabilities.</blockquote>`,

"Hashing & Digital Signatures":
`<h3>Hashing and Digital Signatures</h3>
<p>Hashing creates fixed-size fingerprints of data. Digital signatures prove authenticity and integrity of messages.</p>
<h4>Hashing in Python</h4>
<pre><code>import hashlib
import bcrypt

# SHA-256
message = "Hello, World!"
hash_obj = hashlib.sha256(message.encode())
print(hash_obj.hexdigest())

# Password hashing with bcrypt
password = "user_password".encode()
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

# Verify
if bcrypt.checkpw(password, hashed):
    print("Password matches")</code></pre>
<h4>Digital Signatures</h4>
<pre><code>from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding

private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

# Sign
signature = private_key.sign(message, padding.PKCS1v15(), hashes.SHA256())

# Verify
public_key.verify(signature, message, padding.PKCS1v15(), hashes.SHA256())</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Hashing verifies data integrity. Digital signatures provide authentication and non-repudiation. Always use bcrypt for password hashing.</blockquote>`,

"Vulnerability Scanning with Nmap":
`<h3>Vulnerability Scanning with Nmap</h3>
<p>Nmap is a network scanning tool used to discover hosts, services, and vulnerabilities on a network.</p>
<h4>Basic Nmap Commands</h4>
<pre><code># Scan a target
nmap 192.168.1.1

# Service detection
nmap -sV 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Scan entire subnet
nmap 192.168.1.0/24

# Stealth scan
nmap -sS 192.168.1.1

# Vulnerability scan
nmap --script vuln 192.168.1.1</code></pre>
<h4>Common Ports</h4>
<pre><code>21 - FTP (often insecure)
22 - SSH (check for weak credentials)
80 - HTTP
443 - HTTPS
3306 - MySQL
5432 - PostgreSQL</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Nmap helps identify network vulnerabilities before attackers do. Regular scanning combined with patch management forms a strong security posture.</blockquote>`,

"S3 Bucket Management":
`<h3>AWS S3 Bucket Management</h3>
<p>Amazon S3 is an object storage service offering industry-leading scalability, data availability, and security.</p>
<h4>Creating and Configuring Buckets</h4>
<pre><code>import boto3

s3 = boto3.client('s3')

# Create bucket
s3.create_bucket(Bucket='my-bucket',
    CreateBucketConfiguration={'LocationConstraint': 'us-west-2'})

# Upload file
s3.upload_file('local-file.txt', 'my-bucket', 'remote-file.txt')

# List objects
response = s3.list_objects_v2(Bucket='my-bucket')</code></pre>
<h4>Security Configuration</h4>
<pre><code># Enable versioning
s3.put_bucket_versioning(Bucket='my-bucket',
    VersioningConfiguration={'Status': 'Enabled'})

# Enable encryption
s3.put_bucket_encryption(Bucket='my-bucket',
    ServerSideEncryptionConfiguration={
        'Rules': [{'ApplyServerSideEncryptionByDefault': {'SSEAlgorithm': 'aws:kms'}}]
    })</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Secure S3 buckets by enabling encryption, versioning, and proper bucket policies. Never leave buckets publicly accessible unless explicitly required.</blockquote>`,

"RDS & DynamoDB":
`<h3>AWS RDS and DynamoDB</h3>
<p>RDS provides managed relational databases. DynamoDB offers fully managed NoSQL key-value and document databases.</p>
<h4>RDS Setup</h4>
<pre><code>import boto3

rds = boto3.client('rds')
rds.create_db_instance(
    DBInstanceIdentifier='my-db',
    DBInstanceClass='db.t3.micro',
    Engine='postgresql',
    MasterUsername='admin',
    MasterUserPassword='secure_password',
    AllocatedStorage=20
)</code></pre>
<h4>DynamoDB Basics</h4>
<pre><code>dynamodb = boto3.resource('dynamodb')
table = dynamodb.create_table(
    TableName='Users',
    KeySchema=[{'AttributeName': 'user_id', 'KeyType': 'HASH'}],
    AttributeDefinitions=[{'AttributeName': 'user_id', 'AttributeType': 'S'}],
    BillingMode='PAY_PER_REQUEST'
)

# Put item
table.put_item(Item={'user_id': '123', 'name': 'Alice'})

# Get item
response = table.get_item(Key={'user_id': '123'})</code></pre>
<h4>Key Takeaways</h4>
<blockquote>RDS is ideal for structured data with complex queries. DynamoDB excels at high-throughput, low-latency key-value lookups.</blockquote>`,

"CI/CD with CodePipeline":
`<h3>CI/CD with AWS CodePipeline</h3>
<p>CodePipeline automates the build, test, and deploy phases of your release process.</p>
<h4>Pipeline Stages</h4>
<pre><code>1. Source: GitHub/CodeCommit triggers pipeline
2. Build: CodeBuild compiles and tests code
3. Deploy: CodeDeploy/ECS/Lambda deploys to environment

Typical flow:
Developer pushes code -> Source stage triggers
-> Build stage runs tests
-> Deploy stage pushes to staging
-> Manual approval
-> Deploy to production</code></pre>
<h4>CodeBuild Build Spec</h4>
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
<h4>Key Takeaways</h4>
<blockquote>Automate your entire release pipeline from code commit to production. Include automated testing and manual approval gates for critical stages.</blockquote>`,

"Consensus Mechanisms":
`<h3>Blockchain Consensus Mechanisms</h3>
<p>Consensus mechanisms ensure all nodes in a blockchain network agree on the state of the ledger without a central authority.</p>
<h4>Major Algorithms</h4>
<pre><code>Proof of Work (PoW):
  - Miners solve complex puzzles
  - High energy consumption
  - Used by Bitcoin

Proof of Stake (PoS):
  - Validators stake tokens
  - Energy efficient
  - Used by Ethereum 2.0

Delegated PoS (DPoS):
  - Token holders vote for delegates
  - Faster block times

Byzantine Fault Tolerance (BFT):
  - Tolerates up to 1/3 faulty nodes</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Consensus mechanisms balance security, decentralization, and scalability. PoW offers maximum security but uses energy. PoS provides efficiency with good security.</blockquote>`,

"ERC-20 Token Standard":
`<h3>Understanding ERC-20 Token Standard</h3>
<p>ERC-20 is the standard interface for fungible tokens on Ethereum, enabling tokens to be traded and integrated with dApps.</p>
<h4>ERC-20 Interface</h4>
<pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}</code></pre>
<h4>Required Functions</h4>
<pre><code>function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);</code></pre>
<h4>Key Takeaways</h4>
<blockquote>ERC-20 provides a standard interface for fungible tokens. Use OpenZeppelin implementations for security. Always audit smart contracts before deployment.</blockquote>`,

"Yield Farming & Liquidity Pools":
`<h3>Yield Farming and Liquidity Pools</h3>
<p>Yield farming involves providing liquidity to DeFi protocols for rewards. Liquidity pools are smart contracts holding token pairs for decentralized trading.</p>
<h4>AMM Formula</h4>
<pre><code>x * y = k

Where:
x = Token A reserve
y = Token B reserve
k = Constant product

Example:
Pool has 100 ETH and 200,000 USDC
k = 100 * 200,000 = 20,000,000

Buy 10 ETH:
New ETH = 90
New USDC = 20,000,000 / 90 = 222,222.22
Cost = 22,222.22 USDC for 10 ETH</code></pre>
<h4>Impermanent Loss</h4>
<pre><code>Initial: 10 ETH ($2000) + 20,000 USDC
After 2x ETH price change:
Pool value = $42,426
If held = $60,000
Impermanent Loss = 29.3%</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Yield farming offers high returns but carries risks including impermanent loss and smart contract vulnerabilities. Always research protocols thoroughly.</blockquote>`,

"Core Components & Styling":
`<h3>React Native Core Components and Styling</h3>
<p>React Native provides core components that map to native platform UI elements. Styling uses a subset of CSS with Flexbox layout.</p>
<h4>Core Components</h4>
<pre><code>import React from 'react';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';

function App() {
  return (
    &lt;ScrollView&gt;
      &lt;View style={styles.container}&gt;
        &lt;Text style={styles.title}&gt;Hello React Native&lt;/Text&gt;
        &lt;Image source={{ uri: 'https://example.com/img.png' }} style={styles.image} /&gt;
        &lt;FlatList
          data={[{id: '1', name: 'Item 1'}]}
          keyExtractor={item => item.id}
          renderItem={({item}) => &lt;Text&gt;{item.name}&lt;/Text&gt;}
        /&gt;
      &lt;/View&gt;
    &lt;/ScrollView&gt;
  );
}</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Use FlatList for long lists (virtualized) and ScrollView for small content. Styling uses Flexbox by default.</blockquote>`,

"State Management with Context & Zustand":
`<h3>State Management with Context and Zustand</h3>
<p>For state shared across many components, React Context or Zustand provide cleaner alternatives to prop drilling.</p>
<h4>React Context</h4>
<pre><code>import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    &lt;ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}</code></pre>
<h4>Zustand Store</h4>
<pre><code>import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  todos: [],
  increment: () => set(state => ({ count: state.count + 1 })),
  addTodo: (text) => set(state => ({
    todos: [...state.todos, { id: Date.now(), text, done: false }]
  }))
}));

function Counter() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  return &lt;button onClick={increment}&gt;{count}&lt;/button&gt;;
}</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Use Context for simple global state like themes. Zustand is lightweight and avoids Context performance issues.</blockquote>`,

"Camera, Location & Permissions":
`<h3>Camera, Location, and Permissions in React Native</h3>
<p>React Native provides access to device hardware through libraries. Permissions must be requested before accessing sensitive data.</p>
<h4>Camera Access</h4>
<pre><code>import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const [hasPermission, setHasPermission] = useState(null);

useEffect(() => {
  (async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  })();
}, []);

const takePicture = async () => {
  if (cameraRef.current) {
    const photo = await cameraRef.current.takePictureAsync();
    setImage(photo.uri);
  }
};</code></pre>
<h4>Location Access</h4>
<pre><code>import * as Location from 'expo-location';

useEffect(() => {
  (async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    }
  })();
}, []);</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Always request permissions at runtime and handle denial gracefully. Use expo-camera and expo-location for cross-platform hardware access.</blockquote>`,

"App Store Submission Guide":
`<h3>App Store Submission Guide</h3>
<p>Submitting an app to the App Store or Google Play requires meeting specific guidelines and preparing proper metadata.</p>
<h4>Pre-Submission Checklist</h4>
<pre><code>App Store Requirements:
1. App icon (1024x1024 PNG)
2. Screenshots for all required device sizes
3. App description and keywords
4. Privacy policy URL
5. Support URL
6. Category selection
7. Age rating questionnaire

Build Commands:
# iOS
eas build --platform ios
eas submit --platform ios

# Android
eas build --platform android
eas submit --platform android</code></pre>
<h4>Common Rejection Reasons</h4>
<pre><code>- Crashes or bugs
- Incomplete metadata
- Misleading description
- Privacy policy missing
- Poor UI/UX design
- Broken links
- Placeholder content</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Test thoroughly before submission. Follow platform guidelines carefully. Prepare all metadata and screenshots in advance.</blockquote>`,

"Pivot Tables & Data Summarization":
`<h3>Pivot Tables and Data Summarization in Excel</h3>
<p>Pivot tables transform raw data into meaningful summaries, enabling quick analysis of large datasets without complex formulas.</p>
<h4>Creating Pivot Tables</h4>
<pre><code>import pandas as pd

df = pd.read_csv('sales.csv')

pivot = pd.pivot_table(
    df,
    values='Revenue',
    index='Region',
    columns='Product',
    aggfunc='sum',
    fill_value=0,
    margins=True,
    margins_name='Total'
)
print(pivot)</code></pre>
<h4>Aggregation Functions</h4>
<pre><code>Common aggregations:
- SUM: Total of all values
- COUNT: Number of entries
- AVERAGE: Mean value
- MAX/MIN: Highest/lowest values
- STDEV: Standard deviation

# Multiple aggregations
pivot = pd.pivot_table(df, values='Revenue', index='Region',
    aggfunc=['sum', 'mean', 'count'])</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Pivot tables are powerful for data exploration. They let you slice data by multiple dimensions and quickly identify trends.</blockquote>`,

"JOIN Operations":
`<h3>SQL JOIN Operations</h3>
<p>JOINs combine rows from two or more tables based on related columns, enabling you to query data across multiple tables.</p>
<h4>Types of JOINs</h4>
<pre><code>-- INNER JOIN: Only matching rows
SELECT c.name, o.total
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

-- LEFT JOIN: All rows from left table
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- FULL OUTER JOIN: All rows from both
SELECT c.name, o.total
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;

-- CROSS JOIN: Cartesian product
SELECT c.name, p.product_name
FROM customers c
CROSS JOIN products p;</code></pre>
<h4>Multi-table JOINs</h4>
<pre><code>SELECT o.id, c.name, p.product_name, oi.quantity
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.date >= '2024-01-01';</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Always index JOIN columns. Use INNER JOIN when you only need matching rows. Avoid SELECT * - specify only needed columns.</blockquote>`,

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
-- DENSE_RANK: No gaps (1, 2, 2, 3)</code></pre>
<h4>Key Takeaways</h4>
<blockquote>Window functions enable complex analytical queries without subqueries. PARTITION BY divides data into groups. ORDER BY defines processing order within each partition.</blockquote>`
};

export const lessonQuizzes: Record<string, {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: {
    content: string;
    type: string;
    points: number;
    explanation: string;
    difficulty: string;
    answers: { content: string; isCorrect: boolean; points: number }[];
  }[];
}> = {

"Semantic HTML Elements": {
  title: "Semantic HTML Elements Quiz",
  description: "Test your knowledge of HTML5 semantic elements.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which element wraps main navigation?", type: "SINGLE_CHOICE", points: 10, explanation: "nav is for navigation blocks.", difficulty: "easy", answers: [{ content: "<header>", isCorrect: false, points: 0 }, { content: "<nav>", isCorrect: true, points: 10 }, { content: "<section>", isCorrect: false, points: 0 }, { content: "<div>", isCorrect: false, points: 0 }] },
    { content: "How many <main> elements per page?", type: "SINGLE_CHOICE", points: 10, explanation: "Exactly one main element.", difficulty: "easy", answers: [{ content: "As many as needed", isCorrect: false, points: 0 }, { content: "Exactly one", isCorrect: true, points: 10 }, { content: "Exactly two", isCorrect: false, points: 0 }, { content: "None", isCorrect: false, points: 0 }] },
    { content: "<article> represents independently distributable content.", type: "TRUE_FALSE", points: 10, explanation: "Articles should make sense independently.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Which element captions a <figure>?", type: "SINGLE_CHOICE", points: 10, explanation: "figcaption provides captions.", difficulty: "medium", answers: [{ content: "<caption>", isCorrect: false, points: 0 }, { content: "<label>", isCorrect: false, points: 0 }, { content: "<figcaption>", isCorrect: true, points: 10 }, { content: "<title>", isCorrect: false, points: 0 }] },
    { content: "Semantic elements improve SEO.", type: "TRUE_FALSE", points: 10, explanation: "Search engines use semantics for hierarchy.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"ES6+ Features & Arrow Functions": {
  title: "ES6+ Features Quiz",
  description: "Test your understanding of modern JavaScript features.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Key difference between arrow and regular functions regarding 'this'?", type: "SINGLE_CHOICE", points: 10, explanation: "Arrow functions lexically bind this.", difficulty: "medium", answers: [{ content: "Arrow has own this", isCorrect: false, points: 0 }, { content: "Arrow inherits this from enclosing scope", isCorrect: true, points: 10 }, { content: "No difference", isCorrect: false, points: 0 }, { content: "Arrow uses global this", isCorrect: false, points: 0 }] },
    { content: "Which syntax creates a template literal?", type: "SINGLE_CHOICE", points: 10, explanation: "Backticks with interpolation.", difficulty: "easy", answers: [{ content: "Single quotes", isCorrect: false, points: 0 }, { content: "Double quotes", isCorrect: false, points: 0 }, { content: "Backticks", isCorrect: true, points: 10 }, { content: "Parentheses", isCorrect: false, points: 0 }] },
    { content: "Spread operator expands iterables into individual elements.", type: "TRUE_FALSE", points: 10, explanation: "Spread expands arrays/objects.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Optional chaining returns undefined for null properties.", type: "TRUE_FALSE", points: 10, explanation: "Safely returns undefined instead of errors.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Difference between || and ?? operators?", type: "SINGLE_CHOICE", points: 10, explanation: "|| falls back on falsy, ?? only on null/undefined.", difficulty: "hard", answers: [{ content: "Identical", isCorrect: false, points: 0 }, { content: "|| checks null/undefined only", isCorrect: false, points: 0 }, { content: "?? checks falsy values", isCorrect: false, points: 0 }, { content: "|| falls back on falsy, ?? only on null/undefined", isCorrect: true, points: 10 }] }
  ]
},

"State & Props Management": {
  title: "State & Props Quiz",
  description: "Test your understanding of React state and props.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which statement about props is correct?", type: "SINGLE_CHOICE", points: 10, explanation: "Props are read-only from parent to child.", difficulty: "easy", answers: [{ content: "Props can be modified by children", isCorrect: false, points: 0 }, { content: "Props flow child to parent", isCorrect: false, points: 0 }, { content: "Props are read-only from parent to child", isCorrect: true, points: 10 }, { content: "Props only work with classes", isCorrect: false, points: 0 }] },
    { content: "Why must state updates be immutable?", type: "SINGLE_CHOICE", points: 10, explanation: "React detects changes by reference comparison.", difficulty: "medium", answers: [{ content: "Performance only", isCorrect: false, points: 0 }, { content: "React detects by reference comparison", isCorrect: true, points: 10 }, { content: "Style preference", isCorrect: false, points: 0 }, { content: "JavaScript requirement", isCorrect: false, points: 0 }] },
    { content: "useReducer is for complex state with multiple sub-values.", type: "TRUE_FALSE", points: 10, explanation: "useReducer handles complex state transitions.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Lifting state up moves it to the closest common ancestor.", type: "TRUE_FALSE", points: 10, explanation: "Shared state lives in the parent component.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "The children prop receives content between JSX tags.", type: "TRUE_FALSE", points: 10, explanation: "Special prop for nested content.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"RESTful API Design": {
  title: "RESTful API Design Quiz",
  description: "Evaluate your knowledge of REST API design.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which status code for successful creation?", type: "SINGLE_CHOICE", points: 10, explanation: "201 Created on POST.", difficulty: "easy", answers: [{ content: "200 OK", isCorrect: false, points: 0 }, { content: "201 Created", isCorrect: true, points: 10 }, { content: "204 No Content", isCorrect: false, points: 0 }, { content: "301 Redirect", isCorrect: false, points: 0 }] },
    { content: "REST APIs should use plural nouns.", type: "TRUE_FALSE", points: 10, explanation: "Convention uses /users, /products.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Which method updates only specific fields?", type: "SINGLE_CHOICE", points: 10, explanation: "PATCH for partial updates.", difficulty: "medium", answers: [{ content: "GET", isCorrect: false, points: 0 }, { content: "POST", isCorrect: false, points: 0 }, { content: "PUT", isCorrect: false, points: 0 }, { content: "PATCH", isCorrect: true, points: 10 }] },
    { content: "Why version APIs?", type: "SINGLE_CHOICE", points: 10, explanation: "Allow breaking changes without disrupting clients.", difficulty: "medium", answers: [{ content: "Aesthetics", isCorrect: false, points: 0 }, { content: "Breaking changes without disruption", isCorrect: true, points: 10 }, { content: "Required by HTTP", isCorrect: false, points: 0 }, { content: "Security only", isCorrect: false, points: 0 }] },
    { content: "Content-Type indicates body format.", type: "TRUE_FALSE", points: 10, explanation: "Specifies media type like application/json.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Linear Algebra for ML": {
  title: "Linear Algebra Quiz",
  description: "Test your understanding of linear algebra in ML.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Dot product of [1,2,3] and [4,5,6]?", type: "SINGLE_CHOICE", points: 10, explanation: "1*4+2*5+3*6=32.", difficulty: "easy", answers: [{ content: "32", isCorrect: true, points: 10 }, { content: "[4,10,18]", isCorrect: false, points: 0 }, { content: "15", isCorrect: false, points: 0 }, { content: "21", isCorrect: false, points: 0 }] },
    { content: "PCA stands for Principal Component Analysis.", type: "TRUE_FALSE", points: 10, explanation: "Reduces dimensionality via variance.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Identity matrix property?", type: "SINGLE_CHOICE", points: 10, explanation: "A*I=A preserves original.", difficulty: "medium", answers: [{ content: "Returns zero", isCorrect: false, points: 0 }, { content: "Returns original matrix", isCorrect: true, points: 10 }, { content: "Returns transpose", isCorrect: false, points: 0 }, { content: "Returns inverse", isCorrect: false, points: 0 }] },
    { content: "Eigenvalues represent variance captured.", type: "TRUE_FALSE", points: 10, explanation: "Indicate variance along eigenvectors.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "SVD used in recommendations for?", type: "SINGLE_CHOICE", points: 10, explanation: "Matrix factorization to predict ratings.", difficulty: "hard", answers: [{ content: "Image recognition", isCorrect: false, points: 0 }, { content: "Matrix factorization for ratings", isCorrect: true, points: 10 }, { content: "Text classification", isCorrect: false, points: 0 }, { content: "Time series", isCorrect: false, points: 0 }] }
  ]
},

"Decision Trees & Random Forests": {
  title: "Decision Trees Quiz",
  description: "Assess your knowledge of tree-based algorithms.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Splitting criterion for classification?", type: "SINGLE_CHOICE", points: 10, explanation: "Gini or information gain.", difficulty: "easy", answers: [{ content: "MSE", isCorrect: false, points: 0 }, { content: "Gini/Information Gain", isCorrect: true, points: 10 }, { content: "R-squared", isCorrect: false, points: 0 }, { content: "Cosine", isCorrect: false, points: 0 }] },
    { content: "Random forests reduce overfitting by?", type: "SINGLE_CHOICE", points: 10, explanation: "Averaging many trees on random subsets.", difficulty: "medium", answers: [{ content: "Deeper trees", isCorrect: false, points: 0 }, { content: "Averaging trees on random subsets", isCorrect: true, points: 10 }, { content: "One deep tree", isCorrect: false, points: 0 }, { content: "Removing features", isCorrect: false, points: 0 }] },
    { content: "Random forests are more interpretable than single trees.", type: "TRUE_FALSE", points: 10, explanation: "Single trees are easier to interpret.", difficulty: "medium", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "What does feature_importances_ measure?", type: "SINGLE_CHOICE", points: 10, explanation: "Contribution to reducing impurity.", difficulty: "medium", answers: [{ content: "Features to remove", isCorrect: false, points: 0 }, { content: "Feature contribution to predictions", isCorrect: true, points: 10 }, { content: "Correlation", isCorrect: false, points: 0 }, { content: "Optimal tree count", isCorrect: false, points: 0 }] },
    { content: "Bagging trains on bootstrap samples.", type: "TRUE_FALSE", points: 10, explanation: "Random sampling with replacement.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Principal Component Analysis (PCA)": {
  title: "PCA Quiz",
  description: "Test your understanding of PCA.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "What do before applying PCA?", type: "SINGLE_CHOICE", points: 10, explanation: "Standardize data first.", difficulty: "easy", answers: [{ content: "Normalize [0,1]", isCorrect: false, points: 0 }, { content: "Standardize to zero mean/unit variance", isCorrect: true, points: 10 }, { content: "Remove outliers", isCorrect: false, points: 0 }, { content: "No preprocessing", isCorrect: false, points: 0 }] },
    { content: "Scree plot helps determine?", type: "SINGLE_CHOICE", points: 10, explanation: "How many components to keep.", difficulty: "medium", answers: [{ content: "Best algorithm", isCorrect: false, points: 0 }, { content: "How many components to keep", isCorrect: true, points: 10 }, { content: "Learning rate", isCorrect: false, points: 0 }, { content: "Linear separability", isCorrect: false, points: 0 }] },
    { content: "PCA captures nonlinear relationships.", type: "TRUE_FALSE", points: 10, explanation: "PCA only captures linear relationships.", difficulty: "medium", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "Output shape after PCA with n_components=2?", type: "SINGLE_CHOICE", points: 10, explanation: "(n_samples, 2).", difficulty: "easy", answers: [{ content: "(2, n_features)", isCorrect: false, points: 0 }, { content: "(n_samples, 2)", isCorrect: true, points: 10 }, { content: "(n_features, 2)", isCorrect: false, points: 0 }, { content: "(2, 2)", isCorrect: false, points: 0 }] },
    { content: "PCA helps noise reduction by?", type: "SINGLE_CHOICE", points: 10, explanation: "Projecting and reconstructing removes noise.", difficulty: "hard", answers: [{ content: "Adding noise", isCorrect: false, points: 0 }, { content: "Projecting onto components and reconstructing", isCorrect: true, points: 10 }, { content: "Removing first component", isCorrect: false, points: 0 }, { content: "Increasing dimensions", isCorrect: false, points: 0 }] }
  ]
},

"Training with Backpropagation": {
  title: "Backpropagation Quiz",
  description: "Evaluate your understanding of neural network training.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Backpropagation relies on?", type: "SINGLE_CHOICE", points: 10, explanation: "Chain rule of calculus.", difficulty: "easy", answers: [{ content: "Pythagorean theorem", isCorrect: false, points: 0 }, { content: "Chain rule", isCorrect: true, points: 10 }, { content: "Bayes theorem", isCorrect: false, points: 0 }, { content: "Fourier transform", isCorrect: false, points: 0 }] },
    { content: "Forward pass produces?", type: "SINGLE_CHOICE", points: 10, explanation: "Input flows to prediction.", difficulty: "easy", answers: [{ content: "Gradients", isCorrect: false, points: 0 }, { content: "Weight updates", isCorrect: false, points: 0 }, { content: "Prediction", isCorrect: true, points: 10 }, { content: "Loss minimization", isCorrect: false, points: 0 }] },
    { content: "Vanishing gradients slow early layer learning.", type: "TRUE_FALSE", points: 10, explanation: "Gradients shrink through deep layers.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "loss.backward() computes gradients.", type: "TRUE_FALSE", points: 10, explanation: "Triggers backpropagation via chain rule.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Adam optimizer combines?", type: "SINGLE_CHOICE", points: 10, explanation: "Momentum with adaptive learning rates.", difficulty: "medium", answers: [{ content: "SGD", isCorrect: false, points: 0 }, { content: "Momentum + adaptive learning rates", isCorrect: true, points: 10 }, { content: "AdaGrad", isCorrect: false, points: 0 }, { content: "BatchNorm", isCorrect: false, points: 0 }] }
  ]
},

"Keyword Research Methods": {
  title: "Keyword Research Quiz",
  description: "Test your knowledge of SEO keyword research.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which intent means ready to purchase?", type: "SINGLE_CHOICE", points: 10, explanation: "Transactional intent.", difficulty: "easy", answers: [{ content: "Informational", isCorrect: false, points: 0 }, { content: "Navigational", isCorrect: false, points: 0 }, { content: "Commercial", isCorrect: false, points: 0 }, { content: "Transactional", isCorrect: true, points: 10 }] },
    { content: "Long-tail keywords have higher conversion rates.", type: "TRUE_FALSE", points: 10, explanation: "More specific = higher intent.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "What is a topic cluster?", type: "SINGLE_CHOICE", points: 10, explanation: "Pillar page + cluster pages.", difficulty: "medium", answers: [{ content: "Single blog post", isCorrect: false, points: 0 }, { content: "Pillar page linked to cluster pages", isCorrect: true, points: 10 }, { content: "Competitor list", isCorrect: false, points: 0 }, { content: "High-volume keyword", isCorrect: false, points: 0 }] },
    { content: "Prioritize user intent over volume.", type: "TRUE_FALSE", points: 10, explanation: "Intent drives conversions.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Analyze competitors to find?", type: "SINGLE_CHOICE", points: 10, explanation: "Keyword gaps and opportunities.", difficulty: "medium", answers: [{ content: "Copy content", isCorrect: false, points: 0 }, { content: "Gaps and opportunities", isCorrect: true, points: 10 }, { content: "Block SEO", isCorrect: false, points: 0 }, { content: "No value", isCorrect: false, points: 0 }] }
  ]
},

"Content Calendar Planning": {
  title: "Content Calendar Quiz",
  description: "Test your understanding of content planning.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Primary benefit of a content calendar?", type: "SINGLE_CHOICE", points: 10, explanation: "Consistent publishing and alignment.", difficulty: "easy", answers: [{ content: "Eliminates creativity", isCorrect: false, points: 0 }, { content: "Consistent publishing and alignment", isCorrect: true, points: 10 }, { content: "Guarantees rankings", isCorrect: false, points: 0 }, { content: "Replaces analytics", isCorrect: false, points: 0 }] },
    { content: "TOFU means Top of Funnel.", type: "TRUE_FALSE", points: 10, explanation: "Focused on awareness.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "How far ahead to plan?", type: "SINGLE_CHOICE", points: 10, explanation: "2-4 weeks.", difficulty: "medium", answers: [{ content: "1 day", isCorrect: false, points: 0 }, { content: "2-4 weeks", isCorrect: true, points: 10 }, { content: "6 months", isCorrect: false, points: 0 }, { content: "1 year", isCorrect: false, points: 0 }] },
    { content: "Repurposing content is wasteful.", type: "TRUE_FALSE", points: 10, explanation: "Maximizes content value.", difficulty: "easy", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "Educational content percentage?", type: "SINGLE_CHOICE", points: 10, explanation: "40% builds authority.", difficulty: "medium", answers: [{ content: "10%", isCorrect: false, points: 0 }, { content: "40%", isCorrect: true, points: 10 }, { content: "70%", isCorrect: false, points: 0 }, { content: "100%", isCorrect: false, points: 0 }] }
  ]
},

"Email Campaign Design": {
  title: "Email Campaign Quiz",
  description: "Test your knowledge of email marketing.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Email marketing average ROI?", type: "SINGLE_CHOICE", points: 10, explanation: "$36 per $1 spent.", difficulty: "easy", answers: [{ content: "$5 per $1", isCorrect: false, points: 0 }, { content: "$36 per $1", isCorrect: true, points: 10 }, { content: "$100 per $1", isCorrect: false, points: 0 }, { content: "$10 per $1", isCorrect: false, points: 0 }] },
    { content: "Welcome series emails?", type: "SINGLE_CHOICE", points: 10, explanation: "3-5 emails over 1-2 weeks.", difficulty: "medium", answers: [{ content: "1 email", isCorrect: false, points: 0 }, { content: "3-5 emails", isCorrect: true, points: 10 }, { content: "10-15 emails", isCorrect: false, points: 0 }, { content: "20+ emails", isCorrect: false, points: 0 }] },
    { content: "A/B test multiple variables simultaneously.", type: "TRUE_FALSE", points: 10, explanation: "Test ONE variable at a time.", difficulty: "medium", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "CTOR measures?", type: "SINGLE_CHOICE", points: 10, explanation: "Click-to-Open Rate.", difficulty: "medium", answers: [{ content: "Click-Through Open Rate", isCorrect: false, points: 0 }, { content: "Click-to-Open Rate", isCorrect: true, points: 10 }, { content: "Conversion Ratio", isCorrect: false, points: 0 }, { content: "Customer Total Rate", isCorrect: false, points: 0 }] },
    { content: "SPF/DKIM/DMARC verify sender identity.", type: "TRUE_FALSE", points: 10, explanation: "Authentication protocols.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Generators & Itertools": {
  title: "Generators & Itertools Quiz",
  description: "Test your understanding of Python generators.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Keyword for generator functions?", type: "SINGLE_CHOICE", points: 10, explanation: "yield creates generators.", difficulty: "easy", answers: [{ content: "return", isCorrect: false, points: 0 }, { content: "yield", isCorrect: true, points: 10 }, { content: "async", isCorrect: false, points: 0 }, { content: "await", isCorrect: false, points: 0 }] },
    { content: "Generators are single-use.", type: "TRUE_FALSE", points: 10, explanation: "Exhausted after one iteration.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "itertools.groupby does?", type: "SINGLE_CHOICE", points: 10, explanation: "Groups consecutive elements with same key.", difficulty: "medium", answers: [{ content: "Groups all matching", isCorrect: false, points: 0 }, { content: "Groups consecutive with same key", isCorrect: true, points: 10 }, { content: "Removes duplicates", isCorrect: false, points: 0 }, { content: "Sorts elements", isCorrect: false, points: 0 }] },
    { content: "Generator advantage over list comprehension?", type: "SINGLE_CHOICE", points: 10, explanation: "Minimal memory usage.", difficulty: "medium", answers: [{ content: "Faster", isCorrect: false, points: 0 }, { content: "Much less memory", isCorrect: true, points: 10 }, { content: "More operations", isCorrect: false, points: 0 }, { content: "Multiple iterations", isCorrect: false, points: 0 }] },
    { content: "itertools.chain concatenates iterables.", type: "TRUE_FALSE", points: 10, explanation: "Combines multiple iterables.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Descriptors & Properties": {
  title: "Descriptors Quiz",
  description: "Test your knowledge of Python descriptors.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which methods define a descriptor?", type: "SINGLE_CHOICE", points: 10, explanation: "__get__, __set__, __delete__.", difficulty: "medium", answers: [{ content: "__init__ and __str__", isCorrect: false, points: 0 }, { content: "__get__, __set__, __delete__", isCorrect: true, points: 10 }, { content: "__getattr__ and __setattr__", isCorrect: false, points: 0 }, { content: "__call__ and __iter__", isCorrect: false, points: 0 }] },
    { content: "Properties are built on descriptors.", type: "TRUE_FALSE", points: 10, explanation: "@property is descriptor syntactic sugar.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "__set_name__ provides?", type: "SINGLE_CHOICE", points: 10, explanation: "Attribute name to the descriptor.", difficulty: "hard", answers: [{ content: "Sets value", isCorrect: false, points: 0 }, { content: "Attribute name", isCorrect: true, points: 10 }, { content: "Deletes attr", isCorrect: false, points: 0 }, { content: "Creates instance", isCorrect: false, points: 0 }] },
    { content: "Use descriptors when same behavior applies to multiple classes.", type: "TRUE_FALSE", points: 10, explanation: "Reusable behavior across classes.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Class-level access to descriptor returns?", type: "SINGLE_CHOICE", points: 10, explanation: "__get__ receives None, returns descriptor.", difficulty: "hard", answers: [{ content: "AttributeError", isCorrect: false, points: 0 }, { content: "Descriptor itself", isCorrect: true, points: 10 }, { content: "Default value", isCorrect: false, points: 0 }, { content: "New instance", isCorrect: false, points: 0 }] }
  ]
},

"Coroutines & Tasks": {
  title: "Coroutines & Tasks Quiz",
  description: "Test your understanding of async Python.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Keyword for async functions?", type: "SINGLE_CHOICE", points: 10, explanation: "async def defines coroutines.", difficulty: "easy", answers: [{ content: "def", isCorrect: false, points: 0 }, { content: "async def", isCorrect: true, points: 10 }, { content: "coroutine", isCorrect: false, points: 0 }, { content: "yield", isCorrect: false, points: 0 }] },
    { content: "await suspends coroutine and yields to event loop.", type: "TRUE_FALSE", points: 10, explanation: "Yields control while waiting.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "asyncio.gather runs concurrently.", type: "TRUE_FALSE", points: 10, explanation: "Schedules multiple coroutines.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Task vs coroutine?", type: "SINGLE_CHOICE", points: 10, explanation: "Task wraps and schedules coroutine.", difficulty: "medium", answers: [{ content: "Same thing", isCorrect: false, points: 0 }, { content: "Task wraps coroutine on event loop", isCorrect: true, points: 10 }, { content: "Task runs synchronously", isCorrect: false, points: 0 }, { content: "Coroutine requires threading", isCorrect: false, points: 0 }] },
    { content: "TaskGroup introduced in Python?", type: "SINGLE_CHOICE", points: 10, explanation: "Python 3.11.", difficulty: "hard", answers: [{ content: "Python 3.6", isCorrect: false, points: 0 }, { content: "Python 3.8", isCorrect: false, points: 0 }, { content: "Python 3.11", isCorrect: true, points: 10 }, { content: "Python 2.7", isCorrect: false, points: 0 }] }
  ]
},

"Observer & Strategy Patterns": {
  title: "Design Patterns Quiz",
  description: "Test your understanding of Observer and Strategy.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Observer pattern solves?", type: "SINGLE_CHOICE", points: 10, explanation: "One-to-many dependencies.", difficulty: "easy", answers: [{ content: "Object creation", isCorrect: false, points: 0 }, { content: "One-to-many notifications", isCorrect: true, points: 10 }, { content: "Algorithm encapsulation", isCorrect: false, points: 0 }, { content: "Dynamic responsibilities", isCorrect: false, points: 0 }] },
    { content: "Strategy allows runtime algorithm changes.", type: "TRUE_FALSE", points: 10, explanation: "Encapsulates interchangeable algorithms.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Listeners in Observer?", type: "SINGLE_CHOICE", points: 10, explanation: "Register to receive notifications.", difficulty: "medium", answers: [{ content: "Send notifications", isCorrect: false, points: 0 }, { content: "Register to receive notifications", isCorrect: true, points: 10 }, { content: "Filter notifications", isCorrect: false, points: 0 }, { content: "Store notifications", isCorrect: false, points: 0 }] },
    { content: "Use Strategy when many algorithms and frequent additions.", type: "TRUE_FALSE", points: 10, explanation: "Avoids large if/else chains.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Observer downside?", type: "SINGLE_CHOICE", points: 10, explanation: "Memory leaks and cascade updates.", difficulty: "hard", answers: [{ content: "Too simple", isCorrect: false, points: 0 }, { content: "Memory leaks and cascade updates", isCorrect: true, points: 10 }, { content: "Single event only", isCorrect: false, points: 0 }, { content: "Requires threading", isCorrect: false, points: 0 }] }
  ]
},

"Visual Hierarchy & Layout": {
  title: "Visual Hierarchy Quiz",
  description: "Test your knowledge of visual hierarchy.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which principle makes large elements attention-grabbing?", type: "SINGLE_CHOICE", points: 10, explanation: "Size is primary.", difficulty: "easy", answers: [{ content: "Color", isCorrect: false, points: 0 }, { content: "Size", isCorrect: true, points: 10 }, { content: "Spacing", isCorrect: false, points: 0 }, { content: "Typography", isCorrect: false, points: 0 }] },
    { content: "F-pattern describes text-heavy page scanning.", type: "TRUE_FALSE", points: 10, explanation: "Horizontal then vertical scan.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "White space purpose?", type: "SINGLE_CHOICE", points: 10, explanation: "Groups related, separates unrelated.", difficulty: "medium", answers: [{ content: "Wastes space", isCorrect: false, points: 0 }, { content: "Groups related, separates unrelated", isCorrect: true, points: 10 }, { content: "Only decorative", isCorrect: false, points: 0 }, { content: "Slows loading", isCorrect: false, points: 0 }] },
    { content: "LTR users look first at?", type: "SINGLE_CHOICE", points: 10, explanation: "Top-left.", difficulty: "easy", answers: [{ content: "Bottom-right", isCorrect: false, points: 0 }, { content: "Top-left", isCorrect: true, points: 10 }, { content: "Center", isCorrect: false, points: 0 }, { content: "Bottom-left", isCorrect: false, points: 0 }] },
    { content: "Z-pattern works for visual-heavy pages.", type: "TRUE_FALSE", points: 10, explanation: "Guides eyes diagonally.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Low-Fidelity Wireframing": {
  title: "Low-Fi Wireframing Quiz",
  description: "Test your understanding of wireframing.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Primary focus of low-fi wireframes?", type: "SINGLE_CHOICE", points: 10, explanation: "Layout and user flow.", difficulty: "easy", answers: [{ content: "Visual design", isCorrect: false, points: 0 }, { content: "Layout, content, user flow", isCorrect: true, points: 10 }, { content: "Pixel-perfect", isCorrect: false, points: 0 }, { content: "Animations", isCorrect: false, points: 0 }] },
    { content: "Box with X represents?", type: "SINGLE_CHOICE", points: 10, explanation: "Image placeholder.", difficulty: "easy", answers: [{ content: "Text", isCorrect: false, points: 0 }, { content: "Image placeholder", isCorrect: true, points: 10 }, { content: "Button", isCorrect: false, points: 0 }, { content: "Navigation", isCorrect: false, points: 0 }] },
    { content: "Low-fi wireframes are expensive.", type: "TRUE_FALSE", points: 10, explanation: "They are cheap and fast.", difficulty: "easy", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "Good for collaboration because?", type: "SINGLE_CHOICE", points: 10, explanation: "Simple for non-designers.", difficulty: "medium", answers: [{ content: "More professional", isCorrect: false, points: 0 }, { content: "Simple for non-designers", isCorrect: true, points: 10 }, { content: "Show final colors", isCorrect: false, points: 0 }, { content: "Include animations", isCorrect: false, points: 0 }] },
    { content: "Move to hi-fi after validation.", type: "TRUE_FALSE", points: 10, explanation: "After layout and flow are validated.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Design System Components": {
  title: "Design System Quiz",
  description: "Test your knowledge of design systems.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "What are design tokens?", type: "SINGLE_CHOICE", points: 10, explanation: "Basic visual values.", difficulty: "easy", answers: [{ content: "Code components", isCorrect: false, points: 0 }, { content: "Basic visual values", isCorrect: true, points: 10 }, { content: "Auth tokens", isCorrect: false, points: 0 }, { content: "API tokens", isCorrect: false, points: 0 }] },
    { content: "NOT a core component?", type: "SINGLE_CHOICE", points: 10, explanation: "Server instances are infrastructure.", difficulty: "easy", answers: [{ content: "Buttons", isCorrect: false, points: 0 }, { content: "Forms", isCorrect: false, points: 0 }, { content: "Server instances", isCorrect: true, points: 10 }, { content: "Navigation", isCorrect: false, points: 0 }] },
    { content: "Design systems ensure consistency.", type: "TRUE_FALSE", points: 10, explanation: "Reusable components and standards.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Build first?", type: "SINGLE_CHOICE", points: 10, explanation: "Design tokens are foundation.", difficulty: "medium", answers: [{ content: "Complex layouts", isCorrect: false, points: 0 }, { content: "Design tokens", isCorrect: true, points: 10 }, { content: "Marketing pages", isCorrect: false, points: 0 }, { content: "Testing scripts", isCorrect: false, points: 0 }] },
    { content: "Design systems only benefit designers.", type: "TRUE_FALSE", points: 10, explanation: "Benefit both designers and developers.", difficulty: "medium", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] }
  ]
},

"Common Attack Vectors": {
  title: "Attack Vectors Quiz",
  description: "Test your knowledge of cybersecurity attacks.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Which attack injects malicious SQL?", type: "SINGLE_CHOICE", points: 10, explanation: "SQL injection.", difficulty: "easy", answers: [{ content: "XSS", isCorrect: false, points: 0 }, { content: "SQL Injection", isCorrect: true, points: 10 }, { content: "DDoS", isCorrect: false, points: 0 }, { content: "Phishing", isCorrect: false, points: 0 }] },
    { content: "Best defense against SQL injection?", type: "SINGLE_CHOICE", points: 10, explanation: "Parameterized queries.", difficulty: "medium", answers: [{ content: "Input validation only", isCorrect: false, points: 0 }, { content: "Parameterized queries", isCorrect: true, points: 10 }, { content: "Longer passwords", isCorrect: false, points: 0 }, { content: "Encrypt DB", isCorrect: false, points: 0 }] },
    { content: "XSS injects scripts into web pages.", type: "TRUE_FALSE", points: 10, explanation: "Executes in other users' browsers.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Deceptive email attack?", type: "SINGLE_CHOICE", points: 10, explanation: "Phishing.", difficulty: "easy", answers: [{ content: "Brute force", isCorrect: false, points: 0 }, { content: "Phishing", isCorrect: true, points: 10 }, { content: "Buffer overflow", isCorrect: false, points: 0 }, { content: "MitM", isCorrect: false, points: 0 }] },
    { content: "textContent prevents XSS.", type: "TRUE_FALSE", points: 10, explanation: "Treats input as plain text.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"VPNs & Encryption Protocols": {
  title: "VPNs & Encryption Quiz",
  description: "Test your understanding of VPN protocols.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Modern VPN protocol?", type: "SINGLE_CHOICE", points: 10, explanation: "WireGuard.", difficulty: "easy", answers: [{ content: "PPTP", isCorrect: false, points: 0 }, { content: "L2TP/IPSec", isCorrect: false, points: 0 }, { content: "WireGuard", isCorrect: true, points: 10 }, { content: "WEP", isCorrect: false, points: 0 }] },
    { content: "AES-256 is symmetric encryption.", type: "TRUE_FALSE", points: 10, explanation: "Standard for VPN tunnels.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Diffie-Hellman purpose?", type: "SINGLE_CHOICE", points: 10, explanation: "Establishes shared secrets.", difficulty: "medium", answers: [{ content: "Encrypting data", isCorrect: false, points: 0 }, { content: "Establishing shared secrets", isCorrect: true, points: 10 }, { content: "Hashing passwords", isCorrect: false, points: 0 }, { content: "Compressing data", isCorrect: false, points: 0 }] },
    { content: "PPTP is still secure.", type: "TRUE_FALSE", points: 10, explanation: "Has known vulnerabilities.", difficulty: "easy", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "Key exchange algorithm?", type: "SINGLE_CHOICE", points: 10, explanation: "RSA/Diffie-Hellman.", difficulty: "medium", answers: [{ content: "AES", isCorrect: false, points: 0 }, { content: "RSA/Diffie-Hellman", isCorrect: true, points: 10 }, { content: "MD5", isCorrect: false, points: 0 }, { content: "Base64", isCorrect: false, points: 0 }] }
  ]
},

"Hashing & Digital Signatures": {
  title: "Hashing Quiz",
  description: "Test your knowledge of hashing and signatures.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Good hash function property?", type: "SINGLE_CHOICE", points: 10, explanation: "Deterministic, uniform, few collisions.", difficulty: "easy", answers: [{ content: "Reversible", isCorrect: false, points: 0 }, { content: "Deterministic with uniform output", isCorrect: true, points: 10 }, { content: "Same output different inputs", isCorrect: false, points: 0 }, { content: "Slow", isCorrect: false, points: 0 }] },
    { content: "Password hashing library?", type: "SINGLE_CHOICE", points: 10, explanation: "bcrypt with salting.", difficulty: "easy", answers: [{ content: "hashlib", isCorrect: false, points: 0 }, { content: "bcrypt", isCorrect: true, points: 10 }, { content: "md5", isCorrect: false, points: 0 }, { content: "base64", isCorrect: false, points: 0 }] },
    { content: "Digital signatures provide authentication.", type: "TRUE_FALSE", points: 10, explanation: "Prove sender and prevent denial.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Same key for encrypt/decrypt is?", type: "SINGLE_CHOICE", points: 10, explanation: "Symmetric cryptography.", difficulty: "easy", answers: [{ content: "Asymmetric", isCorrect: false, points: 0 }, { content: "Symmetric", isCorrect: true, points: 10 }, { content: "Hybrid", isCorrect: false, points: 0 }, { content: "Quantum", isCorrect: false, points: 0 }] },
    { content: "MD5 deprecated because?", type: "SINGLE_CHOICE", points: 10, explanation: "Collision vulnerabilities.", difficulty: "medium", answers: [{ content: "Too slow", isCorrect: false, points: 0 }, { content: "Collision vulnerabilities", isCorrect: true, points: 10 }, { content: "Not standardized", isCorrect: false, points: 0 }, { content: "Too much memory", isCorrect: false, points: 0 }] }
  ]
},

"Vulnerability Scanning with Nmap": {
  title: "Nmap Quiz",
  description: "Test your knowledge of Nmap scanning.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Service version detection flag?", type: "SINGLE_CHOICE", points: 10, explanation: "-sV.", difficulty: "easy", answers: [{ content: "-sS", isCorrect: false, points: 0 }, { content: "-sV", isCorrect: true, points: 10 }, { content: "-O", isCorrect: false, points: 0 }, { content: "-A", isCorrect: false, points: 0 }] },
    { content: "Port 22 is SSH.", type: "TRUE_FALSE", points: 10, explanation: "Standard SSH port.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "-O flag does?", type: "SINGLE_CHOICE", points: 10, explanation: "OS detection.", difficulty: "medium", answers: [{ content: "Opens ports", isCorrect: false, points: 0 }, { content: "OS detection", isCorrect: true, points: 10 }, { content: "Output to file", isCorrect: false, points: 0 }, { content: "Optimize speed", isCorrect: false, points: 0 }] },
    { content: "--script vuln runs vulnerability checks.", type: "TRUE_FALSE", points: 10, explanation: "Checks for known vulnerabilities.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "MySQL port?", type: "SINGLE_CHOICE", points: 10, explanation: "3306.", difficulty: "easy", answers: [{ content: "5432", isCorrect: false, points: 0 }, { content: "3306", isCorrect: true, points: 10 }, { content: "1433", isCorrect: false, points: 0 }, { content: "27017", isCorrect: false, points: 0 }] }
  ]
},

"S3 Bucket Management": {
  title: "S3 Bucket Quiz",
  description: "Test your knowledge of AWS S3.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Protects against accidental deletion?", type: "SINGLE_CHOICE", points: 10, explanation: "Versioning.", difficulty: "easy", answers: [{ content: "Logging", isCorrect: false, points: 0 }, { content: "Versioning", isCorrect: true, points: 10 }, { content: "Transfer acceleration", isCorrect: false, points: 0 }, { content: "Static hosting", isCorrect: false, points: 0 }] },
    { content: "S3 buckets are private by default.", type: "TRUE_FALSE", points: 10, explanation: "Public access requires explicit config.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "KMS encryption type?", type: "SINGLE_CHOICE", points: 10, explanation: "SSE-KMS.", difficulty: "medium", answers: [{ content: "Client-side", isCorrect: false, points: 0 }, { content: "SSE-KMS", isCorrect: true, points: 10 }, { content: "SSE-C", isCorrect: false, points: 0 }, { content: "SSL only", isCorrect: false, points: 0 }] },
    { content: "Python S3 library?", type: "SINGLE_CHOICE", points: 10, explanation: "boto3.", difficulty: "easy", answers: [{ content: "requests", isCorrect: false, points: 0 }, { content: "boto3", isCorrect: true, points: 10 }, { content: "flask", isCorrect: false, points: 0 }, { content: "pandas", isCorrect: false, points: 0 }] },
    { content: "Bucket policies use IAM language.", type: "TRUE_FALSE", points: 10, explanation: "JSON-based IAM policies.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"RDS & DynamoDB": {
  title: "RDS & DynamoDB Quiz",
  description: "Test your knowledge of AWS databases.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "RDS is what type of database?", type: "SINGLE_CHOICE", points: 10, explanation: "Managed relational.", difficulty: "easy", answers: [{ content: "NoSQL key-value", isCorrect: false, points: 0 }, { content: "Managed relational", isCorrect: true, points: 10 }, { content: "Document", isCorrect: false, points: 0 }, { content: "Graph", isCorrect: false, points: 0 }] },
    { content: "DynamoDB uses key-value and document model.", type: "TRUE_FALSE", points: 10, explanation: "Supports both models.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Per-request DynamoDB mode?", type: "SINGLE_CHOICE", points: 10, explanation: "PAY_PER_REQUEST.", difficulty: "medium", answers: [{ content: "Provisioned", isCorrect: false, points: 0 }, { content: "PAY_PER_REQUEST", isCorrect: true, points: 10 }, { content: "Reserved", isCorrect: false, points: 0 }, { content: "On-demand", isCorrect: false, points: 0 }] },
    { content: "RDS handles backups and patching.", type: "TRUE_FALSE", points: 10, explanation: "Automated maintenance.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Max RDS storage?", type: "SINGLE_CHOICE", points: 10, explanation: "64 TB.", difficulty: "medium", answers: [{ content: "1 TB", isCorrect: false, points: 0 }, { content: "64 TB", isCorrect: true, points: 10 }, { content: "1 PB", isCorrect: false, points: 0 }, { content: "Unlimited", isCorrect: false, points: 0 }] }
  ]
},

"CI/CD with CodePipeline": {
  title: "CI/CD Quiz",
  description: "Test your understanding of CI/CD pipelines.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "CI stands for?", type: "SINGLE_CHOICE", points: 10, explanation: "Continuous Integration.", difficulty: "easy", answers: [{ content: "Code Integration", isCorrect: false, points: 0 }, { content: "Continuous Integration", isCorrect: true, points: 10 }, { content: "Continuous Improvement", isCorrect: false, points: 0 }, { content: "Central Infrastructure", isCorrect: false, points: 0 }] },
    { content: "CodeBuild compiles and tests code.", type: "TRUE_FALSE", points: 10, explanation: "Produces build artifacts.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "buildspec.yml defines?", type: "SINGLE_CHOICE", points: 10, explanation: "CodeBuild steps.", difficulty: "medium", answers: [{ content: "Pipeline stages", isCorrect: false, points: 0 }, { content: "CodeBuild steps", isCorrect: true, points: 10 }, { content: "Deploy config", isCorrect: false, points: 0 }, { content: "Test suite", isCorrect: false, points: 0 }] },
    { content: "Pipeline order?", type: "SINGLE_CHOICE", points: 10, explanation: "Source -> Build -> Test -> Deploy.", difficulty: "medium", answers: [{ content: "Deploy -> Build -> Test -> Source", isCorrect: false, points: 0 }, { content: "Source -> Build -> Test -> Deploy", isCorrect: true, points: 10 }, { content: "Build -> Source -> Deploy -> Test", isCorrect: false, points: 0 }, { content: "Test -> Source -> Build -> Deploy", isCorrect: false, points: 0 }] },
    { content: "Manual approval before production is recommended.", type: "TRUE_FALSE", points: 10, explanation: "Reduces deployment risk.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Consensus Mechanisms": {
  title: "Consensus Quiz",
  description: "Test your understanding of blockchain consensus.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Bitcoin uses?", type: "SINGLE_CHOICE", points: 10, explanation: "Proof of Work.", difficulty: "easy", answers: [{ content: "Proof of Stake", isCorrect: false, points: 0 }, { content: "Proof of Work", isCorrect: true, points: 10 }, { content: "Delegated PoS", isCorrect: false, points: 0 }, { content: "Proof of Authority", isCorrect: false, points: 0 }] },
    { content: "PoS is more energy efficient than PoW.", type: "TRUE_FALSE", points: 10, explanation: "Validators stake instead of mining.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Byzantine Fault Tolerance?", type: "SINGLE_CHOICE", points: 10, explanation: "Works despite faulty nodes.", difficulty: "medium", answers: [{ content: "Encryption type", isCorrect: false, points: 0 }, { content: "Works despite faulty nodes", isCorrect: true, points: 10 }, { content: "Mining algorithm", isCorrect: false, points: 0 }, { content: "Smart contract", isCorrect: false, points: 0 }] },
    { content: "Ethereum moved to PoS.", type: "TRUE_FALSE", points: 10, explanation: "The Merge in 2022.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Vote for delegates in?", type: "SINGLE_CHOICE", points: 10, explanation: "Delegated Proof of Stake.", difficulty: "medium", answers: [{ content: "Proof of Work", isCorrect: false, points: 0 }, { content: "Delegated PoS", isCorrect: true, points: 10 }, { content: "Proof of Authority", isCorrect: false, points: 0 }, { content: "Proof of Elapsed Time", isCorrect: false, points: 0 }] }
  ]
},

"ERC-20 Token Standard": {
  title: "ERC-20 Quiz",
  description: "Test your knowledge of ERC-20 tokens.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "ERC stands for?", type: "SINGLE_CHOICE", points: 10, explanation: "Ethereum Request for Comments.", difficulty: "easy", answers: [{ content: "Ethereum Resource Contract", isCorrect: false, points: 0 }, { content: "Ethereum Request for Comments", isCorrect: true, points: 10 }, { content: "Ethereum Runtime Code", isCorrect: false, points: 0 }, { content: "Ethereum Registry Standard", isCorrect: false, points: 0 }] },
    { content: "ERC-20 tokens are fungible.", type: "TRUE_FALSE", points: 10, explanation: "Each token is interchangeable.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Total supply function?", type: "SINGLE_CHOICE", points: 10, explanation: "totalSupply().", difficulty: "medium", answers: [{ content: "balanceOf()", isCorrect: false, points: 0 }, { content: "totalSupply()", isCorrect: true, points: 10 }, { content: "transfer()", isCorrect: false, points: 0 }, { content: "approve()", isCorrect: false, points: 0 }] },
    { content: "Audited ERC-20 library?", type: "SINGLE_CHOICE", points: 10, explanation: "OpenZeppelin.", difficulty: "medium", answers: [{ content: "Web3.js", isCorrect: false, points: 0 }, { content: "OpenZeppelin", isCorrect: true, points: 10 }, { content: "Hardhat", isCorrect: false, points: 0 }, { content: "Truffle", isCorrect: false, points: 0 }] },
    { content: "approve sets spender allowance.", type: "TRUE_FALSE", points: 10, explanation: "Allows transfer on your behalf.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Yield Farming & Liquidity Pools": {
  title: "Yield Farming Quiz",
  description: "Test your understanding of DeFi yield farming.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "x * y = k represents?", type: "SINGLE_CHOICE", points: 10, explanation: "Constant product AMM formula.", difficulty: "medium", answers: [{ content: "Interest calculation", isCorrect: false, points: 0 }, { content: "Constant product formula", isCorrect: true, points: 10 }, { content: "Gas estimation", isCorrect: false, points: 0 }, { content: "Block time", isCorrect: false, points: 0 }] },
    { content: "Impermanent loss occurs with price changes.", type: "TRUE_FALSE", points: 10, explanation: "Difference between pool and hold.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Major risk besides IL?", type: "SINGLE_CHOICE", points: 10, explanation: "Smart contract vulnerabilities.", difficulty: "medium", answers: [{ content: "Network congestion", isCorrect: false, points: 0 }, { content: "Smart contract vulnerabilities", isCorrect: true, points: 10 }, { content: "No risks", isCorrect: false, points: 0 }, { content: "Only gas fees", isCorrect: false, points: 0 }] },
    { content: "LPs earn trading fees.", type: "TRUE_FALSE", points: 10, explanation: "Proportional to pool share.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Greater price divergence means?", type: "SINGLE_CHOICE", points: 10, explanation: "Greater impermanent loss.", difficulty: "hard", answers: [{ content: "Loss decreases", isCorrect: false, points: 0 }, { content: "Greater impermanent loss", isCorrect: true, points: 10 }, { content: "No change", isCorrect: false, points: 0 }, { content: "Becomes permanent", isCorrect: false, points: 0 }] }
  ]
},

"Core Components & Styling": {
  title: "React Native Components Quiz",
  description: "Test your knowledge of React Native components.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Best component for long lists?", type: "SINGLE_CHOICE", points: 10, explanation: "FlatList virtualizes.", difficulty: "easy", answers: [{ content: "ScrollView", isCorrect: false, points: 0 }, { content: "FlatList", isCorrect: true, points: 10 }, { content: "View", isCorrect: false, points: 0 }, { content: "Text", isCorrect: false, points: 0 }] },
    { content: "React Native uses Flexbox by default.", type: "TRUE_FALSE", points: 10, explanation: "Default layout system.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Small scrollable content uses?", type: "SINGLE_CHOICE", points: 10, explanation: "ScrollView.", difficulty: "medium", answers: [{ content: "FlatList", isCorrect: false, points: 0 }, { content: "ScrollView", isCorrect: true, points: 10 }, { content: "SectionList", isCorrect: false, points: 0 }, { content: "VirtualizedList", isCorrect: false, points: 0 }] },
    { content: "StyleSheet.create optimizes styles.", type: "TRUE_FALSE", points: 10, explanation: "Creates stylesheet IDs.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Image needs explicit dimensions.", type: "TRUE_FALSE", points: 10, explanation: "Unlike web, requires width/height.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"State Management with Context & Zustand": {
  title: "State Management Quiz",
  description: "Test your understanding of Context and Zustand.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "When use Context?", type: "SINGLE_CHOICE", points: 10, explanation: "Simple global state like themes.", difficulty: "easy", answers: [{ content: "Complex logic", isCorrect: false, points: 0 }, { content: "Simple global state", isCorrect: true, points: 10 }, { content: "High-frequency updates", isCorrect: false, points: 0 }, { content: "Server state", isCorrect: false, points: 0 }] },
    { content: "Zustand avoids Context performance issues.", type: "TRUE_FALSE", points: 10, explanation: "Uses selectors.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Provider does?", type: "SINGLE_CHOICE", points: 10, explanation: "Makes value available to descendants.", difficulty: "easy", answers: [{ content: "Creates context", isCorrect: false, points: 0 }, { content: "Makes value available to descendants", isCorrect: true, points: 10 }, { content: "Consumes context", isCorrect: false, points: 0 }, { content: "Optimizes re-renders", isCorrect: false, points: 0 }] },
    { content: "Zustand needs providers.", type: "TRUE_FALSE", points: 10, explanation: "Stores are standalone.", difficulty: "medium", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "Zustand hook?", type: "SINGLE_CHOICE", points: 10, explanation: "useStore with selector.", difficulty: "medium", answers: [{ content: "useContext", isCorrect: false, points: 0 }, { content: "useStore", isCorrect: true, points: 10 }, { content: "useState", isCorrect: false, points: 0 }, { content: "useReducer", isCorrect: false, points: 0 }] }
  ]
},

"Camera, Location & Permissions": {
  title: "Camera & Location Quiz",
  description: "Test your knowledge of React Native hardware access.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "When request permissions?", type: "SINGLE_CHOICE", points: 10, explanation: "At runtime.", difficulty: "easy", answers: [{ content: "Build time", isCorrect: false, points: 0 }, { content: "At runtime", isCorrect: true, points: 10 }, { content: "app.json only", isCorrect: false, points: 0 }, { content: "Never", isCorrect: false, points: 0 }] },
    { content: "Camera library?", type: "SINGLE_CHOICE", points: 10, explanation: "expo-camera.", difficulty: "easy", answers: [{ content: "react-native-camera", isCorrect: false, points: 0 }, { content: "expo-camera", isCorrect: true, points: 10 }, { content: "expo-media", isCorrect: false, points: 0 }, { content: "expo-capture", isCorrect: false, points: 0 }] },
    { content: "Handle denial gracefully.", type: "TRUE_FALSE", points: 10, explanation: "Provide fallback UI.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Get current location function?", type: "SINGLE_CHOICE", points: 10, explanation: "getCurrentPositionAsync.", difficulty: "medium", answers: [{ content: "getLocation()", isCorrect: false, points: 0 }, { content: "getCurrentPositionAsync()", isCorrect: true, points: 10 }, { content: "fetchLocation()", isCorrect: false, points: 0 }, { content: "readGPS()", isCorrect: false, points: 0 }] },
    { content: "ImagePicker accesses gallery.", type: "TRUE_FALSE", points: 10, explanation: "expo-image-picker provides gallery.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"App Store Submission Guide": {
  title: "App Store Submission Quiz",
  description: "Test your knowledge of app store submission.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Required app icon size?", type: "SINGLE_CHOICE", points: 10, explanation: "1024x1024 PNG.", difficulty: "easy", answers: [{ content: "512x512", isCorrect: false, points: 0 }, { content: "1024x1024", isCorrect: true, points: 10 }, { content: "2048x2048", isCorrect: false, points: 0 }, { content: "256x256", isCorrect: false, points: 0 }] },
    { content: "Privacy policy is required.", type: "TRUE_FALSE", points: 10, explanation: "Both stores require it.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Expo build tool?", type: "SINGLE_CHOICE", points: 10, explanation: "eas build.", difficulty: "medium", answers: [{ content: "npm run build", isCorrect: false, points: 0 }, { content: "eas build", isCorrect: true, points: 10 }, { content: "expo build", isCorrect: false, points: 0 }, { content: "react-native build", isCorrect: false, points: 0 }] },
    { content: "Common rejection reason?", type: "SINGLE_CHOICE", points: 10, explanation: "Crashes or bugs.", difficulty: "medium", answers: [{ content: "Good UI", isCorrect: false, points: 0 }, { content: "Crashes or bugs", isCorrect: true, points: 10 }, { content: "Fast performance", isCorrect: false, points: 0 }, { content: "Clear description", isCorrect: false, points: 0 }] },
    { content: "Test before submission.", type: "TRUE_FALSE", points: 10, explanation: "Thorough testing prevents rejections.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
},

"Pivot Tables & Data Summarization": {
  title: "Pivot Tables Quiz",
  description: "Test your knowledge of pivot tables.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Pivot tables transform raw data into?", type: "SINGLE_CHOICE", points: 10, explanation: "Meaningful summaries.", difficulty: "easy", answers: [{ content: "Raw data", isCorrect: false, points: 0 }, { content: "Meaningful summaries", isCorrect: true, points: 10 }, { content: "Charts only", isCorrect: false, points: 0 }, { content: "SQL queries", isCorrect: false, points: 0 }] },
    { content: "pd.pivot_table is a pandas function.", type: "TRUE_FALSE", points: 10, explanation: "Creates pivot tables in Python.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "aggfunc parameter specifies?", type: "SINGLE_CHOICE", points: 10, explanation: "Aggregation function.", difficulty: "medium", answers: [{ content: "Column name", isCorrect: false, points: 0 }, { content: "Aggregation function", isCorrect: true, points: 10 }, { content: "Filter condition", isCorrect: false, points: 0 }, { content: "Sort order", isCorrect: false, points: 0 }] },
    { content: "fill_value handles missing data.", type: "TRUE_FALSE", points: 10, explanation: "Replaces NaN with specified value.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "Margins parameter adds?", type: "SINGLE_CHOICE", points: 10, explanation: "Row and column totals.", difficulty: "medium", answers: [{ content: "Filters", isCorrect: false, points: 0 }, { content: "Row and column totals", isCorrect: true, points: 10 }, { content: "Sorting", isCorrect: false, points: 0 }, { content: "Charts", isCorrect: false, points: 0 }] }
  ]
},

"JOIN Operations": {
  title: "SQL JOIN Quiz",
  description: "Test your knowledge of SQL JOINs.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "INNER JOIN returns?", type: "SINGLE_CHOICE", points: 10, explanation: "Only matching rows.", difficulty: "easy", answers: [{ content: "All rows from both", isCorrect: false, points: 0 }, { content: "Only matching rows", isCorrect: true, points: 10 }, { content: "All from left only", isCorrect: false, points: 0 }, { content: "All from right only", isCorrect: false, points: 0 }] },
    { content: "LEFT JOIN includes all left table rows.", type: "TRUE_FALSE", points: 10, explanation: "Plus matching right rows.", difficulty: "easy", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "CROSS JOIN produces?", type: "SINGLE_CHOICE", points: 10, explanation: "Cartesian product.", difficulty: "medium", answers: [{ content: "Matching rows only", isCorrect: false, points: 0 }, { content: "Cartesian product", isCorrect: true, points: 10 }, { content: "Unique combinations", isCorrect: false, points: 0 }, { content: "Empty result", isCorrect: false, points: 0 }] },
    { content: "Always index JOIN columns.", type: "TRUE_FALSE", points: 10, explanation: "Improves query performance.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "FULL OUTER JOIN returns?", type: "SINGLE_CHOICE", points: 10, explanation: "All rows from both tables.", difficulty: "medium", answers: [{ content: "Matching only", isCorrect: false, points: 0 }, { content: "All rows from both", isCorrect: true, points: 10 }, { content: "Left table only", isCorrect: false, points: 0 }, { content: "Right table only", isCorrect: false, points: 0 }] }
  ]
},

"Window Functions": {
  title: "Window Functions Quiz",
  description: "Test your knowledge of SQL window functions.",
  timeLimit: 300,
  passingScore: 70,
  questions: [
    { content: "Window functions collapse rows?", type: "TRUE_FALSE", points: 10, explanation: "No, they preserve rows.", difficulty: "easy", answers: [{ content: "True", isCorrect: false, points: 0 }, { content: "False", isCorrect: true, points: 10 }] },
    { content: "PARTITION BY does?", type: "SINGLE_CHOICE", points: 10, explanation: "Divides data into groups.", difficulty: "easy", answers: [{ content: "Sorts data", isCorrect: false, points: 0 }, { content: "Divides into groups", isCorrect: true, points: 10 }, { content: "Filters rows", isCorrect: false, points: 0 }, { content: "Aggregates data", isCorrect: false, points: 0 }] },
    { content: "ROW_NUMBER gives unique sequential numbers.", type: "TRUE_FALSE", points: 10, explanation: "1, 2, 3, 4 with no gaps.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] },
    { content: "RANK vs DENSE_RANK difference?", type: "SINGLE_CHOICE", points: 10, explanation: "RANK has gaps, DENSE_RANK does not.", difficulty: "hard", answers: [{ content: "No difference", isCorrect: false, points: 0 }, { content: "RANK gaps, DENSE_RANK no gaps", isCorrect: true, points: 10 }, { content: "DENSE_RANK is faster", isCorrect: false, points: 0 }, { content: "RANK is for strings", isCorrect: false, points: 0 }] },
    { content: "LAG accesses previous row data.", type: "TRUE_FALSE", points: 10, explanation: "Gets value from preceding row.", difficulty: "medium", answers: [{ content: "True", isCorrect: true, points: 10 }, { content: "False", isCorrect: false, points: 0 }] }
  ]
}

};
