const colorModeBtn = document.getElementById("color-mode-btn");
const headerImage = document.getElementById("header-image");
const cssRoot = document.querySelector(":root");

const darkModeColors = new Map(); // dark mode color palette
darkModeColors.set("--main-background", "hsl(235, 21%, 11%)");
darkModeColors.set("--input-background", "hsl(235, 24%, 19%)");
darkModeColors.set("--type", "hsl(236, 15%, 63%)");
darkModeColors.set("--input-border", "hsl(235, 22%, 23%)");
darkModeColors.set("--strike-text", "hsl(235, 17%, 29%)");
darkModeColors.set("--strike-line", "hsl(235, 16%, 31%)");
darkModeColors.set("--menu-type", "hsl(236, 15%, 63%)");
darkModeColors.set("--menu-hover", "hsl(0, 0%, 100%)");
darkModeColors.set("--caret", "hsl(226, 65%, 45%)");

const lightModeColors = new Map(); // light mode color palette
lightModeColors.set("--main-background", "hsl(0, 0%, 98%)");
lightModeColors.set("--input-background", "hsl(0, 0%, 100%)");
lightModeColors.set("--type", "hsl(236, 8%, 43%)");
lightModeColors.set("--input-border", "hsl(260, 10%, 94%)");
lightModeColors.set("--strike-text", "hsl(260, 8%, 80%)");
lightModeColors.set("--strike-line", "hsl(270, 6%, 75%)");
lightModeColors.set("--menu-type", "hsl(240, 5%, 64%)");
lightModeColors.set("--menu-hover", "hsl(231, 14%, 30%)");
lightModeColors.set("--caret", "hsl(226, 65%, 65%)");

let isDarkMode;
const isDarkModeFromLocalStorage = JSON.parse(localStorage.getItem("isDarkMode"));

if (isDarkModeFromLocalStorage !== null) {
    isDarkMode = isDarkModeFromLocalStorage;
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    isDarkMode = true;
} else if(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    isDarkMode = false;
} else {
    isDarkMode = true;
}

setColorMode();

window.addEventListener("resize", () => {
    const width = document.documentElement.clientWidth;

    activateButtonsOnResize(width);
    getBgImage(width);
});

function getBgImage(width = document.documentElement.clientWidth) {
    if (isDarkMode) {
        colorModeBtn.setAttribute("src", "/images/icon-sun.svg");
        if (width <= 680) {
            headerImage.setAttribute("src", "/images/bg-mobile-dark.jpg");
        } else {
            headerImage.setAttribute("src", "/images/bg-desktop-dark.jpg");
        }
    } else {
        colorModeBtn.setAttribute("src", "/images/icon-moon.svg");
        if (width <= 680) {
            headerImage.setAttribute("src", "/images/bg-mobile-light.jpg");
        } else {
            headerImage.setAttribute("src", "/images/bg-desktop-light.jpg");
        }
    }
}

function setColorMode() {
    getBgImage();

    (isDarkMode ? darkModeColors : lightModeColors).forEach((color, variable) => {
        cssRoot.style.setProperty(variable, color);
    });
}

colorModeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    saveColorModeToLocalStorage();

    setColorMode();
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
    isDarkMode = event.matches;
    setColorMode();
    saveColorModeToLocalStorage();
});

function saveColorModeToLocalStorage() {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
}