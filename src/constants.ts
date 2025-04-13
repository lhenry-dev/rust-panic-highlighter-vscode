export const tmpFileName = 'rustPanicHighlighter_icon_tmp';
export const defaultIconPath = 'resources/panic-icon.gif';
export const defaultIconSize = 64;
export const defaultAdjustTopPosition = 0;

export const maxLengthLine = 105;
export const MinXPositionIconValue = 115;

export const supportedFormats = ['.gif', '.png', '.jpg', '.jpeg', '.svg'];

export const tmpFolderName = 'RustPanicHighlighter';

export enum PanicType {
    unwrap = "unwrap(",
    unwrap_unchecked = "unwrap_unchecked(",
    unwrap_err = "unwrap_err(",
    unwrap_err_unchecked = "unwrap_err_unchecked(",
    expect = "expect(\"",
    panic = "panic!(",
    todo = "todo!(",
    unimplemented = "unimplemented!(",
    assert = "assert!(",
    assert_eq = "assert_eq!(",
    assert_ne = "assert_ne!("
}

export const DiagnosticMessages: Record<PanicType, string> = {
    [PanicType.unwrap]: "This line contains an 'unwrap()', which will panic if the result is None or Err.",
    [PanicType.unwrap_unchecked]: "This line contains an 'unwrap_unchecked()', which can cause undefined behavior if the result is None or Err.",
    [PanicType.unwrap_err]: "This line contains an 'unwrap_err()', which will panic if the result is Ok.",
    [PanicType.unwrap_err_unchecked]: "This line contains an 'unwrap_err_unchecked()', which can cause undefined behavior if the result is Ok.",
    [PanicType.expect]: "This line contains an 'expect()', which will panic if the result is None or Err.",
    [PanicType.panic]: "This line contains a 'panic!' which can cause a runtime panic.",
    [PanicType.todo]: "This line contains a 'todo!' macro, which is a placeholder and will panic if executed.",
    [PanicType.unimplemented]: "This line contains an 'unimplemented!' macro, which will panic if executed.",
    [PanicType.assert]: "This line contains an 'assert!()', which will panic if the condition is false.",
    [PanicType.assert_eq]: "This line contains an 'assert_eq!()', which will panic if the two values are not equal.",
    [PanicType.assert_ne]: "This line contains an 'assert_ne!()', which will panic if the two values are equal."
};