# Attachment Style Diagram

A pure JavaScript visualization of the attachment theory diagram using the infinity symbol (lemniscate) to represent the four attachment styles.

## Features

- Pure JavaScript (no dependencies)
- Canvas-based rendering
- Easily embeddable in any web page
- Customizable appearance
- Plot questionnaire results on the diagram

## Usage

### Basic Usage

Simply open `index.html` in a browser to see the diagram.

### Embedding in Your Web Page

```html
<canvas id="attachmentCanvas" width="600" height="400"></canvas>
<script src="attachment-diagram.js"></script>
<script>
    const diagram = new AttachmentDiagram('attachmentCanvas');
    diagram.render();
</script>
```

### Plotting Questionnaire Results

```javascript
// Create diagram instance
const diagram = new AttachmentDiagram('attachmentCanvas');

// Plot a point based on questionnaire scores
// Values range from -1 (low) to 1 (high)
diagram.render({
    anxiety: 0.5,      // High anxiety
    avoidance: -0.3,   // Low avoidance
    color: '#dc2626'   // Red color
});
```

### Customization Options

```javascript
const diagram = new AttachmentDiagram('attachmentCanvas', {
    scale: 80,              // Size of the diagram
    lineWidth: 2,           // Width of the infinity curve
    curveColor: '#2563eb', // Color of the curve
    labelColor: '#1e293b', // Color of labels
    fontSize: 14,           // Font size for labels
    showLabels: true,       // Show attachment style labels
    showAxes: true,         // Show coordinate axes
    pointRadius: 6          // Radius of plotted points
});
```

## Attachment Styles

The diagram represents four attachment styles:

- **Secure**: Low anxiety, low avoidance (top)
- **Anxious**: High anxiety, low avoidance (left)
- **Avoidant**: Low anxiety, high avoidance (right)
- **Fearful**: High anxiety, high avoidance (bottom)

## Converting Questionnaire Scores

To convert your questionnaire results to the -1 to 1 scale:

```javascript
function normalizeScore(score, minScore, maxScore) {
    // Convert to 0-1 range
    const normalized = (score - minScore) / (maxScore - minScore);
    // Convert to -1 to 1 range
    return (normalized * 2) - 1;
}

// Example: Score of 35 on a 0-50 scale
const anxietyScore = normalizeScore(35, 0, 50);  // 0.4
const avoidanceScore = normalizeScore(20, 0, 50); // -0.2

diagram.render({
    anxiety: anxietyScore,
    avoidance: avoidanceScore,
    color: '#dc2626'
});
```

## API Reference

### Constructor

`new AttachmentDiagram(canvasId, options)`

### Methods

- `render(dataPoint)` - Render the diagram with optional data point
- `plotPoint(anxiety, avoidance, color)` - Plot a point on the diagram
- `clear()` - Clear the canvas

## License

MIT
