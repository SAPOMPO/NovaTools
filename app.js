const fallbackConfig = {
    "appName": "NovaTools",
    "version": "1.0.0",
    "jsonFormatter": {
        "defaultIndent": 2,
        "presets": [
            {
                "name": "Usuario Ejemplo",
                "content": "{\"id\": 101, \"nombre\": \"Elena Gomez\", \"activo\": true, \"roles\": [\"admin\", \"editor\"], \"meta\": {\"visitas\": 4500, \"pais\": \"ES\"}}"
            },
            {
                "name": "Configuracion API",
                "content": "{\"servidor\": \"api.omnitoool.io\", \"puerto\": 443, \"ssl\": true, \"timeout\": 30, \"endpoints\": {\"auth\": \"/v1/auth\", \"data\": \"/v1/data\"}}"
            }
        ]
    },
    "diffChecker": {
        "defaultOriginal": "function calcularSuma(a, b) {\n    return a + b;\n}",
        "defaultModified": "function calcularSumaTotal(a, b, c) {\n    return a + b + (c || 0);\n}"
    },
    "contrastChecker": {
        "defaultFg": "#ffffff",
        "defaultBg": "#0f172a"
    },
    "unitConverter": {
        "categories": {
            "longitud": {
                "name": "Longitud",
                "base": "metro",
                "units": {
                    "metro": 1,
                    "kilometro": 1000,
                    "centimetro": 0.01,
                    "milimetro": 0.001,
                    "pulgada": 0.0254,
                    "pie": 0.3048,
                    "milla": 1609.344
                }
            },
            "masa": {
                "name": "Masa",
                "base": "gramo",
                "units": {
                    "gramo": 1,
                    "kilogramo": 1000,
                    "miligramo": 0.001,
                    "libra": 453.59237,
                    "onza": 28.3495231
                }
            },
            "tiempo": {
                "name": "Tiempo",
                "base": "segundo",
                "units": {
                    "segundo": 1,
                    "minuto": 60,
                    "hora": 3600,
                    "dia": 86400
                }
            },
            "velocidad": {
                "name": "Velocidad",
                "base": "m_s",
                "units": {
                    "m_s": 1,
                    "km_h": 0.277778,
                    "mph": 0.44704,
                    "nudo": 0.514444
                }
            },
            "volumen": {
                "name": "Volumen",
                "base": "litro",
                "units": {
                    "litro": 1,
                    "mililitro": 0.001,
                    "metro_cubico": 1000,
                    "galon": 3.78541
                }
            },
            "almacenamiento": {
                "name": "Almacenamiento Digital",
                "base": "byte",
                "units": {
                    "byte": 1,
                    "kb": 1024,
                    "mb": 1048576,
                    "gb": 1073741824,
                    "tb": 1099511627776
                }
            }
        }
    },
    "regexTester": {
        "presets": [
            {
                "name": "Correo Electronico",
                "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                "flags": "gm",
                "test": "Contacto soporte@omnitoool.io o admin@test.com para ayuda.\nCorreo invalido: test@@domain.com"
            },
            {
                "name": "Numero Telefonico",
                "pattern": "^\\+?[0-9]{1,3}?[ -]?\\(?[0-9]{3}\\)?[ -]?[0-9]{3}[ -]?[0-9]{4}$",
                "flags": "gm",
                "test": "Llamar al +34 600 123 456 o (555) 123-4567.\nInvalido: 12345"
            },
            {
                "name": "URL Web",
                "pattern": "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
                "flags": "gi",
                "test": "Visita https://www.omnitoool.io o http://example.com/path?query=1 para mas info."
            }
        ]
    }
};

let appConfig = fallbackConfig;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("config.json");
        if (response.ok) {
            appConfig = await response.json();
        }
    } catch (e) {
        appConfig = fallbackConfig;
    }

    initializeApp();
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function initializeApp() {
    setupNavigation();
    setupThemeToggle();
    initJsonFormatter();
    initDiffChecker();
    initContrastChecker();
    initUnitConverter();
    initRegexTester();
}

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".tool-section");
    const titleElem = document.getElementById("current-tool-title");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const toolId = item.getAttribute("data-tool");
            navItems.forEach(nav => nav.classList.remove("active"));
            sections.forEach(sec => sec.classList.remove("active"));

            item.classList.add("active");
            const activeSection = document.getElementById(`tool-${toolId}`);
            if (activeSection) {
                activeSection.classList.add("active");
                titleElem.textContent = item.querySelector("span").textContent;
            }
        });
    });
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    let isDark = true;

    toggleBtn.addEventListener("click", () => {
        isDark = !isDark;
        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
        }
    });
}

