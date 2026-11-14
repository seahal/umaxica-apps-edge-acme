import { expect, test } from '@playwright/test';

for (const scheme of ['light', 'dark'] as const) {
  for (const forcedTheme of [undefined, 'light', 'dark'] as const) {
    test(`body contrast: OS ${scheme}, theme ${forcedTheme ?? 'system'}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/about');
      await page.evaluate((theme) => {
        if (theme) document.documentElement.dataset['theme'] = theme;
        else delete document.documentElement.dataset['theme'];
      }, forcedTheme);
      const contrast = await page.locator('body').evaluate((body) => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas unavailable');
        const luminance = (color: string) => {
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const pixels = context.getImageData(0, 0, 1, 1).data;
          const [red, green, blue] = pixels;
          if (red === undefined || green === undefined || blue === undefined) {
            throw new Error('Missing pixel channels');
          }
          const channels = [red, green, blue].map((value) => {
            const s = value / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          const [r = 0, g = 0, b = 0] = channels;
          return r * 0.2126 + g * 0.7152 + b * 0.0722;
        };
        const style = getComputedStyle(body);
        const foreground = luminance(style.color);
        const background = luminance(style.backgroundColor);
        return (
          (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
        );
      });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    });
  }
}
