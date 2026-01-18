/**
 * Attachment Style Diagram
 * Creates an infinity symbol (figure-8) representing attachment theory dimensions
 */

class AttachmentDiagram {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration with warm, calming color palette
        this.config = {
            centerX: options.centerX || this.canvas.width / 2,
            centerY: options.centerY || this.canvas.height / 2,
            scale: options.scale || 200,
            lineWidth: options.lineWidth || 3.5,
            curveColor: options.curveColor || '#8b7d6f',
            labelColor: options.labelColor || '#5a5348',
            axisColor: options.axisColor || '#d4c9bd',
            highlightColor: options.highlightColor || '#a8937e',
            fontSize: options.fontSize || 16,
            labelFontSize: options.labelFontSize || 18,
            showLabels: options.showLabels !== false,
            showAxes: options.showAxes !== false,
            pointRadius: options.pointRadius || 10,
            showQuadrants: options.showQuadrants !== false
        };
        
        this.dataPoint = null;
    }
    
    /**
     * Draw quadrant backgrounds
     */
    drawQuadrants() {
        if (!this.config.showQuadrants) return;
        
        const { centerX, centerY, scale } = this.config;
        const gradient1 = this.ctx.createRadialGradient(centerX, centerY - scale * 0.5, 0, centerX, centerY - scale * 0.5, scale * 0.8);
        gradient1.addColorStop(0, 'rgba(168, 147, 126, 0.08)');
        gradient1.addColorStop(1, 'rgba(168, 147, 126, 0)');
        
        this.ctx.fillStyle = gradient1;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - scale * 0.5, scale * 0.8, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    /**
     * Draw the infinity curve (lemniscate of Bernoulli)
     */
    drawInfinityCurve() {
        const { centerX, centerY, scale, lineWidth, curveColor } = this.config;
        
        // Draw shadow
        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.2)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        
        this.ctx.strokeStyle = curveColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        
        // Parametric equations for infinity symbol
        for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
            const a = scale;
            const x = centerX + (a * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
            const y = centerY + (a * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
            
            if (t === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    /**
     * Draw coordinate axes
     */
    drawAxes() {
        if (!this.config.showAxes) return;
        
        const { centerX, centerY, axisColor } = this.config;
        const padding = 40;
        
        this.ctx.strokeStyle = axisColor;
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([8, 6]);
        
        // Horizontal axis (Anxiety)
        this.ctx.beginPath();
        this.ctx.moveTo(padding, centerY);
        this.ctx.lineTo(this.canvas.width - padding, centerY);
        this.ctx.stroke();
        
        // Vertical axis (Avoidance)
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, padding);
        this.ctx.lineTo(centerX, this.canvas.height - padding);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    /**
     * Draw labels for attachment styles
     */
    drawLabels() {
        if (!this.config.showLabels) return;
        
        const { centerX, centerY, scale, labelFontSize, fontSize, labelColor, highlightColor } = this.config;
        
        // Quadrant labels for attachment styles
        this.ctx.font = `600 ${labelFontSize}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'center';
        
        // Use minimum of scale-based or fixed offset to keep labels in bounds
        // Increase multiplier to 1.8 to keep labels outside the curve
        const maxStyleOffset = Math.min(scale * 1.8, 300);
        
        // Secure (low anxiety, low avoidance)
        this.ctx.fillStyle = labelColor;
        this.ctx.fillText('Secure', centerX, 60);
        
        // Anxious (high anxiety, low avoidance)
        this.ctx.fillStyle = labelColor;
        this.ctx.fillText('Anxious', Math.max(60, centerX - maxStyleOffset), centerY + 15);
        
        // Avoidant (low anxiety, high avoidance)
        this.ctx.fillText('Avoidant', Math.min(this.canvas.width - 60, centerX + maxStyleOffset), centerY + 15);
        
        // Fearful (high anxiety, high avoidance)
        this.ctx.fillText('Fearful', centerX, this.canvas.height - 60);
        
        // Axis labels - aligned with attachment style labels
        this.ctx.font = `400 ${fontSize - 2}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = '#9b8f82';
        this.ctx.textAlign = 'center';
        
        // Use same offset as attachment style labels for alignment
        const anxiousX = Math.max(60, centerX - maxStyleOffset);
        const avoidantX = Math.min(this.canvas.width - 60, centerX + maxStyleOffset);
        
        // Anxiety axis (horizontal labels) - aligned with Anxious/Avoidant
        this.ctx.fillText('Low Anxiety', anxiousX, centerY - 10);
        this.ctx.fillText('High Anxiety', avoidantX, centerY - 10);
        
        // Avoidance axis (vertical labels) - aligned with Secure/Fearful
        this.ctx.fillText('Low Avoidance', centerX, 35);
        this.ctx.fillText('High Avoidance', centerX, this.canvas.height - 35);
    }
    
    /**
     * Plot a point on the diagram based on anxiety and avoidance scores
     * @param {number} anxiety - Score from -1 (low) to 1 (high)
     * @param {number} avoidance - Score from -1 (low) to 1 (high)
     * @param {string} color - Color of the point
     * @param {string} label - Label for the point
     */
    plotPoint(anxiety, avoidance, color = '#c77f5a', label = '') {
        const { centerX, centerY, scale, pointRadius } = this.config;
        
        const x = centerX + anxiety * scale;
        const y = centerY + avoidance * scale;
        
        // Draw outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, pointRadius * 2);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius * 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw main point with shadow
        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.3)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // White border
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.dataPoint = { anxiety, avoidance, x, y };
        
        return { x, y, label, color };
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dataPoint = null;
    }
    
    /**
     * Set the scale/zoom level of the diagram
     */
    setScale(scale) {
        this.config.scale = scale;
    }
    
    /**
     * Render the complete diagram
     */
    render(dataPoint = null) {
        this.clear();
        this.drawQuadrants();
        this.drawAxes();
        this.drawInfinityCurve();
        this.drawLabels();
        
        if (dataPoint) {
            this.plotPoint(dataPoint.anxiety, dataPoint.avoidance, dataPoint.color);
        }
    }
}

// Initialize the diagram
const diagram = new AttachmentDiagram('attachmentCanvas');

// Pre-calculate curve points for the slider to follow
const curvePoints = [];
for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
    const denominator = 1 + Math.sin(t) * Math.sin(t);
    const x = Math.cos(t) / denominator;
    const y = (Math.sin(t) * Math.cos(t)) / denominator;
    curvePoints.push({ x, y, t });
}

// Function to get position on curve from percentage (0-100)
function getPointOnCurve(percentage) {
    const index = Math.floor((percentage / 100) * (curvePoints.length - 1));
    return curvePoints[index];
}

// Function to get attachment style label based on position
function getAttachmentLabel(x, y) {
    if (x < -0.3 && Math.abs(y) < 0.3) return 'Anxious-Preoccupied';
    if (x > 0.3 && Math.abs(y) < 0.3) return 'Dismissive-Avoidant';
    if (Math.abs(x) < 0.3 && y < -0.3) return 'Secure';
    if (Math.abs(x) < 0.3 && y > 0.3) return 'Fearful-Avoidant';
    if (x < 0 && y < 0) return 'Secure-Anxious';
    if (x > 0 && y < 0) return 'Secure-Avoidant';
    if (x < 0 && y > 0) return 'Anxious-Fearful';
    if (x > 0 && y > 0) return 'Avoidant-Fearful';
    return 'Transitional';
}

// Current positions
let yourPosition = 25;
let partnerPosition = 75;

// Store point positions for hover detection
let points = [];

// Function to render both points
function renderBothPoints() {
    const yourPoint = getPointOnCurve(yourPosition);
    const partnerPoint = getPointOnCurve(partnerPosition);
    
    diagram.clear();
    diagram.drawQuadrants();
    diagram.drawAxes();
    diagram.drawInfinityCurve();
    diagram.drawLabels();
    
    // Draw both points and store their positions
    points = [];
    points.push(diagram.plotPoint(partnerPoint.x, partnerPoint.y, '#8b7d6f', 'Partner'));
    points.push(diagram.plotPoint(yourPoint.x, yourPoint.y, '#c77f5a', 'You'));
}

// Function to draw tooltip
function drawTooltip(point, mouseX, mouseY) {
    const ctx = diagram.ctx;
    const label = point.label;
    
    ctx.font = '600 13px "Segoe UI", sans-serif';
    const textMetrics = ctx.measureText(label);
    const padding = 8;
    const tooltipWidth = textMetrics.width + padding * 2;
    const tooltipHeight = 26;
    
    // Position tooltip above the cursor
    const tooltipX = mouseX - tooltipWidth / 2;
    const tooltipY = mouseY - 35;
    
    // Draw tooltip background with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Draw tooltip text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(label, tooltipX + tooltipWidth / 2, tooltipY + 17);
}

// Set up sliders
const curveSlider = document.getElementById('curveSlider');
const positionValue = document.getElementById('positionValue');
const partnerSlider = document.getElementById('partnerSlider');
const partnerPositionValue = document.getElementById('partnerPositionValue');
const zoomSlider = document.getElementById('zoomSlider');
const zoomValue = document.getElementById('zoomValue');

if (curveSlider && positionValue) {
    // Initial render
    const initialPoint = getPointOnCurve(yourPosition);
    const partnerPoint = getPointOnCurve(partnerPosition);
    positionValue.textContent = getAttachmentLabel(initialPoint.x, initialPoint.y);
    partnerPositionValue.textContent = getAttachmentLabel(partnerPoint.x, partnerPoint.y);
    renderBothPoints();
    
    // Your slider event
    curveSlider.addEventListener('input', (e) => {
        yourPosition = parseFloat(e.target.value);
        const point = getPointOnCurve(yourPosition);
        positionValue.textContent = getAttachmentLabel(point.x, point.y);
        renderBothPoints();
    });
    
    // Partner slider event
    if (partnerSlider && partnerPositionValue) {
        partnerSlider.addEventListener('input', (e) => {
            partnerPosition = parseFloat(e.target.value);
            const point = getPointOnCurve(partnerPosition);
            partnerPositionValue.textContent = getAttachmentLabel(point.x, point.y);
            renderBothPoints();
        });
    }
    
    // Zoom slider event
    if (zoomSlider && zoomValue) {
        zoomSlider.addEventListener('input', (e) => {
            const scale = parseFloat(e.target.value);
            zoomValue.textContent = scale;
            diagram.setScale(scale);
            renderBothPoints();
        });
    }
}

// Add hover tooltip functionality
const canvas = diagram.canvas;
let hoveredPoint = null;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is over any point
    let foundPoint = null;
    for (const point of points) {
        const distance = Math.sqrt(
            Math.pow(mouseX - point.x, 2) + 
            Math.pow(mouseY - point.y, 2)
        );
        
        if (distance < 15) {
            foundPoint = point;
            break;
        }
    }
    
    // If hovering state changed, redraw
    if (foundPoint !== hoveredPoint) {
        hoveredPoint = foundPoint;
        renderBothPoints();
        
        if (hoveredPoint) {
            drawTooltip(hoveredPoint, mouseX, mouseY);
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default';
        }
    } else if (hoveredPoint) {
        // Update tooltip position while hovering
        renderBothPoints();
        drawTooltip(hoveredPoint, mouseX, mouseY);
    }
});

canvas.addEventListener('mouseleave', () => {
    if (hoveredPoint) {
        hoveredPoint = null;
        canvas.style.cursor = 'default';
        renderBothPoints();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentDiagram;
}
