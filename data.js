'use strict';
/**
 * DATA - Russia / Syria Diplomatic Relations & Strategic Balance (September 2026)
 * Official Sources:
 * - Embassy of the Russian Federation in Syria: https://syria.mid.ru/ru/embassy/members/
 * - Department of State Protocol of MID RF: https://dgp.mid.ru/currentinfo/embassy/SYR/
 * - Presidential Decree of August 3, 2026 (Appointment of Ambassador D.N. Dogadkin)
 */
const DATA = {
  kpis: [
    { value: "2", label: "Active Embassies", sub: "Damascus & Moscow · 0 Consulates" },
    { value: "10", label: "Accredited Diplomats", sub: "4 in Damascus / 6 in Moscow" },
    { value: "2 Bases", label: "Strategic Facilities", sub: "Tartus Naval PMTO & Khmeimim Air Base" },
    { value: "60,000", label: "Crude Oil (bpd)", sub: "Russian deliveries to Syrian refineries" }
  ],
  timeline: [
    { year: "1944", title: "Diplomatic Ties Established", desc: "USSR & Syrian Republic establish formal diplomatic ties on July 21." },
    { year: "1980", title: "Friendship & Cooperation Treaty", desc: "Foundational Cold War security & defense cooperation treaty." },
    { year: "2015 / 2017", title: "Strategic Basing Accords", desc: "49-year extraterritorial treaties for Khmeimim Air Base & Tartus PMTO." },
    { year: "2026", title: "Joint Logistics MoU", desc: "Reconfiguration into Joint Training Centers & Africa Corps Staging Hub." }
  ],
  functionalDistribution: [
    { role: "Mission Leadership", count: 2, share: "20%", color: "#3b82f6", diplomats: ["Dmitry Dogadkin (RU)", "Abdul Razzak Ismaeel (SY)"] },
    { role: "Defence & Strategic Attaché", count: 1, share: "10%", color: "#ef4444", diplomats: ["Andrei Bodredinov (RU)"] },
    { role: "Consular Leadership", count: 2, share: "20%", color: "#f59e0b", diplomats: ["Zaur Guseinov (RU)", "Zaher Al Ahmar (SY)"] },
    { role: "Chancery & Political Counsel", count: 2, share: "20%", color: "#8b5cf6", diplomats: ["Evgeny Kozlov (RU)", "Kinan Saker (SY)"] },
    { role: "Diplomatic Attachés", count: 3, share: "30%", color: "#10b981", diplomats: ["Muhannad Ali (SY)", "Salah Al Mahamid (SY)", "Safwan Hussein (SY)"] }
  ],
  missions: [
    {
      id: "damascus",
      countryCode: "ru",
      name: "Embassy of the Russian Federation",
      city: "Damascus",
      country: "Syria",
      address: "Omar Ben Al Khattab St., Adawi, Damascus",
      phone: "+963-991-240-999",
      email: "embsyria@mid.ru",
      lat: 33.5138,
      lng: 36.2765,
      staff: [
        { name: "H.E. Dmitry N. DOGADKIN", title: "Ambassador Extraordinary and Plenipotentiary", role: "Head of Mission", note: "Appointed August 3, 2026 (Presidential Decree No. 533)" },
        { name: "Evgeny S. KOZLOV", title: "Minister-Counsellor, Chargé d'Affaires a.i.", role: "Chancery" },
        { name: "Andrei V. BODREDINOV", title: "Defence Attaché (Military, Air and Naval)", role: "Defence Office" },
        { name: "Zaur A. GUSEINOV", title: "Counsellor, Head of Consular Section", role: "Consular Section" }
      ]
    },
    {
      id: "moscow",
      countryCode: "sy",
      name: "Embassy of the Syrian Arab Republic",
      city: "Moscow",
      country: "Russia",
      address: "119034, Moscow, Mansurovskiy Pereulok 4, bldg. 1",
      phone: "+7 499 766-01-92",
      email: "embassy@syrembassy.ru",
      lat: 55.7432,
      lng: 37.6008,
      staff: [
        { name: "Abdul Razzak ISMAEEL", title: "Counsellor, Head of Mission", role: "Head of Mission" },
        { name: "Zaher AL AHMAR", title: "Consul, Counsellor", role: "Consular Section" },
        { name: "Kinan SAKER", title: "Second Secretary", role: "Chancery" },
        { name: "Muhannad ALI", title: "Attaché", role: "Diplomatic Attaché" },
        { name: "Salah AL MAHAMID", title: "Attaché", role: "Diplomatic Attaché" },
        { name: "Safwan HUSSEIN", title: "Attaché", role: "Diplomatic Attaché" }
      ]
    }
  ],
  matrix: [
    {
      sector: "Military Sector",
      russia: "Personnel training, maintenance of Soviet/Russian legacy weapons, Eastern Med maritime monitoring.",
      syria: "Operational management of joint centers, unified command structure integration."
    },
    {
      sector: "Civilian & Port Sector",
      russia: "Advisory technical and engineering support for maritime infrastructure.",
      syria: "Full sovereign management of commercial berths, tariff collection, and civilian port operations."
    },
    {
      sector: "Logistics & Staging",
      russia: "Dedicated staging and logistics hub for the Russian Africa Corps.",
      syria: "Sovereign jurisdiction over territorial waters and inland transport arteries."
    }
  ],
  conclusion: {
    model: "Pragmatic Transactional Alliance",
    thesis: "By September 2026, Russia–Syria diplomatic relations operate under a consolidated, pragmatic transactional alliance. Moscow provides indispensable energy supplies (60,000 bpd crude) and food security lifelines, while maintaining Soviet/Russian legacy weapons. In return, Syria ensures Russia's long-term military foothold in Tartus and Khmeimim as the essential logistics staging hub for the Russian Africa Corps."
  }
};