/**
 * Relational Tension Line Diagram
 * Creates horizontal tension lines representing relationship dimensions
 * Each line shows two extremes with markers for each partner
 */

(function() {
'use strict';

class RelationalTensionDiagram {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Configuration with warm, calming color palette matching attachment diagram
        this.config = {
            lineColor: options.lineColor || '#8b7d6f',
            labelColor: options.labelColor || '#5a5348',
            subLabelColor: options.subLabelColor || '#9b8f82',
            partnerAColor: options.partnerAColor || '#c77f5a',
            partnerBColor: options.partnerBColor || '#8b7d6f',
            lineWidth: options.lineWidth || 3,
            fontSize: options.fontSize || 16,
            labelFontSize: options.labelFontSize || 18,
            pointRadius: options.pointRadius || 10,
            padding: options.padding || 80,
            lineSpacing: options.lineSpacing || 120,
            distanceHighlightColor: options.distanceHighlightColor || '#a8937e'
        };

        // Default themes with extremes
        this.themes = options.themes || [
            {
                name: 'Communication',
                leftExtreme: 'Direct',
                rightExtreme: 'Indirect',
                partnerA: 0.3,  // -1 to 1 scale
                partnerB: -0.6
            },
            {
                name: 'Family Involvement',
                leftExtreme: 'Independent',
                rightExtreme: 'Enmeshed',
                partnerA: -0.4,
                partnerB: 0.5
            },
            {
                name: 'Time Together',
                leftExtreme: 'Separate',
                rightExtreme: 'Merged',
                partnerA: 0.2,
                partnerB: 0.7
            },
            {
                name: 'Conflict Style',
                leftExtreme: 'Confronting',
                rightExtreme: 'Avoiding',
                partnerA: -0.5,
                partnerB: 0.3
            },
            {
                name: 'Decision Making',
                leftExtreme: 'Individual',
                rightExtreme: 'Shared',
                partnerA: 0.1,
                partnerB: -0.2
            }
        ];

        this.draggedPoint = null;
        this.hoveredPoint = null;
    }

    /**
     * Convert normalized position (-1 to 1) to canvas x coordinate
     */
    positionToX(position, y) {
        const lineWidth = this.canvas.width - (2 * this.config.padding);
        return this.config.padding + (position + 1) * lineWidth / 2;
    }

    /**
     * Convert canvas x coordinate to normalized position (-1 to 1)
     */
    xToPosition(x, y) {
        const lineWidth = this.canvas.width - (2 * this.config.padding);
        return ((x - this.config.padding) / lineWidth) * 2 - 1;
    }

    /**
     * Get Y position for a theme line
     */
    getThemeY(themeIndex) {
        const startY = 100;
        return startY + themeIndex * this.config.lineSpacing;
    }

    /**
     * Draw a single tension line with labels
     */
    drawTensionLine(theme, themeIndex) {
        const { padding, lineColor, lineWidth, labelColor, subLabelColor, labelFontSize, fontSize } = this.config;
        const y = this.getThemeY(themeIndex);
        const startX = padding;
        const endX = this.canvas.width - padding;

        // Draw theme name above the line
        this.ctx.font = `600 ${labelFontSize}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(theme.name, this.canvas.width / 2, y - 35);

        // Draw the line with shadow
        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.2)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(startX, y);
        this.ctx.lineTo(endX, y);
        this.ctx.stroke();

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

        // Draw extreme labels
        this.ctx.font = `400 ${fontSize}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = subLabelColor;

        // Left extreme
        this.ctx.textAlign = 'left';
        this.ctx.fillText(theme.leftExtreme, startX, y + 25);

        // Right extreme
        this.ctx.textAlign = 'right';
        this.ctx.fillText(theme.rightExtreme, endX, y + 25);

        // Draw endpoint dots
        this.ctx.fillStyle = lineColor;
        this.ctx.beginPath();
        this.ctx.arc(startX, y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(endX, y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /**
     * Draw distance highlight between partners
     */
    drawDistanceHighlight(theme, themeIndex) {
        const y = this.getThemeY(themeIndex);
        const x1 = this.positionToX(theme.partnerA, y);
        const x2 = this.positionToX(theme.partnerB, y);

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const distance = Math.abs(maxX - minX);

        // Only draw if there's meaningful distance
        if (distance > 5) {
            // Draw subtle highlight bar
            this.ctx.fillStyle = 'rgba(168, 147, 126, 0.15)';
            this.ctx.fillRect(minX, y - 8, distance, 16);

            // Draw distance line above markers
            this.ctx.strokeStyle = this.config.distanceHighlightColor;
            this.ctx.lineWidth = 1.5;
            this.ctx.setLineDash([4, 4]);
            this.ctx.beginPath();
            this.ctx.moveTo(minX, y - 15);
            this.ctx.lineTo(maxX, y - 15);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    /**
     * Draw a partner marker
     */
    drawMarker(position, y, color, label, isHovered = false) {
        const x = this.positionToX(position, y);
        const radius = this.config.pointRadius;

        // Draw outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color + (isHovered ? '60' : '40'));
        gradient.addColorStop(1, color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw main point with shadow
        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.3)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, isHovered ? radius * 1.1 : radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // White border
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        return { x, y, label, color };
    }

    /**
     * Draw tooltip
     */
    drawTooltip(point, mouseX, mouseY) {
        const label = point.label;

        this.ctx.font = '600 13px "Segoe UI", sans-serif';
        const textMetrics = this.ctx.measureText(label);
        const padding = 8;
        const tooltipWidth = textMetrics.width + padding * 2;
        const tooltipHeight = 26;

        // Position tooltip above the cursor
        const tooltipX = mouseX - tooltipWidth / 2;
        const tooltipY = mouseY - 35;

        // Draw tooltip background with shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillStyle = point.color;
        this.ctx.beginPath();
        this.ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
        this.ctx.fill();

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

        // Draw tooltip text
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, tooltipX + tooltipWidth / 2, tooltipY + 17);
    }

    /**
     * Find point at canvas coordinates
     */
    findPointAt(x, y) {
        const hitRadius = 15;

        for (let i = 0; i < this.themes.length; i++) {
            const theme = this.themes[i];
            const lineY = this.getThemeY(i);

            const aX = this.positionToX(theme.partnerA, lineY);
            const bX = this.positionToX(theme.partnerB, lineY);

            // Check Partner A
            const distA = Math.sqrt(Math.pow(x - aX, 2) + Math.pow(y - lineY, 2));
            if (distA < hitRadius) {
                return { themeIndex: i, partner: 'A', x: aX, y: lineY };
            }

            // Check Partner B
            const distB = Math.sqrt(Math.pow(x - bX, 2) + Math.pow(y - lineY, 2));
            if (distB < hitRadius) {
                return { themeIndex: i, partner: 'B', x: bX, y: lineY };
            }
        }

        return null;
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Render the complete diagram
     */
    render() {
        this.clear();

        // Draw title
        this.ctx.font = `700 ${this.config.labelFontSize + 6}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = this.config.labelColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Relational Tension Lines', this.canvas.width / 2, 40);

        // Store all points for hover detection
        const points = [];

        // Draw all themes
        this.themes.forEach((theme, index) => {
            this.drawTensionLine(theme, index);
            this.drawDistanceHighlight(theme, index);

            const y = this.getThemeY(index);

            // Check if points are hovered
            const isAHovered = this.hoveredPoint &&
                              this.hoveredPoint.themeIndex === index &&
                              this.hoveredPoint.partner === 'A';
            const isBHovered = this.hoveredPoint &&
                              this.hoveredPoint.themeIndex === index &&
                              this.hoveredPoint.partner === 'B';

            // Draw markers
            const pointA = this.drawMarker(
                theme.partnerA,
                y,
                this.config.partnerAColor,
                'Partner A',
                isAHovered
            );
            const pointB = this.drawMarker(
                theme.partnerB,
                y,
                this.config.partnerBColor,
                'Partner B',
                isBHovered
            );

            points.push(pointA, pointB);
        });

        return points;
    }
}

// Initialize the diagram
const canvas = document.getElementById('tensionCanvas');
if (!canvas) {
    console.error('Canvas element not found!');
    throw new Error('tensionCanvas element not found');
}

console.log('Canvas found, initializing diagram...');
const diagram = new RelationalTensionDiagram('tensionCanvas');

// Make canvas responsive with high DPI support
function resizeCanvas() {
    const container = document.getElementById('tensionContainer');
    if (!container) {
        console.error('Container element not found!');
        return;
    }
    const containerWidth = container.offsetWidth - 80;
    const isMobile = window.innerWidth <= 768;
    
    console.log('Resizing canvas... containerWidth:', containerWidth, 'isMobile:', isMobile);

    // Get device pixel ratio for retina displays
    const dpr = window.devicePixelRatio || 1;

    let width, height;

    if (isMobile) {
        width = Math.min(containerWidth, 400);
        diagram.config.fontSize = 12;
        diagram.config.labelFontSize = 14;
        diagram.config.lineSpacing = 100;
        diagram.config.padding = 60;
    } else {
        width = 800;
        diagram.config.fontSize = 16;
        diagram.config.labelFontSize = 18;
        diagram.config.lineSpacing = 120;
        diagram.config.padding = 80;
    }

    // Calculate height based on number of themes
    height = 100 + (diagram.themes.length * diagram.config.lineSpacing) + 40;

    // Set display size (CSS pixels)
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Set actual size in memory (scaled for retina)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Scale the context to match device pixel ratio
    diagram.ctx.scale(dpr, dpr);
    
    console.log('Canvas dimensions set - width:', width, 'height:', height, 'actual:', canvas.width, 'x', canvas.height);
}

// Initial resize and render
console.log('Calling initial resizeCanvas...');
resizeCanvas();
console.log('Calling initial render...');
let tensionPoints = diagram.render();
console.log('Diagram rendered, points:', tensionPoints);

// Resize on window resize
window.addEventListener('resize', () => {
    resizeCanvas();
    tensionPoints = diagram.render();
});

// Mouse interaction
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const point = diagram.findPointAt(mouseX, mouseY);
    if (point) {
        isDragging = true;
        diagram.draggedPoint = point;
        canvas.style.cursor = 'grabbing';
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDragging && diagram.draggedPoint) {
        // Update position
        const newPosition = diagram.xToPosition(mouseX, diagram.draggedPoint.y);
        const clampedPosition = Math.max(-1, Math.min(1, newPosition));

        const theme = diagram.themes[diagram.draggedPoint.themeIndex];
        if (diagram.draggedPoint.partner === 'A') {
            theme.partnerA = clampedPosition;
        } else {
            theme.partnerB = clampedPosition;
        }

        tensionPoints = diagram.render();

        // Draw tooltip while dragging
        const point = diagram.findPointAt(mouseX, mouseY);
        if (point) {
            const color = point.partner === 'A' ? diagram.config.partnerAColor : diagram.config.partnerBColor;
            const label = point.partner === 'A' ? 'Partner A' : 'Partner B';
            diagram.drawTooltip({ color, label }, mouseX, mouseY);
        }
    } else {
        // Handle hover
        const point = diagram.findPointAt(mouseX, mouseY);

        if (point !== diagram.hoveredPoint) {
            diagram.hoveredPoint = point;
            tensionPoints = diagram.render();

            if (point) {
                canvas.style.cursor = 'grab';
                const color = point.partner === 'A' ? diagram.config.partnerAColor : diagram.config.partnerBColor;
                const label = point.partner === 'A' ? 'Partner A' : 'Partner B';
                diagram.drawTooltip({ color, label }, mouseX, mouseY);
            } else {
                canvas.style.cursor = 'default';
            }
        } else if (point) {
            // Update tooltip position
            tensionPoints = diagram.render();
            const color = point.partner === 'A' ? diagram.config.partnerAColor : diagram.config.partnerBColor;
            const label = point.partner === 'A' ? 'Partner A' : 'Partner B';
            diagram.drawTooltip({ color, label }, mouseX, mouseY);
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    diagram.draggedPoint = null;
    canvas.style.cursor = diagram.hoveredPoint ? 'grab' : 'default';
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
    diagram.draggedPoint = null;
    diagram.hoveredPoint = null;
    canvas.style.cursor = 'default';
    tensionPoints = diagram.render();
});

// Touch support for mobile
let touchStartPoint = null;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    const point = diagram.findPointAt(touchX, touchY);
    if (point) {
        isDragging = true;
        diagram.draggedPoint = point;
        touchStartPoint = point;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDragging && diagram.draggedPoint) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const touchX = touch.clientX - rect.left;

        const newPosition = diagram.xToPosition(touchX, diagram.draggedPoint.y);
        const clampedPosition = Math.max(-1, Math.min(1, newPosition));

        const theme = diagram.themes[diagram.draggedPoint.themeIndex];
        if (diagram.draggedPoint.partner === 'A') {
            theme.partnerA = clampedPosition;
        } else {
            theme.partnerB = clampedPosition;
        }

        tensionPoints = diagram.render();
    }
});

canvas.addEventListener('touchend', () => {
    isDragging = false;
    diagram.draggedPoint = null;
    touchStartPoint = null;
    tensionPoints = diagram.render();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RelationalTensionDiagram;
}

})(); // End of IIFE
