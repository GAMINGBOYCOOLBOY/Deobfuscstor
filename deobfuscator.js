function deobfuscateCode() {
    const obfuscatedCode = document.getElementById('obfuscatedCode').value;
    try {
        const deobfuscatedCode = deobfuscate(obfuscatedCode);
        document.getElementById('deobfuscatedCode').value = deobfuscatedCode;
    } catch (error) {
        alert('An error occurred during deobfuscation: ' + error.message);
    }
}

function deobfuscate(code) {
    let deobfuscated = code;
    deobfuscated = removeWrappers(deobfuscated);
    deobfuscated = decodeHexUnicodeBase64(deobfuscated);
    deobfuscated = inlineFunctions(deobfuscated);
    deobfuscated = replaceDynamicNames(deobfuscated);
    deobfuscated = cleanUpCode(deobfuscated);
    return deobfuscated;
}

function removeWrappers(code) {
    return code.replace(/eval\(([^)]+)\)/g, (_, p1) => p1)
                .replace(/Function\(['"][^'"]*['"],\s*['"][^'"]*['"]\)/g, '');
}

function decodeHexUnicodeBase64(code) {
    code = code.replace(/\\x([0-9A-Fa-f]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    code = code.replace(/\\u([0-9A-Fa-f]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    code = code.replace(/atob\(['"]([^'"]*)['"]\)/g, (_, p1) => {
        try {
            return atob(p1);
        } catch {
            return p1;
        }
    });
    return code;
}

function inlineFunctions(code) {
    return code.replace(/function\s+\w+\s*\(\)\s*{return\s+([^;]+);}/g, (_, p1) => p1);
}

function replaceDynamicNames(code) {
    return code.replace(/_\w+/g, (match) => `var_${match.slice(1)}`);
}

function cleanUpCode(code) {
    return code.replace(/;{2,}/g, ';').trim();
}
