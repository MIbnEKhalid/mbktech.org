async function getTermsVersionFromPrivacyPolicy() {
    try {
        console.log('Fetching terms version from privacy policy...');
        const response = await fetch('/Terms&Conditions');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const termsVersionElement = doc.getElementById('termVersionPrivacy');
        if (termsVersionElement) {
            const termsVersion = termsVersionElement.innerText.split(': ')[1];
            console.log('Fetched terms version:', termsVersion);
            return termsVersion;
        } else {
            throw new Error('Element with id "termVersionPrivacy" not found.');
        }
    } catch (err) {
        console.error('Failed to fetch or parse the privacy policy page:', err);
        return null;
    }
}

async function AskForCookieConsent() {
    try {
        console.log('Fetching cookie consent HTML...');
        const response = await fetch('/Assets/Cookie/index.html');
        const html = await response.text();
        document.getElementById('cookie').innerHTML = html;
        console.log('Cookie consent HTML loaded.');

        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log('Terms version obtained:', termsVersion);

        checkCookie(termsVersion);
    } catch (err) {
        console.error('Error in AskForCookieConsent:', err);
    }
}

async function SaveCookie() {
    try {
        console.log('Saving cookie...');
        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log('Terms version for saving cookie:', termsVersion);
        setCookie('agreed', termsVersion, 365);
        console.log('Cookie saved.');
        hideOverlay();
    } catch (err) {
        console.error('Error in SaveCookie:', err);
    }
}

function checkCookie(currentVersion) {
    console.log('Checking cookie...');
    const agreedVersion = getCookie('agreed');
    console.log('Agreed version:', agreedVersion, 'Current version:', currentVersion);
    if (agreedVersion === currentVersion) {
        hideOverlay();
    } else {
        document.getElementById('cookieNotice').style.display = 'block';
    }
}

function hideOverlay() {
    document.getElementById('cookieNotice').style.display = 'none';
}

function setCookie(name, value, days) {
    console.log('Setting cookie:', name, value, days);
    let expires = "";
    // Set expiration time if specified
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    let domain = "";
    // Set domain to .mbktech.org for both main domain and subdomains
    if (window.location.hostname.endsWith("mbktech.org")) {
        domain = "; domain=.mbktech.org"; // Apply to all subdomains
    } else if (window.location.hostname.endsWith("mbktech.xyz")) {
        domain = "; domain=.mbktech.xyz"; // Apply to all subdomains
    } else if (window.location.hostname.endsWith("ibnekhalid.me")) {
        domain = "; domain=.ibnekhalid.me";
    }
    // Construct and set the cookie
    document.cookie = `${name}=${value || ""}${expires}; path=/${domain}`;
    console.log(`Cookie set with domain scope: ${domain || "current domain only"}`);
}

function getCookie(name) {
    console.log('Getting cookie:', name);
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            const value = cookie.substring(nameEQ.length);
            console.log('Cookie found:', value);
            return value;
        }
    }
    console.log('Cookie not found.');
    return null;
}

function hideCookieNotice() {
    document.getElementById('cookieNotice').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", AskForCookieConsent);