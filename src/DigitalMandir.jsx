import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Bell, Flame, Music2, Search, Settings, ChevronRight, ChevronLeft,
  Play, Pause, SkipBack, SkipForward, Repeat, Plus, Minus, Home,
  BookOpen, User, Compass, Sun, Moon, Info, Award, Check, Lock,
  ArrowLeft, MoreVertical, Edit2, Heart, ChevronDown, Users, Volume2, VolumeX
} from "lucide-react";

function estimateMinutes(steps) {
  let totalSec = 0;
  steps.forEach((s) => {
    const sec = s.duration.match(/(\d+)\s*sec/);
    const min = s.duration.match(/(\d+)\s*min/);
    if (sec) totalSec += parseInt(sec[1], 10);
    if (min) totalSec += parseInt(min[1], 10) * 60;
  });
  return Math.max(1, Math.round(totalSec / 60));
}

const maroon = "#4A1015";
const maroonMid = "#6B1F24";
const cream = "#FBF3E7";
const gold = "#C9973E";
const goldLight = "#E8C77E";
const textDark = "#2B1210";
const textMuted = "#8B6F5E";

const OM = "\u0950";
const HANDS = "\uD83D\uDE4F";

// ---------------- GUIDED RITUAL COPY (Module 1, now bilingual) ----------------
const stepCopyI18n = {
  en: {
    bell: { title: "Awaken the Space", subtitle: "Let the divine energy begin", cta: "Ring Bell", icon: "\uD83D\uDD14" },
    darshan: { title: "Behold the Divine", subtitle: "Witness the sacred presence, live", cta: "Begin Darshan", icon: "\uD83D\uDC41\uFE0F" },
    aarti: { title: "Offer Your Aarti", subtitle: "Express devotion with light and gratitude", cta: "Begin Aarti", icon: "\uD83E\uDE94" },
    mantra: { title: "Enter Mantra Jap", subtitle: "Focus your mind and energy", cta: "Start Chanting", icon: OM },
    bhajan: { title: "Immerse in Bhakti", subtitle: "Let devotion flow through music", cta: "Play Bhajan", icon: "\uD83C\uDFB5" },
    gratitude: { title: "Shanti & Samarpan", subtitle: "Offer gratitude and surrender", cta: "Complete Puja", icon: HANDS },
  },
  hi: {
    bell: { title: "\u0938\u094D\u0925\u093E\u0928 \u0915\u094B \u091C\u0917\u093E\u090F\u0902", subtitle: "\u0926\u093F\u0935\u094D\u092F \u090A\u0930\u094D\u091C\u093E \u0915\u094B \u0906\u0930\u0902\u092D \u0939\u094B\u0928\u0947 \u0926\u0947\u0902", cta: "\u0918\u0902\u091F\u0940 \u092C\u091C\u093E\u090F\u0902", icon: "\uD83D\uDD14" },
    darshan: { title: "\u0926\u093F\u0935\u094D\u092F \u0926\u0930\u094D\u0936\u0928 \u0915\u0930\u0947\u0902", subtitle: "\u091C\u0940\u0935\u0902\u0924 \u092A\u0935\u093F\u0924\u094D\u0930 \u0909\u092A\u0938\u094D\u0925\u093F\u0924\u093F \u0915\u0947 \u0938\u093E\u0915\u094D\u0937\u0940 \u092C\u0928\u0947\u0902", cta: "\u0926\u0930\u094D\u0936\u0928 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902", icon: "\uD83D\uDC41\uFE0F" },
    aarti: { title: "\u0905\u092A\u0928\u0940 \u0906\u0930\u0924\u0940 \u0905\u0930\u094D\u092A\u093F\u0924 \u0915\u0930\u0947\u0902", subtitle: "\u092A\u094D\u0930\u0915\u093E\u0936 \u0914\u0930 \u0915\u0943\u0924\u091C\u094D\u091E\u0924\u093E \u0938\u0947 \u092D\u0915\u094D\u0924\u093F \u0935\u094D\u092F\u0915\u094D\u0924 \u0915\u0930\u0947\u0902", cta: "\u0906\u0930\u0924\u0940 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902", icon: "\uD83E\uDE94" },
    mantra: { title: "\u092E\u0902\u0924\u094D\u0930 \u091C\u093E\u092A \u092E\u0947\u0902 \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930\u0947\u0902", subtitle: "\u0905\u092A\u0928\u0947 \u092E\u0928 \u0914\u0930 \u090A\u0930\u094D\u091C\u093E \u092A\u0930 \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0902", cta: "\u091C\u093E\u092A \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902", icon: OM },
    bhajan: { title: "\u092D\u0915\u094D\u0924\u093F \u092E\u0947\u0902 \u0932\u0940\u0928 \u0939\u094B\u0902", subtitle: "\u0938\u0902\u0917\u0940\u0924 \u0915\u0947 \u092E\u093E\u0927\u094D\u092F\u092E \u0938\u0947 \u092D\u0915\u094D\u0924\u093F \u092C\u0939\u0928\u0947 \u0926\u0947\u0902", cta: "\u092D\u091C\u0928 \u092C\u091C\u093E\u090F\u0902", icon: "\uD83C\uDFB5" },
    gratitude: { title: "\u0936\u093E\u0902\u0924\u093F \u0914\u0930 \u0938\u092E\u0930\u094D\u092A\u0923", subtitle: "\u0915\u0943\u0924\u091C\u094D\u091E\u0924\u093E \u0905\u0930\u094D\u092A\u093F\u0924 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0938\u092E\u0930\u094D\u092A\u0923 \u0915\u0930\u0947\u0902", cta: "\u092A\u0942\u091C\u093E \u092A\u0942\u0930\u094D\u0923 \u0915\u0930\u0947\u0902", icon: HANDS },
  },
};
function guided(step, lang = "en") {
  const map = stepCopyI18n[lang] || stepCopyI18n.en;
  return map[step.type] || { title: step.content || "Continue", subtitle: "", cta: "Continue", icon: "\u2728" };
}

