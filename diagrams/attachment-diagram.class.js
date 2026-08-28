/**
 * Attachment Style Diagram — class-only module
 * Extracted from attachment-diagram.js for use in results page.
 * Demo scaffolding is in attachment-diagram.js (untouched).
 *
 * Constructor accepts either a canvas ID string or a canvas element directly,
 * so it can be used with off-screen canvases (e.g. for high-res PDF export).
 *
 * Pass logicalWidth / logicalHeight in options to decouple CSS-pixel drawing
 * coordinates from the physical canvas.width / canvas.height (needed when the
 * canvas is scaled up for print quality while keeping layout values in CSS px).
 */

class AttachmentDiagram {
    constructor(canvasId, options = {}) {
        this.canvas = typeof canvasId === 'string'
            ? document.getElementById(canvasId)
            : canvasId;
        this.ctx = this.canvas.getContext('2d');

        // Logical (CSS-pixel) dimensions — default to physical canvas size.
        // Set these explicitly when canvas.width/height differ from the
        // drawing coordinate space (e.g. after a DPR or PDF scale factor).
        this._lw = options.logicalWidth  !== undefined ? options.logicalWidth  : this.canvas.width;
        this._lh = options.logicalHeight !== undefined ? options.logicalHeight : this.canvas.height;

        this.config = {
            centerX:        options.centerX        || this._lw / 2,
            centerY:        options.centerY        || this._lh / 2,
            scale:          options.scale          || 200,
            lineWidth:      options.lineWidth      || 3.5,
            curveColor:     options.curveColor     || '#8b7d6f',
            labelColor:     options.labelColor     || '#5a5348',
            axisColor:      options.axisColor      || '#d4c9bd',
            highlightColor: options.highlightColor || '#a8937e',
            fontSize:       options.fontSize       || 16,
            labelFontSize:  options.labelFontSize  || 18,
            showLabels:     options.showLabels     !== false,
            showAxes:        options.showAxes        !== false,
            pointRadius:     options.pointRadius     || 10,
            showQuadrants:   options.showQuadrants   !== false,
            labelPixelScale: options.labelPixelScale !== undefined ? options.labelPixelScale : 1
        };

        this.dataPoint = null;
    }

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

    drawInfinityCurve() {
        const { centerX, centerY, scale, lineWidth, curveColor } = this.config;

        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.2)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.strokeStyle = curveColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();

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

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawAxes() {
        if (!this.config.showAxes) return;

        const { centerX, centerY, axisColor } = this.config;
        const padding = 40;

        this.ctx.strokeStyle = axisColor;
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([8, 6]);

        this.ctx.beginPath();
        this.ctx.moveTo(padding, centerY);
        this.ctx.lineTo(this._lw - padding, centerY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(centerX, padding);
        this.ctx.lineTo(centerX, this._lh - padding);
        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }

    drawLabels() {
        if (!this.config.showLabels) return;

        const { centerX, centerY, scale, labelFontSize, fontSize, labelColor, labelPixelScale: lps } = this.config;

        this.ctx.font = `600 ${labelFontSize}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = labelColor;
        this.ctx.textAlign = 'center';

        // maxStyleOffset drives how far left/right the horizontal labels are placed.
        // The 300px cap was designed for normal 1× canvases; scale it so hi-res
        // exports (where lps = PDF_SCALE) keep labels at the correct edges.
        const maxStyleOffset = Math.min(scale * 1.8, 300 * lps);

        this.ctx.fillText('Secure',   centerX, 60 * lps);
        this.ctx.fillText('Anxious',  Math.max(60 * lps, centerX - maxStyleOffset), centerY + 15 * lps);
        this.ctx.fillText('Avoidant', Math.min(this._lw - 60 * lps, centerX + maxStyleOffset), centerY + 15 * lps);
        this.ctx.fillText('Fearful',  centerX, this._lh - 60 * lps);

        this.ctx.font = `400 ${fontSize - 2}px 'Segoe UI', sans-serif`;
        this.ctx.fillStyle = '#9b8f82';
        this.ctx.textAlign = 'center';

        const anxiousX  = Math.max(60 * lps, centerX - maxStyleOffset);
        const avoidantX = Math.min(this._lw - 60 * lps, centerX + maxStyleOffset);

        this.ctx.fillText('Low Anxiety',    anxiousX,  centerY - 10 * lps);
        this.ctx.fillText('High Anxiety',   avoidantX, centerY - 10 * lps);
        this.ctx.fillText('Low Avoidance',  centerX, 35 * lps);
        this.ctx.fillText('High Avoidance', centerX, this._lh - 35 * lps);
    }

    plotPoint(anxiety, avoidance, color, label) {
        color = color || '#c77f5a';
        label = label || '';
        const { centerX, centerY, scale, pointRadius } = this.config;

        const x = centerX + anxiety * scale;
        const y = centerY + avoidance * scale;

        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, pointRadius * 2);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius * 2, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowColor = 'rgba(90, 83, 72, 0.3)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.dataPoint = { anxiety, avoidance, x, y };

        return { x, y, label, color };
    }

    clear() {
        this.ctx.clearRect(0, 0, this._lw, this._lh);
        this.dataPoint = null;
    }

    setScale(scale) {
        this.config.scale = scale;
    }

    render(dataPoint) {
        dataPoint = dataPoint || null;
        this.clear();
        this.drawQuadrants();
        this.drawAxes();
        this.drawInfinityCurve();
        this.drawLabels();

        if (dataPoint) {
            this.plotPoint(dataPoint.anxiety, dataPoint.avoidance, dataPoint.color, dataPoint.label);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AttachmentDiagram;
}