function initJsonFormatter() {
    const input = document.getElementById("json-input");
    const output = document.getElementById("json-output");
    const statusBadge = document.getElementById("json-status");
    const stats = document.getElementById("json-input-stats");
    const formatBtn = document.getElementById("json-format-btn");
    const minifyBtn = document.getElementById("json-minify-btn");
    const copyBtn = document.getElementById("json-copy-btn");
    const clearBtn = document.getElementById("json-clear-btn");
    const indentSelect = document.getElementById("json-indent-select");
    const presetsContainer = document.getElementById("json-presets");

    if (appConfig.jsonFormatter && appConfig.jsonFormatter.presets) {
        appConfig.jsonFormatter.presets.forEach(preset => {
            const chip = document.createElement("button");
            chip.className = "preset-chip";
            chip.textContent = preset.name;
            chip.addEventListener("click", () => {
                input.value = preset.content;
                processJson(false);
            });
            presetsContainer.appendChild(chip);
        });
        if (appConfig.jsonFormatter.presets.length > 0) {
            input.value = appConfig.jsonFormatter.presets[0].content;
            processJson(false);
        }
    }

    input.addEventListener("input", () => processJson(false));
    formatBtn.addEventListener("click", () => processJson(true));
    minifyBtn.addEventListener("click", () => processJsonMinify());
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(output.textContent);
        showToast("JSON copiado al portapapeles");
    });
    clearBtn.addEventListener("click", () => {
        input.value = "";
        output.textContent = "";
        statusBadge.textContent = "Vacío";
        statusBadge.className = "status-badge";
        stats.textContent = "0 caracteres";
    });

    function processJson(forceFormat) {
        const val = input.value;
        stats.textContent = `${val.length} caracteres`;

        if (!val.trim()) {
            output.textContent = "";
            statusBadge.textContent = "Vacío";
            statusBadge.className = "status-badge";
            return;
        }

        try {
            const parsed = JSON.parse(val);
            statusBadge.textContent = "Válido";
            statusBadge.className = "status-badge success";

            const indentVal = indentSelect.value;
            const spaces = indentVal === "tab" ? "\t" : parseInt(indentVal, 10);

            if (forceFormat || input === document.activeElement === false) {
                output.textContent = JSON.stringify(parsed, null, spaces);
            } else {
                output.textContent = JSON.stringify(parsed, null, spaces);
            }
        } catch (e) {
            statusBadge.textContent = "Error de sintaxis";
            statusBadge.className = "status-badge error";
            output.textContent = e.message;
        }
    }

    function processJsonMinify() {
        const val = input.value;
        if (!val.trim()) return;
        try {
            const parsed = JSON.parse(val);
            output.textContent = JSON.stringify(parsed);
            statusBadge.textContent = "Compactado";
            statusBadge.className = "status-badge success";
        } catch (e) {
            statusBadge.textContent = "Error de sintaxis";
            statusBadge.className = "status-badge error";
            output.textContent = e.message;
        }
    }

    indentSelect.addEventListener("change", () => processJson(true));
}

