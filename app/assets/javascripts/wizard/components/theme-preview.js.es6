import { observes } from 'ember-addons/ember-computed-decorators';

import {
  createPreviewComponent,
  loadImage,
  darkLightDiff,
  chooseBrighter,
  drawHeader,
  LOREM
} from 'wizard/lib/preview';

export default createPreviewComponent(659, 320, {
  logo: null,
  avatar: null,

  @observes('step.fieldsById.theme_id.value')
  themeChanged() {
    this.triggerRepaint();
  },

  load() {
    return Ember.RSVP.Promise.all([loadImage('/images/wizard/discourse-small.png'),
                            loadImage('/images/wizard/trout.png')]).then(result => {
      this.logo = result[0];
      this.avatar = result[1];
    });
  },

  paint(ctx, colors, width, height) {
    const headerHeight = height * 0.15;

    drawHeader(ctx, colors, width, headerHeight);

    const margin = width * 0.02;
    const avatarSize = height * 0.1;
    const lineHeight = height / 19.0;

    // Logo
    const headerMargin = headerHeight * 0.2;
    const logoHeight = headerHeight - (headerMargin * 2);
    const logoWidth = (logoHeight / this.logo.height) * this.logo.width;
    ctx.drawImage(this.logo, headerMargin, headerMargin, logoWidth, logoHeight);

    // Top right menu
    ctx.drawImage(this.avatar, width - avatarSize - headerMargin, headerMargin, avatarSize, avatarSize);
    ctx.fillStyle = darkLightDiff(colors.primary, colors.secondary, 45, 55);

    const headerFontSize = headerHeight / 44;

    ctx.font = `${headerFontSize}em FontAwesome`;
    ctx.fillText("\uf0c9", width - (avatarSize * 2) - (headerMargin * 0.5), avatarSize);
    ctx.fillText("\uf002", width - (avatarSize * 3) - (headerMargin * 0.5), avatarSize);

    // Draw a fake topic
    ctx.drawImage(this.avatar, margin, headerHeight + (height * 0.17), avatarSize, avatarSize);

    ctx.beginPath();
    ctx.fillStyle = colors.primary;
    ctx.font = `bold ${headerFontSize}em 'Arial'`;
    ctx.fillText("Welcome to Discourse", margin, (height * 0.25));

    const bodyFontSize = height / 440.0;
    ctx.font = `${bodyFontSize}em 'Arial'`;

    let line = 0;
    const lines = LOREM.split("\n");
    for (let i=0; i<10; i++) {
      line = (height * 0.3) + (i * lineHeight);
      ctx.fillText(lines[i], margin + avatarSize + margin, line);
    }

    // Reply Button
    ctx.beginPath();
    ctx.rect(width * 0.57, line + lineHeight, width * 0.1, height * 0.07);
    ctx.fillStyle = colors.tertiary;
    ctx.fill();
    ctx.fillStyle = chooseBrighter(colors.primary, colors.secondary);
    ctx.font = `${bodyFontSize}em 'Arial'`;
    ctx.fillText("Reply", width * 0.595, line + (lineHeight * 1.85));

    // Icons
    ctx.font = `${bodyFontSize}em FontAwesome`;
    ctx.fillStyle = colors.love;
    ctx.fillText("\uf004", width * 0.48, line + (lineHeight * 1.8));
    ctx.fillStyle = darkLightDiff(colors.primary, colors.secondary, 65, 55);
    ctx.fillText("\uf040", width * 0.525, line + (lineHeight * 1.8));

    // Draw Timeline
    const timelineX = width * 0.8;
    ctx.beginPath();
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = 0.5;
    ctx.moveTo(timelineX, height * 0.3);
    ctx.lineTo(timelineX, height * 0.6);
    ctx.stroke();

    // Timeline
    ctx.beginPath();
    ctx.strokeStyle = colors.tertiary;
    ctx.lineWidth = 2;
    ctx.moveTo(timelineX, height * 0.3);
    ctx.lineTo(timelineX, height * 0.4);
    ctx.stroke();

    ctx.font = `Bold ${bodyFontSize}em Arial`;
    ctx.fillStyle = colors.primary;
    ctx.fillText("1 / 20", timelineX + margin, (height * 0.3) + (margin * 1.5));
  }
});
