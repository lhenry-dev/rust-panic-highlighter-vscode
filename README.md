# Rust Panic Highlighter

The **Rust Panic Highlighter** extension for Visual Studio Code highlights lines of code containing common panic triggers in Rust, such as `panic!()`, `unwrap()`, and `expect()`. It provides visual warnings directly in the editor to help developers identify potentially dangerous code that could cause runtime panics.

## Features

- **Highlight Panic Triggers**: Highlights occurrences of `panic!()`, `unwrap()`, `expect()`, and other common panic triggers in Rust code.
- **Diagnostic Severity Levels**: Control the severity level for Rust panic diagnostics, with options ranging from `Error` to `Hint`.
- **Ignore Test Blocks**: Optionally ignore panic diagnostics in test blocks for cleaner testing workflows.
- **Ignore Specific Panics**: Customize which panic types to ignore in diagnostics (e.g., `unwrap()`, `expect()`, etc.).

- **Customizable Icon**: You can choose a custom icon to be displayed next to the panic triggers, with adjustable size and positioning.
- **Directory Support for Icons**: Use a directory of images for random icon selection.
- **Minimum Icon Position**: Ensure icons are aligned at least 100 characters from the start of the line, or position them immediately after the content.

> Tip: This extension allows for easy identification of potentially unsafe code in Rust, helping developers avoid runtime errors caused by panics.

## Requirements

- **Visual Studio Code**: This extension works with Visual Studio Code, version 1.95 or higher.
- **Rust Development Environment**: You need to have a Rust development environment set up (e.g., `rustup`, `cargo`).

## Extension Settings

This extension adds several configurable settings to control its behavior:

* **`rustPanicHighlighter.diagnostic.severity`**:  
  Set the severity level for Rust panic diagnostics.  
  - Options: `Error`, `Warning`, `Information`, `Hint`  
  - Default: `Warning`  

* **`rustPanicHighlighter.diagnostic.ignoreInTestBlock`**:  
  Ignore Rust panic diagnostics within test blocks to reduce unnecessary noise.  
  - Default: `true`  

* **`rustPanicHighlighter.diagnostic.ignoredPanics`**:  
  List of panic types to ignore for diagnostics. Leave empty to enable all.  
  - Supported panic types: `panic`, `unwrap`, `unwrap_unchecked`, `unwrap_err`, `unwrap_err_unchecked`, `expect`, `todo`, `unimplemented`, `assert`, `assert_eq`, `assert_ne`  
  - Default: `[]`  

### Icon Settings

* **`rustPanicHighlighter.icon.enabled`**:  
  Enable or disable the display of icons next to panic triggers.  
  - Default: `true`  

* **`rustPanicHighlighter.icon.path`**:  
  Specify the path to the icon to display at the end of the line.  
  - Supports file formats: `.gif`, `.png`, `.jpg`, `.jpeg`, `.svg`  
  - Directory support: Provide a directory path ending with `/` to randomly choose an image from the directory.  
  - Use `'default'` to load the extension's default icon.  
  - Default: `'default'`  

* **`rustPanicHighlighter.icon.minXPositionEnabled`**:  
  Enable a minimum X position for the icon.  
  - When enabled (`true`), the icon will be placed at least 100 characters from the start of the line.  
  - Default: `true`  

* **`rustPanicHighlighter.icon.size`**:  
  Specify the size of the icon in pixels.  
  - Defines both width and height, ensuring a square bounding box.  
  - Non-square images preserve their aspect ratio within the bounding box.  
  - Default: `64`  

* **`rustPanicHighlighter.icon.adjustTopPosition`**:  
  Adjust the vertical position of the icon in pixels.  
  - Use positive or negative values for fine-tuning.  
  - Default: `0`

## Known Issues

- **Icons alignment issues:** Depending on your editor settings (e.g., font size, line height), the icon's vertical alignment might not appear as expected. To address this, the `adjustTopPosition` parameter has been added, allowing you to fine-tune the icon's vertical position manually for better alignment.

## Release Notes

### 1.1.0

- Added the option to ignore panics in test blocks, improving workflows for Rust testing.  
- Introduced support for directory-based random icon selection, enabling more dynamic customization.  
- Added a **minimum X position** for icons, ensuring alignment at least 100 characters from the start of the line.  

### 1.0.0

- Initial release of **Rust Panic Highlighter**.
- Features include highlighting of panic triggers (`panic!()`, `unwrap()`, `expect()`) with a customizable icon.
- Configurable settings for icon path, size, and position.