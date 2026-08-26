export interface ClusterContact {
  id: string;
  name: string;
  email: string;
  organization: string;
}

export function formatDisplayName(contact: { name?: string; email: string }): string {
  if (contact.name && contact.name.trim()) {
    return contact.name.trim();
  }
  const username = contact.email.split("@")[0] || "";
  return username
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export function getOrganizationBadgeClass(org: string): string {
  switch (org) {
    case "UNICEF":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20";
    case "UNDP":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "WHO":
      return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
    case "WFP":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    case "IOM":
      return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20";
    case "UN Women":
    case "UNFPA":
    case "United Nations":
      return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
    case "Gov of Vanuatu / NDMO":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    case "Shelter Cluster":
    case "Gender & Protection Cluster":
      return "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20";
    case "Save the Children":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20";
    case "World Vision":
      return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
    case "CARE International":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    case "Red Cross / IFRC":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    case "DFAT Australia":
    case "MFAT New Zealand":
    case "US Government / USAID":
    case "Gov of New Caledonia / France":
    case "UK FCDO":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export const CLUSTER_CONTACTS: ClusterContact[] = [
  {
    "id": "contact-1",
    "name": "Sandrine Benjimen",
    "email": "sbenjimen@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-2",
    "name": "Mahina Sherryl",
    "email": "mahina.sherryl@undp.org",
    "organization": "UNDP"
  },
  {
    "id": "contact-3",
    "name": "Enate Nyakurerwa",
    "email": "nyakurerwa@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-4",
    "name": "Zoe Mahe",
    "email": "zoe.mahe@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-5",
    "name": "",
    "email": "abraham_philip@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-6",
    "name": "Alice Kalontano",
    "email": "alice.kalontano@dfat.gov.au",
    "organization": "DFAT Australia"
  },
  {
    "id": "contact-7",
    "name": "",
    "email": "boekara-rebecca@jica.go.jp",
    "organization": "JICA"
  },
  {
    "id": "contact-8",
    "name": "Shelter Cluster Pacific",
    "email": "coord.pacific@sheltercluster.org",
    "organization": "Shelter Cluster"
  },
  {
    "id": "contact-9",
    "name": "Vanuatu Shelter Cluster",
    "email": "coord1.vanuatu@sheltercluster.org",
    "organization": "Shelter Cluster"
  },
  {
    "id": "contact-10",
    "name": "Risk & Resilience Unit (RRU)",
    "email": "fsacreport@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-11",
    "name": "Isaac (VLA)",
    "email": "isaac.savua@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-12",
    "name": "Leikita Kalorib",
    "email": "leikita.kalorib@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-13",
    "name": "",
    "email": "levendal@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-14",
    "name": "Liku (VLA)",
    "email": "liku.jimmy@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-15",
    "name": "Paolo Malatu",
    "email": "malatupaolo@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-16",
    "name": "",
    "email": "mehaka.rountree@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-17",
    "name": "",
    "email": "michelle.popovi@fao.org",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-18",
    "name": "Pallen Abraham Philip",
    "email": "pallenabraham_philip@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-19",
    "name": "Rico Kalmelu Aka",
    "email": "ricoaka@adra.org.vu",
    "organization": "ADRA"
  },
  {
    "id": "contact-20",
    "name": "Rowan Lulu",
    "email": "rowan.lulu@respondglobal.com",
    "organization": "Respond Global"
  },
  {
    "id": "contact-21",
    "name": "",
    "email": "sdoyle@actforpeace.org.au",
    "organization": "Act for Peace"
  },
  {
    "id": "contact-22",
    "name": "Sheena Luankon",
    "email": "sheena.luankon@dfat.gov.au",
    "organization": "DFAT Australia"
  },
  {
    "id": "contact-23",
    "name": "",
    "email": "sheffieldec@state.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-24",
    "name": "Jeffrey (Port Vila)",
    "email": "shelstadj@state.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-25",
    "name": "",
    "email": "tim.vosailagi@fieldready.org",
    "organization": "Field Ready"
  },
  {
    "id": "contact-26",
    "name": "Gender and Protection Cluster",
    "email": "vanuatu.genderandprotection@gmail.com",
    "organization": "Gender & Protection Cluster"
  },
  {
    "id": "contact-27",
    "name": "",
    "email": "_duaea@mail.gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-28",
    "name": "",
    "email": "a.dundas@actforpeace.org.au",
    "organization": "Act for Peace"
  },
  {
    "id": "contact-29",
    "name": "",
    "email": "aable@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-30",
    "name": "",
    "email": "abelson.ndmomalampa@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-31",
    "name": "",
    "email": "abelson424@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-32",
    "name": "Ana Cristina Azevedo",
    "email": "acazevedo@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-33",
    "name": "Aaron Hakwa",
    "email": "ahakwa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-34",
    "name": "",
    "email": "alexander.thomas@wfp.org",
    "organization": "WFP"
  },
  {
    "id": "contact-35",
    "name": "",
    "email": "alexandre.carrat@nouvelle-caledonie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-36",
    "name": "",
    "email": "alfredbaniuri@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-37",
    "name": "",
    "email": "alsacb@afd.fr",
    "organization": "AFD"
  },
  {
    "id": "contact-38",
    "name": "",
    "email": "amalo86@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-39",
    "name": "",
    "email": "an2taribiti@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-40",
    "name": "Abraham Nasak",
    "email": "anasak@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-41",
    "name": "Anne Crawford",
    "email": "anne.crawford@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-42",
    "name": "",
    "email": "annie.l.ingram@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-43",
    "name": "Antoine Ravo",
    "email": "aravo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-44",
    "name": "Renata Amos",
    "email": "arenata@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-45",
    "name": "Alice Iarem Sanga",
    "email": "asanga@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-46",
    "name": "",
    "email": "aspakoa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-47",
    "name": "Anna Spethman",
    "email": "aspethman@usaid.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-48",
    "name": "",
    "email": "asuncionmr@state.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-49",
    "name": "Andrew Taribiti",
    "email": "ataribiti@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-50",
    "name": "Basil Leodoro",
    "email": "basil.leodoro@respondglobal.com",
    "organization": "Respond Global"
  },
  {
    "id": "contact-51",
    "name": "",
    "email": "bcollard@redr.org.au",
    "organization": "RedR Australia"
  },
  {
    "id": "contact-52",
    "name": "",
    "email": "berton.j@nbv.vu",
    "organization": "National Bank of Vanuatu"
  },
  {
    "id": "contact-53",
    "name": "",
    "email": "betsy.ndmotorba@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-54",
    "name": "",
    "email": "betty.toa@unwomen.org",
    "organization": "UN Women"
  },
  {
    "id": "contact-55",
    "name": "",
    "email": "bhemingway@usaid.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-56",
    "name": "Betsy Manliwos",
    "email": "bmanliwos@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-57",
    "name": "Brecht Mommen",
    "email": "bmommen@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-58",
    "name": "",
    "email": "bomalamparedcross@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-59",
    "name": "",
    "email": "brianwalsaienkay@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-60",
    "name": "",
    "email": "bronwynl@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-61",
    "name": "",
    "email": "bsebastian@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-62",
    "name": "",
    "email": "btofor@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-63",
    "name": "Benneth Bue",
    "email": "buebenneth607@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-64",
    "name": "",
    "email": "bulmol08@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-65",
    "name": "",
    "email": "bwillams@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-66",
    "name": "Brenda Williams",
    "email": "bwilliams@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-67",
    "name": "",
    "email": "carmella.fernandes-da-rocha@province-sud.nc",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-68",
    "name": "Carol Angir",
    "email": "carol.angir@actionaid.org",
    "organization": "ActionAid"
  },
  {
    "id": "contact-69",
    "name": "",
    "email": "cbani@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-70",
    "name": "",
    "email": "cgroundy@ldschurch.org",
    "organization": "LDS Charities"
  },
  {
    "id": "contact-71",
    "name": "Christion Tukunamoli",
    "email": "christion.tukunamoli@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-72",
    "name": "",
    "email": "christopher.hartnett@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-73",
    "name": "",
    "email": "cinzia.virelala@engie.com",
    "organization": "ENGIE / UNELCO"
  },
  {
    "id": "contact-74",
    "name": "Charlesly Kanas",
    "email": "ckanas@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-75",
    "name": "",
    "email": "clarel-leon.lorain@nouvelle-caledonie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-76",
    "name": "Charlington Leo",
    "email": "cleo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-77",
    "name": "Cobin Ngwero",
    "email": "cngwero@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-78",
    "name": "",
    "email": "colquhoun2@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-79",
    "name": "",
    "email": "contact.unelco@engie.com",
    "organization": "ENGIE / UNELCO"
  },
  {
    "id": "contact-80",
    "name": "",
    "email": "cristofaricf@afd.fr",
    "organization": "AFD"
  },
  {
    "id": "contact-81",
    "name": "Charlie Silas",
    "email": "csilas@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-82",
    "name": "",
    "email": "csumtoh@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-83",
    "name": "",
    "email": "csumtoh@vanuatu.com.vu",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-84",
    "name": "Christophe Sumtoh",
    "email": "csumtoh@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-85",
    "name": "",
    "email": "danielavillarp@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-86",
    "name": "Butterfly Trust",
    "email": "david.lynn@butterflytrust.org",
    "organization": "Butterfly Trust"
  },
  {
    "id": "contact-87",
    "name": "DECM Cluster Vanuatu",
    "email": "decmclustervanuatu@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-88",
    "name": "",
    "email": "demickjosis9@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-89",
    "name": "Diego FLORES",
    "email": "diego.flores@wfp.org",
    "organization": "WFP"
  },
  {
    "id": "contact-90",
    "name": "",
    "email": "disaster.coordinator@redcrossvanuatu.com",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-91",
    "name": "",
    "email": "donald.wouloseje@undp.org",
    "organization": "UNDP"
  },
  {
    "id": "contact-92",
    "name": "Davis Saravanu",
    "email": "dsaravanu@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-93",
    "name": "DSPPAC - Recovery Unit",
    "email": "dsppac.nrc@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-94",
    "name": "",
    "email": "dwomeara@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-95",
    "name": "Eunice Amkori",
    "email": "eamokori@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-96",
    "name": "",
    "email": "edurpaire@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-97",
    "name": "",
    "email": "ehanghangkon@adb.org",
    "organization": "Asian Development Bank"
  },
  {
    "id": "contact-98",
    "name": "",
    "email": "emia-nouvelle-caledonie.j5.fct@intradef.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-99",
    "name": "",
    "email": "erand@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-100",
    "name": "Erickson Sammy",
    "email": "esammy@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-101",
    "name": "",
    "email": "esther.jens@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-102",
    "name": "",
    "email": "eyescope19@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-103",
    "name": "Fidel Zebeta",
    "email": "f.zebeta@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-104",
    "name": "",
    "email": "farthur@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-105",
    "name": "",
    "email": "fbibi@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-106",
    "name": "Flora Vano",
    "email": "flora.vano@actionaid.org",
    "organization": "ActionAid"
  },
  {
    "id": "contact-107",
    "name": "",
    "email": "franck.boulay105@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-108",
    "name": "",
    "email": "francois.sow@diplomatie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-109",
    "name": "",
    "email": "francois.sow@nouvelle-caledonie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-110",
    "name": "",
    "email": "freda.vdpa@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-111",
    "name": "",
    "email": "frederic.petit@engie.com",
    "organization": "ENGIE / UNELCO"
  },
  {
    "id": "contact-112",
    "name": "Frida Sam",
    "email": "frida.sam@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-113",
    "name": "Fidel Zebeta",
    "email": "fzebeta@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-114",
    "name": "",
    "email": "gaelle.deriaz@nouvelle-caledonie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-115",
    "name": "Antony Garae",
    "email": "gantony@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-116",
    "name": "",
    "email": "gauthier.guillaumat@intradef.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-117",
    "name": "Glenise Levendal",
    "email": "glenise.levendal@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-118",
    "name": "",
    "email": "glenp@oxfam.org.au",
    "organization": "Oxfam"
  },
  {
    "id": "contact-119",
    "name": "",
    "email": "gludvaune@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-120",
    "name": "Gerard Metsan",
    "email": "gmetsan@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-121",
    "name": "",
    "email": "gregoire.bonhomme@diplomatie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-122",
    "name": "Philippe Guyant",
    "email": "guyantp@who.int",
    "organization": "WHO"
  },
  {
    "id": "contact-123",
    "name": "Heather Sarur Maraki",
    "email": "h.s.maraki@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-124",
    "name": "Hannah Tamata",
    "email": "hannah.tamata@ipmpv.org",
    "organization": "IPMPV"
  },
  {
    "id": "contact-125",
    "name": "",
    "email": "hardwickmt@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-126",
    "name": "",
    "email": "hbani@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-127",
    "name": "",
    "email": "hedleytau18@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-128",
    "name": "Helen Corrigan",
    "email": "helen_corrigan@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-129",
    "name": "Hanson Stanley",
    "email": "hstanley@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-130",
    "name": "Henry Worek",
    "email": "hworek@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-131",
    "name": "Iati Bergmans",
    "email": "ibergmans@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-132",
    "name": "Isabelle Choutet",
    "email": "isabelle.choutet@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-133",
    "name": "Jack French",
    "email": "jack.french@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-134",
    "name": "Johnson Binaru Iauma",
    "email": "jbiauma@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-135",
    "name": "Jodi Devine",
    "email": "jdevine@wansmolbag.org",
    "organization": "Wan Smolbag"
  },
  {
    "id": "contact-136",
    "name": "",
    "email": "jean-luc.huppert@intradef.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-137",
    "name": "Jelson Naparau",
    "email": "jelson.naparau@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-138",
    "name": "",
    "email": "jennifer.kausei@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-139",
    "name": "John Ezra",
    "email": "jezra@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-140",
    "name": "JACK Janet",
    "email": "jjack@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-141",
    "name": "",
    "email": "jlhuppert@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-142",
    "name": "",
    "email": "jlswobelak@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-143",
    "name": "",
    "email": "jnaura777@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-144",
    "name": "Jimmy Naura",
    "email": "jnaura@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-145",
    "name": "Joseph Curry",
    "email": "jocurry@usaid.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-146",
    "name": "Joint Planning Operation Center",
    "email": "jpoc@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-147",
    "name": "",
    "email": "jruben@meteo.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-148",
    "name": "",
    "email": "judithiakavai@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-149",
    "name": "Julien LAMBERTI",
    "email": "julien.lamberti@expertisefrance.fr",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-150",
    "name": "",
    "email": "kallista440@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-151",
    "name": "",
    "email": "kalnaarthur@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-152",
    "name": "",
    "email": "karaet@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-153",
    "name": "",
    "email": "katie.nicholls@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-154",
    "name": "",
    "email": "kellytabi@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-155",
    "name": "Sanma PDO",
    "email": "kensley.ndmosanma@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-156",
    "name": "",
    "email": "kensly.ndmosanma@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-157",
    "name": "Ken Mana",
    "email": "kmana@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-158",
    "name": "Melissa Yveinita Kalmatak",
    "email": "kmelissa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-159",
    "name": "Kensley Micah",
    "email": "kmicah@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-160",
    "name": "",
    "email": "krakolinig@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-161",
    "name": "",
    "email": "ktavhapi@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-162",
    "name": "",
    "email": "kunal.lal@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-163",
    "name": "Julien Lamberti",
    "email": "lamberti.julien@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-164",
    "name": "",
    "email": "leachel782@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-165",
    "name": "",
    "email": "leal@unfpa.org",
    "organization": "UNFPA"
  },
  {
    "id": "contact-166",
    "name": "",
    "email": "learntoserve.vanuatu@yahoo.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-167",
    "name": "",
    "email": "leitare.joel@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-168",
    "name": "Lindah Peter",
    "email": "lindah.peter@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-169",
    "name": "lulu lemang",
    "email": "llululamap@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-170",
    "name": "",
    "email": "lnimoho@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-171",
    "name": "",
    "email": "lucy.stevens@unwomen.org",
    "organization": "UN Women"
  },
  {
    "id": "contact-172",
    "name": "",
    "email": "ludovic.arnout@croix-rouge.fr",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-173",
    "name": "",
    "email": "lveremaito@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-174",
    "name": "",
    "email": "lyerta@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-175",
    "name": "Lynette Taga",
    "email": "lynette_taga@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-176",
    "name": "",
    "email": "lynoldaru20191@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-177",
    "name": "AHELMHALAHLAH Mansen",
    "email": "mahelmhalahl@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-178",
    "name": "",
    "email": "malatopaolo@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-179",
    "name": "Morris Amos",
    "email": "mamos@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-180",
    "name": "",
    "email": "manon.brasseur@gouv.nc",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-181",
    "name": "",
    "email": "manson.ndmopenama@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-182",
    "name": "",
    "email": "marangowiny@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-183",
    "name": "Marie Toto",
    "email": "marie.toto@careint.org",
    "organization": "CARE International"
  },
  {
    "id": "contact-184",
    "name": "",
    "email": "marjorie.botella@france-volontaires.org",
    "organization": "France Volontaires"
  },
  {
    "id": "contact-185",
    "name": "",
    "email": "mark.mccaul@ifrc.org",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-186",
    "name": "Mereoni Ketewai",
    "email": "mereoni.ketewai@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-187",
    "name": "Michael Taurakoto",
    "email": "michael.taurakoto@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-188",
    "name": "",
    "email": "michael.watters@fcdo.gov.uk",
    "organization": "UK FCDO"
  },
  {
    "id": "contact-189",
    "name": "Michel Calo Kapp",
    "email": "michel.calokapp@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-190",
    "name": "",
    "email": "min.sun@wfp.org",
    "organization": "WFP"
  },
  {
    "id": "contact-191",
    "name": "Willy Missack",
    "email": "missack.willy@yahoo.fr",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-192",
    "name": "Moses John Amos Tinapua",
    "email": "mjamos@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-193",
    "name": "",
    "email": "mjtrief@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-194",
    "name": "",
    "email": "mosesb@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-195",
    "name": "",
    "email": "mosesjohnamos@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-196",
    "name": "",
    "email": "mosessandie@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-197",
    "name": "Malatu Paolo",
    "email": "mpaolo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-198",
    "name": "",
    "email": "mtaeidena@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-199",
    "name": "",
    "email": "mtomaki@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-200",
    "name": "",
    "email": "murraymillar@adra.org.au",
    "organization": "ADRA"
  },
  {
    "id": "contact-201",
    "name": "",
    "email": "myamsiu@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-202",
    "name": "",
    "email": "n93000son@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-203",
    "name": "",
    "email": "naniselapi545@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-204",
    "name": "Ministry of Health NHEOC",
    "email": "nationalhealtheoc@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-205",
    "name": "NDMO Information Management",
    "email": "ndmo.im@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-206",
    "name": "",
    "email": "nehemaiahb51@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-207",
    "name": "",
    "email": "nelson.shem2018@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-208",
    "name": "Nellie Ham",
    "email": "nham@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-209",
    "name": "Health Emergency Operations Centre",
    "email": "nheoc@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-210",
    "name": "",
    "email": "nick.watt@respondglobal.com",
    "organization": "Respond Global"
  },
  {
    "id": "contact-211",
    "name": "",
    "email": "nixonmasanga117@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-212",
    "name": "Nanise Lapi",
    "email": "nlapi@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-213",
    "name": "Nick Nicolson",
    "email": "nnicolson@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-214",
    "name": "Nancy Wells",
    "email": "nwells@adb.org",
    "organization": "Asian Development Bank"
  },
  {
    "id": "contact-215",
    "name": "",
    "email": "olulbronwynndmo@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-216",
    "name": "",
    "email": "oscar.matheson10@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-217",
    "name": "",
    "email": "pbasil@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-218",
    "name": "",
    "email": "pdomocc@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-219",
    "name": "",
    "email": "pglenda@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-220",
    "name": "",
    "email": "pierre@stap-vanuatu.com",
    "organization": "STAP Vanuatu"
  },
  {
    "id": "contact-221",
    "name": "Peter Korisa",
    "email": "pkorisa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-222",
    "name": "",
    "email": "pmeto.ndmopplo@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-223",
    "name": "Philip Meto",
    "email": "pmeto@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-224",
    "name": "",
    "email": "pobc.depc@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-225",
    "name": "",
    "email": "profficer@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-226",
    "name": "",
    "email": "prorovskaya@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-227",
    "name": "Sam Tapo",
    "email": "pstapo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-228",
    "name": "Presley Tari",
    "email": "ptari.ndmoict@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-229",
    "name": "",
    "email": "raynoldt973@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-230",
    "name": "Rihanna Brown",
    "email": "rbrown@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-231",
    "name": "Roslyn David",
    "email": "rdavid@unfpa.org",
    "organization": "UNFPA"
  },
  {
    "id": "contact-232",
    "name": "",
    "email": "rebecca.weir@respondglobal.com",
    "organization": "Respond Global"
  },
  {
    "id": "contact-233",
    "name": "Relvie Matariki",
    "email": "relvie.matariki@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-234",
    "name": "",
    "email": "rhensly@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-235",
    "name": "henzly Roy",
    "email": "rhnzly@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-236",
    "name": "",
    "email": "richardm@oxfam.org.au",
    "organization": "Oxfam"
  },
  {
    "id": "contact-237",
    "name": "rihanna ndmo",
    "email": "rihanna.ndmo@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-238",
    "name": "",
    "email": "rilo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-239",
    "name": "",
    "email": "rinoka@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-240",
    "name": "",
    "email": "rita@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-241",
    "name": "",
    "email": "rjeanmichel772@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-242",
    "name": "RJ Welin",
    "email": "rjwelin2018@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-243",
    "name": "",
    "email": "rnamela@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-244",
    "name": "Rocky Jean Michel Neveserveth",
    "email": "rnevserveth@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-245",
    "name": "Rocky JM Nevserveth",
    "email": "rocky.ndmostao@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-246",
    "name": "",
    "email": "rodriguemetsan24@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-247",
    "name": "",
    "email": "rolul@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-248",
    "name": "",
    "email": "rores@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-249",
    "name": "",
    "email": "ryan_smith@consultant.wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-250",
    "name": "",
    "email": "ryan_smith@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-251",
    "name": "",
    "email": "sairosm@oxfam.org.au",
    "organization": "Oxfam"
  },
  {
    "id": "contact-252",
    "name": "Sarah James",
    "email": "sajames@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-253",
    "name": "samandra Gete",
    "email": "samandragete@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-254",
    "name": "",
    "email": "sboedovo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-255",
    "name": "",
    "email": "sebastien.jaunatre@diplomatie.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-256",
    "name": "",
    "email": "seniormanagement@wansmolbag.org",
    "organization": "Wan Smolbag"
  },
  {
    "id": "contact-257",
    "name": "",
    "email": "sg@redcrossvanuatu.com",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-258",
    "name": "",
    "email": "shantony.moli@savethechildren.org.au",
    "organization": "Save the Children"
  },
  {
    "id": "contact-259",
    "name": "",
    "email": "shefapeocops2023@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-260",
    "name": "",
    "email": "shefapeocpls2023@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-261",
    "name": "",
    "email": "shefapl2023@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-262",
    "name": "",
    "email": "shefaredcross@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-263",
    "name": "Jenny Stephens",
    "email": "sjenny@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-264",
    "name": "Serge Lewawa",
    "email": "slewawa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-265",
    "name": "Smith Pakoasongi",
    "email": "smithpakoasongi459@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-266",
    "name": "Sandy Moses Sawan",
    "email": "smoses@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-267",
    "name": "",
    "email": "sndalesa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-268",
    "name": "",
    "email": "sobed.consultant@adb.org",
    "organization": "Asian Development Bank"
  },
  {
    "id": "contact-269",
    "name": "",
    "email": "soejitnos@afd.fr",
    "organization": "AFD"
  },
  {
    "id": "contact-270",
    "name": "",
    "email": "spakoasongi@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-271",
    "name": "",
    "email": "stiku1993@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-272",
    "name": "",
    "email": "stoara.consultant@adb.org",
    "organization": "Asian Development Bank"
  },
  {
    "id": "contact-273",
    "name": "",
    "email": "sunnys@sprep.org",
    "organization": "SPREP"
  },
  {
    "id": "contact-274",
    "name": "",
    "email": "suzanne.akila@dfat.gov.au",
    "organization": "DFAT Australia"
  },
  {
    "id": "contact-275",
    "name": "",
    "email": "t.lavinia73@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-276",
    "name": "",
    "email": "tarijohnny@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-277",
    "name": "Tony Amos Sewen",
    "email": "tasewen@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-278",
    "name": "",
    "email": "thomas.lebreuil@croix-rouge.fr",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-279",
    "name": "Theingi Soe",
    "email": "thsoe@unicef.org",
    "organization": "UNICEF"
  },
  {
    "id": "contact-280",
    "name": "Rothina Ilo",
    "email": "tinanoka@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-281",
    "name": "",
    "email": "tnaupa264@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-282",
    "name": "",
    "email": "tokosb886@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-283",
    "name": "Tony Tavlili",
    "email": "tony.ndmotafea@gmail.com",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-284",
    "name": "Presley Tari",
    "email": "tpresley@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-285",
    "name": "",
    "email": "ttavlili@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-286",
    "name": "",
    "email": "ttiwok@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-287",
    "name": "",
    "email": "twlenga@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-288",
    "name": "",
    "email": "unisarai52@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-289",
    "name": "Allan Harper",
    "email": "vanuatu.harper@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-290",
    "name": "",
    "email": "vanuatuclimateactionnetwork@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-291",
    "name": "",
    "email": "vcan@oxfam.org.au",
    "organization": "Oxfam"
  },
  {
    "id": "contact-292",
    "name": "George Tabi",
    "email": "vccdisastereadyprog@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-293",
    "name": "",
    "email": "virana.lini@unwomen.org",
    "organization": "UN Women"
  },
  {
    "id": "contact-294",
    "name": "Viviane Obed",
    "email": "viviane.obeds@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-295",
    "name": "",
    "email": "vola.matas.vwc@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-296",
    "name": "ORGANO Vanessa Claire",
    "email": "vorgano@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-297",
    "name": "Clifford Vusi",
    "email": "vusic@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-298",
    "name": "",
    "email": "vwc.tafea@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-299",
    "name": "",
    "email": "waileen@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-300",
    "name": "Wycliff Jnr Bakeo",
    "email": "wbakeo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-301",
    "name": "",
    "email": "wcharlie@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-302",
    "name": "",
    "email": "williejenny460@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-303",
    "name": "",
    "email": "wills0082@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-304",
    "name": "William Iamasore Nasak",
    "email": "winasak@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-305",
    "name": "",
    "email": "wroyson@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-306",
    "name": "Melissa Kalmatak",
    "email": "yvei42@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-307",
    "name": "Zo\u00e9 Touteniaki Ayong",
    "email": "zayong@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-308",
    "name": "ADAMS Carl Stuart",
    "email": "caadams@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-309",
    "name": "",
    "email": "jkarlosaruru@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-310",
    "name": "NICHOLLS Imogen Catherine",
    "email": "inicholls@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-311",
    "name": "IOM Pacific Programme Support Unit",
    "email": "iompacificprogrammesupportunit@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-312",
    "name": "",
    "email": "rlal@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-313",
    "name": "",
    "email": "lvunituraga@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-314",
    "name": "",
    "email": "fsaid@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-315",
    "name": "",
    "email": "ohomsombath@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-316",
    "name": "",
    "email": "vivesl@who.int",
    "organization": "WHO"
  },
  {
    "id": "contact-317",
    "name": "",
    "email": "donalyne.naviti@mfat.govt.nz",
    "organization": "MFAT New Zealand"
  },
  {
    "id": "contact-318",
    "name": "",
    "email": "hnasawa@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-319",
    "name": "",
    "email": "brakau@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-320",
    "name": "",
    "email": "sluankon57@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-321",
    "name": "",
    "email": "singhama@who.int",
    "organization": "WHO"
  },
  {
    "id": "contact-322",
    "name": "",
    "email": "w.7ngweta@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-323",
    "name": "",
    "email": "tarikelanaw@states.gov",
    "organization": "US Government / USAID"
  },
  {
    "id": "contact-324",
    "name": "",
    "email": "svinbel@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-325",
    "name": "",
    "email": "cmnasak@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-326",
    "name": "",
    "email": "ttemakon@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-327",
    "name": "",
    "email": "mshen@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-328",
    "name": "",
    "email": "monit.lal@ifrc.org",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-329",
    "name": "",
    "email": "shelterclusterco.vanuatu@ifrc.org",
    "organization": "Shelter Cluster"
  },
  {
    "id": "contact-330",
    "name": "",
    "email": "marcinpius@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-331",
    "name": "",
    "email": "aus1dart@qfes.qld.gov.au",
    "organization": "QFES Australia"
  },
  {
    "id": "contact-332",
    "name": "Olive Taurakoto",
    "email": "olive.taurakoto@dfat.gov.au",
    "organization": "DFAT Australia"
  },
  {
    "id": "contact-333",
    "name": "Fiona Schmid",
    "email": "fiona.schmid@un.org",
    "organization": "United Nations"
  },
  {
    "id": "contact-334",
    "name": "Isabelle Choutet",
    "email": "choutet.isabelle@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-335",
    "name": "",
    "email": "rothinanoka@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-336",
    "name": "",
    "email": "jjtari@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-337",
    "name": "",
    "email": "rghlpr@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-338",
    "name": "",
    "email": "clement_chipokolo@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-339",
    "name": "",
    "email": "kathleen.preissing@undp.org",
    "organization": "UNDP"
  },
  {
    "id": "contact-340",
    "name": "Niaz Kandhir",
    "email": "niaz.kandhir@undp.org",
    "organization": "UNDP"
  },
  {
    "id": "contact-341",
    "name": "",
    "email": "michelle.popovi@undp.org",
    "organization": "UNDP"
  },
  {
    "id": "contact-342",
    "name": "",
    "email": "neocops24@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-343",
    "name": "Georgyanne Tasso",
    "email": "georgyanne.tasso@dfat.gov.au",
    "organization": "DFAT Australia"
  },
  {
    "id": "contact-344",
    "name": "Tykes Taiki",
    "email": "michael.taiki@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-345",
    "name": "",
    "email": "tdenny@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-346",
    "name": "",
    "email": "jrurunavira@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-347",
    "name": "Jerry Dalesa",
    "email": "dalesajerry01@gmail.com",
    "organization": "Cluster Partner"
  },
  {
    "id": "contact-348",
    "name": "Mark Hosea",
    "email": "mhosea@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-349",
    "name": "Revite",
    "email": "revite.kirition@who.int",
    "organization": "WHO"
  },
  {
    "id": "contact-350",
    "name": "",
    "email": "smento@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-351",
    "name": "",
    "email": "larry.abel@espvanuatu.com",
    "organization": "ESP Vanuatu"
  },
  {
    "id": "contact-352",
    "name": "",
    "email": "drr.assistant@redcross.org.vu",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-353",
    "name": "",
    "email": "david.cram@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-354",
    "name": "Yvette Camille",
    "email": "ycamille@wansmolbag.org",
    "organization": "Wan Smolbag"
  },
  {
    "id": "contact-355",
    "name": "Lynne Lala",
    "email": "llala@wansmolbag.org",
    "organization": "Wan Smolbag"
  },
  {
    "id": "contact-356",
    "name": "",
    "email": "smaltock@oxfampacific.org",
    "organization": "Oxfam"
  },
  {
    "id": "contact-357",
    "name": "Ophelie QUILBEUF",
    "email": "ophelie.quilbeuf@france-volontaires.org",
    "organization": "France Volontaires"
  },
  {
    "id": "contact-358",
    "name": "",
    "email": "pierre-francois.maux@intradef.gouv.fr",
    "organization": "Gov of New Caledonia / France"
  },
  {
    "id": "contact-359",
    "name": "SHRESTHA Pooja",
    "email": "pshrestha@iom.int",
    "organization": "IOM"
  },
  {
    "id": "contact-360",
    "name": "Thomas Belden",
    "email": "thomasbelden@adra.org.vu",
    "organization": "ADRA"
  },
  {
    "id": "contact-361",
    "name": "Theotime Tetu",
    "email": "theotime.tetu@croix-rouge.fr",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-362",
    "name": "",
    "email": "disaster.coordinator@redcross.org.vu",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-363",
    "name": "Samandra Gete",
    "email": "shelter@redcross.org.vu",
    "organization": "Red Cross / IFRC"
  },
  {
    "id": "contact-364",
    "name": "",
    "email": "caianna@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-365",
    "name": "",
    "email": "mboesel@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-366",
    "name": "",
    "email": "sshem@israaid.org",
    "organization": "IsraAID"
  },
  {
    "id": "contact-367",
    "name": "",
    "email": "maxime_zacharie@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-368",
    "name": "",
    "email": "hillary_garae@wvi.org",
    "organization": "World Vision"
  },
  {
    "id": "contact-369",
    "name": "",
    "email": "obwanda@unfpa.org",
    "organization": "UNFPA"
  },
  {
    "id": "contact-370",
    "name": "",
    "email": "jed.abad@tetratech.com",
    "organization": "Tetra Tech"
  },
  {
    "id": "contact-371",
    "name": "",
    "email": "gdeighton@israaid.org",
    "organization": "IsraAID"
  },
  {
    "id": "contact-372",
    "name": "",
    "email": "mantfalo@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-373",
    "name": "Charles Sale Sumbe",
    "email": "cssumbe@vbtc.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-374",
    "name": "Lilon BONGMATUR",
    "email": "lbongmatur@vbtc.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-375",
    "name": "Liah John Kaltoi",
    "email": "ljkaltoi@vanuatu.gov.vu",
    "organization": "Gov of Vanuatu / NDMO"
  },
  {
    "id": "contact-376",
    "name": "Glen Pakoa",
    "email": "gpakoa@oxfampacific.org",
    "organization": "Oxfam"
  },
  {
    "id": "contact-377",
    "name": "BRIZIO Alexandra",
    "email": "brizioa@afd.fr",
    "organization": "AFD"
  }
];
