# Rust Panic Highlighter

The **Rust Panic Highlighter** extension for Visual Studio Code highlights lines of code containing common panic triggers in Rust, such as `panic!()`, `unwrap()`, and `expect()`. It provides visual warnings directly in the editor to help developers identify potentially dangerous code that could cause runtime panics.

## Features

- **Highlight Panic Triggers**: Highlights occurrences of `panic!()`, `unwrap()`, and `expect()` in Rust code.
- **Customizable Icon**: You can choose a custom icon to be displayed next to the panic triggers, with adjustable size and positioning.

<!-- ![Rust Panic Highlighter](images/panic-highlighter.png) *(replace with actual image path)* -->

> Tip: This extension allows for easy identification of potentially unsafe code in Rust, helping developers avoid runtime errors caused by panics.

## Requirements

- **Visual Studio Code**: This extension works with Visual Studio Code, version 1.95 or higher.
- **Rust Development Environment**: You need to have a Rust development environment set up (e.g., `rustup`, `cargo`).

## Extension Settings

This extension adds several configurable settings to control its behavior:

* **`rustPanicHighlighter.icon.enabled`**: Enable/disable the panic icon feature. Default is `true`.
* **`rustPanicHighlighter.icon.path`**: Path to the icon file to use for panic triggers. Defaults to a built-in `panic-icon.gif`.
* **`rustPanicHighlighter.icon.width`**: Width of the panic icon in pixels. Defaults to `64`.
* **`rustPanicHighlighter.icon.height`**: Height of the panic icon in pixels. Defaults to `64`.
* **`rustPanicHighlighter.icon.adjustTopPosition`**: Adjust the vertical positioning of the panic icon. Default is `0`.

For example, you can add these settings to your `settings.json`:

```json
"rustPanicHighlighter.icon.enabled": true,
"rustPanicHighlighter.icon.path": "resources/my-icon.gif",
"rustPanicHighlighter.icon.width": 64,
"rustPanicHighlighter.icon.height": 64,
"rustPanicHighlighter.icon.adjustTopPosition": 0
```

## Known Issues

- The extension currently only works with Rust files.
- Icons may not display correctly if the specified image file is not in a supported format (`.gif`, `.png`, `.jpg`, `.jpeg`, `.svg`).
- If the icon file has any issues (e.g., file not found or invalid format), the default icon will be used.

## Release Notes

### 1.0.0

- Initial release of **Rust Panic Highlighter**.
- Features include highlighting of panic triggers (`panic!()`, `unwrap()`, `expect()`) with a customizable icon.
- Configurable settings for icon path, size, and position.

### 1.0.1

- Fixed an issue with SVG icon handling.

### 1.1.0

- Added configuration options for line height adjustment.