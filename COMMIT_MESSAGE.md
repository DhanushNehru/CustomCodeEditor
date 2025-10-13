# Git Commit Message

```
feat: add basic editor options (line numbers, word wrap, font size)

- Add toggle controls for line numbers visibility
- Add toggle controls for word wrap functionality  
- Add font size slider with range 12px-20px
- Create professional editor settings panel in sidebar
- Implement responsive design with dark mode support
- Update Monaco Editor options configuration
- Add CSS styling for editor settings section

Closes #[issue-number]

Files changed:
- src/pages/EditorComponent.js
- src/components/css/EditorComponent.css

Features:
- Line numbers toggle (default: enabled)
- Word wrap toggle (default: disabled)
- Font size control (12px-20px range)
- Immediate visual feedback
- No breaking changes
- No new dependencies required
```

## Alternative Shorter Version:
```
feat: add editor settings panel with line numbers, word wrap, and font size controls

- Add toggle switches for line numbers and word wrap
- Add font size slider (12px-20px) with marked values
- Create organized settings panel in sidebar
- Update Monaco Editor configuration
- Include responsive design and dark mode support

Closes #[issue-number]
```

## Conventional Commit Format:
```
type(scope): description

feat(editor): add basic customization options

Add line numbers toggle, word wrap toggle, and font size slider
to Monaco Editor settings panel. Improves user experience and
accessibility with professional editor customization options.

- Add state management for editor settings
- Create UI controls in sidebar with Material-UI components
- Update Monaco Editor options configuration
- Add responsive CSS styling with dark mode support
- Ensure backward compatibility and no breaking changes

Closes #[issue-number]
```

