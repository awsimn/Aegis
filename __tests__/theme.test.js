

const { theme, lightTheme } = require('../src/styles/theme');

describe('Theme Configuration', () => {
  
  describe('Color System', () => {
    test('should export a theme object', () => {
      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });

    test('should have primary colors', () => {
      expect(theme.colors.primary).toBeDefined();
      expect(theme.colors.primaryLight).toBeDefined();
      expect(theme.colors.primaryDark).toBeDefined();
    });

    test('should have semantic colors', () => {
      expect(theme.colors.danger).toBeDefined();
      expect(theme.colors.success).toBeDefined();
      expect(theme.colors.warning).toBeDefined();
      expect(theme.colors.emergency).toBeDefined();
    });

    test('should have light variants for semantic colors', () => {
      expect(theme.colors.dangerLight).toBeDefined();
      expect(theme.colors.successLight).toBeDefined();
      expect(theme.colors.warningLight).toBeDefined();
      expect(theme.colors.emergencyLight).toBeDefined();
    });

    test('should have surface and background colors', () => {
      expect(theme.colors.background).toBeDefined();
      expect(theme.colors.surface).toBeDefined();
      expect(theme.colors.surfaceHighlight).toBeDefined();
    });

    test('should have text color hierarchy', () => {
      expect(theme.colors.text.primary).toBeDefined();
      expect(theme.colors.text.secondary).toBeDefined();
      expect(theme.colors.text.muted).toBeDefined();
      expect(theme.colors.text.inverse).toBeDefined();
    });

    test('should have border colors', () => {
      expect(theme.colors.border).toBeDefined();
      expect(theme.colors.borderLight).toBeDefined();
    });

    test('all color values should be valid hex strings', () => {
      const hexRegex = /^#[0-9A-Fa-f]{3,8}$/;
      const flatColors = [
        theme.colors.primary,
        theme.colors.primaryLight,
        theme.colors.primaryDark,
        theme.colors.danger,
        theme.colors.success,
        theme.colors.warning,
        theme.colors.emergency,
        theme.colors.background,
        theme.colors.surface,
        theme.colors.border,
        theme.colors.text.primary,
        theme.colors.text.secondary,
        theme.colors.text.muted,
        theme.colors.text.inverse,
      ];
      flatColors.forEach((color) => {
        expect(hexRegex.test(color)).toBe(true);
      });
    });
  });

  
  describe('Typography', () => {
    test('should have typography styles', () => {
      expect(theme.typography).toBeDefined();
      expect(theme.typography.header).toBeDefined();
      expect(theme.typography.subHeader).toBeDefined();
      expect(theme.typography.body).toBeDefined();
      expect(theme.typography.caption).toBeDefined();
      expect(theme.typography.button).toBeDefined();
    });

    test('header should have correct properties', () => {
      expect(theme.typography.header.fontSize).toBeGreaterThanOrEqual(20);
      expect(theme.typography.header.fontWeight).toBeDefined();
    });

    test('body should have lineHeight', () => {
      expect(theme.typography.body.lineHeight).toBeGreaterThan(0);
    });

    test('font sizes should be in descending order', () => {
      expect(theme.typography.header.fontSize).toBeGreaterThan(
        theme.typography.subHeader.fontSize
      );
      expect(theme.typography.subHeader.fontSize).toBeGreaterThan(
        theme.typography.body.fontSize
      );
      expect(theme.typography.body.fontSize).toBeGreaterThan(
        theme.typography.caption.fontSize
      );
    });
  });

  
  describe('Spacing', () => {
    test('should have spacing scale', () => {
      expect(theme.spacing).toBeDefined();
      expect(theme.spacing.xs).toBeDefined();
      expect(theme.spacing.sm).toBeDefined();
      expect(theme.spacing.md).toBeDefined();
      expect(theme.spacing.lg).toBeDefined();
      expect(theme.spacing.xl).toBeDefined();
    });

    test('spacing values should be in ascending order', () => {
      expect(theme.spacing.xs).toBeLessThan(theme.spacing.sm);
      expect(theme.spacing.sm).toBeLessThan(theme.spacing.md);
      expect(theme.spacing.md).toBeLessThan(theme.spacing.lg);
      expect(theme.spacing.lg).toBeLessThan(theme.spacing.xl);
    });
  });

  
  describe('Border Radius', () => {
    test('should have border radius scale', () => {
      expect(theme.borderRadius).toBeDefined();
      expect(theme.borderRadius.sm).toBeDefined();
      expect(theme.borderRadius.md).toBeDefined();
      expect(theme.borderRadius.lg).toBeDefined();
      expect(theme.borderRadius.full).toBeDefined();
    });

    test('border radius full should be very large', () => {
      expect(theme.borderRadius.full).toBeGreaterThan(100);
    });
  });

  
  describe('Shadows', () => {
    test('should have shadow presets', () => {
      expect(theme.shadows).toBeDefined();
      expect(theme.shadows.none).toBeDefined();
      expect(theme.shadows.soft).toBeDefined();
      expect(theme.shadows.medium).toBeDefined();
    });

    test('shadow presets should have required RN properties', () => {
      ['none', 'soft', 'medium'].forEach((level) => {
        expect(theme.shadows[level]).toHaveProperty('shadowColor');
        expect(theme.shadows[level]).toHaveProperty('shadowOffset');
        expect(theme.shadows[level]).toHaveProperty('shadowOpacity');
        expect(theme.shadows[level]).toHaveProperty('shadowRadius');
        expect(theme.shadows[level]).toHaveProperty('elevation');
      });
    });

    test('none shadow should have zero opacity', () => {
      expect(theme.shadows.none.shadowOpacity).toBe(0);
    });
  });

  
  describe('Exports', () => {
    test('lightTheme should be the same as theme', () => {
      expect(lightTheme).toBe(theme);
    });
  });
});
