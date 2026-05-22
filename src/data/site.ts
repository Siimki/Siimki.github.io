export type Locale = "et" | "en";

export const routes = {
  et: {
    home: "/",
    about: "/firmast/",
    services: "/ventilatsiooniteenused/",
    projects: "/tehtud-tood/",
    jobs: "/toopakkumised/",
    contact: "/kontakt/",
  },
  en: {
    home: "/en/",
    about: "/en/about/",
    services: "/en/services/",
    projects: "/en/projects/",
    jobs: "/en/jobs/",
    contact: "/en/contact/",
  },
} as const;

export const company = {
  name: "VAP Ventilatsioon",
  legalName: "VAP Ventilatsioon OÜ",
  registryCode: "11179404",
  vat: "EE101001584",
  mtr: "EEH 001068 - Ehitamine",
  founded: "2005",
  email: "vap@vap.ee",
  legalAddress: "Vikita tee 3/1-6, Karla küla, Rae vald, 75326",
  operatingAddress: "Killustiku põik 4, Lagedi, Harjumaa 75303",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Killustiku%20p%C3%B5ik%204%20Lagedi%20Harjumaa%2075303",
  people: [
    {
      name: "Veiko Meltsas",
      roleEt: "tegevjuht",
      roleEn: "CEO",
      phone: "+372 50 28 619",
      phoneHref: "+3725028619",
      email: "veiko.meltsas@vap.ee",
    },
    {
      name: "Priit Saksniit",
      roleEt: "projektijuht",
      roleEn: "project manager",
      phone: "+372 52 14 953",
      phoneHref: "+3725214953",
      email: "priit.saksniit@vap.ee",
    },
  ],
  links: [
    {
      label: "Inforegister",
      href: "https://www.inforegister.ee/11179404-VAP-VENTILATSIOON-OU/",
    },
    {
      label: "e-Äriregister",
      href: "https://ariregister.rik.ee/est/company/11179404/Osa%C3%BChing-VAP-Ventilatsioon",
    },
  ],
};

