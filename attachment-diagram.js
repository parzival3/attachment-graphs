/**
 * Attachment Style Diagram
 * Creates an infinity symbol (figure-8) representing attachment theory dimensions
 */

class AttachmentDiagram {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration
        this.config = {
            centerX: options.centerX || this.canvas.width / 2,
            centerY: options.centerY || this.canvas.height / 2,
            scale: options.scale || 80,
            lineWidth: options.lineWidth || 2,
            curveColor: options.curveColor || '#2563eb',
            labelColor: options.labelColor || '#1e293b',
            fontSize: options.fontSize || 14,
            showLabels: options.showLabels !== false,
            showAxes: options.showAxes !== false,
            pointRadius: options.pointRadius || 6
        };
        
        this.dataPoint = null;
    }
    
    /**
     * Draw the infinity curve (lemniscate of Bernoulli)
     */
    drawInfinityCurve() {
        const { centerX, centerY, scale, lineWidth, curveColor } = this.config;
        
        this.ctx.strokeStyle = curveColor;
        this.ctx.lineWidth = lineWidth;
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
    }
    
    /**
     * Draw coordinate axes
     */
    drawAxes() {
        if (!this.config.showAxes) return;
        
        const { centerX, centerY } = this.config;
        const padding = 30;
        
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
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
        
        const { centerX, centerY, scale, fontSize, labelColor } = this.config;
        
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'center';
        
        // Quadrant labels for attachment styles
        const offset = scale * 1.3;
        
        // Secure (low anxiety, low avoidance)
        this.ctx.fillText('Secure', centerX, centerY - offset - 10);
        
        // Anxious (high anxiety, low avoidance)
        this.ctx.fillText('Anxious', centerX - offset, centerY);
        
        // Avoidant (low anxiety, high avoidance)
        this.ctx.fillText('Avoidant', centerX + offset, centerY);
        
        // Fearful (high anxiety, high avoidance)
        this.ctx.fillText('Fearful', centerX, centerY + offset + 20);
        
        // Axis labels
        this.ctx.font = `${fontSize - 2}px Arial`;
        this.ctx.fillStyle = '#64748b';
        
        // Anxiety axis
        this.ctx.fillText('Low Anxiety', centerX - scale * 1.5, centerY - 15);
        this.ctx.fillText('High Anxiety', centerX + scale * 1.5, centerY - 15);
        
        // Avoidance axis
        this.ctx.save();
        this.ctx.translate(centerX + 15, centerY - scale * 1.3);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('Low Avoidance', 0, 0);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(centerX + 15, centerY + scale * 1.3);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('High Avoidance', 0, 0);
        this.ctx.restore();
    }
    
    /**
     * Plot a point on the diagram based on anxiety and avoidance scores
     * @param {number} anxiety - Score from -1 (low) to 1 (high)
     * @param {number} avoidance - Score from -1 (low) to 1 (high)
     * @param {string} color - Color of the point
     */
    plotPoint(anxiety, avoidance, color = '#dc2626') {
        const { centerX, centerY, scale, pointRadius } = this.config;
        
        const x = centerX + anxiety * scale;
        const y = centerY + avoidance * scale;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
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
    diagram.render({ anxiety: 0.5, avoidance: -0.3, color: '#dc2626' });
}, 1000);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentDiagram;
}
