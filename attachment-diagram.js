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
            scale: options.scale || 100,
            lineWidth: options.lineWidth || 3,
            curveColor: options.curveColor || '#8b7d6f',
            labelColor: options.labelColor || '#5a5348',
            axisColor: options.axisColor || '#d4c9bd',
            highlightColor: options.highlightColor || '#a8937e',
            fontSize: options.fontSize || 15,
            labelFontSize: options.labelFontSize || 16,
            showLabels: options.showLabels !== false,
            showAxes: options.showAxes !== false,
            pointRadius: options.pointRadius || 8,
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
        
        const offset = scale * 1.35;
        
        // Secure (low anxiety, low avoidance)
        this.ctx.fillStyle = highlightColor;
        this.ctx.fillText('Secure', centerX, centerY - offset - 10);
        
        // Anxious (high anxiety, low avoidance)
        this.ctx.fillStyle = labelColor;
        this.ctx.fillText('Anxious', centerX - offset, centerY + 5);
        
        // Avoidant (low anxiety, high avoidance)
        this.ctx.fillText('Avoidant', centerX + offset, centerY + 5);
        
        // Fearful (high anxiety, high avoidance)
        this.ctx.fillText('Fearful', centerX, centerY + offset + 25);
        
        // Axis labels
        this.ctx.font = `400 ${fontSize - 2}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = '#9b8f82';
        
        // Anxiety axis
        this.ctx.fillText('Low Anxiety', centerX - scale * 1.6, centerY - 20);
        this.ctx.fillText('High Anxiety', centerX + scale * 1.6, centerY - 20);
        
        // Avoidance axis
        this.ctx.save();
        this.ctx.translate(centerX + 20, centerY - scale * 1.4);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.fillText('Low Avoidance', 0, 0);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(centerX + 20, centerY + scale * 1.4);
        this.ctx.rotate(Math.PI / 2);
        this.ctx.fillText('High Avoidance', 0, 0);
        this.ctx.restore();
    }
    
    /**
     * Plot a point on the diagram based on anxiety and avoidance scores
     * @param {number} anxiety - Score from -1 (low) to 1 (high)
     * @param {number} avoidance - Score from -1 (low) to 1 (high)
     * @param {string} color - Color of the point
     */
    plotPoint(anxiety, avoidance, color = '#c77f5a') {
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
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dataPoint = null;
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
diagram.render();

// Example: Plot a point after 1 second (for demonstration)
setTimeout(() => {
    // Example scores: moderate anxiety (0.5), low avoidance (-0.3)
    diagram.render({ anxiety: 0.5, avoidance: -0.3, color: '#c77f5a' });
}, 1000);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentDiagram;
}