// ---------------- LANGUAGE / i18n ----------------
const translations = {
  en: {
    appName: "SMART MANDIR", tagline: "DIVINE . DIGITAL . DAILY.",
    navHome: "Home", navPuja: "Puja", navExplore: "Explore", navLibrary: "Library", navProfile: "Profile",
    greeting: "Good day", continueJourney: "Continue Your Journey", viewAll: "View All", quickAccess: "Quick Access",
    qAarti: "Aarti", qDarshan: "Darshan", qMantra: "Mantra", qBhajan: "Bhajan",
    shubhPrabhatPuja: "Shubh Prabhat Puja", sandhyaShantiPuja: "Sandhya Shanti Puja",
    continueWhereLeftOff: "Continue where you left off", step: "step", of: "of",
    recommendedForYou: "RECOMMENDED FOR YOU",
    beginMinPuja: (m) => `Begin ${m} Min Puja`, guidanceDay: "Guidance Day", divineFlow: "Divine Flow",
    totalTime: "Total Time", mins: "mins", pujaFlowTitle: "Puja Flow", pujaCompleteBtn: "\u2728 Puja Complete",
    libAarti: "Aarti", libMantra: "Mantra", libBhajan: "Bhajan", libStotra: "Stotra",
    searchPlaceholder: (t) => `Search ${t}...`, trending: "TRENDING", fits: (d) => `Fits ${d}`,
    fitsEveryDay: "Fits every day", tracks: "tracks", tracksThatFit: (d) => `tracks that fit ${d}'s puja plan`,
    noResults: "No results found.", library: "Library",
    weeklyPlan: "Weekly Plan", morningPuja: "Morning Puja", eveningPuja: "Evening Puja",
    viewEveningPlan: "View Evening Plan", morningRitual: (n) => `Morning: ${n} Kripa Ritual`,
    eveningPlanTitle: (d) => `${d} - Evening Plan`, startEveningPuja: "Start Evening Puja",
    sandhyaShantiRitual: "Sandhya Shanti Ritual", endDayPeace: "End your day with peace and gratitude.", hariKripaRitual: "Hari Kripa Morning Ritual",
    chants: "Chants", reset: "Reset",
    lyrics: "Lyrics", meaningHi: "Meaning (Hindi)", meaningEn: "Meaning (English)", traditionalAarti: "Traditional Bhakti Aarti", playAudio: "Play audio", pauseAudio: "Pause audio", audioUnavailable: "Audio could not be loaded.",
    liveDarshanTitle: "Live Darshan", devoteesPresent: "devotees present", darshanEndsIn: "Darshan ends in",
    darshanCompleteLabel: "Darshan complete", tapPranam: `Tap ${HANDS} to send Pranam \u00B7 tap \u2713 to continue`,
    pujaCompleteTitle: "\u2728 Puja Complete", pujaCompleteSubtitle: "You completed today's ritual",
    dayStreak: "Day Streak", returnHome: "Return Home", daysLabel: "Days",
    pujaReminder: "Puja Reminder", customReminder: "Custom Reminder", addOwnReminder: "Add your own reminder",
    reminderNoteGranted: "Reminders will notify you while this app stays open in your browser.",
    reminderNoteDenied: "Notifications are blocked in your browser settings \u2014 enable them to receive reminders.",
    reminderNoteDefault: "We'll ask for notification permission once a reminder is turned on.",
    quoteDaily: "\u201CA little devotion daily brings immense peace.\u201D",
    pujaReminders: "Puja Reminders", ishtaDevtaPreferences: "Ishta Devta & Preferences", myDeities: "My Deities",
    settings: "Settings", helpSupport: "Help & Support", aboutUs: "About Us", languageMenu: "Language",
    pujaStreak: "Puja Streak", level: "Level", devotee: "Devotee",
    chooseIshta: "Choose your Ishta Devta", preferredMantraType: "Preferred Mantra Type", pujaTime: "Puja Time",
    continueBtn: "Continue", enterApp: "Enter Smart Mandir",
    optPeace: "Peace", optProtection: "Protection", optFocus: "Focus",
    optMorning: "Morning", optEvening: "Evening", optBoth: "Both",
    chooseLanguage: "Choose your language", languageSubtitle: "You can change this anytime from Profile.",
    english: "English", hindi: "\u0939\u093F\u0902\u0926\u0940 (Hindi)", doneLabel: "Done",
    muhuratTitle: "Shubh Muhurat", todaysMuhurat: "Today's Shubh Muhurat", viewFullMuhurat: "View Full Muhurat",
    brahmaMuhurta: "Brahma Muhurta", abhijitMuhurat: "Abhijit Muhurat", rahuKalam: "Rahu Kalam", yamaganda: "Yamaganda",
    sunriseLabel: "Sunrise", sunsetLabel: "Sunset", pratahSandhya: "Pratah Sandhya", sayamSandhya: "Sayam Sandhya",
    morningSection: "Morning", middaySection: "Midday", eveningSection: "Evening", avoidSection: "Avoid Today",
    brahmaMuhurtaDesc: "Best time to wake, meditate & begin puja", abhijitDesc: "Most auspicious window of the day",
    sandhyaDesc: "Ideal for evening aarti & prayer", rahuDesc: "Inauspicious \u2014 avoid starting anything new",
    yamagandaDesc: "Inauspicious \u2014 avoid important beginnings", skippedOnWed: "Not observed on Wednesdays",
    usingLocation: (city) => `Times for ${city}`, useMyLocation: "Use my current location",
    locationDenied: "Location access denied \u2014 showing default city times.", detecting: "Detecting your location...",
    muhuratDisclaimer: "Computed from today's sunrise & sunset at your location using standard solar astronomy. For exact ceremonial timings, please confirm with a local priest or panchang.",
    auspicious: "AUSPICIOUS", inauspicious: "AVOID",
    customScheduleMenu: "Customize Weekly Schedule", customScheduleTitle: "Weekly Schedule",
    pujaDayLabel: "Puja Day", restDayLabel: "Rest Day", deityFocusLabel: "Deity Focus", includeInRitual: "Include in Ritual",
    saveSchedule: "Save Schedule", resetDefault: "Reset to Default", scheduleSavedMsg: "Your weekly schedule has been saved.",
    restDayHomeTitle: "Rest Day Today", restDayHomeDesc: "No puja scheduled today \u2014 you can still begin one anytime.",
    beginAnyway: "Begin Puja Anyway", customizedTag: "Customized", scheduleIntro: "Choose a deity focus, active days, and which parts of the ritual to include \u2014 for each day of the week.",
  },
  hi: {
    appName: "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u092E\u0902\u0926\u093F\u0930", tagline: "\u0926\u093F\u0935\u094D\u092F . \u0921\u093F\u091C\u093F\u091F\u0932 . \u0930\u094B\u091C\u093C\u093E\u0928\u093E",
    navHome: "\u0939\u094B\u092E", navPuja: "\u092A\u0942\u091C\u093E", navExplore: "\u090F\u0915\u094D\u0938\u092A\u094D\u0932\u094B\u0930", navLibrary: "\u0932\u093E\u0907\u092C\u094D\u0930\u0947\u0930\u0940", navProfile: "\u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932",
    greeting: "\u0936\u0941\u092D \u0926\u093F\u0928", continueJourney: "\u0905\u092A\u0928\u0940 \u092F\u093E\u0924\u094D\u0930\u093E \u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902", viewAll: "\u0938\u092D\u0940 \u0926\u0947\u0916\u0947\u0902", quickAccess: "\u0924\u094D\u0935\u0930\u093F\u0924 \u092A\u0939\u0941\u0902\u091A",
    qAarti: "\u0906\u0930\u0924\u0940", qDarshan: "\u0926\u0930\u094D\u0936\u0928", qMantra: "\u092E\u0902\u0924\u094D\u0930", qBhajan: "\u092D\u091C\u0928",
    shubhPrabhatPuja: "\u0936\u0941\u092D \u092A\u094D\u0930\u092D\u093E\u0924 \u092A\u0942\u091C\u093E", sandhyaShantiPuja: "\u0938\u0902\u0927\u094D\u092F\u093E \u0936\u093E\u0902\u0924\u093F \u092A\u0942\u091C\u093E",
    continueWhereLeftOff: "\u091C\u0939\u093E\u0902 \u0938\u0947 \u091B\u094B\u0921\u093C\u093E \u0925\u093E \u0935\u0939\u0940\u0902 \u0938\u0947 \u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902", step: "\u091A\u0930\u0923", of: "\u092E\u0947\u0902 \u0938\u0947",
    recommendedForYou: "\u0906\u092A\u0915\u0947 \u0932\u093F\u090F \u0905\u0928\u0941\u0936\u0902\u0938\u093F\u0924",
    beginMinPuja: (m) => `${m} \u092E\u093F\u0928\u091F \u0915\u0940 \u092A\u0942\u091C\u093E \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902`, guidanceDay: "\u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928 \u0926\u093F\u0935\u0938", divineFlow: "\u0926\u093F\u0935\u094D\u092F \u092A\u094D\u0930\u0935\u093E\u0939",
    totalTime: "\u0915\u0941\u0932 \u0938\u092E\u092F", mins: "\u092E\u093F\u0928\u091F", pujaFlowTitle: "\u092A\u0942\u091C\u093E \u092A\u094D\u0930\u0935\u093E\u0939", pujaCompleteBtn: "\u2728 \u092A\u0942\u091C\u093E \u092A\u0942\u0930\u094D\u0923",
    libAarti: "\u0906\u0930\u0924\u0940", libMantra: "\u092E\u0902\u0924\u094D\u0930", libBhajan: "\u092D\u091C\u0928", libStotra: "\u0938\u094D\u0924\u094B\u0924\u094D\u0930",
    searchPlaceholder: (t) => `${t} \u0916\u094B\u091C\u0947\u0902...`, trending: "\u091F\u094D\u0930\u0947\u0902\u0921\u093F\u0902\u0917", fits: (d) => `${d} \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924`,
    fitsEveryDay: "\u0939\u0930 \u0926\u093F\u0928 \u0915\u0947 \u0932\u093F\u090F \u0909\u092A\u092F\u0941\u0915\u094D\u0924", tracks: "\u091F\u094D\u0930\u0948\u0915", tracksThatFit: (d) => `\u091F\u094D\u0930\u0948\u0915 \u091C\u094B ${d} \u0915\u0940 \u092A\u0942\u091C\u093E \u092F\u094B\u091C\u0928\u093E \u092E\u0947\u0902 \u092B\u093F\u091F \u0939\u094B\u0924\u0947 \u0939\u0948\u0902`,
    noResults: "\u0915\u094B\u0908 \u092A\u0930\u093F\u0923\u093E\u092E \u0928\u0939\u0940\u0902 \u092E\u093F\u0932\u093E\u0964", library: "\u0932\u093E\u0907\u092C\u094D\u0930\u0947\u0930\u0940",
    weeklyPlan: "\u0938\u093E\u092A\u094D\u0924\u093E\u0939\u093F\u0915 \u092F\u094B\u091C\u0928\u093E", morningPuja: "\u0938\u0941\u092C\u0939 \u0915\u0940 \u092A\u0942\u091C\u093E", eveningPuja: "\u0936\u093E\u092E \u0915\u0940 \u092A\u0942\u091C\u093E",
    viewEveningPlan: "\u0936\u093E\u092E \u0915\u0940 \u092F\u094B\u091C\u0928\u093E \u0926\u0947\u0916\u0947\u0902", morningRitual: (n) => `\u0938\u0941\u092C\u0939: ${n} \u0915\u0943\u092A\u093E \u0905\u0928\u0941\u0937\u094D\u0920\u093E\u0928`,
    eveningPlanTitle: (d) => `${d} - \u0936\u093E\u092E \u0915\u0940 \u092F\u094B\u091C\u0928\u093E`, startEveningPuja: "\u0936\u093E\u092E \u0915\u0940 \u092A\u0942\u091C\u093E \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902",
    sandhyaShantiRitual: "\u0938\u0902\u0927\u094D\u092F\u093E \u0936\u093E\u0902\u0924\u093F \u0905\u0928\u0941\u0937\u094D\u0920\u093E\u0928", endDayPeace: "\u0936\u093E\u0902\u0924\u093F \u0914\u0930 \u0915\u0943\u0924\u091C\u094D\u091E\u0924\u093E \u0915\u0947 \u0938\u093E\u0925 \u0905\u092A\u0928\u093E \u0926\u093F\u0928 \u0938\u092E\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902\u0964", hariKripaRitual: "\u0939\u0930\u093F \u0915\u0943\u092A\u093E \u092A\u094D\u0930\u093E\u0924\u0903 \u0905\u0928\u0941\u0937\u094D\u0920\u093E\u0928",
    chants: "\u091C\u093E\u092A", reset: "\u0930\u0940\u0938\u0947\u091F",
    lyrics: "\u092C\u094B\u0932", meaningHi: "\u0905\u0930\u094D\u0925 (\u0939\u093F\u0902\u0926\u0940)", meaningEn: "\u0905\u0930\u094D\u0925 (\u0905\u0902\u0917\u094D\u0930\u0947\u091C\u093C\u0940)", traditionalAarti: "\u092A\u093E\u0930\u0902\u092A\u0930\u093F\u0915 \u092D\u0915\u094D\u0924\u093F \u0906\u0930\u0924\u0940", playAudio: "\u0911\u0921\u093F\u092F\u094B \u091A\u0932\u093E\u090F\u0901", pauseAudio: "\u0911\u0921\u093F\u092F\u094B \u0930\u094B\u0915\u0947\u0902", audioUnavailable: "\u0911\u0921\u093F\u092F\u094B \u0932\u094B\u0921 \u0928\u0939\u0940\u0902 \u0939\u094B \u0938\u0915\u093E\u0964",
    liveDarshanTitle: "\u0932\u093E\u0907\u0935 \u0926\u0930\u094D\u0936\u0928", devoteesPresent: "\u092D\u0915\u094D\u0924 \u0909\u092A\u0938\u094D\u0925\u093F\u0924", darshanEndsIn: "\u0926\u0930\u094D\u0936\u0928 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u0917\u093E",
    darshanCompleteLabel: "\u0926\u0930\u094D\u0936\u0928 \u092A\u0942\u0930\u094D\u0923", tapPranam: `\uD83D\uDE4F \u0926\u092C\u093E\u0915\u0930 \u092A\u094D\u0930\u0923\u093E\u092E \u092D\u0947\u091C\u0947\u0902 \u00B7 \u2713 \u0926\u092C\u093E\u0915\u0930 \u0906\u0917\u0947 \u092C\u0922\u093C\u0947\u0902`,
    pujaCompleteTitle: "\u2728 \u092A\u0942\u091C\u093E \u092A\u0942\u0930\u094D\u0923", pujaCompleteSubtitle: "\u0906\u092A\u0928\u0947 \u0906\u091C \u0915\u093E \u0905\u0928\u0941\u0937\u094D\u0920\u093E\u0928 \u092A\u0942\u0930\u093E \u0915\u0930 \u0932\u093F\u092F\u093E",
    dayStreak: "\u0926\u093F\u0928 \u0915\u0940 \u0932\u0917\u0928", returnHome: "\u0939\u094B\u092E \u092A\u0930 \u0932\u094C\u091F\u0947\u0902",
    pujaReminder: "\u092A\u0942\u091C\u093E \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915", customReminder: "\u0915\u0938\u094D\u091F\u092E \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915", addOwnReminder: "\u0905\u092A\u0928\u093E \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915 \u091C\u094B\u0921\u093C\u0947\u0902",
    reminderNoteGranted: "\u091C\u092C \u0924\u0915 \u092F\u0939 \u0910\u092A \u0906\u092A\u0915\u0947 \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u092E\u0947\u0902 \u0916\u0941\u0932\u093E \u0930\u0939\u0947\u0917\u093E, \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915 \u0906\u092A\u0915\u094B \u0938\u0942\u091A\u093F\u0924 \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
    reminderNoteDenied: "\u0906\u092A\u0915\u0940 \u092C\u094D\u0930\u093E\u0909\u091C\u093C\u0930 \u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938 \u092E\u0947\u0902 \u0938\u0942\u091A\u0928\u093E\u090F\u0902 \u0905\u0935\u0930\u0941\u0926\u094D\u0927 \u0939\u0948\u0902 \u2014 \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915 \u092A\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0907\u0928\u094D\u0939\u0947\u0902 \u0938\u0915\u094D\u0937\u092E \u0915\u0930\u0947\u0902\u0964",
    reminderNoteDefault: "\u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915 \u091A\u093E\u0932\u0942 \u0915\u0930\u0924\u0947 \u0939\u0940 \u0939\u092E \u0938\u0942\u091A\u0928\u093E \u0915\u0940 \u0905\u0928\u0941\u092E\u0924\u093F \u092E\u093E\u0902\u0917\u0947\u0902\u0917\u0947\u0964",
    quoteDaily: "\u201C\u0930\u094B\u091C\u093C \u0915\u0940 \u0925\u094B\u0921\u093C\u0940 \u0938\u0940 \u092D\u0915\u094D\u0924\u093F \u0905\u092A\u093E\u0930 \u0936\u093E\u0902\u0924\u093F \u0932\u093E\u0924\u0940 \u0939\u0948\u0964\u201D",
    pujaReminders: "\u092A\u0942\u091C\u093E \u0905\u0928\u0941\u0938\u094D\u092E\u093E\u0930\u0915", ishtaDevtaPreferences: "\u0907\u0937\u094D\u091F \u0926\u0947\u0935\u0924\u093E \u0914\u0930 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E\u090F\u0902", myDeities: "\u092E\u0947\u0930\u0947 \u0926\u0947\u0935\u0924\u093E",
    settings: "\u0938\u0947\u091F\u093F\u0902\u0917\u094D\u0938", helpSupport: "\u0938\u0939\u093E\u092F\u0924\u093E \u0914\u0930 \u0938\u092E\u0930\u094D\u0925\u0928", aboutUs: "हमारे बारे में", languageMenu: "\u092D\u093E\u0937\u093E",
    pujaStreak: "\u092A\u0942\u091C\u093E \u0932\u0917\u0928", level: "\u0938\u094D\u0924\u0930", devotee: "\u092D\u0915\u094D\u0924",
    chooseIshta: "\u0905\u092A\u0928\u0947 \u0907\u0937\u094D\u091F \u0926\u0947\u0935\u0924\u093E \u091A\u0941\u0928\u0947\u0902", preferredMantraType: "\u092A\u0938\u0902\u0926\u0940\u0926\u093E \u092E\u0902\u0924\u094D\u0930 \u092A\u094D\u0930\u0915\u093E\u0930", pujaTime: "\u092A\u0942\u091C\u093E \u0915\u093E \u0938\u092E\u092F",
    continueBtn: "\u091C\u093E\u0930\u0940 \u0930\u0916\u0947\u0902", enterApp: "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u092E\u0902\u0926\u093F\u0930 \u092E\u0947\u0902 \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930\u0947\u0902",
    optPeace: "\u0936\u093E\u0902\u0924\u093F", optProtection: "\u0938\u0941\u0930\u0915\u094D\u0937\u093E", optFocus: "\u090F\u0915\u093E\u0917\u094D\u0930\u0924\u093E",
    optMorning: "\u0938\u0941\u092C\u0939", optEvening: "\u0936\u093E\u092E", optBoth: "\u0926\u094B\u0928\u094B\u0902",
    chooseLanguage: "\u0905\u092A\u0928\u0940 \u092D\u093E\u0937\u093E \u091A\u0941\u0928\u0947\u0902", languageSubtitle: "\u0906\u092A \u0907\u0938\u0947 \u0915\u092D\u0940 \u092D\u0940 \u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932 \u0938\u0947 \u092C\u0926\u0932 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902\u0964",
    english: "English", hindi: "\u0939\u093F\u0902\u0926\u0940 (Hindi)", doneLabel: "\u092A\u0942\u0930\u094D\u0923",
    muhuratTitle: "शुभ मुहूर्त", todaysMuhurat: "आज का शुभ मुहूर्त", viewFullMuhurat: "पूरा मुहूर्त देखें",
    brahmaMuhurta: "ब्रह्म मुहूर्त", abhijitMuhurat: "अभिजीत मुहूर्त", rahuKalam: "राहु काल", yamaganda: "यमगण्ड",
    sunriseLabel: "सूर्योदय", sunsetLabel: "सूर्यास्त", pratahSandhya: "प्रातः संध्या", sayamSandhya: "सायं संध्या",
    morningSection: "सुबह", middaySection: "दोपहर", eveningSection: "शाम", avoidSection: "आज बचें",
    brahmaMuhurtaDesc: "जागने, ध्यान और पूजा शुरू करने का सर्वोत्तम समय", abhijitDesc: "दिन का सबसे शुभ समय",
    sandhyaDesc: "शाम की आरती और प्रार्थना के लिए उपयुक्त", rahuDesc: "अशुभ — कुछ भी नया शुरू करने से बचें",
    yamagandaDesc: "अशुभ — महत्वपूर्ण शुरुआत से बचें", skippedOnWed: "बुधवार को लागू नहीं",
    usingLocation: (city) => `${city} के लिए समय`, useMyLocation: "मेरा वर्तमान स्थान उपयोग करें",
    locationDenied: "स्थान की अनुमति नहीं मिली — डिफ़ॉल्ट शहर का समय दिखाया जा रहा है।", detecting: "आपका स्थान पता लगाया जा रहा है...",
    muhuratDisclaimer: "आपके स्थान पर आज के सूर्योदय और सूर्यास्त से मानक सौर खगोल विज्ञान का उपयोग करके गणना की गई है। सटीक अनुष्ठान समय के लिए कृपया स्थानीय पुजारी या पंचांग से पुष्टि करें।",
    auspicious: "शुभ", inauspicious: "बचें",
    customScheduleMenu: "साप्ताहिक शेड्यूल कस्टमाइज़ करें", customScheduleTitle: "साप्ताहिक शेड्यूल",
    pujaDayLabel: "पूजा दिवस", restDayLabel: "आराम का दिन", deityFocusLabel: "देवता फोकस", includeInRitual: "अनुष्ठान में शामिल करें",
    saveSchedule: "शेड्यूल सहेजें", resetDefault: "डिफ़ॉल्ट पर रीसेट करें", scheduleSavedMsg: "आपका साप्ताहिक शेड्यूल सहेज लिया गया है।",
    restDayHomeTitle: "आज आराम का दिन", restDayHomeDesc: "आज कोई पूजा निर्धारित नहीं है — आप फिर भी कभी भी शुरू कर सकते हैं।",
    beginAnyway: "फिर भी पूजा शुरू करें", customizedTag: "कस्टमाइज़्ड", scheduleIntro: "सप्ताह के हर दिन के लिए देवता फोकस, सक्रिय दिन और अनुष्ठान के किन हिस्सों को शामिल करना है, चुनें।",
  },
};
const LangContext = createContext({ lang: "en", setLang: () => {}, t: (k) => k });
function useLang() {
  return useContext(LangContext);
}
function makeT(lang) {
  return (key, ...args) => {
    const dict = translations[lang] || translations.en;
    const val = dict[key] !== undefined ? dict[key] : translations.en[key];
    return typeof val === "function" ? val(...args) : val;
  };
}

// Accent tint per chosen Ishta Devta (Module 4 personalization)
const DEVTA_ACCENT = {
  Krishna: "#C9973E",
  Shiva: "#9FBFC0",
  Hanuman: "#E08A3E",
  Devi: "#D06A93",
  Ganesh: "#E0A23E",
};
const DEVTA_VARIANT = { Krishna: "krishna", Shiva: "shani", Hanuman: "hanuman", Devi: "lakshmi", Ganesh: "ganesh" };

// ---------------- PRESENCE LAYER: audio + haptics (Module 2) ----------------
let sharedAudioCtx = null;
function getAudioCtx() {
  try {
    if (!sharedAudioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) sharedAudioCtx = new AC();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
    return sharedAudioCtx;
  } catch (e) {
    return null;
  }
}
function playBell() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [{ f: 660, g: 0.22, d: 1.6 }, { f: 990, g: 0.1, d: 1.2 }].forEach(({ f, g, d }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(g, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + d);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + d + 0.05);
  });
}
function playTick() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}
function vibrate(pattern) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {}
}
function useAmbientDrone(active) {
  const nodesRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 110;
    osc2.type = "sine";
    osc2.frequency.value = 164.8;
    gain.gain.value = 0.0001;
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start();
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.4);
    nodesRef.current = { osc1, osc2, gain };
    return () => {
      const c = getAudioCtx();
      if (nodesRef.current && c) {
        const { osc1: o1, osc2: o2, gain: g } = nodesRef.current;
        g.gain.linearRampToValueAtTime(0.0001, c.currentTime + 0.5);
        setTimeout(() => {
          try {
            o1.stop();
            o2.stop();
          } catch (e) {}
        }, 550);
      }
      nodesRef.current = null;
    };
  }, [active]);
}
function scheduleDailyReminder(hour, minute, message, timeoutRef) {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  const now = new Date();
  let next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const ms = next - now;
  const fire = () => {
    try {
      if (window.Notification && Notification.permission === "granted") {
        new Notification("Smart Mandir", { body: message });
      }
    } catch (e) {}
    timeoutRef.current = setTimeout(fire, 24 * 60 * 60 * 1000);
  };
  timeoutRef.current = setTimeout(fire, ms);
}

// ---------------- ILLUSTRATION COMPONENTS ----------------
function MandalaBg({ opacity = 0.14, color = goldLight, size = 260 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: "absolute", opacity }}>
      {[86, 68, 50, 32].map((r, i) => (
        <circle key={r} cx={100} cy={100} r={r} fill="none" stroke={color} strokeWidth={i === 0 ? 1.2 : 0.6} strokeDasharray={i % 2 === 0 ? "2 4" : "none"} />
      ))}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <circle key={i} cx={100 + 92 * Math.cos(a)} cy={100 + 92 * Math.sin(a)} r={2} fill={color} />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = 100 + 32 * Math.cos(a), y1 = 100 + 32 * Math.sin(a);
        const x2 = 100 + 50 * Math.cos(a), y2 = 100 + 50 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={0.6} />;
      })}
    </svg>
  );
}

