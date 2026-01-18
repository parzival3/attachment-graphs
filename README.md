# Attachment Style Diagram

An interactive, therapy-inspired visualization of attachment theory using the infinity symbol (lemniscate) to represent the four attachment styles. Built with pure JavaScript and optimized for both desktop and mobile devices.

![Attachment Style Diagram](screenshot.png)

## Features

### Core Features
- ✨ **Pure JavaScript** - No dependencies, works anywhere
- 🎨 **Beautiful Design** - Warm, calming color palette inspired by therapy websites
- 📱 **Mobile Responsive** - Fully optimized for smartphones and tablets
- 🎯 **Interactive Sliders** - Move points along the curve to explore attachment styles
- 👥 **Dual Points** - Track both "You" and "Partner" positions simultaneously
- 🖱️ **Hover Tooltips** - Hover or tap points to see labels
- 🔍 **Adjustable Scale** - Zoom slider to resize the curve (80-200)
- 🎲 **Random Initialization** - Different positions on each page load
- 📐 **Precise Positioning** - Labels stay within bounds at all scales

### Technical Features
- Canvas-based rendering with smooth animations
- Touch event support for mobile devices
- Responsive layout with automatic canvas resizing
- Cache-busting for development
- Real-time updates as you adjust controls

## Quick Start

### View the Demo

Simply open `index.html` in any modern web browser.

### Files Structure

```
├── index.html              # Main HTML page
├── attachment-diagram.js   # Core diagram logic
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## Usage

### Interactive Controls

1. **Your Position Slider** - Move your point along the attachment curve
2. **Partner Position Slider** - Move your partner's point independently
3. **Curve Size Slider** - Adjust the diagram zoom (80-200)

### Attachment Styles

The diagram shows four primary attachment styles:

- **Secure** (Top) - Low anxiety, low avoidance - Healthy attachment
- **Anxious** (Left) - High anxiety, low avoidance - Preoccupied with relationships
- **Avoidant** (Right) - Low anxiety, high avoidance - Dismissive of closeness
- **Fearful** (Bottom) - High anxiety, high avoidance - Fearful of intimacy

### How to Use

1. **Explore Positions**: Use sliders to move points around the curve
2. **View Labels**: Hover (desktop) or tap (mobile) on points to see "You" or "Partner"
3. **Adjust Size**: Use the Curve Size slider to zoom in or out
4. **Compare Styles**: See how different positions relate to attachment styles

## Embedding in Your Website

### Basic Embedding

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <canvas id="attachmentCanvas" width="700" height="500"></canvas>
    <script src="attachment-diagram.js"></script>
</body>
</html>
```

### Customization

```javascript
const diagram = new AttachmentDiagram('attachmentCanvas', {
    scale: 200,                // Curve size
    lineWidth: 3.5,           // Curve line thickness
    curveColor: '#8b7d6f',    // Curve color
    labelColor: '#5a5348',    // Label text color
    fontSize: 16,             // Axis label font size
    labelFontSize: 18,        // Style label font size
    pointRadius: 10           // Point size
});
```

### API Methods

```javascript
// Set the scale/zoom level
diagram.setScale(150);

// Plot a point with label
diagram.plotPoint(anxiety, avoidance, color, label);
// anxiety: -1 (low) to 1 (high)
// avoidance: -1 (low) to 1 (high)
// color: hex color code
// label: text to show on hover

// Clear and redraw
diagram.clear();
diagram.drawInfinityCurve();
diagram.drawLabels();
```

## Mobile Optimization

The diagram automatically adapts to mobile devices:

- **Responsive Canvas**: Scales to fit screen width
- **Touch Support**: Tap points to see tooltips
- **Adaptive Text**: Smaller fonts on mobile
- **Optimized Layout**: Reduced padding and margins
- **Touch Targets**: Larger hit areas (20px) for easier tapping

### Mobile Breakpoint

Mobile styles activate when screen width ≤ 768px

## Design System

### Color Palette

Inspired by therapeutic design with warm, calming tones:

- **Background**: `#e8dfd4` → `#d4c9bd` (gradient)
- **Curve**: `#8b7d6f` (warm gray)
- **Labels**: `#5a5348` (dark warm gray)
- **Axes**: `#d4c9bd` (light beige)
- **Your Point**: `#c77f5a` (terracotta)
- **Partner Point**: `#8b7d6f` (warm gray)

### Typography

- **Font Family**: Segoe UI, sans-serif
- **Attachment Styles**: 18px, weight 600
- **Axis Labels**: 14px, weight 400

## Technical Details

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Dependencies

None! Pure vanilla JavaScript and HTML5 Canvas.

### Performance

- Lightweight: ~15KB total (HTML + JS + CSS)
- Smooth animations
- Efficient canvas rendering
- No external requests

## Development

### Local Development

1. Clone the repository
2. Open `index.html` in a browser
3. No build process needed!

### Cache Busting

The page includes cache-busting meta tags for development:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

### Git History

The project includes detailed commit messages for all changes:

- Initial setup with infinity curve
- Color palette inspired by therapy website
- Interactive sliders for position control
- Hover tooltips
- Mobile responsive design
- Partner point tracking
- Dynamic scaling
- Label positioning optimization

## Changelog

### Latest Updates

- ✅ Mobile responsive design with touch support
- ✅ Random initial positions on page load
- ✅ Adjustable curve size with slider (80-200)
- ✅ Dual point tracking (You + Partner)
- ✅ Hover/touch tooltips
- ✅ Optimized label positioning at all scales
- ✅ Cache-busting for development
- ✅ Maximum scale default (200)

## Use Cases

- **Therapy Practice**: Visualize client attachment patterns
- **Relationship Counseling**: Compare partner attachment styles
- **Self-Discovery**: Explore your own attachment tendencies
- **Education**: Teach attachment theory concepts
- **Research**: Plot questionnaire results
- **Workshops**: Interactive attachment style demonstrations

## Contributing

This is a personal project, but suggestions are welcome! Feel free to:

1. Report issues
2. Suggest features
3. Submit improvements

## License

MIT License - Free to use and modify

## Credits

**Developed with Warp AI**
- All commits include: `Co-Authored-By: Warp <agent@warp.dev>`

**Design Inspiration**
- Color palette inspired by therapeutic website design
- Infinity symbol represents the continuous nature of attachment patterns

## Resources

### Learn About Attachment Theory

- [Attachment Theory Overview](https://en.wikipedia.org/wiki/Attachment_theory)
- Understanding attachment styles in relationships
- How attachment patterns develop and change

### Technical Resources

- HTML5 Canvas API
- Touch Events API
- Responsive Web Design
- Lemniscate of Bernoulli (infinity curve mathematics)

---

**Made with ❤️ for therapists, counselors, and anyone exploring attachment theory**
