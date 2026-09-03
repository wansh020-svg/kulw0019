# Module 2 Devlog

## Proof of completion

<!-- Replace with your actual screenshots, saved in tutorials/imgs/ -->
![PlayerProfile component rendering with rank and status](../imgs/module02-playerprofile-rendered.png)
*Caption: The t02 PlayerProfile component displaying username, rank, Gain XP button, and online status after styling was applied.*

![PlayerStats extension component in action](../imgs/module02-playerstats-extension.png)
*Caption: The PlayerStats component showing health and gold updating independently via the Take Damage and Find Loot buttons, with the Low Health warning triggered.*

**Extension task completed successfully:** Yes

**Media description:** The first image shows the PlayerProfile component rendering the player's username, calculated rank, and online status, styled with the dashboard CSS theme. The second image shows the PlayerStats extension component, where health decreases and gold increases independently without overwriting each other, and the low-health warning message appears once health drops to 40 or below.

## Concept mapping

- **Concept 1:** Lecture slide #__ — Component-based architecture: breaking a UI into small, reusable functional components (e.g. `PlayerProfile`, `PlayerStats`) instead of one large HTML file, each exported and imported where needed.
  ```jsx
  function PlayerProfile() {
    return (
      <div className="profile-card">
        <h2>Player: {username}</h2>
      </div>
    );
  }
  export default PlayerProfile;
  ```
- **Concept 2:** Lecture slide #__ — Object destructuring: extracting specific properties from a state object into standalone variables to avoid repetitive dot notation.
  ```js
  const { username, level, active } = player;
  ```
- **Concept 3:** Lecture slide #__ — State and immutability with the spread operator: using `useState` and spreading the existing object into a new one so React's Virtual DOM diffing detects the change via a new memory reference.
  ```js
  const [player, setPlayer] = useState({ username: "PixelPioneer", level: 5, active: true });
  const handleLevelUp = () => {
    const updatedPlayer = { ...player, level: level + 1 };
    setPlayer(updatedPlayer);
  };
  ```
- **Concept 4:** Lecture slide #__ — Conditional rendering with the ternary operator, since imperative if/else blocks aren't valid inside JSX.
  ```jsx
  {active ? <p>Status: Online</p> : <p>Status: Offline</p>}
  ```
- **Concept 5:** Lecture slide #__ — Modularisation and template literals: moving logic out of the component into a separate `.js` utility file, exported and imported by name, using backticks for string interpolation.
  ```js
  export const getPlayerRank = (level) => {
    let rank = "Novice";
    if (level >= 6) rank = "Adept";
    if (level >= 10) rank = "Master";
    return `Level ${level} ${rank}`;
  };
  ```

## AI transparency and critical reflection

### Table 1: AI tool usage log

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How?                                                                                    |
|---|---|---|--------------------------------------------------------------------------------------------------------------------------------------|
| Claude | Step-by-step guidance through the Vite scaffold, Git branch/commit/PR workflow, and building PlayerProfile.jsx | Pasted the tutorial text and asked what to do at each step | modified it: modified instructions                                                                                                   |
| Claude | Debugging import and rendering errors (e.g. "Failed to resolve import" for components/styles files, duplicate `handleLevelUp` declaration, malformed JSX fragment) | Pasted terminal/browser error messages and asked what was wrong | As is: applied the exact fix suggested after identifying the cause (wrong file path, duplicate declaration, malformed fragment tags) |
| Claude | Writing the full PlayerStats.jsx extension component from the less-guided extension task instructions | Asked for the complete code implementing the extension task requirements | modified it : modified the final code                                                                                                |

### Analysis and Implications

**Reflection:** AI assistance sped up debugging significantly, particularly for import path and JSX syntax errors that would otherwise take longer to spot manually. Because most guided tasks provided exact code to type, my understanding of *why* code behaves as it does (e.g. immutability, the diffing algorithm) came primarily from the tutorial text rather than the AI. For the extension task, letting AI generate a complete solution risked reducing independent problem-solving, so I made sure to trace through and test the logic myself before considering it complete.

---

# Module 3 Devlog

## Proof of completion

<!-- Replace with your actual screenshots, saved in tutorials/imgs/ -->
![Header and CourseModule components with mapped list and topics](../imgs/module03-coursemodules-rendered.png)
*Caption: The t03 app displaying the Header component and three CourseModule cards generated via .map(), each showing a nested topic list.*

![Blank app after initial Vite scaffold cleanup](../imgs/module03-blank-scaffold.png)
*Caption: The t03 project after removing the default Vite boilerplate and CSS files, confirming the clean starting state before components were added.*

**Extension task completed successfully:** No

**Media description:** The first image shows three CourseModule cards rendered dynamically from an array using `.map()`, each with a unique key and a nested unordered list of topic strings. The second image shows the blank starting page after Task 1's cleanup, confirming the boilerplate was removed before component work began.

## Concept mapping

- **Concept 1:** Lecture slide #__ — Props and one-way data flow: passing data from a parent component down to a child component as read-only attributes.
  ```jsx
  <CourseModule title="Introduction to React" description="Understanding the Virtual DOM." />
  ```
- **Concept 2:** Lecture slide #__ — Destructuring props directly in the function signature to avoid referencing a bundled `props` object.
  ```jsx
  function CourseModule({ title, description, topics = [] }) { ... }
  ```
- **Concept 3:** Lecture slide #__ — Rendering lists with `.map()` and unique `key` props so React's Virtual DOM diffing algorithm can efficiently track added, changed, or removed items.
  ```jsx
  {moduleData.map((module) => (
    <CourseModule key={module.id} title={module.title} description={module.description} />
  ))}
  ```
- **Concept 4:** Lecture slide #__ — Nested data structures and default prop values, safely rendering a conditional list only when data exists.
  ```jsx
  {topics.length > 0 && (
    <ul className="topic-list">
      {topics.map((topic, index) => (
        <li key={index}>{topic}</li>
      ))}
    </ul>
  )}
  ```

## AI transparency and critical reflection

### Table 1: AI tool usage log

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
|---|---|---|---|
| Claude | Step-by-step guidance through scaffolding t03, building Header and CourseModule components | Pasted the tutorial text and asked what to do at each step | As is: followed the instructions directly as given |
| Claude | Clarifying where to run terminal commands and confirming which branch to work from before starting new module work | Asked where to run scaffold commands after losing track of the terminal location | As is: used the suggested `cd` and `git checkout main` commands directly |

### Analysis and Implications

**Reflection:** For Module 3, AI use was mostly procedural (confirming terminal locations, working through the guided steps in order) rather than generating original code logic, since the tutorial itself provided most of the code directly. This kept my understanding grounded in the actual tutorial material rather than AI-generated explanations. One implication worth noting is that relying on AI to restate guided instructions step-by-step, rather than reading them independently first, could reduce practice at parsing technical documentation on my own.
