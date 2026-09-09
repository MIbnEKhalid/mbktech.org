import { spamRepository } from "../repositories/index.js";

// ----- Blocked Entries CRUD (delegates to SpamRepository) -----

export async function getBlockedEntries() {
    return spamRepository.getBlockedEntries();
}

export async function addBlockedEntry(type, value, reason, createdBy) {
    return spamRepository.addBlockedEntry(type, value, reason, createdBy);
}

export async function removeBlockedEntry(id) {
    return spamRepository.removeBlockedEntry(id);
}

// ----- Submission Validation -----

export async function validateSubmission(email, phoneNumber, message) {
    // Check blocked emails
    if (email) {
        const blockedEmail = await spamRepository.findBlocked("email", email);
        if (blockedEmail) {
            return {
                blocked: true,
                status: 403,
                error: `Your email has been banned: ${blockedEmail.reason || "Contact support for more information"}`,
            };
        }
    }

    // Check blocked phone numbers
    if (phoneNumber) {
        const blockedPhone = await spamRepository.findBlocked("phone", phoneNumber);
        if (blockedPhone) {
            return {
                blocked: true,
                status: 403,
                error: `This phone number has been banned: ${blockedPhone.reason || "Contact support for more information"}`,
            };
        }
    }

    // Check blocked keywords
    if (message) {
        const keywords = await spamRepository.getActiveKeywords();
        for (const keyword of keywords) {
            if (message.toLowerCase().includes(keyword.value.toLowerCase())) {
                return {
                    blocked: true,
                    status: 403,
                    error: `Your message contains blocked content: ${keyword.reason || "Contact support for more information"}`,
                };
            }
        }
    }

    return { blocked: false };
}

export { spamRepository };
