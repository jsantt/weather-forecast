You are an expert in TypeScript and scalable web application development. You write maintainable and accessible code following TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
- use parentheses
- use return early pattern
- use private keyword instead of low dash (\_)

## Web Components Best Practices

- Use shadow dom in each component
- remember shadow dom is used for each component

### Loading

- Expressed Dependencies — Does the component import or otherwise load all of its own dependencies?

- Load Order Independence — Can you load the component at any point?

- Relative Paths — Are all paths relative to required resources (images, etc.) relative to the component source?

### DOM Presence

- Plain Tag — Can you instantiate the component with just a plain tag (<my-element>)?

- Declared Semantics — Does the component expose its semantics by wrapping/extending a native element, or using ARIA roles, states, and properties? AccessibilityAccessibility

- Meaningful Structure — Does the component's DOM structure reflect the meaningful relationship between elements, such that those relationships are clear to a user relying on an assistive device? AccessibilityAccessibility

- Labels — Are the component's significant elements labeled such that a user relying on an assistive device can understand what those elements are for? AccessibilityAccessibility

- Local Effects — Does the component limit its effects to itself (or a designated target element)?

- Detached Instantiation — Can the component be instantiated without being part of the document?

- Detachment — If the component is detached, does it stop listening to page events, and generally suspend non-essential tasks?

- Reattachment — Can a detached component be added back to the page?

### Content

- Children Visible — If the component is visible and given an initial set of children, are those children visible without any attributes, methods, event handlers, or styles required?

- Content Assignment — Can you place a <slot> element inside a component instance and have the component treat the assigned content as if it were directly inside the component?

- Content Changes — Will the component respond to runtime changes in its content (including distributed content)?

- Parent/Child Independence — Can you use the component inside any type of parent element, or with any type of child elements?

- Auxiliary Content — Does the component permit the use of child elements that perform auxiliary functions?

- Back-End Independence — Can the component retrieve its content from a variety of a back-end services?

### Interaction

- Focusable — If the component is interactive, can you navigate to/through it with Tab and Shift+Tab? AccessibilityAccessibility

- Keyboard Support — Can you use the basic aspects of component exclusively with the keyboard? AccessibilityAccessibility

- Redundant Sound — If the component uses sound to communicate information, does it also provide the same information another way? AccessibilityAccessibility

### Styling

- Presentable — If the component is instantiated with no explicit styling, is it reasonably attractive, such that someone could feel comfortable presenting it as is?

- Generic Styling — Generally speaking, is the component’s default appearance straightforward and subdued?

- Informational Animation — Does the component’s default styling only use animation to communicate visually what is happening, rather than for purely artistic effects?

- Static Initial Render — Does the component avoid initial animated transitions?

- Default Font — By default, does the component use the inherited font face, size, style, and weight?

- Default Colors — By default, does the component make use of the inherited forecolor and backcolor?

- Focus Visible — Can you easily see when the component has focus? AccessibilityAccessibility

- Redundant Color — If the component uses color to communicate information, does it also provide the same information another way? AccessibilityAccessibility

- Size to Content — Does the component automatically size itself to contain its content by default?

- Stretch to Fit — If you stretch the component (e.g., with absolute positioning or CSS flex), do its elements appropriately stretch as well?

- Sufficient Contrast — Are labels, icons, etc. perceivable and usable by low vision users? AccessibilityAccessibility

- High Contrast — Is the component perceivable and usable when High Contrast Mode is enabled? AccessibilityAccessibility

- Automatic Positioning — Does the component automatically calculate positions for its elements?

- Child Positioning — Can child elements be positioned relative to their container within the component?

- Responsive — Does the component scale well to standard mobile, tablet, and desktop screen sizes?

- Magnification — Does the component render correctly when magnified? AccessibilityAccessibility

- Style Recalc — Can you apply styles to a component instance even after it’s attached to the document?

- Size Recalc — If the component manually positions any subelements relative to its own size, does it appropriately recalc these positions when its own size changes?

### API

- Member Order Independence — Can you set or invoke the component’s attributes, properties, and methods in any order?

- Member Combinations — Can you generally use all the component’s attributes, properties, and methods in any combination?

- Member Stability — If you change a component property or contents, then immediately get that property or contents, do you generally get the same result back?

- Required Properties — Does the component avoid requiring properties to be set unless absolutely necessary?

- Exposed Methods — Can you programmatically trigger all of the component’s key functionality through methods, rather than relying on user interaction?

- Exposed Events — Does the component raise events for all key points in its use?

- Property Change Events — Does the component raise property change events when — and only when — properties change in response to internal component activity?

- Documented API — Does the component document its public API?

- Hide Internal Members — Does the component avoid exposing internal members in its public API?

### Performance

- Computational Performance — Generally speaking, does the component perform its core functions reasonably quickly?

- Network Performance — If the component uses the network, does it do so efficiently?

- Render Performance — Is the component quick to get pixels on the screen when first loading and when updating?

- Vector Graphics — Where possible and appropriate, are the component’s graphics in a scalable vector form?

- Progress Feedback — For long operations, can the component provide appropriate feedback?

### Localization

- Localizable Strings — Can text presented by the component be replaced for use in other languages?

- Date+Time Format — If the component accepts or renders dates and/or times, can you change the date/time format?

- Currency Format — If the component accepts or renders currency amounts, can you change the currency format?

- Right-to-Left — Can the component be configured to flip its presentation for use in right-to-left languages like Arabic and Hebrew?

### Factoring

- Base Class — If the component is a special case of another component, does it appropriately subclass from (or at least compose an instance of) that base class?

- Composition — Does the component appropriately delegate responsibilities to existing standard components when possible?

- Subclassable — Is the component subclassable?

- Overridable Methods — Does the component provide internal methods for key functionality, such that a subclass can override those methods to refine their behavior?

### Development

- Clean Console — Does the component avoid writing to the debug console unless specifically requested to do so?
- Prefixed Name — Does the component have a name prefixed with a project name, element collection name, organization, or something with semantic meaning?
