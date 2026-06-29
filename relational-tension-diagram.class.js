/**
 * Relational Tension Line Diagram — class-only module
 * Extracted from relational-tension-diagram.js for use in results page.
 * Demo scaffolding (IIFE init + event listeners) is in relational-tension-diagram.js (untouched).
 *
 * Constructor accepts either a canvas ID string or a canvas element directly,
 * so it can be used with off-screen canvases (e.g. for high-res PDF export).
 *
 * Pass logicalWidth / logicalHeight in options to decouple CSS-pixel drawing
 * coordinates from the physical canvas dimensions (needed when the canvas is
 * scaled up for print quality while keeping layout values in CSS px).
 *
 * Additional scaling config for high-res export:
 *   themeStartY        — y position of the first theme line (default 130)
 *   lineLabelOffset    — px above line for theme name label (default 35)
 *   extremeLabelOffset — px below line for left/right extreme labels (default 25)
 *   endpointDotRadius  — radius of line endpoint dots (default 4)
 *   distanceBandHalf   — half-height of the distance highlight band (default 8)
 *   distanceBracketY   — px above line for the dashed bracket line (default 15)
 */

class RelationalTensionDiagram {
    constructor(canvasId, options) {
        options = options || {};
        this.canvas = typeof canvasId === 'string'
            ? document.getElementById(canvasId)
            : canvasId;
        this.ctx = this.canvas.getContext('2d');

        // Logical (CSS-pixel) dimensions — default to physical canvas size.
        this._lw = options.logicalWidth  !== undefined ? options.logicalWidth  : this.canvas.width;
        this._lh = options.logicalHeight !== undefined ? options.logicalHeight : this.canvas.height;

        this.config = {
            lineColor:              options.lineColor              || '#8b7d6f',
            labelColor:             options.labelColor             || '#5a5348',
            subLabelColor:          options.subLabelColor          || '#9b8f82',
            partnerAColor:          options.partnerAColor          || '#c77f5a',
            partnerBColor:          options.partnerBColor          || '#8b7d6f',
            lineWidth:              options.lineWidth              || 3,
            fontSize:               options.fontSize               || 16,
            labelFontSize:          options.labelFontSize          || 18,
            pointRadius:            options.pointRadius            || 10,
            padding:                options.padding                || 80,
            lineSpacing:            options.lineSpacing            || 120,
            distanceHighlightColor: options.distanceHighlightColor || '#a8937e',
            singleMode:             options.singleMode             || false,
            markerALabel:           options.markerALabel           || 'Partner A',
            showTitle:              options.showTitle !== false,
            // Scalable offset values for high-res export
            themeStartY:            options.themeStartY            !== undefined ? options.themeStartY        : 130,
            lineLabelOffset:        options.lineLabelOffset        !== undefined ? options.lineLabelOffset    : 35,
            extremeLabelOffset:     options.extremeLabelOffset     !== undefined ? options.extremeLabelOffset : 25,
            endpointDotRadius:      options.endpointDotRadius      !== undefined ? options.endpointDotRadius  : 4,
            distanceBandHalf:       options.distanceBandHalf       !== undefined ? options.distanceBandHalf   : 8,
            distanceBracketY:       options.distanceBracketY       !== undefined ? options.distanceBracketY   : 15
        };

        this.themes = options.themes || [
            { name: 'Communication',      leftExtreme: 'Direct',       rightExtreme: 'Indirect',  partnerA: 0.3,  partnerB: -0.6 },
            { name: 'Family Involvement', leftExtreme: 'Independent',  rightExtreme: 'Enmeshed',  partnerA: -0.4, partnerB: 0.5  },
            { name: 'Time Together',      leftExtreme: 'Separate',     rightExtreme: 'Merged',    partnerA: 0.2,  partnerB: 0.7  },
            { name: 'Conflict Style',     leftExtreme: 'Confronting',  rightExtreme: 'Avoiding',  partnerA: -0.5, partnerB: 0.3  },
            { name: 'Decision Making',    leftExtreme: 'Individual',   rightExtreme: 'Shared',    partnerA: 0.1,  partnerB: -0.2 }
        ];

        this.draggedPoint = null;
        this.hoveredPoint = null;
    }

    positionToX(position) {
        var lineWidth = this._lw - (2 * this.config.padding);
        return this.config.padding + (position + 1) * lineWidth / 2;
    }

    xToPosition(x) {
        var lineWidth = this._lw - (2 * this.config.padding);
        return ((x - this.config.padding) / lineWidth) * 2 - 1;
    }

    getThemeY(themeIndex) {
        return this.config.themeStartY + themeIndex * this.config.lineSpacing;
    }

