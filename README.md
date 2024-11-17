# Rust Panic Highlighter

The **Rust Panic Highlighter** extension for Visual Studio Code highlights lines of code containing common panic triggers in Rust, such as `panic!()`, `unwrap()`, and `expect()`. It provides visual warnings directly in the editor to help developers identify potentially dangerous code that could cause runtime panics.

## Features

- **Highlight Panic Triggers**: Highlights occurrences of `panic!()`, `unwrap()`, and `expect()` in Rust code.
- **Customizable Icon**: You can choose a custom icon to be displayed next to the panic triggers, with adjustable size and positioning.

> Tip: This extension allows for easy identification of potentially unsafe code in Rust, helping developers avoid runtime errors caused by panics.

## Requirements

- **Visual Studio Code**: This extension works with Visual Studio Code, version 1.95 or higher.
- **Rust Development Environment**: You need to have a Rust development environment set up (e.g., `rustup`, `cargo`).

## Extension Settings

This extension adds several configurable settings to control its behavior:

* **`rustPanicHighlighter.diagnostic.severity`**: Set the severity level for Rust panic diagnostics. Options are: `Error`, `Warning`, `Information`, and `Hint`. Default is `Warning`.

* **`rustPanicHighlighter.icon.enabled`**: Enable or disable the icon display at the end of the line. Default is `true`.

* **`rustPanicHighlighter.icon.path`**: Specify the path to the icon to display at the end of the line. It is recommended to use an SVG file. Use `'default'` to load the extension's default icon. Default is `'default'`.

* **`rustPanicHighlighter.icon.width`**: Specify the width of the icon in pixels. This setting is only applicable to SVG files. Ensure that the SVG does not have a default width set, as it may override the configured size. Default is `64`.

* **`rustPanicHighlighter.icon.height`**: Specify the height of the icon in pixels. This setting is only applicable to SVG files. Ensure that the SVG does not have a default height set, as it may override the configured size. Default is `64`.

* **`rustPanicHighlighter.icon.adjustTopPosition`**: Adjust the top position of the icon in pixels. Use a positive or negative number to fine-tune the vertical alignment. This setting compensates for potential alignment issues caused by differences in editor configurations (such as font size, line height, etc.). Depending on the user's setup, icons might appear slightly misaligned, and this option allows you to manually adjust their vertical position to achieve the best visual result. Default is `0`.

## Known Issues

- The extension currently only works with Rust files.
- Icons may not display correctly if the specified image file is not in a supported format (`.gif`, `.png`, `.jpg`, `.jpeg`, `.svg`).
- If the icon file has any issues (e.g., file not found or invalid format), the default icon will be used.
- **Icons alignment issues:** Depending on your editor settings (e.g., font size, line height), the icon's vertical alignment might not appear as expected. To address this, the `adjustTopPosition` parameter has been added, allowing you to fine-tune the icon's vertical position manually for better alignment.

## Release Notes

### 1.0.0

- Initial release of **Rust Panic Highlighter**.
- Features include highlighting of panic triggers (`panic!()`, `unwrap()`, `expect()`) with a customizable icon.
- Configurable settings for icon path, size, and position.