// Stylised, wholly-original devotional silhouette icons (flat geometric shapes, not
// traced from any existing artwork) that vary by a simple emblem per deity.
function DeitySilhouette({ variant = "krishna", size = 130, glow = true }) {
  const emblem = {
    krishna: { badge: "\u{1FA88}" },
    hanuman: { badge: "\u26D0\uFE0F" },
    ganesh: { badge: "\u2728" },
    vishnu: { badge: "\u2638\uFE0F" },
    lakshmi: { badge: "\u{1FAB7}" },
    shani: { badge: "\u2696\uFE0F" },
    surya: { badge: "\u2600\uFE0F" },
  }[variant] || { badge: OM };

  return (
    <svg width={size} height={size} viewBox="0 0 130 130" style={{ animation: glow ? "deityGlow 4s ease-in-out infinite" : "none" }}>
      <defs>
        <radialGradient id={`halo-${variant}`} cx="50%" cy="38%" r="55%">
          <stop offset="0%" stopColor={goldLight} stopOpacity={glow ? 0.55 : 0.25} />
          <stop offset="100%" stopColor={goldLight} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="100%" stopColor={gold} />
        </linearGradient>
      </defs>
      <circle cx="65" cy="55" r="55" fill={`url(#halo-${variant})`} />
      <path d="M45 34 L52 20 L58 32 L65 16 L72 32 L78 20 L85 34 Z" fill={`url(#body-${variant})`} />
      <circle cx="65" cy="17" r="3.2" fill={goldLight} />
      <circle cx="65" cy="46" r="15" fill={`url(#body-${variant})`} />
      <path d="M40 108 C40 78 50 60 65 60 C80 60 90 78 90 108 Z" fill={`url(#body-${variant})`} />
      <path d="M65 60 C65 78 65 96 65 108" stroke={maroon} strokeWidth={1} opacity={0.25} />
      <circle cx="98" cy="88" r="15" fill={maroon} stroke={goldLight} strokeWidth={1.2} />
      <text x="98" y="93" fontSize="14" textAnchor="middle">{emblem.badge}</text>
    </svg>
  );
}

function DiyaFlame({ size = 46, lit = true }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 60 78">
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="55%" stopColor={gold} />
          <stop offset="100%" stopColor="#8A3B2A" />
        </radialGradient>
        <linearGradient id="diyaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="100%" stopColor="#8A5A22" />
        </linearGradient>
      </defs>
      {lit && (
        <ellipse cx="30" cy="26" rx="10" ry="18" fill="url(#flameGrad)" style={{ transformOrigin: "30px 40px", animation: "flameFlicker 1.6s ease-in-out infinite" }} />
      )}
      <path d="M8 48 Q30 66 52 48 L46 54 Q30 62 14 54 Z" fill="url(#diyaGrad)" />
      <ellipse cx="30" cy="48" rx="22" ry="7" fill="url(#diyaGrad)" />
      <ellipse cx="30" cy="48" rx="15" ry="4" fill="#5C3A12" opacity={0.5} />
    </svg>
  );
}

function TempleArchStrip({ dark = true, height = 20 }) {
  const arches = 7;
  const w = 320;
  const color = dark ? "rgba(232,199,126,0.35)" : "rgba(138,59,42,0.25)";
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {Array.from({ length: arches }).map((_, i) => {
        const cx = (w / arches) * (i + 0.5);
        return <path key={i} d={`M ${cx - 20} ${height} Q ${cx} ${-2} ${cx + 20} ${height}`} fill="none" stroke={color} strokeWidth={1.4} />;
      })}
    </svg>
  );
}

const flameKeyframes = `
@keyframes flameFlicker {
  0%,100% { transform: scaleY(1) scaleX(1) rotate(0deg); }
  25% { transform: scaleY(1.06) scaleX(0.96) rotate(-1.5deg); }
  50% { transform: scaleY(0.96) scaleX(1.03) rotate(1deg); }
  75% { transform: scaleY(1.03) scaleX(0.98) rotate(-0.5deg); }
}
@keyframes deityGlow {
  0%,100% { filter: drop-shadow(0 0 6px rgba(201,151,62,0.35)); }
  50% { filter: drop-shadow(0 0 20px rgba(201,151,62,0.75)); }
}
@keyframes fadeInStep {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Preserve touch scrolling while keeping the phone UI free of browser scrollbars. */
.smart-mandir-screen, .smart-mandir-screen * {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.smart-mandir-screen::-webkit-scrollbar, .smart-mandir-screen *::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}`;

const pujaSteps = [
  { id: 1, type: "bell", content: "Soft temple bell", duration: "10 sec" },
  { id: 2, type: "darshan", content: "Live view of the deity", duration: "2 mins" },
  { id: 3, type: "aarti", content: "Om Jai Jagdish Hare", duration: "~ 2 mins", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Aarti_Shri_Radha_Govind%2C_Musical_Puja_Prayer.ogg", audioCredit: "Aarti Shri Radha Govind Dev Ji, Jaipur · CC0" },
  { id: 4, type: "mantra", content: "Om Namo Bhagavate Vasudevaya (21 times)", duration: "~ 3 mins", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Om_Namo_Bhagavate_Vasudevaya_Pronunciation.oga", audioLoop: true, audioCredit: "Mantra pronunciation by Tito Dutta · CC BY-SA 3.0" },
  { id: 5, type: "bhajan", content: "Achyutam Keshavam", duration: "~ 4 mins", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Bhajana.ogg", audioCredit: "Bhajana (1937 recording) · Public domain" },
  { id: 6, type: "gratitude", content: "Express thanks and surrender to divine", duration: "30 sec" },
];

const eveningSteps = [
  { id: 1, type: "bell", content: "Bell + Deepak", duration: "30 sec" },
  { id: 2, type: "darshan", content: "Live view of the deity", duration: "2 mins" },
  { id: 3, type: "aarti", content: "Om Jai Jagdish Hare", duration: "~ 2 mins" },
  { id: 4, type: "bhajan", content: "Hanuman Chalisa (Protection Path)", duration: "~ 4 mins" },
  { id: 5, type: "mantra", content: "Om Namah Shivaya", duration: "~ 2 mins" },
  { id: 6, type: "bhajan", content: "Shiv Kailasho Ke Vasi", duration: "~ 2 mins" },
  { id: 7, type: "gratitude", content: "Gratitude Close", duration: "30 sec" },
];

const weekDays = [
  { key: "Mon", full: "Monday", fullHi: "\u0938\u094B\u092E\u0935\u093E\u0930", focus: "Ganesh Focus", theme: "New Beginnings", description: "Start the week by clearing obstacles and setting fresh intent.", descriptionHi: "\u0935\u093F\u0918\u094D\u0928\u094B\u0902 \u0915\u094B \u0926\u0942\u0930 \u0915\u0930\u0915\u0947 \u0914\u0930 \u0928\u0908 \u0938\u094B\u091A \u0915\u0947 \u0938\u093E\u0925 \u0938\u092A\u094D\u0924\u093E\u0939 \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902\u0964", deity: "ganesh" },
  { key: "Tue", full: "Tuesday", fullHi: "\u092E\u0902\u0917\u0932\u0935\u093E\u0930", focus: "Hanuman Focus", theme: "Strength - Courage", description: "Draw on strength and steady courage for whatever today brings.", descriptionHi: "\u0906\u091C \u0915\u0947 \u0939\u0930 \u092A\u0932 \u0915\u0947 \u0932\u093F\u090F \u0936\u0915\u094D\u0924\u093F \u0914\u0930 \u0938\u094D\u0925\u093F\u0930 \u0938\u093E\u0939\u0938 \u092A\u093E\u090F\u0902\u0964", deity: "hanuman" },
  { key: "Wed", full: "Wednesday", fullHi: "\u092C\u0941\u0927\u0935\u093E\u0930", focus: "Vishnu Focus", theme: "Balance - Sustenance", description: "Find balance and steady sustenance through the middle of your week.", descriptionHi: "\u0938\u092A\u094D\u0924\u093E\u0939 \u0915\u0947 \u092C\u0940\u091A \u092E\u0947\u0902 \u0938\u0902\u0924\u0941\u0932\u0928 \u0914\u0930 \u0938\u094D\u0925\u093F\u0930\u0924\u093E \u092A\u093E\u090F\u0902\u0964", deity: "vishnu" },
  { key: "Thu", full: "Thursday", fullHi: "\u0917\u0941\u0930\u0941\u0935\u093E\u0930", focus: "Hari / Krishna Focus", theme: "Wisdom - Growth - Guidance", description: "Start your day with clarity & devotion.", descriptionHi: "\u0905\u092A\u0928\u0947 \u0926\u093F\u0928 \u0915\u0940 \u0936\u0941\u0930\u0941\u0906\u0924 \u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E \u0914\u0930 \u092D\u0915\u094D\u0924\u093F \u0938\u0947 \u0915\u0930\u0947\u0902\u0964", deity: "krishna" },
  { key: "Fri", full: "Friday", fullHi: "\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930", focus: "Lakshmi Focus", theme: "Abundance - Grace", description: "Invite abundance and grace as the week winds toward rest.", descriptionHi: "\u0938\u092A\u094D\u0924\u093E\u0939 \u0915\u0947 \u0905\u0902\u0924 \u092E\u0947\u0902 \u0938\u092E\u0943\u0926\u094D\u0927\u093F \u0914\u0930 \u0915\u0943\u092A\u093E \u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0915\u0930\u0947\u0902\u0964", deity: "lakshmi" },
  { key: "Sat", full: "Saturday", fullHi: "\u0936\u0928\u093F\u0935\u093E\u0930", focus: "Shani Focus", theme: "Discipline - Patience", description: "Practice patience and discipline; let go of what no longer serves you.", descriptionHi: "\u0927\u0948\u0930\u094D\u092F \u0914\u0930 \u0905\u0928\u0941\u0936\u093E\u0938\u0928 \u0915\u093E \u0905\u092D\u094D\u092F\u093E\u0938 \u0915\u0930\u0947\u0902; \u091C\u094B \u0905\u092C \u0915\u093E\u092E \u0915\u093E \u0928\u0939\u0940\u0902 \u0909\u0938\u0947 \u091B\u094B\u0921\u093C \u0926\u0947\u0902\u0964", deity: "shani" },
  { key: "Sun", full: "Sunday", fullHi: "\u0930\u0935\u093F\u0935\u093E\u0930", focus: "Surya Focus", theme: "Vitality - Clarity", description: "Rise with the sun and carry its vitality and clarity through your day.", descriptionHi: "\u0938\u0942\u0930\u094D\u092F \u0915\u0947 \u0938\u093E\u0925 \u0909\u0920\u0947\u0902 \u0914\u0930 \u0909\u0938\u0915\u0940 \u0938\u094D\u092B\u0942\u0930\u094D\u0924\u093F \u0914\u0930 \u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E \u0905\u092A\u0928\u0947 \u0926\u093F\u0928\u092D\u0930 \u0938\u093E\u0925 \u0930\u0916\u0947\u0902\u0964", deity: "surya" },
];
function getTodayInfo() {
  const idx = new Date().getDay(); // 0=Sun..6=Sat
  const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return weekDays.find((w) => w.key === order[idx]) || weekDays[3];
}
function getTodayKey() {
  const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return order[new Date().getDay()];
}

// ---------------- CUSTOM WEEKLY SCHEDULE ----------------
// Deities a person can assign to a day; each already has a dedicated DeitySilhouette emblem.
const SCHEDULABLE_DEITIES = ["ganesh", "hanuman", "vishnu", "krishna", "lakshmi", "shani", "surya"];
const DEITY_DISPLAY = {
  ganesh: { en: "Ganesh", hi: "\u0917\u0923\u0947\u0936" },
  hanuman: { en: "Hanuman", hi: "\u0939\u0928\u0941\u092E\u093E\u0928" },
  vishnu: { en: "Vishnu", hi: "\u0935\u093F\u0937\u094D\u0923\u0941" },
  krishna: { en: "Krishna", hi: "\u0915\u0943\u0937\u094D\u0923" },
  lakshmi: { en: "Lakshmi", hi: "\u0932\u0915\u094D\u0937\u094D\u092E\u0940" },
  shani: { en: "Shani", hi: "\u0936\u0928\u093F" },
  surya: { en: "Surya", hi: "\u0938\u0942\u0930\u094D\u092F" },
};
// Step types a person can include/exclude per day; bell + gratitude always bookend the ritual.
const SCHEDULABLE_STEP_TYPES = ["darshan", "aarti", "mantra", "bhajan"];

function defaultDaySchedule(dayKey) {
  const d = weekDays.find((w) => w.key === dayKey);
  return { active: true, deity: d ? d.deity : "krishna", steps: [...SCHEDULABLE_STEP_TYPES] };
}
// Merge a saved custom schedule (which may be partial/missing) with sane defaults for every day.
function normalizeSchedule(customSchedule) {
  const result = {};
  weekDays.forEach((d) => {
    const saved = customSchedule && customSchedule[d.key];
    result[d.key] = saved ? { ...defaultDaySchedule(d.key), ...saved } : defaultDaySchedule(d.key);
  });
  return result;
}
function getDaySchedule(dayKey, customSchedule) {
  if (customSchedule && customSchedule[dayKey]) return { ...defaultDaySchedule(dayKey), ...customSchedule[dayKey] };
  return defaultDaySchedule(dayKey);
}
// Filters the base morning ritual down to the step types this day's schedule includes.
// Bell and Gratitude are structural bookends and always stay.
function getStepsForDay(dayKey, customSchedule) {
  const sched = getDaySchedule(dayKey, customSchedule);
  const filtered = pujaSteps.filter((s) => s.type === "bell" || s.type === "gratitude" || sched.steps.includes(s.type));
  return filtered.length ? filtered : pujaSteps;
}

// =================================================================
// MUHURAT ENGINE: real sunrise/sunset astronomy (NOAA low-precision
// solar equations), used to derive Brahma Muhurta, Abhijit Muhurat,
// Rahu Kalam, Yamaganda and Sandhya Kaal for today at a given
// latitude/longitude. No external API — computed client-side.
// =================================================================
function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}
// Returns { sunrise, sunset, solarNoon } as Date objects (local device time)
function getSunTimes(date, lat, lon) {
  const rad = Math.PI / 180;
  const N = dayOfYear(date);
  const tzOffsetHours = -date.getTimezoneOffset() / 60;
  const gamma = ((2 * Math.PI) / 365) * (N - 1 + (12 - 12) / 24);

  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const latRad = lat * rad;
  const zenith = 90.833 * rad; // official sunrise/sunset zenith (refraction + solar radius)
  const cosHA = Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl)) - Math.tan(latRad) * Math.tan(decl);
  const clamped = Math.max(-1, Math.min(1, cosHA));
  const ha = Math.acos(clamped) / rad; // hour angle in degrees

  const solarNoonMin = 720 - 4 * lon - eqTime + tzOffsetHours * 60;
  const sunriseMin = solarNoonMin - 4 * ha;
  const sunsetMin = solarNoonMin + 4 * ha;

  const toDate = (mins) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    d.setMinutes(mins);
    return d;
  };
  return { sunrise: toDate(sunriseMin), sunset: toDate(sunsetMin), solarNoon: toDate(solarNoonMin) };
}
// Traditional 8-part division of the sunrise-sunset day; each "kalam" occupies one part.
// Part index (1-8) by weekday, per the standard panchang sequence.
const RAHU_KALAM_PART = { Sun: 8, Mon: 2, Tue: 7, Wed: 5, Thu: 6, Fri: 4, Sat: 3 };
const YAMAGANDA_PART = { Sun: 5, Mon: 4, Tue: 3, Wed: 2, Thu: 1, Fri: 7, Sat: 6 };
function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}
function computeMuhurats(date, lat, lon) {
  const { sunrise, sunset, solarNoon } = getSunTimes(date, lat, lon);
  const dayLenMin = (sunset - sunrise) / 60000;
  const partLen = dayLenMin / 8;
  const order = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const wd = order[date.getDay()];

  const rahuPart = RAHU_KALAM_PART[wd];
  const rahuStart = addMinutes(sunrise, (rahuPart - 1) * partLen);
  const rahuEnd = addMinutes(sunrise, rahuPart * partLen);

  const yamaPart = YAMAGANDA_PART[wd];
  const yamaStart = addMinutes(sunrise, (yamaPart - 1) * partLen);
  const yamaEnd = addMinutes(sunrise, yamaPart * partLen);

  return {
    sunrise,
    sunset,
    solarNoon,
    brahmaMuhurtaStart: addMinutes(sunrise, -96),
    brahmaMuhurtaEnd: addMinutes(sunrise, -48),
    abhijitStart: addMinutes(solarNoon, -24),
    abhijitEnd: addMinutes(solarNoon, 24),
    abhijitSkipped: wd === "Wed",
    sandhyaEveningStart: addMinutes(sunset, -24),
    sandhyaEveningEnd: addMinutes(sunset, 24),
    pratahSandhyaStart: addMinutes(sunrise, -24),
    pratahSandhyaEnd: addMinutes(sunrise, 24),
    rahuKalamStart: rahuStart,
    rahuKalamEnd: rahuEnd,
    yamagandaStart: yamaStart,
    yamagandaEnd: yamaEnd,
  };
}
function fmtTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const aartiLibrary = [
  { name: "Om Jai Jagdish Hare", deity: "Vishnu", day: "Daily", duration: "2:10", trending: true },
  { name: "Jai Ganesh Deva", deity: "Ganesh", day: "Mon", duration: "4:12", trending: true },
  { name: "Sukhkarta Dukhharta", deity: "Ganesh", day: "Mon", duration: "5:03" },
  { name: "Ganpati Bappa Morya Aarti", deity: "Ganesh", day: "Mon", duration: "3:20" },
  { name: "Aarti Kije Hanuman Lala Ki", deity: "Hanuman", day: "Tue", duration: "4:47", trending: true },
  { name: "Sukh Sampatti Ke Data Vishnu", deity: "Vishnu", day: "Wed", duration: "3:35" },
  { name: "Saraswati Vandana Aarti", deity: "Saraswati", day: "Wed", duration: "4:10" },
  { name: "Aarti Kunj Bihari Ki", deity: "Krishna", day: "Thu", duration: "4:20", trending: true },
  { name: "Jai Radha Madhav Aarti", deity: "Krishna", day: "Thu", duration: "4:33" },
  { name: "Sri Ramchandra Kripalu", deity: "Ram", day: "Thu", duration: "4:02" },
  { name: "Om Jai Lakshmi Mata", deity: "Lakshmi", day: "Fri", duration: "4:55" },
  { name: "Jai Ambe Gauri", deity: "Durga", day: "Fri", duration: "5:40" },
  { name: "Om Jai Shani Dev", deity: "Shani", day: "Sat", duration: "4:05" },
  { name: "Om Jai Shiv Omkara", deity: "Shiv", day: "Sat", duration: "5:15" },
  { name: "Om Jai Surya Bhagwan", deity: "Surya", day: "Sun", duration: "3:48" },
];