    drawTensionLine(theme, themeIndex) {
        var padding      = this.config.padding;
        var lineColor    = this.config.lineColor;
        var lineWidth    = this.config.lineWidth;
        var labelColor   = this.config.labelColor;
        var subLabel     = this.config.subLabelColor;
        var labelFontSz  = this.config.labelFontSize;
        var fontSize     = this.config.fontSize;
        var y            = this.getThemeY(themeIndex);
        var startX       = padding;
        var endX         = this._lw - padding;

        this.ctx.font = '600 ' + labelFontSz + "px 'Segoe UI', sans-serif";
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(theme.name, this._lw / 2, y - this.config.lineLabelOffset);

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

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;

        this.ctx.font = '400 ' + fontSize + "px 'Segoe UI', sans-serif";
        this.ctx.fillStyle = subLabel;

        this.ctx.textAlign = 'left';
        this.ctx.fillText(theme.leftExtreme, startX, y + this.config.extremeLabelOffset);

        this.ctx.textAlign = 'right';
        this.ctx.fillText(theme.rightExtreme, endX, y + this.config.extremeLabelOffset);

        var dotR = this.config.endpointDotRadius;
        this.ctx.fillStyle = lineColor;
        this.ctx.beginPath();
        this.ctx.arc(startX, y, dotR, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(endX, y, dotR, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawDistanceHighlight(theme, themeIndex) {
        var y  = this.getThemeY(themeIndex);
        var x1 = this.positionToX(theme.partnerA);
        var x2 = this.positionToX(theme.partnerB);
        var minX = Math.min(x1, x2);
        var maxX = Math.max(x1, x2);
        var distance = Math.abs(maxX - minX);

        if (distance > 5) {
            var bh = this.config.distanceBandHalf;
            this.ctx.fillStyle = 'rgba(168, 147, 126, 0.15)';
            this.ctx.fillRect(minX, y - bh, distance, bh * 2);

            var bracketY = this.config.distanceBracketY;
            this.ctx.strokeStyle = this.config.distanceHighlightColor;
            this.ctx.lineWidth = 1.5;
            this.ctx.setLineDash([4, 4]);
            this.ctx.beginPath();
            this.ctx.moveTo(minX, y - bracketY);
            this.ctx.lineTo(maxX, y - bracketY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawMarker(position, y, color, label, isHovered) {
        isHovered = isHovered || false;
        var x      = this.positionToX(position);
        var radius = this.config.pointRadius;

        var gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color + (isHovered ? '60' : '40'));
        gradient.addColorStop(1, color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.3)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, isHovered ? radius * 1.1 : radius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        return { x: x, y: y, label: label, color: color };
    }

    findPointAt(x, y) {
        var hitRadius = 15;

        for (var i = 0; i < this.themes.length; i++) {
            var theme = this.themes[i];
            var lineY = this.getThemeY(i);
            var aX = this.positionToX(theme.partnerA);

            var distA = Math.sqrt(Math.pow(x - aX, 2) + Math.pow(y - lineY, 2));
            if (distA < hitRadius) {
                return { themeIndex: i, partner: 'A', x: aX, y: lineY };
            }

            if (!this.config.singleMode) {
                var bX = this.positionToX(theme.partnerB);
                var distB = Math.sqrt(Math.pow(x - bX, 2) + Math.pow(y - lineY, 2));
                if (distB < hitRadius) {
                    return { themeIndex: i, partner: 'B', x: bX, y: lineY };
                }
            }
        }

        return null;
    }

    clear() {
        this.ctx.clearRect(0, 0, this._lw, this._lh);
    }

    render() {
        this.clear();

        if (this.config.showTitle) {
            this.ctx.font = '700 ' + (this.config.labelFontSize + 6) + "px 'Segoe UI', sans-serif";
            this.ctx.fillStyle = this.config.labelColor;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Relational Tension Lines', this._lw / 2, 40);
        }

        var points = [];
        var self   = this;

        this.themes.forEach(function (theme, index) {
            self.drawTensionLine(theme, index);

            if (!self.config.singleMode) {
                self.drawDistanceHighlight(theme, index);
            }

            var y = self.getThemeY(index);

            var isAHovered = self.hoveredPoint &&
                             self.hoveredPoint.themeIndex === index &&
                             self.hoveredPoint.partner === 'A';
            var isBHovered = self.hoveredPoint &&
                             self.hoveredPoint.themeIndex === index &&
                             self.hoveredPoint.partner === 'B';

            var pointA = self.drawMarker(theme.partnerA, y, self.config.partnerAColor, self.config.markerALabel, isAHovered);

            if (!self.config.singleMode) {
                var pointB = self.drawMarker(theme.partnerB, y, self.config.partnerBColor, 'Partner B', isBHovered);
                points.push(pointA, pointB);
            } else {
                points.push(pointA);
            }
        });

        return points;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RelationalTensionDiagram;
}