function initDiffChecker() {
    const origInput = document.getElementById("diff-original");
    const modInput = document.getElementById("diff-modified");
    const compareBtn = document.getElementById("diff-compare-btn");
    const copyBtn = document.getElementById("diff-copy-btn");
    const clearBtn = document.getElementById("diff-clear-btn");
    const caseCheckbox = document.getElementById("diff-case-sensitive");
    const output = document.getElementById("diff-output");
    const statsAdded = document.querySelector("#diff-stats .badge.added");
    const statsRemoved = document.querySelector("#diff-stats .badge.removed");
    const statsModified = document.querySelector("#diff-stats .badge.modified");

    if (appConfig.diffChecker) {
        origInput.value = appConfig.diffChecker.defaultOriginal;
        modInput.value = appConfig.diffChecker.defaultModified;
    }

    compareBtn.addEventListener("click", performDiff);
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(output.textContent);
        showToast("Resultado copiado al portapapeles");
    });
    clearBtn.addEventListener("click", () => {
        origInput.value = "";
        modInput.value = "";
        output.innerHTML = "";
        statsAdded.textContent = "+0 líneas";
        statsRemoved.textContent = "-0 líneas";
        statsModified.textContent = "0 cambios";
    });

    function performDiff() {
        const origText = origInput.value;
        const modText = modInput.value;
        const caseSens = caseCheckbox.checked;

        const origLines = origText.split("\n");
        const modLines = modText.split("\n");

        output.innerHTML = "";
        let addedCount = 0;
        let removedCount = 0;
        let modifiedCount = 0;

        const maxLen = Math.max(origLines.length, modLines.length);
        for (let i = 0; i < maxLen; i++) {
            const oLine = origLines[i];
            const mLine = modLines[i];

            const lineDiv = document.createElement("div");
            lineDiv.className = "diff-line";

            if (oLine === undefined) {
                lineDiv.classList.add("added");
                lineDiv.textContent = `+ ${mLine}`;
                addedCount++;
                modifiedCount++;
            } else if (mLine === undefined) {
                lineDiv.classList.add("removed");
                lineDiv.textContent = `- ${oLine}`;
                removedCount++;
                modifiedCount++;
            } else {
                const compO = caseSens ? oLine : oLine.toLowerCase();
                const compM = caseSens ? mLine : mLine.toLowerCase();

                if (compO === compM) {
                    lineDiv.classList.add("normal");
                    lineDiv.textContent = `  ${mLine}`;
                } else {
                    lineDiv.classList.add("added");
                    lineDiv.textContent = `~ ${mLine}`;
                    modifiedCount++;
                }
            }
            output.appendChild(lineDiv);
        }

        statsAdded.textContent = `+${addedCount} líneas`;
        statsRemoved.textContent = `-${removedCount} líneas`;
        statsModified.textContent = `${modifiedCount} cambios`;
    }

    performDiff();
}