export const pageText = {
  et: {
    langName: "Eesti",
    switchLabel: "English",
    nav: {
      home: "Avaleht",
      about: "Firmast",
      services: "Teenused",
      projects: "Tehtud tööd",
      jobs: "Tööpakkumised",
      contact: "Kontakt",
    },
    footerSummary:
      "VAP Ventilatsioon OÜ on 2005. aasta sügisel asutatud Eesti erakapitalil põhinev osaühing, mille põhiliseks tegevusalaks on ventilatsioonisüsteemide projekteerimine ning paigaldus.",
    home: {
      title: "VAP Ventilatsioon",
      seoTitle: "VAP Ventilatsioon - ventilatsioonitööd",
      description:
        "Ventilatsioonisüsteemide projekteerimine ja paigaldus pikaajalise kogemusega meeskonnalt.",
      kicker: "Alates 2005",
      headline: "Ventilatsioonisüsteemide projekteerimine ja paigaldus",
      subhead: "Pikaaegse kogemusega spetsialistid",
      primaryCta: "Tehtud tööd",
      secondaryCta: "Kontakt",
      aboutTitle: "Ettevõttest",
      aboutBody:
        "VAP Ventilatsioon OÜ on 2005. aasta sügisel asutatud Eesti erakapitalil põhinev osaühing. Täna on ettevõtte põhiliseks tegevusalaks ventilatsioonisüsteemide projekteerimine ning paigaldus. Ettevõtte meeskond omab pikaajalist kogemust ventilatsioonitööde valdkonnas.",
      values: ["Täpsus", "Kogemustepagas", "Kvaliteetne töö", "Kaasaegsed lahendused"],
      stats: [
        { value: "projectCount", label: "projekti" },
        { value: "100+", label: "klienti" },
        { value: "yearsInOperation", label: "aastat tegutsemist" },
      ],
    },
    about: {
      seoTitle: "Firmast - VAP Ventilatsioon",
      title: "Firmast",
      description:
        "VAP Ventilatsioon OÜ on Eesti erakapitalil põhinev ventilatsioonitööde ettevõte.",
      body: [
        "VAP Ventilatsioon OÜ on 2005. aasta sügisel asutatud Eesti erakapitalil põhinev osaühing. Täna on ettevõtte põhiliseks tegevusalaks ventilatsioonisüsteemide projekteerimine ning paigaldus.",
        "Ettevõtte meeskond omab pikaajalist kogemust ventilatsioonitööde valdkonnas. VAP Ventilatsioon OÜ visiooniks on pakkuda oma töös tänapäevaseid komplektseid ventilatsioonisüsteeme koos sinna juurde kuuluvate kaasaegsete ventilatsiooniseadmetega ning materjalidega. Eesmärk on leida ning pakkuda tellijale kiireid ja optimaalseid lahendusi.",
      ],
    },
    services: {
      seoTitle: "Teenused - VAP Ventilatsioon",
      title: "Teenused",
      description: "Ventilatsioonisüsteemide projekteerimine, paigaldus ja kaasaegsed terviklahendused.",
    },
    projects: {
      seoTitle: "Tehtud tööd - VAP Ventilatsioon",
      title: "Tehtud tööd",
      description:
        "Valik töös olevaid ja varasemaid objekte ning täielik arhiiv aastate kaupa.",
      archiveTitle: "Arhiiv",
    },
    jobs: {
      seoTitle: "Tööpakkumised - VAP Ventilatsioon",
      title: "Tööpakkumised",
      description:
        "Kui soovid liituda VAP Ventilatsioon OÜ meeskonnaga, võta meiega ühendust.",
      heading: "Liitu meie meeskonnaga",
      body:
        "Ootame ühendust ventilatsioonisüsteemide projekteerimise ja paigalduse kogemusega inimestelt. Saada lühike tutvustus või CV e-posti aadressile vap@vap.ee.",
      emailCta: "Kirjuta meile",
      contactCta: "Kontakt",
    },
    contact: {
      seoTitle: "Kontakt - VAP Ventilatsioon",
      title: "Kontakt",
      description: "VAP Ventilatsiooni kontaktid, aadressid ja ettevõtte andmed.",
      addressTitle: "Aadress",
      legalAddress: "Juriidiline aadress",
      operatingAddress: "Tegevusaadress",
      detailsTitle: "Muu",
      peopleTitle: "Kontaktisikud",
      mapLabel: "Ava Google Maps",
      registryLinks: "Lingid",
    },
  },
  en: {
    langName: "English",
    switchLabel: "Eesti",
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      jobs: "Jobs",
      contact: "Contact",
    },
    footerSummary:
      "VAP Ventilatsioon OÜ is a private limited company founded on Estonian capital in 2005. The company designs and installs ventilation systems.",
    home: {
      title: "VAP Ventilatsioon",
      seoTitle: "VAP Ventilatsioon - ventilation works",
      description:
        "Design and installation of ventilation systems by an experienced team.",
      kicker: "Since 2005",
      headline: "Design and installation of ventilation systems",
      subhead: "Professionals with long experience",
      primaryCta: "Projects",
      secondaryCta: "Contact",
      aboutTitle: "About us",
      aboutBody:
        "VAP Ventilatsioon OÜ is a private limited company founded on Estonian capital in 2005. The company’s main activities are the design and installation of ventilation systems. The team has long experience in ventilation work.",
      values: ["Accuracy", "Experience", "Quality work", "Modern solutions"],
      stats: [
        { value: "projectCount", label: "projects" },
        { value: "100+", label: "clients" },
        { value: "yearsInOperation", label: "years in operation" },
      ],
    },
    about: {
      seoTitle: "About - VAP Ventilatsioon",
      title: "About",
      description:
        "VAP Ventilatsioon OÜ is an Estonian ventilation works company founded in 2005.",
      body: [
        "VAP Ventilatsioon OÜ is a private limited company founded on Estonian capital in 2005. The company’s main activities are the design and installation of ventilation systems.",
        "The team has long experience in ventilation work. VAP Ventilatsioon OÜ aims to offer modern complete ventilation systems with contemporary equipment and materials, and to find fast, optimal solutions for clients.",
      ],
    },
    services: {
      seoTitle: "Services - VAP Ventilatsioon",
      title: "Services",
      description: "Ventilation system design, installation, and modern complete solutions.",
    },
    projects: {
      seoTitle: "Projects - VAP Ventilatsioon",
      title: "Projects",
      description:
        "A selection of ongoing and completed projects, plus the full archive grouped by year.",
      archiveTitle: "Archive",
    },
    jobs: {
      seoTitle: "Jobs - VAP Ventilatsioon",
      title: "Jobs",
      description:
        "If you would like to join the VAP Ventilatsioon OÜ team, get in touch with us.",
      heading: "Join our team",
      body:
        "We welcome messages from people with experience in ventilation system design and installation. Send a short introduction or CV to vap@vap.ee.",
      emailCta: "Email us",
      contactCta: "Contact",
    },
    contact: {
      seoTitle: "Contact - VAP Ventilatsioon",
      title: "Contact",
      description: "Contact details, addresses, and company information for VAP Ventilatsioon.",
      addressTitle: "Address",
      legalAddress: "Legal address",
      operatingAddress: "Postal address",
      detailsTitle: "Other",
      peopleTitle: "Contact persons",
      mapLabel: "Open Google Maps",
      registryLinks: "Links",
    },
  },
} as const;

export const services = {
  et: [
    {
      title: "Ventilatsioonisüsteemide projekteerimine",
      text: "Terviklikud lahendused vastavalt objekti vajadustele.",
      image: "/assets/service-design.jpg",
    },
    {
      title: "Ventilatsioonisüsteemide paigaldus",
      text: "Paigaldustööd ehitusobjektidel Eestis ja vajadusel välismaal.",
      image: "/assets/service-installation.jpg",
    },
    {
      title: "Kaasaegsed terviklahendused",
      text: "Ventilatsiooniseadmed, materjalid ja optimaalsed tehnilised lahendused.",
      image: "/assets/service-solutions.jpg",
    },
  ],
  en: [
    {
      title: "Ventilation system design",
      text: "Complete solutions based on the needs of the project.",
      image: "/assets/service-design.jpg",
    },
    {
      title: "Installation of ventilation systems",
      text: "Installation work on construction sites in Estonia and abroad when needed.",
      image: "/assets/service-installation.jpg",
    },
    {
      title: "Modern complete solutions",
      text: "Ventilation equipment, materials, and practical technical solutions.",
      image: "/assets/service-solutions.jpg",
    },
  ],
} as const;
