import {ColorThemeKind, window} from 'vscode'

export const isDark = ()=>{
    return window.activeColorTheme.kind == ColorThemeKind.Dark
}

export const isLight = ()=>{
    return window.activeColorTheme.kind == ColorThemeKind.Light
}

export const isHighContrast = ()=>{
    return window.activeColorTheme.kind == ColorThemeKind.HighContrast
}