const mantraLibrary = [
  { name: "Om Namah Shivaya", deity: "Shiv", day: "Sat", duration: "3 min repeat", trending: true },
  { name: "Mahamrityunjaya Mantra", deity: "Shiv", day: "Sat", duration: "5 min repeat" },
  { name: "Om Gan Ganapataye Namah", deity: "Ganesh", day: "Mon", duration: "3 min repeat" },
  { name: "Panchakshari Mantra (Slow)", deity: "Shiv", day: "Mon", duration: "4 min repeat" },
  { name: "Om Hanumate Namah", deity: "Hanuman", day: "Tue", duration: "3 min repeat" },
  { name: "Hanuman Bahuk Mantra", deity: "Hanuman", day: "Tue", duration: "4 min repeat" },
  { name: "Om Namo Narayanaya", deity: "Vishnu", day: "Wed", duration: "3 min repeat" },
  { name: "Om Aim Saraswatyai Namah", deity: "Saraswati", day: "Wed", duration: "3 min repeat" },
  { name: "Om Namo Bhagavate Vasudevaya", deity: "Krishna", day: "Thu", duration: "3 min repeat", trending: true },
  { name: "Krishna Mool Mantra (Om Kleem Krishnaya Namah)", deity: "Krishna", day: "Thu", duration: "3 min repeat" },
  { name: "Shri Ram Jai Ram Jai Jai Ram", deity: "Ram", day: "Thu", duration: "4 min repeat" },
  { name: "Om Shreem Mahalakshmiyei Namah", deity: "Lakshmi", day: "Fri", duration: "3 min repeat" },
  { name: "Om Dum Durgayei Namah", deity: "Durga", day: "Fri", duration: "3 min repeat" },
  { name: "Shani Beej Mantra", deity: "Shani", day: "Sat", duration: "3 min repeat" },
  { name: "Gayatri Mantra", deity: "Surya", day: "Sun", duration: "4 min repeat", trending: true },
  { name: "Surya Beej Mantra", deity: "Surya", day: "Sun", duration: "3 min repeat" },
];

const bhajanLibrary = [
  { name: "Achyutam Keshavam", deity: "Krishna", day: "Thu", duration: "4:35", fav: true },
  { name: "Govind Bolo Hari Gopal Bolo", deity: "Krishna", day: "Thu", duration: "4:10" },
  { name: "Madhurashtakam", deity: "Krishna", day: "Thu", duration: "4:08" },
  { name: "Shri Krishna Govind Hare Murari", deity: "Krishna", day: "Thu", duration: "5:20", trending: true },
  { name: "Maiya Yashoda", deity: "Krishna", day: "Thu", duration: "3:55" },
  { name: "Ram Siya Ram (Slow)", deity: "Ram", day: "Thu", duration: "6:12" },
  { name: "Deva Shree Ganesha", deity: "Ganesh", day: "Mon", duration: "4:44", trending: true },
  { name: "Jai Ganesh Jai Ganesh Deva", deity: "Ganesh", day: "Mon", duration: "3:50" },
  { name: "Sankat Mochan Naam Tiharo", deity: "Hanuman", day: "Tue", duration: "4:30" },
  { name: "Bajrangbali Hanuman", deity: "Hanuman", day: "Tue", duration: "4:15" },
  { name: "Hanuman Chalisa (Bhajan Style)", deity: "Hanuman", day: "Tue", duration: "9:41", fav: true, trending: true },
  { name: "Vaishnav Jan To", deity: "Vishnu", day: "Wed", duration: "5:10" },
  { name: "Shiv Kailasho Ke Vasi", deity: "Shiv", day: "Sat", duration: "5:22" },
  { name: "Om Jai Shani Dev Bhajan", deity: "Shani", day: "Sat", duration: "4:12" },
  { name: "Jai Lakshmi Ramana", deity: "Lakshmi", day: "Fri", duration: "4:02" },
  { name: "Suraj Hai Balak", deity: "Surya", day: "Sun", duration: "3:33" },
];

const stotraLibrary = [
  { name: "Hanuman Chalisa", deity: "Hanuman", day: "Tue", duration: "9:41", trending: true },
  { name: "Ram Raksha Stotram", deity: "Ram", day: "Thu", duration: "8:10" },
  { name: "Achyutashtakam (Krishna Stotram)", deity: "Krishna", day: "Thu", duration: "5:40" },
  { name: "Vishnu Sahasranamam", deity: "Vishnu", day: "Wed", duration: "25:00", trending: true },
  { name: "Vishnu Chalisa", deity: "Vishnu", day: "Wed", duration: "6:15" },
  { name: "Saraswati Stotram", deity: "Saraswati", day: "Wed", duration: "4:50" },
  { name: "Sankashtanashana Ganesh Stotra", deity: "Ganesh", day: "Mon", duration: "5:15" },
  { name: "Shiv Tandav Stotram", deity: "Shiv", day: "Sat", duration: "6:40", trending: true },
  { name: "Shani Chalisa", deity: "Shani", day: "Sat", duration: "6:45" },
  { name: "Navgraha Stotram", deity: "Navgraha", day: "Sat", duration: "7:30" },
  { name: "Kanakadhara Stotram (Lakshmi)", deity: "Lakshmi", day: "Fri", duration: "6:02" },
  { name: "Durga Chalisa", deity: "Durga", day: "Fri", duration: "7:10" },
  { name: "Kali Chalisa", deity: "Durga", day: "Fri", duration: "5:55" },
  { name: "Aditya Hridayam", deity: "Surya", day: "Sun", duration: "8:20" },
  { name: "Surya Chalisa", deity: "Surya", day: "Sun", duration: "6:05" },
];

const libraryData = { Aarti: aartiLibrary, Mantra: mantraLibrary, Bhajan: bhajanLibrary, Stotra: stotraLibrary };

const dayFilters = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const aartiLyricsHindi = [
  "\u0950 \u091C\u092F \u091C\u0917\u0926\u0940\u0936 \u0939\u0930\u0947, \u0938\u094D\u0935\u093E\u092E\u0940 \u091C\u092F \u091C\u0917\u0926\u0940\u0936 \u0939\u0930\u0947\u0964",
  "\u092D\u0915\u094D\u0924 \u091C\u0928\u094B\u0902 \u0915\u0947 \u0938\u0902\u0915\u091F, \u0915\u094D\u0937\u0923 \u0926\u0942\u0930 \u0915\u0930\u0947 \u0964\u0964",
  "\u0950 \u091C\u092F \u091C\u0917\u0926\u0940\u0936 \u0939\u0930\u0947, \u0938\u094D\u0935\u093E\u092E\u0940 \u091C\u092F \u091C\u0917\u0926\u0940\u0936 \u0939\u0930\u0947\u0964",
];