function initContrastChecker() {
    const fgPicker = document.getElementById("fg-color-picker");
    const fgText = document.getElementById("fg-color-text");
    const bgPicker = document.getElementById("bg-color-picker");
    const bgText = document.getElementById("bg-color-text");
    const swapBtn = document.getElementById("contrast-swap-btn");
    const fixBtn = document.getElementById("contrast-fix-btn");
    const previewCard = document.getElementById("contrast-preview-card");
    const ratioVal = document.getElementById("contrast-ratio-val");

    const aaNormal = document.getElementById("wcag-aa-normal");
    const aaaNormal = document.getElementById("wcag-aaa-normal");
    const aaLarge = document.getElementById("wcag-aa-large");
    const aaaLarge = document.getElementById("wcag-aaa-large");

    if (appConfig.contrastChecker) {
        fgPicker.value = appConfig.contrastChecker.defaultFg;
        fgText.value = appConfig.contrastChecker.defaultFg;
        bgPicker.value = appConfig.contrastChecker.defaultBg;
        bgText.value = appConfig.contrastChecker.defaultBg;
    }

    fgPicker.addEventListener("input", (e) => {
        fgText.value = e.target.value;
        updateContrast();
    });
    fgText.addEventListener("input", (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            fgPicker.value = e.target.value;
            updateContrast();
        }
    });

    bgPicker.addEventListener("input", (e) => {
        bgText.value = e.target.value;
        updateContrast();
    });
    bgText.addEventListener("input", (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            bgPicker.value = e.target.value;
            updateContrast();
        }
    });

    swapBtn.addEventListener("click", () => {
        const temp = fgPicker.value;
        fgPicker.value = bgPicker.value;
        fgText.value = bgPicker.value;
        bgPicker.value = temp;
        bgText.value = temp;
        updateContrast();
    });

    fixBtn.addEventListener("click", () => {
        let fg = parseHex(fgPicker.value);
        let bg = parseHex(bgPicker.value);
        let currentRatio = getContrastRatio(fg, bg);
        if (currentRatio >= 4.5) {
            showToast("El contraste actual ya es suficiente");
            return;
        }

        const step = getLuminance(fg) > getLuminance(bg) ? 0.05 : -0.05;
        for (let i = 0; i < 50; i++) {
            fg = adjustColor(fg, step);
            if (getContrastRatio(fg, bg) >= 4.5) break;
        }
        const newHex = rgbToHex(fg);
        fgPicker.value = newHex;
        fgText.value = newHex;
        updateContrast();
        showToast("Color ajustado automáticamente");
    });

    function parseHex(hex) {
        let clean = hex.replace("#", "");
        if (clean.length === 3) {
            clean = clean.split("").map(c => c + c).join("");
        }
        const num = parseInt(clean, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    function rgbToHex(rgb) {
        return "#" + rgb.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }

    function getLuminance(rgb) {
        const a = rgb.map(v => {
            let val = v / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrastRatio(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1);
        const lum2 = getLuminance(rgb2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function adjustColor(rgb, amount) {
        return rgb.map(c => Math.min(255, Math.max(0, Math.round(c + amount * 255))));
    }

    function updateContrast() {
        const fg = parseHex(fgPicker.value);
        const bg = parseHex(bgPicker.value);
        const ratio = getContrastRatio(fg, bg);

        previewCard.style.backgroundColor = bgPicker.value;
        previewCard.style.color = fgPicker.value;
        ratioVal.textContent = ratio.toFixed(2) + ":1";

        const passAA = ratio >= 4.5;
        const passAAA = ratio >= 7.0;
        const passAALarge = ratio >= 3.0;
        const passAAALarge = ratio >= 4.5;

        setWcagStatus(aaNormal, passAA, "Min 4.5:1");
        setWcagStatus(aaaNormal, passAAA, "Min 7:1");
        setWcagStatus(aaLarge, passAALarge, "Min 3:1");
        setWcagStatus(aaaLarge, passAAALarge, "Min 4.5:1");
    }

    function setWcagStatus(elem, passed, req) {
        const statusSpan = elem.querySelector(".wcag-status");
        statusSpan.textContent = (passed ? "Pasa" : "Falla") + ` (${req})`;
        statusSpan.style.color = passed ? "var(--success)" : "var(--error)";
    }

    updateContrast();
}

function initUnitConverter() {
    const categoriesContainer = document.getElementById("converter-categories");
    const fieldsContainer = document.getElementById("converter-fields");
    const decimalsSelect = document.getElementById("converter-decimals");

    const categories = appConfig.unitConverter.categories;
    let currentCatKey = Object.keys(categories)[0];
    let activeInputs = {};

    function renderCategories() {
        categoriesContainer.innerHTML = "";
        Object.keys(categories).forEach(key => {
            const btn = document.createElement("button");
            btn.className = `cat-tab ${key === currentCatKey ? "active" : ""}`;
            btn.textContent = categories[key].name;
            btn.addEventListener("click", () => {
                currentCatKey = key;
                renderCategories();
                renderFields();
            });
            categoriesContainer.appendChild(btn);
        });
    }

    function renderFields() {
        fieldsContainer.innerHTML = "";
        activeInputs = {};
        const cat = categories[currentCatKey];
        const units = cat.units;

        Object.keys(units).forEach(unitKey => {
            const card = document.createElement("div");
            card.className = "unit-field-card";

            const label = document.createElement("div");
            label.className = "unit-label";
            label.innerHTML = `<span>${unitKey}</span>`;

            const input = document.createElement("input");
            input.type = "number";
            input.className = "unit-input";
            input.value = unitKey === cat.base ? "1" : "";

            input.addEventListener("input", () => {
                convertUnits(unitKey, input.value);
            });

            card.appendChild(label);
            card.appendChild(input);
            fieldsContainer.appendChild(card);
            activeInputs[unitKey] = input;
        });

        convertUnits(cat.base, "1");
    }

    function convertUnits(sourceUnit, sourceVal) {
        const cat = categories[currentCatKey];
        const units = cat.units;
        const decimals = parseInt(decimalsSelect.value, 10);

        if (sourceVal === "" || isNaN(sourceVal)) {
            Object.keys(activeInputs).forEach(u => {
                if (u !== sourceUnit) activeInputs[u].value = "";
            });
            return;
        }

        const valNum = parseFloat(sourceVal);
        const baseValue = valNum * units[sourceUnit];

        Object.keys(units).forEach(u => {
            if (u !== sourceUnit) {
                const converted = baseValue / units[u];
                activeInputs[u].value = parseFloat(converted.toFixed(decimals));
            }
        });
    }

    decimalsSelect.addEventListener("change", () => {
        const baseUnit = categories[currentCatKey].base;
        if (activeInputs[baseUnit]) {
            convertUnits(baseUnit, activeInputs[baseUnit].value);
        }
    });

    renderCategories();
    renderFields();
}

function initRegexTester() {
    const patternInput = document.getElementById("regex-pattern");
    const flagsInput = document.getElementById("regex-flags");
    const testInput = document.getElementById("regex-test-text");
    const highlightsView = document.getElementById("regex-highlights");
    const matchCount = document.getElementById("regex-match-count");
    const presetsContainer = document.getElementById("regex-presets");

    const flagG = document.getElementById("flag-g");
    const flagI = document.getElementById("flag-i");
    const flagM = document.getElementById("flag-m");

    if (appConfig.regexTester && appConfig.regexTester.presets) {
        appConfig.regexTester.presets.forEach(preset => {
            const chip = document.createElement("button");
            chip.className = "preset-chip";
            chip.textContent = preset.name;
            chip.addEventListener("click", () => {
                patternInput.value = preset.pattern;
                flagsInput.value = preset.flags;
                testInput.value = preset.test;
                syncFlagsFromText();
                runRegex();
            });
            presetsContainer.appendChild(chip);
        });
        if (appConfig.regexTester.presets.length > 0) {
            const p = appConfig.regexTester.presets[0];
            patternInput.value = p.pattern;
            flagsInput.value = p.flags;
            testInput.value = p.test;
            syncFlagsFromText();
            runRegex();
        }
    }

    function syncFlagsFromText() {
        const flags = flagsInput.value;
        flagG.checked = flags.includes("g");
        flagI.checked = flags.includes("i");
        flagM.checked = flags.includes("m");
    }

    function syncTextFromFlags() {
        let flags = "";
        if (flagG.checked) flags += "g";
        if (flagI.checked) flags += "i";
        if (flagM.checked) flags += "m";
        flagsInput.value = flags;
        runRegex();
    }

    [flagG, flagI, flagM].forEach(cb => cb.addEventListener("change", syncTextFromFlags));
    patternInput.addEventListener("input", runRegex);
    flagsInput.addEventListener("input", () => {
        syncFlagsFromText();
        runRegex();
    });
    testInput.addEventListener("input", runRegex);

    function runRegex() {
        const pattern = patternInput.value;
        const flags = flagsInput.value;
        const text = testInput.value;

        if (!pattern) {
            highlightsView.textContent = text;
            matchCount.textContent = "0 coincidencias";
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            let matches = 0;
            let resultHTML = "";

            if (!flags.includes("g")) {
                const match = regex.exec(text);
                if (match) {
                    matches = 1;
                    const start = match.index;
                    const end = start + match[0].length;
                    resultHTML = escapeHtml(text.slice(0, start)) +
                        `<span class="regex-match-highlight">${escapeHtml(match[0])}</span>` +
                        escapeHtml(text.slice(end));
                } else {
                    resultHTML = escapeHtml(text);
                }
            } else {
                let lastIdx = 0;
                let match;
                while ((match = regex.exec(text)) !== null) {
                    matches++;
                    const start = match.index;
                    const end = start + match[0].length;
                    resultHTML += escapeHtml(text.slice(lastIdx, start));
                    resultHTML += `<span class="regex-match-highlight">${escapeHtml(match[0])}</span>`;
                    lastIdx = end;
                    if (match[0].length === 0) {
                        regex.lastIndex++;
                    }
                }
                resultHTML += escapeHtml(text.slice(lastIdx));
            }

2026-10-19            highlightsView.innerHTML = resultHTML;
            matchCount.textContent = `${matches} coincidencia${matches === 1 ? "" : "s"}`;
        } catch (e) {
            highlightsView.textContent = `Error de expresión regular: ${e.message}`;
            matchCount.textContent = "Error";
        }
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}
