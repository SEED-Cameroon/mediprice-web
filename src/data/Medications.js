// Sample data used until the pages are wired to the MediPrice API.
const medications = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    form: "Tablets, pack of 10",
    description:
      "Relieves mild to moderate pain and reduces fever. One of the most commonly bought medicines in the region.",
    category: "Pain relief",
    providers: [
      {
        id: 1,
        name: "Commercial Avenue Pharmacy",
        type: "Pharmacy",
        area: "Commercial Avenue",
        price: 500,
        trust: "SEED-verified",
        updatedAt: "2026-09-27",
      },
      {
        id: 2,
        name: "Nkwen Community Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 600,
        trust: "Provider-verified",
        updatedAt: "2026-09-24",
      },
      {
        id: 3,
        name: "Up Station Pharmacy",
        type: "Pharmacy",
        area: "Up Station",
        price: 550,
        trust: "Community-reported",
        updatedAt: "2026-09-18",
      },
    ],
  },

  {
    id: 2,
    name: "Amoxicillin 500mg",
    form: "Capsules, pack of 21",
    description:
      "An antibiotic used to treat bacterial infections such as chest, ear and urinary infections. Requires a prescription.",
    category: "Antibiotic",
    requiresPrescription: true,
    providers: [
      {
        id: 1,
        name: "Commercial Avenue Pharmacy",
        type: "Pharmacy",
        area: "Commercial Avenue",
        price: 1500,
        trust: "Provider-verified",
        updatedAt: "2026-09-26",
      },
      {
        id: 2,
        name: "Regional Hospital Pharmacy",
        type: "Hospital pharmacy",
        area: "Azire",
        price: 1300,
        trust: "SEED-verified",
        updatedAt: "2026-09-22",
      },
      {
        id: 3,
        name: "Mile 4 Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 1700,
        trust: "Community-reported",
        updatedAt: "2026-09-15",
      },
    ],
  },

  {
    id: 3,
    name: "Ibuprofen 400mg",
    form: "Tablets, pack of 10",
    description:
      "Relieves pain, reduces fever and decreases inflammation. Take with food.",
    category: "Pain relief",
    providers: [
      {
        id: 1,
        name: "Nkwen Community Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 800,
        trust: "Provider-verified",
        updatedAt: "2026-09-25",
      },
      {
        id: 2,
        name: "Up Station Pharmacy",
        type: "Pharmacy",
        area: "Up Station",
        price: 900,
        trust: "Community-reported",
        updatedAt: "2026-09-20",
      },
    ],
  },

  {
    id: 4,
    name: "Artemether/Lumefantrine 20/120mg",
    form: "Tablets, adult course of 24",
    description:
      "The first-line treatment for uncomplicated malaria, often sold as Coartem. Complete the full course.",
    category: "Antimalarial",
    providers: [
      {
        id: 1,
        name: "Regional Hospital Pharmacy",
        type: "Hospital pharmacy",
        area: "Azire",
        price: 1800,
        trust: "SEED-verified",
        updatedAt: "2026-09-28",
      },
      {
        id: 2,
        name: "Commercial Avenue Pharmacy",
        type: "Pharmacy",
        area: "Commercial Avenue",
        price: 2000,
        trust: "SEED-verified",
        updatedAt: "2026-09-27",
      },
      {
        id: 3,
        name: "Nkwen Community Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 2200,
        trust: "Provider-verified",
        updatedAt: "2026-09-23",
      },
      {
        id: 4,
        name: "Mile 4 Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 2600,
        trust: "Community-reported",
        updatedAt: "2026-08-14",
      },
    ],
  },

  {
    id: 5,
    name: "Metformin 500mg",
    form: "Tablets, pack of 30",
    description:
      "Controls blood sugar in type 2 diabetes. Usually taken with meals every day.",
    category: "Diabetes",
    requiresPrescription: true,
    providers: [
      {
        id: 1,
        name: "Regional Hospital Pharmacy",
        type: "Hospital pharmacy",
        area: "Azire",
        price: 1200,
        trust: "SEED-verified",
        updatedAt: "2026-09-21",
      },
      {
        id: 2,
        name: "Commercial Avenue Pharmacy",
        type: "Pharmacy",
        area: "Commercial Avenue",
        price: 1500,
        trust: "Provider-verified",
        updatedAt: "2026-09-19",
      },
    ],
  },

  {
    id: 6,
    name: "Oral Rehydration Salts",
    form: "Sachet, 1 litre",
    description:
      "Replaces fluids and salts lost through diarrhoea or vomiting. Especially important for children.",
    category: "Rehydration",
    providers: [
      {
        id: 1,
        name: "Up Station Pharmacy",
        type: "Pharmacy",
        area: "Up Station",
        price: 150,
        trust: "Community-reported",
        updatedAt: "2026-09-26",
      },
      {
        id: 2,
        name: "Nkwen Community Pharmacy",
        type: "Pharmacy",
        area: "Nkwen",
        price: 200,
        trust: "Provider-verified",
        updatedAt: "2026-09-24",
      },
    ],
  },
];

export default medications;