function FadeIn({ children, style }) {
  return <div style={{ animation: "fadeInStep .5s ease", display: "flex", flexDirection: "column", flex: 1, ...style, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>{children}</div>;
}

function Screen({ children }) {
  return (
    <div
      className="smart-mandir-screen"
      style={{
        width: 360,
        height: "min(720px, calc(100svh - 40px))",
        minHeight: 0,
        background: cream,
        borderRadius: 34,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Poppins','Segoe UI',sans-serif",
        boxShadow: "0 0 0 8px #111, 0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      <style>{flameKeyframes}</style>
      {children}
    </div>
  );
}

function StatusBar({ dark }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 22px 4px",
        fontSize: 13,
        fontWeight: 600,
        color: dark ? cream : textDark,
      }}
    >
      <span>9:41</span>
      <span style={{ display: "flex", gap: 5 }}>
        <span>{"\u2022\u2022\u2022"}</span>
      </span>
    </div>
  );
}

function TopBar({ title, onBack, dark, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 18px 14px",
        color: dark ? cream : textDark,
      }}
    >
      <div style={{ width: 30 }}>
        {onBack && (
          <button onClick={onBack} style={iconBtnStyle(dark)}>
            <ArrowLeft size={18} />
          </button>
        )}
      </div>
      <div style={{ fontWeight: 600, fontSize: 17 }}>{title}</div>
      <div style={{ width: 30, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

function iconBtnStyle(dark) {
  return {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "none",
    background: dark ? "rgba(255,255,255,0.12)" : "#F0E4D3",
    color: dark ? cream : textDark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };
}

function BottomNav({ active, onChange }) {
  const { t } = useLang();
  const items = [
    { key: "home", label: t("navHome"), icon: Home },
    { key: "puja", label: t("navPuja"), icon: Flame },
    { key: "explore", label: t("navExplore"), icon: Compass },
    { key: "library", label: t("navLibrary"), icon: BookOpen },
    { key: "profile", label: t("navProfile"), icon: User },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 6px 16px",
        background: maroon,
        borderTop: `1px solid ${maroonMid}`,
      }}
    >
      {items.map((it) => {
        const isActive = active === it.key;
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: isActive ? gold : "#C9A38E",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #F0E4D3",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ---------------- HOME ----------------
function HomeScreen({ goPuja, streak, morningIndex, eveningIndex, profile, onOpenMuhurat, customSchedule }) {
  const { lang, t } = useLang();
  const today = getTodayInfo();
  const todayKey = getTodayKey();
  const sched = getDaySchedule(todayKey, customSchedule);
  const daySteps = getStepsForDay(todayKey, customSchedule);
  const todayFull = lang === "hi" ? today.fullHi : today.full;
  const todayDesc = lang === "hi" ? today.descriptionHi : today.description;
  const mins = estimateMinutes(daySteps);
  const deityName = DEITY_DISPLAY[sched.deity] ? (DEITY_DISPLAY[sched.deity][lang] || DEITY_DISPLAY[sched.deity].en) : sched.deity.charAt(0).toUpperCase() + sched.deity.slice(1);
  const muhuratPreview = computeMuhurats(new Date(), DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
  const inProgress = (morningIndex > 0 && morningIndex < pujaSteps.length) || (eveningIndex > 0 && eveningIndex < eveningSteps.length);
  const resumeRitual = morningIndex > 0 && morningIndex < pujaSteps.length ? "morning" : "evening";
  const resumeSteps = resumeRitual === "morning" ? pujaSteps : eveningSteps;
  const resumeIndex = resumeRitual === "morning" ? morningIndex : eveningIndex;
  const recommended = profile && profile.devta
    ? bhajanLibrary.find((b) => b.deity.toLowerCase() === profile.devta.toLowerCase()) || bhajanLibrary.find((b) => b.trending)
    : null;

  return (
    <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
      <div style={{ background: maroon, paddingBottom: 22 }}>
        <StatusBar dark />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 4px" }}>
          <div>
            <div style={{ color: goldLight, fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>{t("appName")}</div>
            <div style={{ color: "#D8B98C", fontSize: 9, letterSpacing: 2 }}>{t("tagline")}</div>
          </div>
          <Bell size={18} color={cream} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "14px 20px 0", color: cream }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{t("greeting")}, Manish Yadav {HANDS}</div>
            <div style={{ fontSize: 12, color: "#D8B98C" }}>{todayFull}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "4px 10px" }}>
            <DiyaFlame size={16} />
            <span style={{ fontSize: 12, fontWeight: 700, color: goldLight }}>{streak}d</span>
          </div>
        </div>

        {/* Today's Ritual Card (Module 3), now respecting the custom weekly schedule */}
        <div style={{ margin: "14px 20px 0", borderRadius: 16, overflow: "hidden", position: "relative", height: 190, background: "linear-gradient(135deg,#7a2b1f,#2c0a0c)" }}>
          <div style={{ position: "absolute", top: -30, right: -10, opacity: 0.9 }}>
            <MandalaBg size={210} opacity={0.16} />
          </div>
          <div style={{ position: "absolute", top: 8, right: 10 }}>
            <DeitySilhouette variant={sched.deity} size={108} glow={sched.active} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "16px 14px", color: cream, boxSizing: "border-box" }}>
            <div style={{ width: "calc(100% - 112px)", position: "relative", zIndex: 1 }}>
              {sched.active ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{"\u2728"} {todayFull} {t("divineFlow")}</div>
                  <div style={{ fontSize: 11, color: goldLight, marginBottom: 2 }}>{deityName} {t("guidanceDay")}</div>
                  <div style={{ fontSize: 11, color: "#EAD9C4", marginBottom: 10 }}>{todayDesc}</div>
                  <button onClick={() => goPuja("morning")} style={{ background: maroon, color: gold, border: `1px solid ${gold}`, borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    {t("beginMinPuja", mins)} <ChevronRight size={13} />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{"\uD83C\uDF3F"} {t("restDayHomeTitle")}</div>
                  <div style={{ fontSize: 11, color: "#EAD9C4", marginBottom: 10 }}>{t("restDayHomeDesc")}</div>
                  <button onClick={() => goPuja("morning")} style={{ background: "rgba(255,255,255,0.1)", color: goldLight, border: `1px solid ${gold}`, borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    {t("beginAnyway")} <ChevronRight size={13} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10, padding: "0 6px" }}><TempleArchStrip height={14} /></div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {inProgress && (
          <div
            onClick={() => goPuja(resumeRitual)}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "#FBEAD2", border: `1px solid ${gold}`, borderRadius: 14, padding: 12, marginBottom: 16, cursor: "pointer" }}
          >
            <DiyaFlame size={26} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8A3B2A" }}>{t("continueWhereLeftOff")}</div>
              <div style={{ fontSize: 10, color: textMuted }}>{guided(resumeSteps[Math.min(resumeIndex, resumeSteps.length - 1)], lang).title} &middot; {t("step")} {Math.min(resumeIndex + 1, resumeSteps.length)} {t("of")} {resumeSteps.length}</div>
            </div>
            <ChevronRight size={16} color="#8A3B2A" />
          </div>
        )}

        {recommended && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 12, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0E4D3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Music2 size={15} color="#8A3B2A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: "#B5824A", fontWeight: 700 }}>{t("recommendedForYou")}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: textDark }}>{recommended.name}</div>
            </div>
            <span style={{ fontSize: 10, color: textMuted }}>{recommended.duration}</span>
          </div>
        )}

        <div onClick={onOpenMuhurat} style={{ background: "linear-gradient(135deg,#FBEAD2,#F3D9A8)", border: `1px solid ${gold}`, borderRadius: 14, padding: 12, marginBottom: 16, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#8A3B2A" }}>{"\u2600\uFE0F"} {t("todaysMuhurat")}</span>
            <ChevronRight size={15} color="#8A3B2A" />
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, color: "#B5824A", fontWeight: 700 }}>{t("brahmaMuhurta").toUpperCase()}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: textDark }}>
                {fmtTime(muhuratPreview.brahmaMuhurtaStart)} {"\u2013"} {fmtTime(muhuratPreview.brahmaMuhurtaEnd)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#B5342A", fontWeight: 700 }}>{t("rahuKalam").toUpperCase()}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#B5342A" }}>
                {fmtTime(muhuratPreview.rahuKalamStart)} {"\u2013"} {fmtTime(muhuratPreview.rahuKalamEnd)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 600, color: textDark, fontSize: 13 }}>{t("continueJourney")}</span>
          <span style={{ color: "#B5824A", fontSize: 11 }}>{t("viewAll")}</span>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <Card style={{ flex: 1, padding: 12, background: "linear-gradient(160deg,#FBEAD2,#F3D9A8)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -14, top: -14, opacity: 0.5 }}><MandalaBg size={90} color="#B5824A" opacity={0.5} /></div>
            <Sun size={16} color="#B5824A" />
            <div style={{ fontWeight: 600, fontSize: 12, marginTop: 6, color: textDark }}>{t("shubhPrabhatPuja")}</div>
            <div style={{ fontSize: 10, color: textMuted }}>{estimateMinutes(pujaSteps)} {t("mins")}</div>
          </Card>
          <Card style={{ flex: 1, padding: 12, background: "linear-gradient(160deg,#3a1015,#1a0708)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -14, top: -14, opacity: 0.5 }}><MandalaBg size={90} color={goldLight} opacity={0.5} /></div>
            <Moon size={16} color={goldLight} />
            <div style={{ fontWeight: 600, fontSize: 12, marginTop: 6, color: cream }}>{t("sandhyaShantiPuja")}</div>
            <div style={{ fontSize: 10, color: "#C9A38E" }}>{estimateMinutes(eveningSteps)} {t("mins")}</div>
          </Card>
        </div>

        <div style={{ fontWeight: 600, color: textDark, fontSize: 13, marginBottom: 8 }}>{t("quickAccess")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, textAlign: "center" }}>
          {[
            { label: t("qAarti"), diya: true },
            { label: t("qDarshan"), live: true },
            { label: t("qMantra"), om: true },
            { label: t("qBhajan"), icon: Music2 },
          ].map((item) => (
            <div key={item.label} style={{ background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: "10px 4px 8px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "center", color: "#8A3B2A", marginBottom: 2, height: 26, alignItems: "center" }}>
                {item.diya ? <DiyaFlame size={20} /> : item.live ? <Users size={16} /> : item.om ? <span style={{ fontSize: 16 }}>{OM}</span> : <item.icon size={16} />}
              </div>
              <div style={{ fontSize: 10, color: textDark }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- PUJA FLOW ----------------
function PujaFlowScreen({ steps, current, onStepClick, onStartFrom, onBack, title }) {
  const { lang, t } = useLang();
  const totalMin = estimateMinutes(steps);
  const currentStep = steps[current];
  return (
    <FadeIn>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <StatusBar />
        <TopBar title={t("pujaFlowTitle")} onBack={onBack} right={<Settings size={16} color={textDark} />} />
        <div style={{ padding: "0 20px" }}>
          <div style={{ color: "#8A3B2A", fontWeight: 700, fontSize: 17 }}>{title}</div>
          <div style={{ color: textMuted, fontSize: 12, marginBottom: 14 }}>{t("totalTime")}: {totalMin} {t("mins")}</div>

          {steps.map((s, i) => {
            const isDone = i < current;
            const isCurrent = i === current;
            const isLocked = i > current;
            const g = guided(s, lang);
            return (
              <div
                key={s.id}
                onClick={() => !isLocked && onStepClick(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  marginBottom: 10,
                  background: isCurrent ? "#FBEAD2" : "#fff",
                  border: isCurrent ? `1px solid ${gold}` : "1px solid #F0E4D3",
                  cursor: isLocked ? "default" : "pointer",
                  opacity: isLocked ? 0.55 : 1,
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: isDone ? "#E7EFE0" : isCurrent ? maroon : "#F5EFE4", display: "flex", alignItems: "center", justifyContent: "center", color: isDone ? "#4E7A34" : isCurrent ? gold : textMuted, fontSize: 15 }}>
                  {isDone ? <Check size={16} /> : isLocked ? <Lock size={14} /> : <span>{g.icon}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: textDark }}>{g.title}</div>
                  <div style={{ fontSize: 10, color: textMuted }}>{g.subtitle}</div>
                </div>
                <div style={{ fontSize: 10, color: textMuted, whiteSpace: "nowrap" }}>{s.duration}</div>
                {isCurrent && <ChevronRight size={16} color={textMuted} />}
              </div>
            );
          })}

          <button
            onClick={() => onStartFrom(current)}
            style={{ width: "100%", background: maroon, color: gold, border: "none", borderRadius: 24, padding: "13px 0", fontWeight: 600, fontSize: 14, marginTop: 6, cursor: "pointer" }}
          >
            {current >= steps.length ? t("pujaCompleteBtn") : guided(currentStep, lang).cta}
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

function useAudioTrack(src, loop = false) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return undefined;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audio.loop = loop;
    const onLoaded = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onTime = () => setElapsed(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => { setPlaying(false); setError(true); };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [src, loop]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) await audio.play();
      else audio.pause();
    } catch (e) {
      setError(true);
    }
  };
  const seek = (value) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(value)) {
      audio.currentTime = value;
      setElapsed(value);
    }
  };
  return { playing, elapsed, duration, error, toggle, seek };
}

function AudioTrackPlayer({ src, loop = false, credit, dark = false }) {
  const { t } = useLang();
  const { playing, error, toggle } = useAudioTrack(src, loop);
  if (!src) return null;
  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, background: dark ? "rgba(255,255,255,0.08)" : "#fff", color: dark ? goldLight : "#8A3B2A", border: `1px solid ${gold}`, borderRadius: 18, padding: "7px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
      >
        {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />} {playing ? t("pauseAudio") : t("playAudio")}
      </button>
      {credit && <div style={{ color: dark ? "#C9A38E" : textMuted, fontSize: 9, marginTop: 5 }}>{credit}</div>}
      {error && <div style={{ color: "#B5342A", fontSize: 9, marginTop: 5 }}>{t("audioUnavailable")}</div>}
    </div>
  );
}

// ---------------- AARTI PLAYER ----------------
function AartiScreen({ onBack, onComplete, deity = "krishna", content = "Om Jai Jagdish Hare", audioUrl, audioCredit }) {
  const { lang, t } = useLang();
  const [tab, setTab] = useState("lyrics");
  const [repeatCount, setRepeatCount] = useState(21);
  const { playing, elapsed, duration: loadedDuration, error: audioError, toggle, seek } = useAudioTrack(audioUrl);
  const duration = loadedDuration || 130;
  const g = stepCopyI18n[lang].aarti;

  useEffect(() => {
    playBell();
    vibrate(30);
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const finish = () => {
    playTick();
    vibrate(15);
    onComplete();
  };

  return (
    <FadeIn style={{ background: "linear-gradient(180deg,#2B0F12,#1a0708)" }}>
      <StatusBar dark />
      <TopBar
        title={t("qAarti")}
        onBack={onBack}
        dark
        right={<MoreVertical size={16} color={cream} />}
      />
      <div style={{ textAlign: "center", marginTop: -6, marginBottom: 6 }}>
        <div style={{ color: cream, fontWeight: 700, fontSize: 16 }}>{g.icon} {g.title}</div>
        <div style={{ color: "#C9A38E", fontSize: 11 }}>{g.subtitle}</div>
      </div>

      <div style={{ margin: "0 24px", borderRadius: 16, overflow: "hidden", height: 180, background: "radial-gradient(circle at 50% 20%,#7a3d14,#2c1005 75%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute" }}><MandalaBg size={200} opacity={0.18} /></div>
        <DeitySilhouette variant={deity} size={128} glow />
        <div style={{ position: "absolute", bottom: 8, display: "flex", gap: 18 }}>
          <DiyaFlame size={26} />
          <DiyaFlame size={26} />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 14 }}>
        <div style={{ color: cream, fontWeight: 700, fontSize: 18 }}>{content}</div>
        <div style={{ color: "#C9A38E", fontSize: 11 }}>{t("traditionalAarti")}</div>
        {audioCredit && <div style={{ color: "#C9A38E", fontSize: 9, marginTop: 6 }}>{audioCredit}</div>}
        {audioError && <div style={{ color: "#E7B9AE", fontSize: 9, marginTop: 4 }}>{t("audioUnavailable")}</div>}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "14px 0 10px" }}>
        {["lyrics", "meaning-hi", "meaning-en"].map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            style={{
              background: tab === tb ? gold : "rgba(255,255,255,0.08)",
              color: tab === tb ? "#3a1f05" : "#E8D9C8",
              border: "none",
              borderRadius: 16,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tb === "lyrics" ? t("lyrics") : tb === "meaning-hi" ? t("meaningHi") : t("meaningEn")}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 26px", color: "#F3E4CE", fontSize: 15, lineHeight: 1.9, textAlign: "center" }}>
        {tab === "lyrics" && aartiLyricsHindi.map((l, i) => <div key={i}>{l}</div>)}
        {tab === "meaning-hi" && (
          <div style={{ fontSize: 13, color: "#E8D9C8" }}>
            यह आरती भगवान से जीवन के कष्टों को दूर करने और भक्तों की रक्षा करने की प्रार्थना है। यह विश्वास और समर्पण का भाव व्यक्त करती है।
          </div>
        )}
        {tab === "meaning-en" && (
          <div style={{ fontSize: 13, color: "#E8D9C8" }}>
            This aarti is a plea to the divine to lift away life's troubles and watch over those who seek shelter, sung in a spirit of trust and surrender.
          </div>
        )}
      </div>

      <div style={{ padding: "0 26px" }}>
        <input
          type="range"
          min={0}
          max={duration}
          value={elapsed}
          onChange={(e) => seek(Number(e.target.value))}
          style={{ width: "100%", accentColor: gold }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#C9A38E" }}>
          <span>{fmt(elapsed)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 26, padding: "10px 0 6px" }}>
        <Repeat size={16} color="#C9A38E" />
        <SkipBack size={20} color={cream} />
        <button
          onClick={toggle}
          style={{ width: 54, height: 54, borderRadius: "50%", background: maroon, border: `2px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          {playing ? <Pause size={22} color={gold} /> : <Play size={22} color={gold} style={{ marginLeft: 2 }} />}
        </button>
        <SkipForward size={20} color={cream} />
        <Repeat size={16} color="#C9A38E" style={{ opacity: 0 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "6px 0 18px" }}>
        {[11, 21, 108].map((n) => (
          <button
            key={n}
            onClick={() => setRepeatCount(n)}
            style={{
              background: repeatCount === n ? gold : "rgba(255,255,255,0.08)",
              color: repeatCount === n ? "#3a1f05" : "#E8D9C8",
              border: "none",
              borderRadius: 10,
              padding: "6px 16px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
        <button onClick={finish} style={{ background: "none", border: `1px solid ${gold}`, color: gold, borderRadius: 10, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>
          {t("doneLabel")} <Check size={11} style={{ verticalAlign: -1 }} />
        </button>
      </div>
    </FadeIn>
  );
}

// ---------------- LIVE DARSHAN ----------------
function LiveDarshanScreen({ onBack, onComplete, deity = "krishna", templeName = "Shree Krishna Mandir" }) {
  const { lang, t } = useLang();
  const DURATION = 120;
  const [remaining, setRemaining] = useState(DURATION);
  const [muted, setMuted] = useState(false);
  const [pranams, setPranams] = useState(1204);
  const [justSent, setJustSent] = useState(false);
  const intervalRef = useRef(null);
  const g = stepCopyI18n[lang].darshan;

  useEffect(() => {
    playBell();
    vibrate(30);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const complete = remaining <= 0;

  const sendPranam = () => {
    setPranams((p) => p + 1);
    setJustSent(true);
    playTick();
    vibrate(10);
    setTimeout(() => setJustSent(false), 500);
  };

  const finish = () => {
    playTick();
    vibrate(15);
    onComplete();
  };

  return (
    <FadeIn style={{ background: "radial-gradient(circle at 50% 12%,#5c2410,#170608 78%)", position: "relative", overflow: "hidden" }}>
      <StatusBar dark />
      <TopBar
        title={t("liveDarshanTitle")}
        onBack={onBack}
        dark
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#B5342A", borderRadius: 10, padding: "2px 8px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "flameFlicker 1.2s infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>LIVE</span>
          </div>
        }
      />
      <div style={{ textAlign: "center", marginTop: -4 }}>
        <div style={{ color: cream, fontWeight: 600, fontSize: 13 }}>{g.icon} {g.title}</div>
        <div style={{ color: "#C9A38E", fontSize: 10 }}>{g.subtitle}</div>
      </div>

      <div style={{ position: "absolute", inset: 0, top: 56, display: "flex", justifyContent: "center" }}>
        <MandalaBg size={320} opacity={0.14} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <DeitySilhouette variant={deity} size={190} glow />
        <div style={{ display: "flex", gap: 22, marginTop: 2 }}>
          <DiyaFlame size={24} />
          <DiyaFlame size={24} />
        </div>
      </div>

      <div style={{ textAlign: "center", color: cream, position: "relative" }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{templeName}</div>
        <div style={{ fontSize: 11, color: "#C9A38E", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Users size={11} /> {pranams.toLocaleString()} {t("devoteesPresent")}
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "10px 0", position: "relative" }}>
        <div style={{ fontSize: 11, color: "#C9A38E" }}>{complete ? t("darshanCompleteLabel") : t("darshanEndsIn")}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: gold, fontFamily: "serif" }}>{fmt(remaining)}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, padding: "6px 0 22px", position: "relative" }}>
        <button onClick={() => setMuted((m) => !m)} style={{ ...circleBtn(44), background: "rgba(255,255,255,0.1)", border: "none" }}>
          {muted ? <VolumeX size={17} color={cream} /> : <Volume2 size={17} color={cream} />}
        </button>
        <button
          onClick={sendPranam}
          style={{ ...circleBtn(62), background: maroon, border: `2px solid ${gold}`, transform: justSent ? "scale(1.08)" : "scale(1)", transition: "transform .15s" }}
        >
          <span style={{ fontSize: 24 }}>{HANDS}</span>
        </button>
        <button
          onClick={finish}
          style={{ ...circleBtn(44), background: complete ? gold : "rgba(255,255,255,0.1)", border: "none" }}
        >
          <Check size={17} color={complete ? "#3a1f05" : cream} />
        </button>
      </div>
      <div style={{ textAlign: "center", fontSize: 10, color: "#C9A38E", paddingBottom: 10, position: "relative" }}>
        {t("tapPranam")}
      </div>
    </FadeIn>
  );
}

// ---------------- MANTRA / MALA COUNTER ----------------
function MantraScreen({ onBack, onComplete, content = "Om Namo Bhagavate Vasudevaya", audioUrl, audioCredit }) {
  const { lang, t } = useLang();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(21);
  const beadCount = 12;
  const g = stepCopyI18n[lang].mantra;

  useEffect(() => {
    playBell();
    vibrate(20);
  }, []);

  const bump = (delta) => {
    setCount((c) => {
      const next = Math.max(0, Math.min(target, c + delta));
      if (delta > 0) {
        playTick();
        vibrate(8);
      }
      return next;
    });
  };

  const finish = () => {
    playTick();
    vibrate(15);
    onComplete();
  };

  return (
    <FadeIn>
      <StatusBar />
      <TopBar title="" onBack={onBack} />
      <div style={{ textAlign: "center", marginBottom: 2 }}>
        <div style={{ color: "#8A3B2A", fontWeight: 700, fontSize: 14 }}>{g.icon} {g.title}</div>
        <div style={{ color: textMuted, fontSize: 10 }}>{g.subtitle}</div>
      </div>
      <div style={{ textAlign: "center", color: "#8A3B2A", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
        {content}
      </div>
      <div style={{ textAlign: "center", marginBottom: 4 }}><AudioTrackPlayer src={audioUrl} loop credit={audioCredit} /></div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute" }}><MandalaBg size={240} color="#B5824A" opacity={0.22} /></div>
        <svg width={220} height={220} viewBox="0 0 220 220">
          {Array.from({ length: beadCount }).map((_, i) => {
            const angle = (i / beadCount) * 2 * Math.PI - Math.PI / 2;
            const r = 95;
            const cx = 110 + r * Math.cos(angle);
            const cy = 110 + r * Math.sin(angle);
            const litUp = i < Math.min(beadCount, Math.round((count / Math.max(target, 1)) * beadCount));
            return <circle key={i} cx={cx} cy={cy} r={11} fill={litUp ? gold : "#EADFC9"} stroke="#B5824A" strokeWidth={1} />;
          })}
        </svg>
        <div style={{ position: "absolute", textAlign: "center" }}>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#8A3B2A", fontFamily: "serif" }}>{count}</div>
          <div style={{ fontSize: 12, color: textMuted }}>/{target} {t("chants")}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 22, marginBottom: 16 }}>
        <button onClick={() => bump(-1)} style={circleBtn()}>
          <Minus size={18} color="#8A3B2A" />
        </button>
        <button
          onClick={() => bump(1)}
          style={{ ...circleBtn(64), background: maroon, color: gold, border: `2px solid ${gold}` }}
        >
          <Plus size={22} />
        </button>
        <button onClick={() => setCount(0)} style={circleBtn()}>
          <span style={{ fontSize: 11, color: "#8A3B2A" }}>{t("reset")}</span>
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        {[11, 21, 108].map((n) => (
          <button
            key={n}
            onClick={() => { setTarget(n); setCount(0); }}
            style={{
              background: target === n ? gold : "#fff",
              border: target === n ? "none" : "1px solid #E0D2BB",
              color: target === n ? "#3a1f05" : textDark,
              borderRadius: 10,
              padding: "8px 20px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {count >= target && (
        <div style={{ padding: "0 24px 20px" }}>
          <button onClick={finish} style={{ width: "100%", background: maroon, color: gold, border: "none", borderRadius: 24, padding: "13px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
            {t("doneLabel")}
          </button>
        </div>
      )}
    </FadeIn>
  );
}
function circleBtn(size = 46) {
  return { width: size, height: size, borderRadius: "50%", border: "1px solid #E0D2BB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
}

// ---------------- SIMPLE STEP (bhajan / gratitude) ----------------
function SimpleStepScreen({ step, onBack, onComplete, deity = "krishna" }) {
  const { lang } = useLang();
  const g = guided(step, lang);

  useEffect(() => {
    if (step.type === "bell") {
      playBell();
      vibrate(45);
    } else {
      vibrate(15);
    }
  }, [step.type]);

  const finish = () => {
    if (step.type === "gratitude") {
      playBell();
      vibrate(30);
    } else {
      playTick();
      vibrate(15);
    }
    onComplete();
  };

  return (
    <FadeIn>
      <StatusBar />
      <TopBar title={g.title} onBack={onBack} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <DeitySilhouette variant={deity} size={100} glow />
        <div style={{ fontWeight: 700, fontSize: 18, color: textDark, marginTop: 10, marginBottom: 2 }}>{g.icon} {g.title}</div>
        <div style={{ color: textMuted, fontSize: 12, marginBottom: 4 }}>{g.subtitle}</div>
        <div style={{ color: "#B5824A", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>{step.content}</div>
        {step.type === "bhajan" && <div style={{ marginTop: -12, marginBottom: 20 }}><AudioTrackPlayer src={step.audioUrl} credit={step.audioCredit} /></div>}
        <button onClick={finish} style={{ background: maroon, color: gold, border: "none", borderRadius: 24, padding: "13px 34px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          {g.cta}
        </button>
      </div>
    </FadeIn>
  );
}

// ---------------- WEEKLY PLAN ----------------
// ---------------- SHUBH MUHURAT ----------------
const DEFAULT_LOCATION = { lat: 28.6692, lon: 77.4538, label: "Ghaziabad" };

function MuhuratRow({ title, desc, start, end, tone, skipped }) {
  const { t } = useLang();
  const isAvoid = tone === "avoid";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1px solid ${isAvoid ? "#E7B9AE" : "#F0E4D3"}`, borderRadius: 14, padding: 14, marginBottom: 10, opacity: skipped ? 0.55 : 1 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: isAvoid ? "#F7E4DE" : "#FBEAD2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {isAvoid ? <span style={{ fontSize: 18 }}>{"\u26A0\uFE0F"}</span> : <DiyaFlame size={18} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: textDark }}>{title}</span>
          <span style={{ fontSize: 8, fontWeight: 700, borderRadius: 8, padding: "1px 6px", background: isAvoid ? "#F7E4DE" : "#E7EFE0", color: isAvoid ? "#B5342A" : "#4E7A34" }}>
            {isAvoid ? t("inauspicious") : t("auspicious")}
          </span>
        </div>
        <div style={{ fontSize: 11, color: textMuted }}>{desc}</div>
        {skipped && <div style={{ fontSize: 10, color: "#B5824A", fontStyle: "italic" }}>{t("skippedOnWed")}</div>}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: isAvoid ? "#B5342A" : "#8A3B2A" }}>{fmtTime(start)}</div>
        <div style={{ fontSize: 10, color: textMuted }}>{"\u2013"} {fmtTime(end)}</div>
      </div>
    </div>
  );
}

function MuhuratScreen({ onBack }) {
  const { t } = useLang();
  const [coords, setCoords] = useState(DEFAULT_LOCATION);
  const [locStatus, setLocStatus] = useState("idle"); // idle | detecting | granted | denied

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus("denied");
      return;
    }
    setLocStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: null });
        setLocStatus("granted");
      },
      () => setLocStatus("denied"),
      { timeout: 6000 }
    );
  };

  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const m = computeMuhurats(new Date(), coords.lat, coords.lon);
  const locationLabel = coords.label || (locStatus === "granted" ? null : DEFAULT_LOCATION.label);

  return (
    <FadeIn>
      <StatusBar />
      <TopBar title={t("muhuratTitle")} onBack={onBack} />
      <div style={{ padding: "0 20px 4px" }}>
        <div style={{ fontSize: 11, color: textMuted, marginBottom: 10 }}>
          {locStatus === "detecting"
            ? t("detecting")
            : locationLabel
            ? t("usingLocation", locationLabel)
            : t("usingLocation", `${coords.lat.toFixed(2)}\u00B0, ${coords.lon.toFixed(2)}\u00B0`)}
          {locStatus === "denied" && <div style={{ color: "#B5824A", marginTop: 2 }}>{t("locationDenied")}</div>}
        </div>
        {locStatus !== "granted" && (
          <button
            onClick={detectLocation}
            style={{ marginBottom: 14, background: "#fff", border: `1px solid ${gold}`, color: "#8A3B2A", borderRadius: 16, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
          >
            {t("useMyLocation")}
          </button>
        )}
      </div>

      <div style={{ padding: "0 20px", overflowY: "auto", flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#B5824A", letterSpacing: 1, marginBottom: 8 }}>{t("morningSection").toUpperCase()}</div>
        <MuhuratRow title={t("brahmaMuhurta")} desc={t("brahmaMuhurtaDesc")} start={m.brahmaMuhurtaStart} end={m.brahmaMuhurtaEnd} tone="good" />
        <MuhuratRow title={t("sunriseLabel")} desc={t("pratahSandhya")} start={m.pratahSandhyaStart} end={m.pratahSandhyaEnd} tone="good" />

        <div style={{ fontSize: 11, fontWeight: 700, color: "#B5824A", letterSpacing: 1, margin: "14px 0 8px" }}>{t("middaySection").toUpperCase()}</div>
        <MuhuratRow title={t("abhijitMuhurat")} desc={t("abhijitDesc")} start={m.abhijitStart} end={m.abhijitEnd} tone="good" skipped={m.abhijitSkipped} />

        <div style={{ fontSize: 11, fontWeight: 700, color: "#B5824A", letterSpacing: 1, margin: "14px 0 8px" }}>{t("eveningSection").toUpperCase()}</div>
        <MuhuratRow title={t("sunsetLabel")} desc={t("sandhyaDesc")} start={m.sandhyaEveningStart} end={m.sandhyaEveningEnd} tone="good" />

        <div style={{ fontSize: 11, fontWeight: 700, color: "#B5342A", letterSpacing: 1, margin: "14px 0 8px" }}>{t("avoidSection").toUpperCase()}</div>
        <MuhuratRow title={t("rahuKalam")} desc={t("rahuDesc")} start={m.rahuKalamStart} end={m.rahuKalamEnd} tone="avoid" />
        <MuhuratRow title={t("yamaganda")} desc={t("yamagandaDesc")} start={m.yamagandaStart} end={m.yamagandaEnd} tone="avoid" />

        <div style={{ fontSize: 10, color: textMuted, textAlign: "center", padding: "10px 6px 22px", lineHeight: 1.5 }}>{t("muhuratDisclaimer")}</div>
      </div>
    </FadeIn>
  );
}

// ---------------- CUSTOM WEEKLY SCHEDULE ----------------
function CustomScheduleScreen({ customSchedule, onSave, onBack }) {
  const { lang, t } = useLang();
  const [draft, setDraft] = useState(() => normalizeSchedule(customSchedule));
  const [savedFlash, setSavedFlash] = useState(false);

  const updateDay = (dayKey, patch) => {
    setDraft((prev) => ({ ...prev, [dayKey]: { ...prev[dayKey], ...patch } }));
  };
  const toggleStep = (dayKey, type) => {
    setDraft((prev) => {
      const cur = prev[dayKey].steps;
      const steps = cur.includes(type) ? cur.filter((s) => s !== type) : [...cur, type];
      return { ...prev, [dayKey]: { ...prev[dayKey], steps: steps.length ? steps : cur } };
    });
  };

  const handleSave = () => {
    onSave(draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };
  const handleReset = () => {
    const fresh = normalizeSchedule(null);
    setDraft(fresh);
    onSave(null);
  };

  return (
    <FadeIn>
      <StatusBar />
      <TopBar title={t("customScheduleTitle")} onBack={onBack} />
      <div style={{ padding: "0 20px 8px", fontSize: 11, color: textMuted }}>{t("scheduleIntro")}</div>
      <div style={{ padding: "0 20px", overflowY: "auto", flex: 1 }}>
        {weekDays.map((d) => {
          const day = draft[d.key];
          const dayFull = lang === "hi" ? d.fullHi : d.full;
          return (
            <div key={d.key} style={{ background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 12, marginBottom: 10, opacity: day.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: day.active ? 10 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <DeitySilhouette variant={day.deity} size={30} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: textDark }}>{dayFull}</div>
                    <div style={{ fontSize: 10, color: textMuted }}>{day.active ? t("pujaDayLabel") : t("restDayLabel")}</div>
                  </div>
                </div>
                <button
                  onClick={() => updateDay(d.key, { active: !day.active })}
                  style={{ width: 40, height: 22, borderRadius: 12, border: "none", background: day.active ? "#8A3B2A" : "#E0D2BB", position: "relative", cursor: "pointer", flexShrink: 0 }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: day.active ? 20 : 2, transition: "left .15s" }} />
                </button>
              </div>

              {day.active && (
                <>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#B5824A", marginBottom: 5 }}>{t("deityFocusLabel").toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {SCHEDULABLE_DEITIES.map((dt) => (
                      <button
                        key={dt}
                        onClick={() => updateDay(d.key, { deity: dt })}
                        style={{
                          background: day.deity === dt ? gold : "#F5EFE4",
                          color: day.deity === dt ? "#3a1f05" : textDark,
                          border: "none",
                          borderRadius: 10,
                          padding: "5px 10px",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {DEITY_DISPLAY[dt][lang] || DEITY_DISPLAY[dt].en}
                      </button>
                    ))}
                  </div>

                  <div style={{ fontSize: 9, fontWeight: 700, color: "#B5824A", marginBottom: 5 }}>{t("includeInRitual").toUpperCase()}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {SCHEDULABLE_STEP_TYPES.map((type) => {
                      const on = day.steps.includes(type);
                      const label = { darshan: t("qDarshan"), aarti: t("qAarti"), mantra: t("qMantra"), bhajan: t("qBhajan") }[type];
                      return (
                        <button
                          key={type}
                          onClick={() => toggleStep(d.key, type)}
                          style={{
                            background: on ? "#FBEAD2" : "#F5EFE4",
                            color: on ? "#8A3B2A" : "#B0A18E",
                            border: on ? `1px solid ${gold}` : "1px solid transparent",
                            borderRadius: 10,
                            padding: "5px 10px",
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          {on ? "\u2713 " : ""}{label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 10, margin: "6px 0 24px" }}>
          <button
            onClick={handleReset}
            style={{ flex: 1, background: "#fff", border: "1px solid #E0D2BB", color: textMuted, borderRadius: 22, padding: "12px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            {t("resetDefault")}
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 1, background: maroon, color: gold, border: "none", borderRadius: 22, padding: "12px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            {t("saveSchedule")}
          </button>
        </div>
        {savedFlash && (
          <div style={{ textAlign: "center", fontSize: 11, color: "#4E7A34", marginTop: -14, marginBottom: 20 }}>{t("scheduleSavedMsg")}</div>
        )}
      </div>
    </FadeIn>
  );
}

function WeeklyPlanScreen({ onBack, onOpenEvening, onOpenSchedule, customSchedule }) {
  const { lang, t } = useLang();
  const [day, setDay] = useState("Thu");
  const d = weekDays.find((w) => w.key === day);
  const dayFull = lang === "hi" ? d.fullHi : d.full;
  const sched = getDaySchedule(day, customSchedule);
  const daySteps = getStepsForDay(day, customSchedule);
  const isCustomized = customSchedule && customSchedule[day];
  const deityName = DEITY_DISPLAY[sched.deity] ? (DEITY_DISPLAY[sched.deity][lang] || DEITY_DISPLAY[sched.deity].en) : d.focus.split(" ")[0];
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <StatusBar />
      <TopBar title={t("weeklyPlan")} onBack={onBack} right={
        <button onClick={onOpenSchedule} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Settings size={16} color={textDark} />
        </button>
      } />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 18px 12px" }}>
        {weekDays.map((w) => (
          <button
            key={w.key}
            onClick={() => setDay(w.key)}
            style={{
              background: day === w.key ? maroon : "transparent",
              color: day === w.key ? gold : textMuted,
              border: "none",
              borderRadius: 14,
              padding: "6px 8px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {w.key}
          </button>
        ))}
      </div>

      <div style={{ margin: "0 18px", borderRadius: 16, overflow: "hidden", padding: 16, background: "linear-gradient(135deg,#5c1a1f,#2c0a0c)", color: cream, position: "relative" }}>
        <div style={{ position: "absolute", top: -20, right: -10 }}><MandalaBg size={160} opacity={0.16} /></div>
        <div style={{ position: "absolute", top: 4, right: 6 }}><DeitySilhouette variant={sched.deity} size={78} /></div>
        <div style={{ maxWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{dayFull}</div>
          <div style={{ color: goldLight, fontSize: 12, marginBottom: 6 }}>({deityName})</div>
          {isCustomized && (
            <span style={{ fontSize: 8, fontWeight: 700, background: "rgba(255,255,255,0.15)", color: goldLight, borderRadius: 8, padding: "2px 7px" }}>{t("customizedTag")}</span>
          )}
          <div style={{ color: "#D8B98C", fontSize: 11, margin: "8px 0 14px" }}>{sched.active ? d.theme : t("restDayLabel")}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10 }}>
            <Sun size={14} color={gold} />
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{t("morningPuja")}</div>
            <div style={{ fontSize: 10, color: "#C9A38E" }}>{sched.active ? `${estimateMinutes(daySteps)} ${t("mins")}` : t("restDayLabel")}</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10 }}>
            <Moon size={14} color={gold} />
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{t("eveningPuja")}</div>
            <div style={{ fontSize: 10, color: "#C9A38E" }}>{estimateMinutes(eveningSteps)} {t("mins")}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: textDark }}>{t("morningRitual", deityName)}</div>
          <button onClick={onOpenSchedule} style={{ background: "none", border: "none", color: "#B5824A", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t("customScheduleMenu")}</button>
        </div>
        {daySteps.map((s) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F0E4D3" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FBEAD2", color: "#8A3B2A", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{guided(s, lang).icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textDark }}>{guided(s, lang).title}</div>
              <div style={{ fontSize: 10, color: textMuted }}>{s.content}</div>
            </div>
            <div style={{ fontSize: 10, color: textMuted }}>{s.duration}</div>
          </div>
        ))}
        <button onClick={onOpenEvening} style={{ width: "100%", marginTop: 14, background: "#fff", border: `1px solid ${gold}`, color: "#8A3B2A", borderRadius: 20, padding: "11px 0", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
          {t("viewEveningPlan")} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function EveningPlanScreen({ onBack, onStart }) {
  const { lang, t } = useLang();
  const todayFull = lang === "hi" ? getTodayInfo().fullHi : getTodayInfo().full;
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <StatusBar />
      <TopBar title={t("eveningPlanTitle", todayFull)} onBack={onBack} />
      <div style={{ margin: "0 18px", borderRadius: 16, overflow: "hidden", position: "relative", height: 140, background: "linear-gradient(135deg,#3a1015,#160607)" }}>
        <div style={{ position: "absolute", top: -20, right: -6 }}><MandalaBg size={150} opacity={0.15} /></div>
        <div style={{ position: "absolute", top: 8, right: 8 }}><DeitySilhouette variant="vishnu" size={72} /></div>
        <div style={{ position: "absolute", bottom: 10, left: 12 }}><DiyaFlame size={22} /></div>
        <div style={{ position: "absolute", inset: 0, padding: "14px 14px 14px 44px", color: cream, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <Moon size={16} color={gold} />
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>{t("sandhyaShantiRitual")}</div>
          <div style={{ fontSize: 10, color: "#D8B98C" }}>{t("endDayPeace")}</div>
        </div>
      </div>
      <div style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 11, color: textMuted, marginBottom: 10 }}>{t("totalTime")}: {estimateMinutes(eveningSteps)} {t("mins")}</div>
        {eveningSteps.map((s) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #F0E4D3" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#FBEAD2", color: "#8A3B2A", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{guided(s, lang).icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textDark }}>{guided(s, lang).title}</div>
              <div style={{ fontSize: 10, color: textMuted }}>{s.content}</div>
            </div>
            <div style={{ fontSize: 10, color: textMuted }}>{s.duration}</div>
          </div>
        ))}
        <button onClick={onStart} style={{ width: "100%", marginTop: 16, background: maroon, color: gold, border: "none", borderRadius: 24, padding: "13px 0", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          {t("startEveningPuja")}
        </button>
      </div>
    </div>
  );
}

// ---------------- LIBRARY ----------------
function LibraryScreen({ favs, toggleFav }) {
  const { t } = useLang();
  const [tab, setTab] = useState("Aarti");
  const [query, setQuery] = useState("");
  const [dayFilter, setDayFilter] = useState("All");
  const tabs = ["Aarti", "Mantra", "Bhajan", "Stotra"];
  const tabLabel = { Aarti: t("libAarti"), Mantra: t("libMantra"), Bhajan: t("libBhajan"), Stotra: t("libStotra") };

  const fullList = libraryData[tab];
  const list = fullList.filter((b) => {
    const matchesQuery = b.name.toLowerCase().includes(query.toLowerCase()) || b.deity.toLowerCase().includes(query.toLowerCase());
    const matchesDay = dayFilter === "All" || b.day === dayFilter || b.day === "Daily";
    return matchesQuery && matchesDay;
  });

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <StatusBar />
      <TopBar title={t("library")} />
      <div style={{ display: "flex", gap: 18, padding: "0 20px 10px" }}>
        {tabs.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontSize: 13, fontWeight: tab === tb ? 700 : 400, color: tab === tb ? "#8A3B2A" : textMuted, borderBottom: tab === tb ? `2px solid #8A3B2A` : "2px solid transparent" }}
          >
            {tabLabel[tb]}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 20px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E0D2BB", borderRadius: 12, padding: "9px 12px" }}>
          <Search size={14} color={textMuted} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder", tabLabel[tab].toLowerCase())}
            style={{ border: "none", outline: "none", flex: 1, fontSize: 12, background: "transparent" }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, padding: "0 20px 10px", overflowX: "auto" }}>
        {dayFilters.map((d) => (
          <button
            key={d}
            onClick={() => setDayFilter(d)}
            style={{
              flexShrink: 0,
              background: dayFilter === d ? maroon : "#fff",
              color: dayFilter === d ? gold : textMuted,
              border: dayFilter === d ? "none" : "1px solid #E0D2BB",
              borderRadius: 12,
              padding: "5px 11px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {d}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 20px 6px", fontSize: 10, color: textMuted }}>
        {dayFilter === "All" ? `${list.length} ${t("tracks")}` : `${list.length} ${t("tracksThatFit", dayFilter)}`}
      </div>
      <div style={{ padding: "0 20px" }}>
        {list.length === 0 && <div style={{ color: textMuted, fontSize: 12, textAlign: "center", marginTop: 20 }}>{t("noResults")}</div>}
        {list.map((b) => (
          <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0E4D3" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0E4D3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Music2 size={15} color="#8A3B2A" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textDark, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
                {b.trending && (
                  <span style={{ flexShrink: 0, background: "#FBEAD2", color: "#B5824A", fontSize: 8, fontWeight: 700, borderRadius: 8, padding: "1px 6px" }}>{t("trending")}</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: textMuted }}>
                {b.deity} &middot; {b.day === "Daily" ? t("fitsEveryDay") : t("fits", b.day)} &middot; {b.duration}
              </div>
            </div>
            <button onClick={() => toggleFav(b.name)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
              <Heart size={16} color={favs.has(b.name) ? "#B5342A" : "#D8C6AE"} fill={favs.has(b.name) ? "#B5342A" : "none"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- AI DEITY GALLERY (Hugging Face MCP image generation) ----------------
const deityPrompts = {
  krishna: "a warm, respectful devotional illustration of Krishna playing a flute, peacock feather crown, soft golden halo, gentle temple-art style, suitable as a serene app icon, no text",
  vishnu: "a warm, respectful devotional illustration of Vishnu with a discus and lotus, blue-toned skin, golden crown, soft radiant halo, gentle temple-art style, suitable as a serene app icon, no text",
  hanuman: "a warm, respectful devotional illustration of Hanuman in a devoted, calm pose, golden mace, soft radiant halo, gentle temple-art style, suitable as a serene app icon, no text",
  ganesh: "a warm, respectful devotional illustration of Ganesh seated in blessing pose, golden ornaments, soft radiant halo, gentle temple-art style, suitable as a serene app icon, no text",
  lakshmi: "a warm, respectful devotional illustration of Lakshmi seated on a lotus, golden coins gently falling, soft radiant halo, gentle temple-art style, suitable as a serene app icon, no text",
  shani: "a warm, respectful devotional illustration representing Shani, dark robes with golden trim, calm composed pose, soft radiant halo, gentle temple-art style, suitable as a serene app icon, no text",
  surya: "a warm, respectful devotional illustration of Surya the sun deity, radiant golden crown and rays, riding a simple chariot motif, gentle temple-art style, suitable as a serene app icon, no text",
};

function AIDeityGalleryScreen({ onBack }) {
  const [images, setImages] = useState({});
  const [status, setStatus] = useState({});

  const generate = async (variant) => {
    setStatus((s) => ({ ...s, [variant]: "loading" }));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Using an available image generation tool, create ${deityPrompts[variant]}. Return the generated image.`,
            },
          ],
          mcp_servers: [{ type: "url", url: "https://huggingface.co/mcp", name: "huggingface" }],
        }),
      });
      const data = await res.json();
      const content = data.content || [];

      let found = null;
      for (const block of content) {
        if (block.type === "image" && block.source?.data) {
          found = `data:${block.source.media_type || "image/png"};base64,${block.source.data}`;
          break;
        }
      }
      if (!found) {
        const toolResults = content.filter((b) => b.type === "mcp_tool_result");
        for (const block of toolResults) {
          const items = block.content || [];
          for (const it of items) {
            if (it.type === "image" && it.source?.data) {
              found = `data:${it.source.media_type || "image/png"};base64,${it.source.data}`;
              break;
            }
            if (it.type === "text" && it.text) {
              const m = it.text.match(/https?:\/\/\S+\.(png|jpg|jpeg|webp)/i);
              if (m) found = m[0];
            }
          }
          if (found) break;
        }
      }
      if (!found) {
        const textBlocks = content.filter((b) => b.type === "text").map((b) => b.text).join(" ");
        const m = textBlocks.match(/https?:\/\/\S+\.(png|jpg|jpeg|webp)/i);
        if (m) found = m[0];
      }

      if (found) {
        setImages((prev) => ({ ...prev, [variant]: found }));
        setStatus((s) => ({ ...s, [variant]: "done" }));
      } else {
        setStatus((s) => ({ ...s, [variant]: "empty" }));
      }
    } catch (e) {
      setStatus((s) => ({ ...s, [variant]: "error" }));
    }
  };

  const variants = ["krishna", "vishnu", "hanuman", "ganesh", "lakshmi", "shani", "surya"];

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <StatusBar />
      <TopBar title="My Deities" onBack={onBack} />
      <div style={{ padding: "0 20px 6px", fontSize: 11, color: textMuted }}>
        Generated live via your connected Hugging Face tools. Tap Generate on any deity.
      </div>
      <div style={{ padding: "10px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {variants.map((v) => (
          <div key={v} style={{ background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 10, textAlign: "center" }}>
            <div style={{ height: 110, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#3a1015,#1a0708)", marginBottom: 8, position: "relative" }}>
              {images[v] ? (
                <img src={images[v]} alt={v} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <DeitySilhouette variant={v} size={80} />
              )}
              {status[v] === "loading" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: goldLight, fontSize: 10 }}>
                  Generating…
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: textDark, textTransform: "capitalize", marginBottom: 6 }}>{v}</div>
            <button
              onClick={() => generate(v)}
              disabled={status[v] === "loading"}
              style={{ width: "100%", background: images[v] ? "#fff" : maroon, color: images[v] ? "#8A3B2A" : gold, border: images[v] ? `1px solid ${gold}` : "none", borderRadius: 16, padding: "6px 0", fontSize: 11, fontWeight: 600, cursor: status[v] === "loading" ? "default" : "pointer" }}
            >
              {status[v] === "loading" ? "Please wait" : images[v] ? "Regenerate" : "Generate"}
            </button>
            {status[v] === "error" && <div style={{ fontSize: 9, color: "#B5342A", marginTop: 4 }}>Couldn't reach the tool. Try again.</div>}
            {status[v] === "empty" && <div style={{ fontSize: 9, color: "#B5342A", marginTop: 4 }}>No image tool available on this connector.</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- PROFILE ----------------
function ProfileScreen({ onOpenReminders, onOpenGallery, onOpenPreferences, onOpenLanguage, onOpenMuhurat, onOpenSchedule, streak }) {
  const { t } = useLang();
  const menu = [
    { label: t("customScheduleMenu"), action: onOpenSchedule },
    { label: t("muhuratTitle"), action: onOpenMuhurat },
    { label: t("pujaReminders"), action: onOpenReminders },
    { label: t("ishtaDevtaPreferences"), action: onOpenPreferences },
    { label: t("myDeities"), action: onOpenGallery },
    { label: t("languageMenu"), action: onOpenLanguage },
    { label: t("settings") },
    { label: t("helpSupport") },
    { label: t("aboutUs") },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ background: maroon, padding: "0 0 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -30 }}><MandalaBg size={200} opacity={0.12} /></div>
        <StatusBar dark />
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", position: "relative" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#7a2b1f", border: `1.5px solid ${gold}`, display: "flex", alignItems: "center", justifyContent: "center", color: goldLight, fontWeight: 700 }}>RS</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: cream, fontWeight: 600, fontSize: 14 }}>Manish Yadav</div>
            <div style={{ color: "#C9A38E", fontSize: 11 }}>manish.sharma@email.com</div>
          </div>
          <Edit2 size={14} color={goldLight} />
        </div>
        <div style={{ margin: "8px 20px 0", background: "#3a1015", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#D8B98C" }}>{t("pujaStreak")}</div>
            <div style={{ color: cream, fontWeight: 700, fontSize: 16 }}>{streak} {t("dayStreak").replace(/^Day |^\u0926\u093F\u0928 /, "")}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Award size={16} color={gold} />
            <div style={{ fontSize: 10, color: "#D8B98C" }}>{t("level")}</div>
            <div style={{ color: goldLight, fontSize: 12, fontWeight: 600 }}>{t("devotee")}</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}><TempleArchStrip height={16} /></div>
      </div>
      <div style={{ padding: "10px 20px" }}>
        {menu.map((m) => (
          <button key={m.label} onClick={m.action} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", borderBottom: "1px solid #F0E4D3", padding: "13px 0", cursor: "pointer" }}>
            <span style={{ fontSize: 13, color: textDark }}>{m.label}</span>
            <ChevronRight size={15} color={textMuted} />
          </button>
        ))}
        <div style={{ marginTop: 18, background: "#FBEAD2", borderRadius: 14, padding: 16, textAlign: "center", fontStyle: "italic", color: "#8A3B2A", fontSize: 12 }}>
          {t("quoteDaily")}
        </div>
      </div>
    </div>
  );
}

// ---------------- REMINDERS ----------------
function RemindersScreen({ onBack, profile }) {
  const { lang, t } = useLang();
  const [morning, setMorning] = useState(!profile || profile.time !== "Evening");
  const [evening, setEvening] = useState(!profile || profile.time !== "Morning");
  const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const morningTimer = useRef(null);
  const eveningTimer = useRef(null);

  const ensurePermission = () => {
    try {
      if (window.Notification && Notification.permission === "default") {
        Notification.requestPermission().then(setPermission);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (morning) {
      ensurePermission();
      scheduleDailyReminder(6, 30, lang === "hi" ? "\u0906\u092A\u0915\u0940 \u0938\u0941\u092C\u0939 \u0915\u0940 \u092A\u0942\u091C\u093E \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0915\u0930 \u0930\u0939\u0940 \u0939\u0948 \uD83D\uDE4F" : "Your morning puja is waiting \uD83D\uDE4F", morningTimer);
    } else if (morningTimer.current) {
      clearTimeout(morningTimer.current);
    }
    return () => { if (morningTimer.current) clearTimeout(morningTimer.current); };
  }, [morning, lang]);

  useEffect(() => {
    if (evening) {
      ensurePermission();
      scheduleDailyReminder(19, 0, lang === "hi" ? "\u0906\u092A\u0915\u0940 \u0936\u093E\u092E \u0915\u0940 \u092A\u0942\u091C\u093E \u092A\u094D\u0930\u0924\u0940\u0915\u094D\u0937\u093E \u0915\u0930 \u0930\u0939\u0940 \u0939\u0948 \uD83D\uDE4F" : "Your evening puja is waiting \uD83D\uDE4F", eveningTimer);
    } else if (eveningTimer.current) {
      clearTimeout(eveningTimer.current);
    }
    return () => { if (eveningTimer.current) clearTimeout(eveningTimer.current); };
  }, [evening, lang]);

  const Toggle = ({ on, set }) => (
    <button onClick={() => set(!on)} style={{ width: 40, height: 22, borderRadius: 12, border: "none", background: on ? "#8A3B2A" : "#E0D2BB", position: "relative", cursor: "pointer" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left .15s" }} />
    </button>
  );
  return (
    <FadeIn>
      <StatusBar />
      <TopBar title={t("pujaReminder")} onBack={onBack} />
      <div style={{ padding: "6px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Sun size={16} color="#B5824A" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textDark }}>{t("morningPuja")}</div>
              <div style={{ fontSize: 11, color: textMuted }}>06:30 AM</div>
            </div>
          </div>
          <Toggle on={morning} set={setMorning} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Moon size={16} color="#5C2B1F" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textDark }}>{t("eveningPuja")}</div>
              <div style={{ fontSize: 11, color: textMuted }}>07:00 PM</div>
            </div>
          </div>
          <Toggle on={evening} set={setEvening} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1px solid #F0E4D3", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plus size={16} color={textMuted} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textDark }}>{t("customReminder")}</div>
              <div style={{ fontSize: 11, color: textMuted }}>{t("addOwnReminder")}</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 10, color: textMuted, textAlign: "center" }}>
          {permission === "granted"
            ? t("reminderNoteGranted")
            : permission === "denied"
            ? t("reminderNoteDenied")
            : t("reminderNoteDefault")}
        </div>
        <div style={{ marginTop: 12, background: "#FBEAD2", borderRadius: 14, padding: 16, textAlign: "center", fontStyle: "italic", color: "#8A3B2A", fontSize: 12 }}>
          {t("quoteDaily")}
        </div>
      </div>
    </FadeIn>
  );
}

// ---------------- COMPLETION SCREEN (Module 5) ----------------
function CompletionScreen({ streak, onReturnHome, deity = "krishna" }) {
  const { t } = useLang();
  useEffect(() => {
    playBell();
    vibrate([30, 60, 30]);
  }, []);
  return (
    <FadeIn style={{ alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", background: "radial-gradient(circle at 50% 30%,#7a3d14,#1a0708 80%)" }}>
      <div style={{ marginTop: 30 }}>
        <DeitySilhouette variant={deity} size={140} glow />
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 4, marginBottom: 18 }}>
        <DiyaFlame size={26} />
        <DiyaFlame size={26} />
      </div>
      <div style={{ color: cream, fontWeight: 700, fontSize: 20 }}>{t("pujaCompleteTitle")}</div>
      <div style={{ color: "#E8D9C8", fontSize: 13, marginTop: 4, marginBottom: 18 }}>{t("pujaCompleteSubtitle")}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "8px 18px", marginBottom: 26 }}>
        <DiyaFlame size={18} />
        <span style={{ color: goldLight, fontWeight: 700, fontSize: 14 }}>{streak} {t("dayStreak")}</span>
      </div>
      <button onClick={onReturnHome} style={{ background: maroon, color: gold, border: `1px solid ${gold}`, borderRadius: 24, padding: "13px 34px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
        {t("returnHome")}
      </button>
    </FadeIn>
  );
}

// ---------------- ONBOARDING / PERSONALIZATION (Module 4) ----------------
function OnboardingFlow({ onFinish }) {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [devta, setDevta] = useState(null);
  const [mantraType, setMantraType] = useState(null);
  const [time, setTime] = useState(null);

  const screens = [
    { key: "devta", title: t("chooseIshta"), options: [
        { value: "Krishna", label: "Krishna" }, { value: "Shiva", label: "Shiva" }, { value: "Hanuman", label: "Hanuman" }, { value: "Devi", label: "Devi" }, { value: "Ganesh", label: "Ganesh" },
      ], value: devta, set: setDevta },
    { key: "mantraType", title: t("preferredMantraType"), options: [
        { value: "Peace", label: t("optPeace") }, { value: "Protection", label: t("optProtection") }, { value: "Focus", label: t("optFocus") },
      ], value: mantraType, set: setMantraType },
    { key: "time", title: t("pujaTime"), options: [
        { value: "Morning", label: t("optMorning") }, { value: "Evening", label: t("optEvening") }, { value: "Both", label: t("optBoth") },
      ], value: time, set: setTime },
  ];
  const current = screens[step];
  const canContinue = !!current.value;

  const next = () => {
    if (step < screens.length - 1) {
      setStep((s) => s + 1);
    } else {
      onFinish({ devta, mantraType, time });
    }
  };

  return (
    <FadeIn style={{ padding: "0 24px", justifyContent: "center", alignItems: "stretch" }}>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "24px 0 32px" }}>
        {screens.map((s, i) => (
          <div key={s.key} style={{ width: i === step ? 22 : 8, height: 6, borderRadius: 4, background: i <= step ? gold : "#E0D2BB", transition: "width .2s" }} />
        ))}
      </div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <DeitySilhouette variant={devta ? DEVTA_VARIANT[devta] : "krishna"} size={90} glow />
        <div style={{ fontWeight: 700, fontSize: 18, color: "#8A3B2A", marginTop: 10 }}>{current.title}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => current.set(opt.value)}
            style={{
              textAlign: "left",
              padding: "14px 16px",
              borderRadius: 14,
              border: current.value === opt.value ? `2px solid ${gold}` : "1px solid #E0D2BB",
              background: current.value === opt.value ? "#FBEAD2" : "#fff",
              color: textDark,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        onClick={next}
        disabled={!canContinue}
        style={{ marginTop: 28, background: canContinue ? maroon : "#E0D2BB", color: canContinue ? gold : "#fff", border: "none", borderRadius: 24, padding: "13px 0", fontWeight: 600, fontSize: 14, cursor: canContinue ? "pointer" : "default" }}
      >
        {step < screens.length - 1 ? t("continueBtn") : t("enterApp")}
      </button>
    </FadeIn>
  );
}

// ---------------- LANGUAGE SELECT ----------------
function LanguageSelectScreen({ onSelect }) {
  const [choice, setChoice] = useState(null);
  const label = {
    en: { title: translations.en.chooseLanguage, subtitle: translations.en.languageSubtitle, continueBtn: translations.en.continueBtn },
    hi: { title: translations.hi.chooseLanguage, subtitle: translations.hi.languageSubtitle, continueBtn: translations.hi.continueBtn },
  };
  const display = choice ? label[choice] : label.en;
  return (
    <FadeIn style={{ padding: "0 24px", justifyContent: "center", alignItems: "stretch" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <DeitySilhouette variant="krishna" size={90} glow />
        <div style={{ fontWeight: 700, fontSize: 18, color: "#8A3B2A", marginTop: 10 }}>{display.title}</div>
        <div style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>{display.subtitle}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => setChoice("en")}
          style={{
            textAlign: "left",
            padding: "14px 16px",
            borderRadius: 14,
            border: choice === "en" ? `2px solid ${gold}` : "1px solid #E0D2BB",
            background: choice === "en" ? "#FBEAD2" : "#fff",
            color: textDark,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {translations.en.english}
        </button>
        <button
          onClick={() => setChoice("hi")}
          style={{
            textAlign: "left",
            padding: "14px 16px",
            borderRadius: 14,
            border: choice === "hi" ? `2px solid ${gold}` : "1px solid #E0D2BB",
            background: choice === "hi" ? "#FBEAD2" : "#fff",
            color: textDark,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {translations.hi.hindi}
        </button>
      </div>
      <button
        onClick={() => choice && onSelect(choice)}
        disabled={!choice}
        style={{ marginTop: 28, background: choice ? maroon : "#E0D2BB", color: choice ? gold : "#fff", border: "none", borderRadius: 24, padding: "13px 0", fontWeight: 600, fontSize: 14, cursor: choice ? "pointer" : "default" }}
      >
        {display.continueBtn}
      </button>
    </FadeIn>
  );
}

// ---------------- APP ROOT ----------------
export default function SmartMandirApp() {
  const [tab, setTab] = useState("home");
  const [subScreen, setSubScreen] = useState(null);
  const [morningIndex, setMorningIndex] = useState(0);
  const [eveningIndex, setEveningIndex] = useState(0);
  const [activeRitual, setActiveRitual] = useState("morning");
  const [favs, setFavs] = useState(new Set(["Achyutam Keshavam", "Hanuman Chalisa"]));
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [lang, setLangState] = useState(null);
  const [customSchedule, setCustomSchedule] = useState(null);

  // Load persisted profile + streak + language + weekly schedule once (Module 4 & 5 persistence)
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("profile", false);
        if (p && p.value) setProfile(JSON.parse(p.value));
      } catch (e) {}
      try {
        const s = await window.storage.get("streakData", false);
        if (s && s.value) {
          const parsed = JSON.parse(s.value);
          setStreak(parsed.currentStreak || 0);
          setLastCompleted(parsed.lastCompleted || null);
        }
      } catch (e) {}
      try {
        const l = await window.storage.get("language", false);
        if (l && l.value) setLangState(l.value);
      } catch (e) {}
      try {
        const ws = await window.storage.get("weeklySchedule", false);
        if (ws && ws.value) setCustomSchedule(JSON.parse(ws.value));
      } catch (e) {}
      setProfileLoaded(true);
    })();
  }, []);

  const setLang = async (code) => {
    setLangState(code);
    try {
      await window.storage.set("language", code, false);
    } catch (e) {}
  };

  const saveCustomSchedule = async (schedule) => {
    setCustomSchedule(schedule);
    try {
      if (schedule) {
        await window.storage.set("weeklySchedule", JSON.stringify(schedule), false);
      } else {
        await window.storage.delete("weeklySchedule", false);
      }
    } catch (e) {}
  };

  const finishOnboarding = async (p) => {
    setProfile(p);
    try {
      await window.storage.set("profile", JSON.stringify(p), false);
    } catch (e) {}
  };

  const toggleFav = (name) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const currentSteps = activeRitual === "morning" ? getStepsForDay(getTodayKey(), customSchedule) : eveningSteps;
  const currentIndex = activeRitual === "morning" ? morningIndex : eveningIndex;
  const setCurrentIndex = activeRitual === "morning" ? setMorningIndex : setEveningIndex;

  // Deity shown across the active ritual: personalization takes priority, else today's scheduled/assigned deity
  const todayDeity = getDaySchedule(getTodayKey(), customSchedule).deity;
  const ritualDeity = profile && profile.devta ? DEVTA_VARIANT[profile.devta] || todayDeity : todayDeity;

  const inRitual = subScreen === "pujaFlow" || subScreen === "aarti" || subScreen === "mantra" || subScreen === "darshan" || subScreen === "completion" || (subScreen && subScreen.name === "simpleStep");
  useAmbientDrone(inRitual);

  const completeRitualToday = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (lastCompleted === todayStr) return; // already counted today
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const newStreak = lastCompleted === yesterdayStr ? streak + 1 : 1;
    setStreak(newStreak);
    setLastCompleted(todayStr);
    try {
      await window.storage.set("streakData", JSON.stringify({ currentStreak: newStreak, lastCompleted: todayStr }), false);
    } catch (e) {}
  };

  const advanceStep = () => {
    const nextIndex = Math.min(currentSteps.length, currentIndex + 1);
    setCurrentIndex(nextIndex);
    if (nextIndex >= currentSteps.length) {
      completeRitualToday();
      setSubScreen("completion");
    } else {
      setSubScreen("pujaFlow");
    }
  };

  const openStep = (i) => {
    const step = currentSteps[i];
    if (!step) return;
    if (step.type === "darshan") setSubScreen("darshan");
    else if (step.type === "aarti") setSubScreen("aarti");
    else if (step.type === "mantra") setSubScreen("mantra");
    else setSubScreen({ name: "simpleStep", step });
  };

  const goPuja = (which) => {
    setActiveRitual(which);
    setTab("puja");
    setSubScreen("pujaFlow");
  };

  const returnHome = () => {
    setSubScreen(null);
    setTab("home");
  };

  const t = makeT(lang || "en");
  const ritualTitle = activeRitual === "morning" ? t("hariKripaRitual") : t("sandhyaShantiRitual");

  const renderSub = () => {
    if (subScreen === "pujaFlow") {
      return (
        <PujaFlowScreen
          steps={currentSteps}
          current={currentIndex}
          title={ritualTitle}
          onStepClick={openStep}
          onStartFrom={openStep}
          onBack={() => setSubScreen(null)}
        />
      );
    }
    if (subScreen === "darshan") {
      return (
        <LiveDarshanScreen
          deity={ritualDeity}
          templeName={activeRitual === "morning" ? "Shree Krishna Mandir" : "Sandhya Shanti Mandir"}
          onBack={() => setSubScreen("pujaFlow")}
          onComplete={advanceStep}
        />
      );
    }
    if (subScreen === "aarti") {
      const step = currentSteps.find((s) => s.type === "aarti");
      return <AartiScreen deity={ritualDeity} content={step ? step.content : "Om Jai Jagdish Hare"} audioUrl={step?.audioUrl} audioCredit={step?.audioCredit} onBack={() => setSubScreen("pujaFlow")} onComplete={advanceStep} />;
    }
    if (subScreen === "mantra") {
      const step = currentSteps.find((s) => s.type === "mantra");
      return <MantraScreen content={step ? step.content : "Om Namo Bhagavate Vasudevaya"} audioUrl={step?.audioUrl} audioCredit={step?.audioCredit} onBack={() => setSubScreen("pujaFlow")} onComplete={advanceStep} />;
    }
    if (subScreen && subScreen.name === "simpleStep") {
      return <SimpleStepScreen step={subScreen.step} deity={ritualDeity} onBack={() => setSubScreen("pujaFlow")} onComplete={advanceStep} />;
    }
    if (subScreen === "completion") {
      return <CompletionScreen streak={streak} deity={ritualDeity} onReturnHome={returnHome} />;
    }
    if (subScreen === "muhurat") {
      return <MuhuratScreen onBack={() => setSubScreen(null)} />;
    }
    if (subScreen === "weekly") {
      return <WeeklyPlanScreen onBack={() => setSubScreen(null)} onOpenEvening={() => setSubScreen("evening")} onOpenSchedule={() => setSubScreen("schedule")} customSchedule={customSchedule} />;
    }
    if (subScreen === "evening") {
      return (
        <EveningPlanScreen
          onBack={() => setSubScreen("weekly")}
          onStart={() => {
            setActiveRitual("evening");
            setTab("puja");
            setSubScreen("pujaFlow");
          }}
        />
      );
    }
    if (subScreen === "reminders") {
      return <RemindersScreen profile={profile} onBack={() => setSubScreen(null)} />;
    }
    if (subScreen === "gallery") {
      return <AIDeityGalleryScreen onBack={() => setSubScreen(null)} />;
    }
    if (subScreen === "preferences") {
      return <OnboardingFlow onFinish={(p) => { finishOnboarding(p); setSubScreen(null); }} />;
    }
    if (subScreen === "schedule") {
      return <CustomScheduleScreen customSchedule={customSchedule} onSave={saveCustomSchedule} onBack={() => setSubScreen(null)} />;
    }
    if (subScreen === "language") {
      return (
        <LanguageSelectScreen
          onSelect={(code) => {
            setLang(code);
            setSubScreen(null);
          }}
        />
      );
    }
    return null;
  };

  let body;
  if (!profileLoaded) {
    body = <div style={{ flex: 1 }} />;
  } else if (!lang) {
    body = <LanguageSelectScreen onSelect={setLang} />;
  } else if (!profile) {
    body = <OnboardingFlow onFinish={finishOnboarding} />;
  } else if (subScreen) {
    body = renderSub();
  } else if (tab === "home") {
    body = <HomeScreen goPuja={goPuja} streak={streak} morningIndex={morningIndex} eveningIndex={eveningIndex} profile={profile} onOpenMuhurat={() => setSubScreen("muhurat")} customSchedule={customSchedule} />;
  } else if (tab === "puja") {
    body = <PujaFlowScreen steps={currentSteps} current={currentIndex} title={ritualTitle} onStepClick={openStep} onStartFrom={openStep} />;
  } else if (tab === "explore") {
    body = <WeeklyPlanScreen onBack={null} onOpenEvening={() => setSubScreen("evening")} onOpenSchedule={() => setSubScreen("schedule")} customSchedule={customSchedule} />;
  } else if (tab === "library") {
    body = <LibraryScreen favs={favs} toggleFav={toggleFav} />;
  } else if (tab === "profile") {
    body = (
      <ProfileScreen
        streak={streak}
        onOpenReminders={() => setSubScreen("reminders")}
        onOpenGallery={() => setSubScreen("gallery")}
        onOpenPreferences={() => setSubScreen("preferences")}
        onOpenLanguage={() => setSubScreen("language")}
        onOpenMuhurat={() => setSubScreen("muhurat")}
        onOpenSchedule={() => setSubScreen("schedule")}
      />
    );
  }

  const showNav = lang && profile && !(subScreen === "aarti" || subScreen === "mantra" || subScreen === "darshan" || subScreen === "completion" || subScreen === "preferences" || subScreen === "language" || (subScreen && subScreen.name === "simpleStep"));

  return (
    <LangContext.Provider value={{ lang: lang || "en", setLang, t }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 760, background: "#EDE7DC", padding: 20, fontFamily: "sans-serif" }}>
        <Screen>
          {body}
          {showNav && (
            <BottomNav
              active={tab}
              onChange={(k) => {
                setSubScreen(null);
                setTab(k);
              }}
            />
          )}
        </Screen>
      </div>
    </LangContext.Provider>
  );
}
